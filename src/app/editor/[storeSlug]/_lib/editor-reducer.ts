import type { SiteBlueprint } from "@/types/ai-generation";
import type { EditorState, EditorAction } from "./editor-types";

const MAX_UNDO = 20;

function cloneBlueprint(bp: SiteBlueprint): SiteBlueprint {
  return JSON.parse(JSON.stringify(bp));
}

/** Push current blueprint to undo stack before mutating */
function withUndo(state: EditorState): Pick<EditorState, "undoStack" | "redoStack" | "isDirty"> {
  const undoStack = [cloneBlueprint(state.blueprint), ...state.undoStack].slice(0, MAX_UNDO);
  return { undoStack, redoStack: [], isDirty: true };
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_ACTIVE_PAGE":
      return { ...state, activePageId: action.pageId, selectedSectionId: null, drawerOpen: false };

    case "SELECT_SECTION":
      return { ...state, selectedSectionId: action.sectionId };

    case "HOVER_SECTION":
      return { ...state, hoveredSectionId: action.sectionId };

    case "OPEN_DRAWER":
      return { ...state, drawerOpen: true };

    case "CLOSE_DRAWER":
      return { ...state, drawerOpen: false };

    case "UPDATE_SECTION_CONTENT": {
      const undo = withUndo(state);
      const blueprint = cloneBlueprint(state.blueprint);
      for (const page of blueprint.pages) {
        const section = page.sections.find((s) => s.id === action.sectionId);
        if (section) {
          section.content = action.content;
          break;
        }
      }
      return { ...state, ...undo, blueprint };
    }

    case "MOVE_SECTION": {
      const page = state.blueprint.pages.find((p) => p.id === state.activePageId);
      if (!page) return state;

      const sorted = [...page.sections].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((s) => s.id === action.sectionId);
      if (idx === -1) return state;

      const targetIdx = action.direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= sorted.length) return state;

      const undo = withUndo(state);
      const blueprint = cloneBlueprint(state.blueprint);
      const bpPage = blueprint.pages.find((p) => p.id === state.activePageId)!;
      const bpSorted = [...bpPage.sections].sort((a, b) => a.order - b.order);

      // Swap orders
      const orderA = bpSorted[idx].order;
      const orderB = bpSorted[targetIdx].order;
      const sectionA = bpPage.sections.find((s) => s.id === bpSorted[idx].id)!;
      const sectionB = bpPage.sections.find((s) => s.id === bpSorted[targetIdx].id)!;
      sectionA.order = orderB;
      sectionB.order = orderA;

      return { ...state, ...undo, blueprint };
    }

    case "TOGGLE_SECTION_VISIBILITY": {
      const undo = withUndo(state);
      const blueprint = cloneBlueprint(state.blueprint);
      for (const page of blueprint.pages) {
        const section = page.sections.find((s) => s.id === action.sectionId);
        if (section) {
          section.visible = !section.visible;
          break;
        }
      }
      return { ...state, ...undo, blueprint };
    }

    case "DELETE_SECTION": {
      const undo = withUndo(state);
      const blueprint = cloneBlueprint(state.blueprint);
      for (const page of blueprint.pages) {
        const idx = page.sections.findIndex((s) => s.id === action.sectionId);
        if (idx !== -1) {
          page.sections.splice(idx, 1);
          break;
        }
      }
      return {
        ...state,
        ...undo,
        blueprint,
        selectedSectionId: state.selectedSectionId === action.sectionId ? null : state.selectedSectionId,
        drawerOpen: state.selectedSectionId === action.sectionId ? false : state.drawerOpen,
      };
    }

    case "SET_SAVING":
      return { ...state, isSaving: action.isSaving };

    case "MARK_SAVED":
      return { ...state, isDirty: false, isSaving: false };

    case "SET_BLUEPRINT":
      return { ...state, blueprint: action.blueprint, isDirty: false };

    case "MERGE_GENERATED_SECTIONS": {
      // Replace ONLY sections whose local content is { __generating: true }
      // with the corresponding section from the incoming server blueprint.
      // Preserves any user edits made to already-generated sections.
      const incoming = action.blueprint;
      const blueprint = cloneBlueprint(state.blueprint);
      let replacedCount = 0;

      for (const page of blueprint.pages) {
        const incomingPage =
          incoming.pages.find((p) => p.id === page.id) ??
          incoming.pages.find((p) => p.isHomepage) ??
          incoming.pages[0];
        if (!incomingPage) continue;

        page.sections = page.sections.map((sec) => {
          const isPlaceholder =
            (sec.content as Record<string, unknown> | undefined)
              ?.__generating === true;
          if (!isPlaceholder) return sec;

          const incomingSec =
            incomingPage.sections.find((s) => s.id === sec.id) ??
            incomingPage.sections.find((s) => s.order === sec.order);
          if (!incomingSec) return sec;

          const stillGenerating =
            (incomingSec.content as Record<string, unknown> | undefined)
              ?.__generating === true;
          if (stillGenerating) return sec;

          replacedCount++;
          return { ...sec, content: incomingSec.content, variant: incomingSec.variant };
        });
      }

      // Also refresh design tokens if user hasn't customized — phase 1 may have
      // produced placeholders for fonts/palette while phases ran. Always honor
      // server tokens unless we already had non-default ones (we cloned from
      // initial — accept server design wholesale only when local is dirty=false).
      if (!state.isDirty) {
        blueprint.designTokens = incoming.designTokens;
        blueprint.globalContent = incoming.globalContent;
        blueprint.navigation = incoming.navigation;
        blueprint.jsonLd = incoming.jsonLd;
      }

      if (replacedCount === 0) return state;
      return { ...state, blueprint };
    }

    case "SET_VIEWPORT":
      return { ...state, viewportMode: action.mode };

    case "UPDATE_NAVIGATION": {
      const undo = withUndo(state);
      const blueprint = cloneBlueprint(state.blueprint);
      blueprint.navigation = action.navigation.map((n) => ({
        label: n.label,
        href: n.href,
        isExternal: n.isExternal ?? false,
      }));
      return { ...state, ...undo, blueprint };
    }

    case "UPDATE_DESIGN_TOKENS": {
      const undo = withUndo(state);
      const blueprint = cloneBlueprint(state.blueprint);
      const incoming = action.tokens;
      if (incoming.palette) {
        blueprint.designTokens.palette = { ...blueprint.designTokens.palette, ...incoming.palette };
      }
      if (incoming.headingFont) blueprint.designTokens.headingFont = incoming.headingFont;
      if (incoming.bodyFont) blueprint.designTokens.bodyFont = incoming.bodyFont;
      if (incoming.fontPairing) blueprint.designTokens.fontPairing = incoming.fontPairing;
      if (incoming.style) blueprint.designTokens.style = incoming.style;
      if (incoming.borderRadius) blueprint.designTokens.borderRadius = incoming.borderRadius;
      if (incoming.spacing) blueprint.designTokens.spacing = incoming.spacing;
      return { ...state, ...undo, blueprint };
    }

    case "UPDATE_SECTION_VARIANT": {
      const undo = withUndo(state);
      const blueprint = cloneBlueprint(state.blueprint);
      for (const page of blueprint.pages) {
        const section = page.sections.find((s) => s.id === action.sectionId);
        if (section) {
          section.variant = action.variant;
          break;
        }
      }
      return { ...state, ...undo, blueprint };
    }

    case "SET_INLINE_EDITING":
      return { ...state, isInlineEditing: action.value };

    case "BUMP_RENDER_EPOCH":
      return { ...state, renderEpoch: state.renderEpoch + 1 };

    case "UNDO": {
      if (state.undoStack.length === 0) return state;
      const [prev, ...rest] = state.undoStack;
      return {
        ...state,
        blueprint: prev,
        undoStack: rest,
        redoStack: [cloneBlueprint(state.blueprint), ...state.redoStack].slice(0, MAX_UNDO),
        isDirty: true,
      };
    }

    case "REDO": {
      if (state.redoStack.length === 0) return state;
      const [next, ...rest] = state.redoStack;
      return {
        ...state,
        blueprint: next,
        redoStack: rest,
        undoStack: [cloneBlueprint(state.blueprint), ...state.undoStack].slice(0, MAX_UNDO),
        isDirty: true,
      };
    }

    default:
      return state;
  }
}
