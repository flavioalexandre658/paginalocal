"use client";

import { useState } from "react";
import { IconChevronUp, IconChevronDown, IconPencil, IconEye, IconEyeOff, IconTrash } from "@tabler/icons-react";
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
import type { BlockType } from "@/types/ai-generation";

interface Props {
  section: SectionBlock;
}

export function SectionToolbar({ section }: Props) {
  const { dispatch } = useEditor();
  const [showDelete, setShowDelete] = useState(false);

  const label = BLOCK_TYPE_LABELS[section.blockType as BlockType] ?? section.blockType;

  return (
    <>
      <div
        className="absolute right-4 top-4 z-30 flex items-center gap-0.5 rounded-lg bg-white p-1 shadow-lg ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <ToolbarButton
          icon={<IconChevronUp className="h-4 w-4" />}
          title="Mover para cima"
          onClick={() => dispatch({ type: "MOVE_SECTION", sectionId: section.id, direction: "up" })}
        />
        <ToolbarButton
          icon={<IconChevronDown className="h-4 w-4" />}
          title="Mover para baixo"
          onClick={() => dispatch({ type: "MOVE_SECTION", sectionId: section.id, direction: "down" })}
        />

        <div className="mx-0.5 h-5 w-px bg-slate-200" />

        <ToolbarButton
          icon={<IconPencil className="h-4 w-4" />}
          title="Editar conteudo"
          onClick={() => dispatch({ type: "OPEN_DRAWER" })}
        />
        <ToolbarButton
          icon={section.visible ? <IconEye className="h-4 w-4" /> : <IconEyeOff className="h-4 w-4" />}
          title={section.visible ? "Ocultar secao" : "Mostrar secao"}
          onClick={() => dispatch({ type: "TOGGLE_SECTION_VISIBILITY", sectionId: section.id })}
        />

        <div className="mx-0.5 h-5 w-px bg-slate-200" />

        <ToolbarButton
          icon={<IconTrash className="h-4 w-4" />}
          title="Excluir secao"
          onClick={() => setShowDelete(true)}
          variant="danger"
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
    </>
  );
}

function ToolbarButton({
  icon,
  title,
  onClick,
  variant,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  variant?: "danger";
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={
        variant === "danger"
          ? "rounded-md p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
          : "rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
      }
    >
      {icon}
    </button>
  );
}
