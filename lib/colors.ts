export const COLORS = {
  // Condition colors
  manual: '#2563EB',    // darker blue (changed from #3B82F6)
  assistance: '#8B5CF6',  // distinct purple (changed from #6366F1)
  execution: '#10B981',   // emerald green

  // Outcome / metric colors
  success: '#10B981',     // green
  abandonment: '#F97316', // orange
  error: '#F43F5E',       // rose/red
  intervention: '#3B82F6', // blue
  neutral: '#94A3B8',     // light slate

  // UI colors
  background: '#F8FAFC',
  card: '#FFFFFF',
  sidebar: '#0F172A',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  gridLines: '#E5E7EB',
} as const;

export const getConditionColor = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'manual': return COLORS.manual;
    case 'assistance': return COLORS.assistance;
    case 'execution': return COLORS.execution;
    default: return COLORS.neutral;
  }
};
