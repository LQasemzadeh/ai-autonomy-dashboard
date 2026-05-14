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

  let successRate = 0;
  let avgTime = 0;
  let errorRate = 0;
  let nParticipants = 0;
  let interventionRate = 0;
  let abandonmentRate = 0;

  if (condition === 'All') {
    // Success Rate (Completed / Total)
    const completed = outcomes.filter(o => o.outcome === 'Completed').reduce((acc, curr) => acc + curr.n, 0);
    const total = outcomes.reduce((acc, curr) => acc + curr.n, 0);
    successRate = total > 0 ? (completed / total) * 100 : 0;
    
    // Abandonment Rate
    const abandoned = outcomes.filter(o => o.outcome === 'Abandoned').reduce((acc, curr) => acc + curr.n, 0);
    abandonmentRate = total > 0 ? (abandoned / total) * 100 : 0;
    
    // Avg Time (Weighted average of means by session count if possible, but simple average for now)
    avgTime = timeStats.length > 0 
      ? timeStats.reduce((acc, curr) => acc + curr.Mean, 0) / timeStats.length 
      : 0;
    
    // Error Rate (Proportion with at least one error)
    const withErrors = errorStats.filter(e => e.error_status === 'At least one error').reduce((acc, curr) => acc + curr.n, 0);
    const totalSessions = errorStats.reduce((acc, curr) => acc + curr.n, 0);
    errorRate = totalSessions > 0 ? (withErrors / totalSessions) * 100 : 0;

    // Intervention Rate
    const withIntervention = interventionStats.filter(i => i.intervention_status === 'With intervention').reduce((acc, curr) => acc + curr.n, 0);
    interventionRate = totalSessions > 0 ? (withIntervention / totalSessions) * 100 : 0;
    
    nParticipants = data.metadata.total_participants;
    return {
      successRate: successRate.toFixed(1) + '%',
      avgTime: avgTime.toFixed(1) + 'm',
      errorRate: errorRate.toFixed(1) + '%',
      interventionRate: interventionRate.toFixed(1) + '%',
      abandonmentRate: abandonmentRate.toFixed(1) + '%',
      nParticipants: nParticipants.toString(),
      nSessions: totalSessions.toString()
    };
  } else {
    // Specific condition metrics
    const conditionOutcomes = outcomes.filter(o => o.mode === condition);
    const completed = conditionOutcomes.find(o => o.outcome === 'Completed')?.n || 0;
    const abandoned = conditionOutcomes.find(o => o.outcome === 'Abandoned')?.n || 0;
    const total = conditionOutcomes.reduce((acc, curr) => acc + curr.n, 0);
    successRate = total > 0 ? (completed / total) * 100 : 0;
    abandonmentRate = total > 0 ? (abandoned / total) * 100 : 0;

    const conditionTime = timeStats.find(s => s.Condition === condition);
    avgTime = conditionTime?.Mean || 0;

    const conditionError = errorStats.find(e => e.mode === condition && e.error_status === 'At least one error');
    errorRate = (conditionError?.proportion || 0) * 100;
    
    const conditionIntervention = interventionStats.find(i => i.mode === condition && i.intervention_status === 'With intervention');
    interventionRate = (conditionIntervention?.proportion || 0) * 100;

    const conditionPart = data.participants.per_condition.find(p => p.mode === condition);
    nParticipants = conditionPart?.n_participants || 0;

    return {
      successRate: successRate.toFixed(1) + '%',
      avgTime: avgTime.toFixed(1) + 'm',
      errorRate: errorRate.toFixed(1) + '%',
      interventionRate: interventionRate.toFixed(1) + '%',
      abandonmentRate: abandonmentRate.toFixed(1) + '%',
      nParticipants: nParticipants.toString(),
      nSessions: total.toString()
    };
  }
}
