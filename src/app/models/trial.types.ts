// "Type Unions" que son para autocompletado en TypeScript
export type TrialPhase = 'I' | 'II' | 'III' | 'IV';
export type TrialStatus = 'Recruiting' | 'Active' | 'Completed' | 'Cancelled';

// Para generar los <select> dinámicamente en el HTML:
export const TRIAL_PHASES: TrialPhase[] = ['I', 'II', 'III', 'IV'];
export const TRIAL_STATUSES: TrialStatus[] = ['Recruiting', 'Active', 'Completed', 'Cancelled'];