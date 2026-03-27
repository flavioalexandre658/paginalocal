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
import { cn } from "@/lib/utils";
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
        className="pointer-events-auto absolute bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-black/90 px-2 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <ToolbarButton
          icon={<IconLayoutGrid className="size-3.5" />}
          label="Design"
          onClick={() => { dispatch({ type: "SELECT_SECTION", sectionId: section.id }); setShowDesign(true); }}
        />

        <ToolbarButton
          icon={<IconPencil className="size-3.5" />}
          label={typeof window !== "undefined" && window.innerWidth < 640 ? "Editar" : "Editar conteudo"}
          onClick={() => { dispatch({ type: "SELECT_SECTION", sectionId: section.id }); dispatch({ type: "OPEN_DRAWER" }); }}
        />

        <Separator />

        <IconButton
          icon={<IconChevronUp className="size-3.5" />}
          title="Mover para cima"
          onClick={() => dispatch({ type: "MOVE_SECTION", sectionId: section.id, direction: "up" })}
        />

        <IconButton
          icon={<IconChevronDown className="size-3.5" />}
          title="Mover para baixo"
          onClick={() => dispatch({ type: "MOVE_SECTION", sectionId: section.id, direction: "down" })}
        />

        <IconButton
          icon={section.visible
            ? <IconEye className="size-3.5" />
            : <IconEyeOff className="size-3.5" />
          }
          title={section.visible ? "Ocultar secao" : "Mostrar secao"}
          onClick={() => dispatch({ type: "TOGGLE_SECTION_VISIBILITY", sectionId: section.id })}
        />

        <Separator />

        <IconButton
          icon={<IconTrash className="size-3.5" />}
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
  return <div className="mx-1 h-4 w-px bg-white/15" />;
}

function ToolbarButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white/70 transition-[background,color] duration-150 hover:bg-white/10 hover:text-white"
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
      className={cn(
        "flex items-center justify-center rounded-lg px-2 py-1.5 text-white/70 transition-[background,color] duration-150",
        danger
          ? "hover:bg-red-500/20 hover:text-red-400"
          : "hover:bg-white/10 hover:text-white",
      )}
    >
      {icon}
    </button>
  );
}
