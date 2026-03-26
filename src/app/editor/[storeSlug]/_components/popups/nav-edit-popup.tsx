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
          <ModalTitle>Editar navegacao</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-5">
            <div>
              <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Nome da loja</p>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Nome do negocio"
                className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Texto do botao</p>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Ex: Contato"
                  className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                />
              </div>
              <div>
                <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Link do botao</p>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="https:// ou #secao"
                  className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-medium text-[#737373]">Links de navegacao</p>
                <button
                  onClick={generateFromSections}
                  className="flex items-center gap-1 rounded-[8px] px-2 py-1 text-[13px] font-medium text-[#171717] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                >
                  <IconRefresh className="h-3 w-3" />
                  Gerar do site
                </button>
              </div>
              <div className="space-y-2">
                {links.map((link, i) => (
                  editingIndex === i ? (
                    <div key={i} className="space-y-2 rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-[14px]">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => setLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, label: e.target.value } : l))}
                        placeholder="Nome do link"
                        className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => setLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, href: e.target.value } : l))}
                        placeholder="URL ou #secao"
                        className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                      />
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="text-[13px] font-medium text-[#171717] hover:text-[#171717]/70"
                      >
                        Concluido
                      </button>
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white px-[14px] py-[12px] transition-colors hover:border-[rgba(0,0,0,0.2)]"
                    >
                      <IconGripVertical className="h-4 w-4 shrink-0 cursor-grab text-[#a3a3a3]" />
                      <span className="flex-1 truncate text-[14px]">{link.label}</span>
                      <button
                        onClick={() => setEditingIndex(i)}
                        className="rounded-[8px] p-1 text-[#a3a3a3] transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[#171717]"
                      >
                        <IconPencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setLinks((prev) => prev.filter((_, idx) => idx !== i))}
                        className="rounded-[8px] p-1 text-[#a3a3a3] transition-colors hover:bg-[#fef2f2] hover:text-[#ef4444]"
                      >
                        <IconTrash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                ))}
              </div>
              <button
                onClick={() => setLinks((prev) => [...prev, { label: "Novo link", href: "#", isExternal: false }])}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[rgba(0,0,0,0.06)] py-2 text-[13px] font-medium text-[#737373] transition-colors hover:border-[rgba(0,0,0,0.2)] hover:text-[#171717]"
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
            <button
              onClick={onClose}
              className="text-[13px] font-medium text-[#737373] transition-colors hover:text-[#1a1a1a]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="rounded-[8px] bg-[#171717] px-[20px] py-[8px] text-[13px] font-medium text-white transition-colors hover:bg-[#171717]/90"
            >
              Salvar
            </button>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
