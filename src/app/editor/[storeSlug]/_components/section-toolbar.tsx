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
      {/* Dark pill toolbar at bottom-center of section */}
      <div
        data-editor-ui
        className="pointer-events-auto absolute bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-gray-900/90 px-3 py-1.5 shadow-xl backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Design button */}
        <ToolbarButton
          icon={<IconLayoutGrid className="h-3.5 w-3.5" />}
          label="Design"
          onClick={() => {/* TODO: open design panel */}}
        />

        {/* Edit button */}
        <ToolbarButton
          icon={<IconPencil className="h-3.5 w-3.5" />}
          label="Editar"
          onClick={() => dispatch({ type: "OPEN_DRAWER" })}
        />

        <Separator />

        {/* Move up */}
        <IconButton
          icon={<IconChevronUp className="h-3.5 w-3.5" />}
          title="Mover para cima"
          onClick={() => dispatch({ type: "MOVE_SECTION", sectionId: section.id, direction: "up" })}
        />

        {/* Move down */}
        <IconButton
          icon={<IconChevronDown className="h-3.5 w-3.5" />}
          title="Mover para baixo"
          onClick={() => dispatch({ type: "MOVE_SECTION", sectionId: section.id, direction: "down" })}
        />

        {/* Visibility toggle */}
        <IconButton
          icon={section.visible ? <IconEye className="h-3.5 w-3.5" /> : <IconEyeOff className="h-3.5 w-3.5" />}
          title={section.visible ? "Ocultar seção" : "Mostrar seção"}
          onClick={() => dispatch({ type: "TOGGLE_SECTION_VISIBILITY", sectionId: section.id })}
        />

        <Separator />

        {/* Delete */}
        <IconButton
          icon={<IconTrash className="h-3.5 w-3.5" />}
          title="Excluir seção"
          onClick={() => setShowDelete(true)}
          danger
        />
      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir seção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a seção &quot;{label}&quot;? Esta ação pode ser desfeita com Ctrl+Z.
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

function Separator() {
  return <div className="mx-1 h-4 w-px bg-white/20" />;
}

function ToolbarButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/15 hover:text-white"
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
      className={
        danger
          ? "rounded-full p-1.5 text-white/60 transition-colors hover:bg-red-500/30 hover:text-red-400"
          : "rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
      }
    >
      {icon}
    </button>
  );
}
