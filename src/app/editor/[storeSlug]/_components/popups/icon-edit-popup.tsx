"use client";

import { useMemo, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
} from "@/components/ui/modal-blocks";
import { PglButton } from "@/components/ui/pgl-button";
import { cn } from "@/lib/utils";
import { useEditor } from "../../_lib/editor-context";
import { setFieldByPath } from "../../_lib/text-field-mapper";
import { IconRenderer } from "@/components/ui/icon-renderer";
import {
  ICON_CATALOG,
  searchIcons,
  type IconCatalogEntry,
} from "@/components/ui/icon-renderer.catalog";

interface Props {
  sectionId: string;
  content: Record<string, unknown>;
  fieldPath: string;
  currentToken?: string;
  onClose: () => void;
}

export function IconEditPopup({
  sectionId,
  content,
  fieldPath,
  currentToken,
  onClose,
}: Props) {
  const { dispatch } = useEditor();
  const [selected, setSelected] = useState<string | null>(currentToken || null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(
    ICON_CATALOG[0]?.id ?? "popular"
  );

  const visibleEntries: IconCatalogEntry[] = useMemo(() => {
    if (query.trim().length > 0) return searchIcons(query);
    const cat = ICON_CATALOG.find((c) => c.id === activeCategory);
    return cat?.entries ?? [];
  }, [query, activeCategory]);

  const handleSave = () => {
    if (!selected) return;
    const updated = setFieldByPath(content, fieldPath, selected);
    dispatch({
      type: "UPDATE_SECTION_CONTENT",
      sectionId,
      content: updated,
    });
    onClose();
  };

  return (
    <Modal open onOpenChange={(open) => { if (!open) onClose(); }}>
      <ModalContent size="md" data-editor-ui>
        <ModalHeader>
          <ModalTitle>Escolher ícone</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <IconPickerSearch value={query} onChange={setQuery} />

          {query.trim().length === 0 && (
            <IconPickerCategoryTabs
              activeId={activeCategory}
              onSelect={setActiveCategory}
            />
          )}

          <IconPickerGrid
            entries={visibleEntries}
            selected={selected}
            onSelect={setSelected}
          />
        </ModalBody>

        <ModalFooter>
          <ModalFooterActions>
            <PglButton variant="outline" onClick={onClose}>
              Cancelar
            </PglButton>
            <PglButton
              variant="default"
              disabled={!selected}
              onClick={handleSave}
            >
              Aplicar ícone
            </PglButton>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ───────────────── Compound parts ─────────────────

function IconPickerSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/30" />
      <input
        type="text"
        autoFocus
        placeholder="Buscar (ex: estrela, escudo, casa)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 py-2.5 text-sm text-black/80 outline-none transition-colors",
          "placeholder:text-black/30",
          "focus:border-black/30 focus:ring-1 focus:ring-black/10"
        )}
      />
    </div>
  );
}

function IconPickerCategoryTabs({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      data-editor-ui
      className="-mx-1 mt-3 flex gap-1 overflow-x-auto pb-1"
      style={{ scrollbarWidth: "thin" }}
    >
      {ICON_CATALOG.map((cat) => {
        const active = cat.id === activeId;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium transition-[background,color] duration-150",
              active
                ? "bg-black/80 text-white"
                : "bg-black/5 text-black/55 hover:bg-black/10 hover:text-black/80"
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

function IconPickerGrid({
  entries,
  selected,
  onSelect,
}: {
  entries: IconCatalogEntry[];
  selected: string | null;
  onSelect: (token: string) => void;
}) {
  if (entries.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-black/[0.08] bg-black/[0.02] p-8 text-center">
        <p className="text-sm text-black/40">Nenhum ícone encontrado.</p>
      </div>
    );
  }

  return (
    <div
      className="mt-3 grid gap-2 overflow-y-auto"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
        maxHeight: 360,
      }}
    >
      {entries.map((entry) => {
        const active = entry.token === selected;
        return (
          <button
            key={entry.token}
            type="button"
            onClick={() => onSelect(entry.token)}
            title={entry.label}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl border p-3 transition-all",
              active
                ? "border-black/80 bg-black/[0.02] ring-1 ring-black/80"
                : "border-black/[0.06] bg-white hover:border-black/20 hover:bg-black/[0.02]"
            )}
          >
            <IconRenderer
              icon={entry.token}
              size={22}
              color={active ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.65)"}
              ariaLabel={entry.label}
            />
            <span
              className={cn(
                "truncate w-full text-center text-[11px] font-medium",
                active ? "text-black/80" : "text-black/55"
              )}
            >
              {entry.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
