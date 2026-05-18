import { SessionData, SessionEvent } from '@/types/data-explorer';
import { AutonomyCondition } from '@/types/dashboard';

const CONDITIONS: AutonomyCondition[] = ['Manual', 'Assistance', 'Execution'];
const EVENT_TYPES: SessionEvent['type'][] = [
  'TASK_STARTED',
  'FIELD_EDIT',
  'ERROR_SHOWN',
  'OVERRIDE',
  'AI_SUGGESTION_REJECTED',
  'TASK_COMPLETED'
];

function generateEvents(sessionId: string, startTime: Date, outcome: string, condition: AutonomyCondition): SessionEvent[] {
  const events: SessionEvent[] = [];
  let currentTime = new Date(startTime);

  // Always start with TASK_STARTED
  events.push({
    id: `ev-${sessionId}-0`,
    name: 'TASK_STARTED',
    timestamp: currentTime.toISOString(),
    type: 'TASK_STARTED'
  });

  const eventCount = Math.floor(Math.random() * 8) + 3;
  for (let i = 1; i < eventCount; i++) {
    currentTime = new Date(currentTime.getTime() + Math.random() * 2 * 60000);
    const type = EVENT_TYPES[Math.floor(Math.random() * (EVENT_TYPES.length - 2)) + 1];
    
    // Skip rejection if not assistance
    if (type === 'AI_SUGGESTION_REJECTED' && condition !== 'Assistance') continue;
    // Skip override if manual
    if (type === 'OVERRIDE' && condition === 'Manual') continue;

    events.push({
      id: `ev-${sessionId}-${i}`,
      name: type,
      timestamp: currentTime.toISOString(),
      type: type,
      details: type === 'ERROR_SHOWN' ? 'Validation failed on field: address' : undefined
    });
  }

  if (outcome === 'Completed') {
    currentTime = new Date(currentTime.getTime() + Math.random() * 60000);
    events.push({
      id: `ev-${sessionId}-end`,
      name: 'TASK_COMPLETED',
      timestamp: currentTime.toISOString(),
      type: 'TASK_COMPLETED'
    });
  }

  return events;
}

export function generateMockSessions(count: number = 160): SessionData[] {
  const sessions: SessionData[] = [];
  const baseTime = new Date('2024-05-01T09:00:00');

  for (let i = 0; i < count; i++) {
    const sessionId = `S-${1000 + i}`;
    const participantId = `P-${2000 + Math.floor(i / 2)}`;
    const condition = CONDITIONS[i % CONDITIONS.length];
    const outcome = Math.random() > 0.1 ? 'Completed' : 'Abandoned';
    const startTime = new Date(baseTime.getTime() + i * 45 * 60000);
    const events = generateEvents(sessionId, startTime, outcome, condition);
    
    const startedAt = events[0].timestamp;
    const completedAt = outcome === 'Completed' ? events[events.length - 1].timestamp : null;
    const completionTime = completedAt 
      ? (new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 60000 
      : (new Date(events[events.length - 1].timestamp).getTime() - new Date(startedAt).getTime()) / 60000;

    const errorCount = events.filter(e => e.type === 'ERROR_SHOWN').length;
    const interventionCount = events.filter(e => e.type === 'OVERRIDE' || e.type === 'AI_SUGGESTION_REJECTED').length;

    sessions.push({
      session_id: sessionId,
      participant_id: participantId,
      condition,
      outcome,
      completion_time: parseFloat(completionTime.toFixed(2)),
      error_count: errorCount,
      intervention_count: interventionCount,
      started_at: startedAt,
      completed_at: completedAt,
      has_error: errorCount > 0,
      has_intervention: interventionCount > 0,
      events
    });
  }

  return sessions;
}
