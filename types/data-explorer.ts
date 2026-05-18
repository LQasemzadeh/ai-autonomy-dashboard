import { AutonomyCondition } from './dashboard';

export type SessionOutcome = 'Completed' | 'Abandoned';

export interface SessionEvent {
  id: string;
  name: string;
  timestamp: string;
  type: 'TASK_STARTED' | 'TASK_COMPLETED' | 'ERROR_SHOWN' | 'FIELD_EDIT' | 'OVERRIDE' | 'AI_SUGGESTION_REJECTED';
  details?: string;
}

export interface SessionData {
  session_id: string;
  participant_id: string;
  condition: AutonomyCondition;
  outcome: SessionOutcome;
  completion_time: number; // in minutes
  error_count: number;
  intervention_count: number;
  started_at: string;
  completed_at: string | null;
  has_error: boolean;
  has_intervention: boolean;
  events: SessionEvent[];
}
