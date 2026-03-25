import type { PageBlueprint, SectionBlock } from "@/types/ai-generation";

/**
 * Shared utility: given a DOM element inside the preview, find which
 * blueprint section it belongs to by matching the .group/section wrapper
 * index in the DOM with the sorted sections array.
 */
export function findSectionForElement(
  el: HTMLElement,
  previewContainer: Element,
  activePage: PageBlueprint
): { section: SectionBlock; content: Record<string, unknown> } | null {
  // Walk up to find the section wrapper
  let sectionWrapper: HTMLElement | null = el;
  while (sectionWrapper && !sectionWrapper.classList.contains("group/section")) {
    sectionWrapper = sectionWrapper.parentElement;
  }
  if (!sectionWrapper) return null;

  // Find the wrapper's index among all section wrappers
  const allWrappers = previewContainer.querySelectorAll(".group\\/section");
  let wrapperIndex = -1;
  allWrappers.forEach((w, i) => {
    if (w === sectionWrapper) wrapperIndex = i;
  });
  if (wrapperIndex === -1) return null;

  // Match by order — sorted sections correspond to DOM order
  const sortedSections = [...activePage.sections].sort((a, b) => a.order - b.order);
  const section = sortedSections[wrapperIndex];
  if (!section) return null;

  return {
    section,
    content: section.content as Record<string, unknown>,
  };
}
