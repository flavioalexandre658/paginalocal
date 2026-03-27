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
import { PglButton } from "@/components/ui/pgl-button";
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

    dispatch({
      type: "UPDATE_NAVIGATION",
      navigation: links.map((l) => ({
        label: l.label,
        href: l.href,
        isExternal: l.isExternal,
      })),
    });
    onClose();
  }, [state.blueprint, links, content, dispatch, sectionId, storeName, ctaText, ctaLink, onClose]);

  return (
    <Modal open onOpenChange={(open) => { if (!open) onClose(); }}>
      <ModalContent size="sm" data-editor-ui>
        <ModalHeader>
          <ModalTitle>Editar navegacao</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-5">
            <div>
              <p className="mb-1.5 text-[13px] font-medium text-black/55">Nome da loja</p>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Nome do negocio"
                className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black/80 outline-none transition-colors placeholder:text-black/30 focus:border-black/30 focus:ring-1 focus:ring-black/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 text-[13px] font-medium text-black/55">Texto do botao</p>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Ex: Contato"
                  className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black/80 outline-none transition-colors placeholder:text-black/30 focus:border-black/30 focus:ring-1 focus:ring-black/10"
                />
              </div>
              <div>
                <p className="mb-1.5 text-[13px] font-medium text-black/55">Link do botao</p>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="https:// ou #secao"
                  className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black/80 outline-none transition-colors placeholder:text-black/30 focus:border-black/30 focus:ring-1 focus:ring-black/10"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-medium text-black/55">Links de navegacao</p>
                <button
                  onClick={generateFromSections}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-medium text-black/80 transition-colors hover:bg-black/5"
                >
                  <IconRefresh className="size-3.5" />
                  Gerar do site
                </button>
              </div>
              <div className="space-y-2">
                {links.map((link, i) => (
                  editingIndex === i ? (
                    <div key={i} className="space-y-2 rounded-xl border border-black/10 bg-white p-3.5">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => setLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, label: e.target.value } : l))}
                        placeholder="Nome do link"
                        className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black/80 outline-none transition-colors placeholder:text-black/30 focus:border-black/30 focus:ring-1 focus:ring-black/10"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => setLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, href: e.target.value } : l))}
                        placeholder="URL ou #secao"
                        className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black/80 outline-none transition-colors placeholder:text-black/30 focus:border-black/30 focus:ring-1 focus:ring-black/10"
                      />
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="text-[13px] font-medium text-black/80 transition-colors hover:text-black/55"
                      >
                        Concluido
                      </button>
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3.5 py-3 transition-colors hover:border-black/20"
                    >
                      <IconGripVertical className="size-4 shrink-0 cursor-grab text-black/30" />
                      <span className="flex-1 truncate text-sm text-black/80">{link.label}</span>
                      <button
                        onClick={() => setEditingIndex(i)}
                        className="rounded-lg p-1 text-black/30 transition-colors hover:bg-black/5 hover:text-black/80"
                      >
                        <IconPencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => setLinks((prev) => prev.filter((_, idx) => idx !== i))}
                        className="rounded-lg p-1 text-black/30 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <IconTrash className="size-3.5" />
                      </button>
                    </div>
                  )
                ))}
              </div>
              <button
                onClick={() => setLinks((prev) => [...prev, { label: "Novo link", href: "#", isExternal: false }])}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-black/10 py-2 text-[13px] font-medium text-black/55 transition-colors hover:border-black/20 hover:text-black/80"
              >
                <IconPlus className="size-3.5" />
                Adicionar link
              </button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div />
          <ModalFooterActions>
            <PglButton variant="ghost" size="sm" onClick={onClose}>Cancelar</PglButton>
            <PglButton variant="dark" size="sm" onClick={handleSave}>Salvar</PglButton>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
