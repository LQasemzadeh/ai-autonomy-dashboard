export interface DashboardMetadata {
  title: string;
  conditions: string[];
  total_participants: number;
  total_started_sessions: number;
}

export interface ConditionStats {
  mode: string;
  n_participants?: number;
  n_sessions?: number;
}

export interface TaskOutcome {
  mode: string;
  outcome: 'Abandoned' | 'Completed';
  n: number;
  proportion: number;
  label: string;
}

export interface CompletionTimeEntry {
  session_id: string;
  mode: string;
  completion_time: number;
}

export interface CompletionTimeStats {
  Condition: string;
  Mean: number;
  Median: number;
  Min: number;
  Max: number;
  SD?: number;
}

export interface ErrorByMode {
  mode: string;
  error_status: 'At least one error' | 'No error';
  n: number;
  proportion: number;
  label: string;
}

export interface AbandonmentByMode {
  mode: string;
  outcome: 'Abandoned' | 'Completed';
  n: number;
  proportion: number;
  label: string;
}

export interface InterventionByMode {
  mode: string;
  intervention_status: 'No intervention' | 'With intervention';
  n: number;
  proportion: number;
  label: string;
}

export interface InterventionTypeProportion {
  mode: string;
  intervention_type: 'Edit' | 'Override' | 'Reject';
  proportion: number;
  label: string;
}

export interface DashboardData {
  metadata: DashboardMetadata;
  participants: {
    per_condition: ConditionStats[];
    sessions_per_condition: ConditionStats[];
  };
  task_outcomes_by_mode: TaskOutcome[];
  completion_time: {
    distribution: CompletionTimeEntry[];
    summary_after_outlier_removal: CompletionTimeStats[];
  };
  errors: {
    by_mode: ErrorByMode[];
  };
  abandonment: {
    by_mode: AbandonmentByMode[];
  };
  intervention_occurrence: {
    by_mode: InterventionByMode[];
  };
  intervention_types: {
    proportions_by_mode: InterventionTypeProportion[];
  };
}

export type AutonomyCondition = 'All' | 'Manual' | 'Assistance' | 'Execution';
