"use client";

import { useState } from "react";
import {
  IconChevronUp,
  IconChevronDown,
  IconPencil,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconLayoutGrid,
} from "@tabler/icons-react";
import type { SectionBlock } from "@/types/ai-generation";
import { useEditor } from "../_lib/editor-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BLOCK_TYPE_LABELS } from "../_lib/block-type-labels";
import { DesignPopup } from "./popups/design-popup";
import type { BlockType } from "@/types/ai-generation";

interface Props {
  section: SectionBlock;
}

export function SectionToolbar({ section }: Props) {
  const { dispatch } = useEditor();
  const [showDelete, setShowDelete] = useState(false);
  const [showDesign, setShowDesign] = useState(false);

  const label = BLOCK_TYPE_LABELS[section.blockType as BlockType] ?? section.blockType;

  return (
    <>
      <div
        data-editor-ui
        className="pointer-events-auto absolute bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center"
        style={{
          background: "rgba(23,23,23,0.9)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: 999,
          padding: "6px 8px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <ToolbarButton
          icon={<IconLayoutGrid style={{ width: 14, height: 14, marginRight: 4 }} />}
          label="Design"
          onClick={() => { dispatch({ type: "SELECT_SECTION", sectionId: section.id }); setShowDesign(true); }}
        />

        <ToolbarButton
          icon={<IconPencil style={{ width: 14, height: 14, marginRight: 4 }} />}
          label={typeof window !== "undefined" && window.innerWidth < 640 ? "Editar" : "Editar conteudo"}
          onClick={() => { dispatch({ type: "SELECT_SECTION", sectionId: section.id }); dispatch({ type: "OPEN_DRAWER" }); }}
        />

        <Separator />

        <IconButton
          icon={<IconChevronUp style={{ width: 14, height: 14 }} />}
          title="Mover para cima"
          onClick={() => dispatch({ type: "MOVE_SECTION", sectionId: section.id, direction: "up" })}
        />

        <IconButton
          icon={<IconChevronDown style={{ width: 14, height: 14 }} />}
          title="Mover para baixo"
          onClick={() => dispatch({ type: "MOVE_SECTION", sectionId: section.id, direction: "down" })}
        />

        <IconButton
          icon={section.visible
            ? <IconEye style={{ width: 14, height: 14 }} />
            : <IconEyeOff style={{ width: 14, height: 14 }} />
          }
          title={section.visible ? "Ocultar secao" : "Mostrar secao"}
          onClick={() => dispatch({ type: "TOGGLE_SECTION_VISIBILITY", sectionId: section.id })}
        />

        <Separator />

        <IconButton
          icon={<IconTrash style={{ width: 14, height: 14 }} />}
          title="Excluir secao"
          onClick={() => setShowDelete(true)}
          danger
        />
      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir secao</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a secao &quot;{label}&quot;? Esta acao pode ser desfeita com Ctrl+Z.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => dispatch({ type: "DELETE_SECTION", sectionId: section.id })}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DesignPopup
        section={section}
        open={showDesign}
        onClose={() => setShowDesign(false)}
      />
    </>
  );
}

function Separator() {
  return (
    <div
      style={{
        width: 1,
        height: 16,
        background: "rgba(255,255,255,0.15)",
        margin: "0 4px",
      }}
    />
  );
}

function ToolbarButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "6px 12px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: "system-ui",
        color: "rgba(255,255,255,0.7)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        transition: "background 150ms, color 150ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
        e.currentTarget.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function IconButton({
  icon,
  title,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 12px",
        borderRadius: 6,
        color: "rgba(255,255,255,0.7)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        transition: "background 150ms, color 150ms",
      }}
      onMouseEnter={(e) => {
        if (danger) {
          e.currentTarget.style.background = "rgba(239,68,68,0.2)";
          e.currentTarget.style.color = "#ef4444";
        } else {
          e.currentTarget.style.background = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color = "white";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
      }}
    >
      {icon}
    </button>
  );
}
