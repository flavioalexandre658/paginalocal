export const GENERATING_PLACEHOLDER = { __generating: true } as const;

export interface PhaseSectionPlan {
  phase1: number[];
  phase2: number[];
  phase3: number[];
}

/**
 * Split a template's section indices into 3 progressive phases.
 *  - phase1: first 2 sections (header + hero) — generated synchronously
 *  - phase2: next up to 4 (about/services/features) — fire-and-forget
 *  - phase3: remaining (testimonials/faq/cta/footer/etc.) — fire-and-forget
 */
export function planPhases(totalSections: number): PhaseSectionPlan {
  const phase1Count = Math.min(2, totalSections);
  const phase1 = Array.from({ length: phase1Count }, (_, i) => i);
  const phase2Start = phase1.length;
  const phase2End = Math.min(totalSections, phase2Start + 4);
  const phase2 = Array.from(
    { length: phase2End - phase2Start },
    (_, i) => phase2Start + i
  );
  const phase3 = Array.from(
    { length: totalSections - phase2End },
    (_, i) => phase2End + i
  );
  return { phase1, phase2, phase3 };
}
