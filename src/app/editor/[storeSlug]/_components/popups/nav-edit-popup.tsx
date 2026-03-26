"use client";

import { useState, useCallback, useMemo } from "react";
import { IconPlus, IconGripVertical, IconPencil, IconTrash, IconRefresh } from "@tabler/icons-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
} from "@/components/ui/modal-blocks";
import { Button } from "@/components/ui/button";
import { useEditor } from "../../_lib/editor-context";
import { setFieldByPath } from "../../_lib/text-field-mapper";

interface NavLink {
  label: string;
  href: string;
  isExternal: boolean;
}

interface Props {
  sectionId: string;
  content: Record<string, unknown>;
  onClose: () => void;
}

export function NavEditPopup({ sectionId, content, onClose }: Props) {
  const { state, dispatch } = useEditor();

  const [storeName, setStoreName] = useState(
    typeof content.storeName === "string" ? content.storeName : ""
  );
  const [ctaText, setCtaText] = useState(
    typeof content.ctaText === "string" ? content.ctaText : ""
  );
  const [ctaLink, setCtaLink] = useState(
    typeof content.ctaLink === "string" ? content.ctaLink : ""
  );

  const currentNav = state.blueprint.navigation || [];
  const [links, setLinks] = useState<NavLink[]>(
    currentNav.map((n) => ({ label: n.label, href: n.href, isExternal: n.isExternal ?? false }))
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const SKIP_NAV_SECTIONS = new Set(["hero", "header", "footer", "whatsapp-float", "cta"]);
  const NAV_LABELS: Record<string, string> = {
    services: "Servicos", about: "Sobre", contact: "Contato", faq: "FAQ",
    testimonials: "Depoimentos", gallery: "Galeria", team: "Equipe",
    stats: "Estatisticas", pricing: "Planos", menu: "Cardapio",
    catalog: "Catalogo", location: "Localizacao", hours: "Horarios",
    "featured-products": "Destaques",
  };

  const sectionAnchors = useMemo(() => {
    const activePage = state.blueprint.pages.find((p) => p.id === state.activePageId);
    if (!activePage) return [];
    return [...activePage.sections]
      .filter((s) => s.visible && !SKIP_NAV_SECTIONS.has(s.blockType))
      .sort((a, b) => a.order - b.order)
      .map((s) => ({
        label: NAV_LABELS[s.blockType] || s.blockType,
        href: `#${s.blockType}`,
        isExternal: false,
      }));
  }, [state.blueprint, state.activePageId]);

  const generateFromSections = () => {
    setLinks(sectionAnchors);
  };

  const handleSave = useCallback(() => {
    let updatedContent = content;
    updatedContent = setFieldByPath(updatedContent, "storeName", storeName);
    updatedContent = setFieldByPath(updatedContent, "ctaText", ctaText);
    updatedContent = setFieldByPath(updatedContent, "ctaLink", ctaLink);

    dispatch({
      type: "UPDATE_SECTION_CONTENT",
      sectionId,
      content: updatedContent,
    });

    const updatedBlueprint = {
      ...state.blueprint,
      navigation: links.map((l) => ({
        label: l.label,
        href: l.href,
        isExternal: l.isExternal,
      })),
    };
    dispatch({ type: "SET_BLUEPRINT", blueprint: updatedBlueprint });
    onClose();
  }, [state.blueprint, links, content, dispatch, sectionId, storeName, ctaText, ctaLink, onClose]);

  return (
    <Modal open onOpenChange={(open) => { if (!open) onClose(); }}>
      <ModalContent size="sm" data-editor-ui>
        <ModalHeader>
          <ModalTitle>Editar navegação</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-5">
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Nome da loja</p>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Nome do negócio"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Texto do botão</p>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Ex: Contato"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Link do botão</p>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="https:// ou #seção"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Links de navegacao</p>
                <button
                  onClick={generateFromSections}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <IconRefresh className="h-3 w-3" />
                  Gerar do site
                </button>
              </div>
              <div className="space-y-2">
                {links.map((link, i) => (
                  editingIndex === i ? (
                    <div key={i} className="space-y-2 rounded-lg border border-primary/30 bg-muted/30 p-3">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => setLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, label: e.target.value } : l))}
                        placeholder="Nome do link"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => setLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, href: e.target.value } : l))}
                        placeholder="URL ou #seção"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                      />
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="text-xs font-medium text-primary hover:text-primary/80"
                      >
                        Concluído
                      </button>
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 transition-colors hover:border-primary/30"
                    >
                      <IconGripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/50" />
                      <span className="flex-1 truncate text-sm">{link.label}</span>
                      <button
                        onClick={() => setEditingIndex(i)}
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <IconPencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setLinks((prev) => prev.filter((_, idx) => idx !== i))}
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <IconTrash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                ))}
              </div>
              <button
                onClick={() => setLinks((prev) => [...prev, { label: "Novo link", href: "#", isExternal: false }])}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <IconPlus className="h-3.5 w-3.5" />
                Adicionar link
              </button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div />
          <ModalFooterActions>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
