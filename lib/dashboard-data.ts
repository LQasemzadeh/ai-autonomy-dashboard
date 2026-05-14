import { DashboardData, AutonomyCondition } from '@/types/dashboard';

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const response = await fetch('/dashboard_results.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Parsed Dashboard Data Structure:', {
      metadata: data.metadata,
      sampleDistribution: data.completion_time.distribution.slice(0, 2),
      stats: data.completion_time.summary_after_outlier_removal,
      errors: data.errors.by_mode.slice(0, 2),
      abandonment: data.abandonment.by_mode.slice(0, 2),
      intervention: data.intervention_occurrence.by_mode.slice(0, 2)
    });
    return data as DashboardData;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    throw error;
  }
}

export function getKPIMetrics(data: DashboardData, condition: AutonomyCondition) {
  const outcomes = data.task_outcomes_by_mode || [];
  const timeStats = data.completion_time.summary_after_outlier_removal || [];
  const errorStats = data.errors?.by_mode || [];
  const interventionStats = data.intervention_occurrence?.by_mode || [];
  const interventionTypeStats = data.intervention_types?.proportions_by_mode || [];

  let successRate = 0;
  let avgTime = 0;
  let errorRate = 0;
  let nParticipants = 0;
  let interventionRate = 0;
  let abandonmentRate = 0;
  let suggestionRejectionRate = 0;
  let manualOverrideRate = 0;

  if (condition === 'All') {
    // Success Rate (Completed / Total)
    const completed = outcomes.filter(o => o.outcome === 'Completed').reduce((acc, curr) => acc + curr.n, 0);
    const total = outcomes.reduce((acc, curr) => acc + curr.n, 0);
    successRate = total > 0 ? (completed / total) * 100 : 0;
    
    // Abandonment Rate
    const abandoned = outcomes.filter(o => o.outcome === 'Abandoned').reduce((acc, curr) => acc + curr.n, 0);
    abandonmentRate = total > 0 ? (abandoned / total) * 100 : 0;
    
    // Avg Time (Weighted average of means by session count)
    const sessionsPerCondition = data.participants.sessions_per_condition;
    let totalWeightedTime = 0;
    let totalTimeSessions = 0;

    timeStats.forEach(stat => {
      const n = sessionsPerCondition.find(p => p.mode === stat.Condition)?.n_sessions || 0;
      totalWeightedTime += stat.Mean * n;
      totalTimeSessions += n;
    });
    avgTime = totalTimeSessions > 0 ? totalWeightedTime / totalTimeSessions : 0;
    
    // Error Rate (Proportion with at least one error)
    const withErrors = errorStats.filter(e => e.error_status === 'At least one error').reduce((acc, curr) => acc + curr.n, 0);
    const totalErrorSessions = errorStats.reduce((acc, curr) => acc + curr.n, 0) / 2; // Each session appears twice (At least one error / No error)
    errorRate = totalErrorSessions > 0 ? (withErrors / totalErrorSessions) * 100 : 0;

    // Intervention Rate
    const withIntervention = interventionStats.filter(i => i.intervention_status === 'With intervention').reduce((acc, curr) => acc + curr.n, 0);
    const totalInterventionSessions = interventionStats.reduce((acc, curr) => acc + curr.n, 0) / 2;
    interventionRate = totalInterventionSessions > 0 ? (withIntervention / totalInterventionSessions) * 100 : 0;

    // Suggestion Rejection (Only for Assistance in AI context)
    const rejectEntry = interventionTypeStats.find(p => p.mode === 'Assistance' && p.intervention_type === 'Reject');
    suggestionRejectionRate = (rejectEntry?.proportion || 0) * 100;

    // Manual Override (Overall, but typically Execution/Assistance)
    const overrideEntry = interventionTypeStats.find(p => p.mode === 'Execution' && p.intervention_type === 'Override');
    manualOverrideRate = (overrideEntry?.proportion || 0) * 100;
    
    nParticipants = data.metadata.total_participants;
    return {
      successRate: successRate.toFixed(1) + '%',
      avgTime: avgTime.toFixed(1) + 'm',
      errorRate: errorRate.toFixed(1) + '%',
      interventionRate: interventionRate.toFixed(1) + '%',
      abandonmentRate: abandonmentRate.toFixed(1) + '%',
      suggestionRejectionRate: suggestionRejectionRate.toFixed(1) + '%',
      manualOverrideRate: manualOverrideRate.toFixed(1) + '%',
      nParticipants: nParticipants.toString(),
      nSessions: data.metadata.total_started_sessions.toString(),
      raw: data
    };
  } else {
    // Specific condition metrics
    const conditionOutcomes = outcomes.filter(o => o.mode === condition);
    const completed = conditionOutcomes.find(o => o.outcome === 'Completed')?.n || 0;
    const total = conditionOutcomes.reduce((acc, curr) => acc + curr.n, 0);
    successRate = total > 0 ? (completed / total) * 100 : 0;
    abandonmentRate = total > 0 ? ((total - completed) / total) * 100 : 0;

    const conditionTime = timeStats.find(s => s.Condition === condition);
    avgTime = conditionTime?.Mean || 0;

    const conditionError = errorStats.find(e => e.mode === condition && e.error_status === 'At least one error');
    errorRate = (conditionError?.proportion || 0) * 100;
    
    const conditionIntervention = interventionStats.find(i => i.mode === condition && i.intervention_status === 'With intervention');
    interventionRate = (conditionIntervention?.proportion || 0) * 100;

    const rejectEntry = interventionTypeStats.find(p => p.mode === condition && p.intervention_type === 'Reject');
    suggestionRejectionRate = (rejectEntry?.proportion || 0) * 100;

    const overrideEntry = interventionTypeStats.find(p => p.mode === condition && p.intervention_type === 'Override');
    manualOverrideRate = (overrideEntry?.proportion || 0) * 100;

    const conditionPart = data.participants.per_condition.find(p => p.mode === condition);
    nParticipants = conditionPart?.n_participants || 0;

    const isNA_Rejection = condition === 'Manual' || condition === 'Execution';
    const isNA_Override = condition === 'Manual';

    return {
      successRate: successRate.toFixed(1) + '%',
      avgTime: avgTime.toFixed(1) + 'm',
      errorRate: errorRate.toFixed(1) + '%',
      interventionRate: interventionRate.toFixed(1) + '%',
      abandonmentRate: abandonmentRate.toFixed(1) + '%',
      suggestionRejectionRate: isNA_Rejection ? 'N/A' : suggestionRejectionRate.toFixed(1) + '%',
      manualOverrideRate: isNA_Override ? 'N/A' : manualOverrideRate.toFixed(1) + '%',
      nParticipants: nParticipants.toString(),
      nSessions: total.toString(),
      raw: data
    };
  }
}
