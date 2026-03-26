"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
} from "@/components/ui/modal-blocks";
import { Button } from "@/components/ui/button";
import { useEditor } from "../_lib/editor-context";
import { BLOCK_TYPE_LABELS } from "../_lib/block-type-labels";
import { SectionFieldRenderer } from "./section-field-renderer";
import type { BlockType } from "@/types/ai-generation";

export function SectionEditDrawer() {
  const { state, dispatch } = useEditor();

  const activePage = state.blueprint.pages.find((p) => p.id === state.activePageId);
  const selectedSection = activePage?.sections.find((s) => s.id === state.selectedSectionId);

  const isOpen = state.drawerOpen && !!selectedSection;

  function handleContentChange(content: Record<string, unknown>) {
    if (!selectedSection) return;
    dispatch({
      type: "UPDATE_SECTION_CONTENT",
      sectionId: selectedSection.id,
      content,
    });
  }

  function handleClose() {
    dispatch({ type: "CLOSE_DRAWER" });
  }

  const blockLabel = selectedSection
    ? BLOCK_TYPE_LABELS[selectedSection.blockType as BlockType] ?? selectedSection.blockType
    : "";

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>Editar {blockLabel}</ModalTitle>
          {selectedSection && (
            <ModalDescription>
              Variante {selectedSection.variant}
            </ModalDescription>
          )}
        </ModalHeader>

        <ModalBody>
          {selectedSection && (
            <SectionFieldRenderer
              blockType={selectedSection.blockType as BlockType}
              content={selectedSection.content as Record<string, unknown>}
              onChange={handleContentChange}
            />
          )}
        </ModalBody>

        <ModalFooter>
          <div />
          <ModalFooterActions>
            <Button variant="ghost" onClick={handleClose}>
              Fechar
            </Button>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
