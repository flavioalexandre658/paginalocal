"use client";

import { useState, useCallback } from "react";
import { IconPlus, IconGripVertical, IconPencil, IconTrash } from "@tabler/icons-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
} from "@/components/ui/modal-blocks";
import { Switch } from "@/components/ui/switch";
import { PglButton } from "@/components/ui/pgl-button";
import { useEditor } from "../../_lib/editor-context";

interface NavLink {
  label: string;
  href: string;
}

interface Props {
  sectionId: string;
  content: Record<string, unknown>;
  onClose: () => void;
}

export function FooterEditPopup({ sectionId, content, onClose }: Props) {
  const { dispatch } = useEditor();

  const getString = (key: string) =>
    typeof content[key] === "string" ? (content[key] as string) : "";

  const [storeName, setStoreName] = useState(getString("storeName"));
  const [tagline, setTagline] = useState(getString("tagline"));
  const [address, setAddress] = useState(getString("address"));
  const [phone, setPhone] = useState(getString("phone"));
  const [email, setEmail] = useState(getString("email"));
  const [hours, setHours] = useState(getString("hours"));
  const [copyrightText, setCopyrightText] = useState(getString("copyrightText"));
  const [showSocial, setShowSocial] = useState(content.showSocial !== false);

  const existingLinks = Array.isArray(content.navLinks)
    ? (content.navLinks as NavLink[]).map((l) => ({ label: l.label || "", href: l.href || "" }))
    : [];
  const [navLinks, setNavLinks] = useState<NavLink[]>(existingLinks);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSave = useCallback(() => {
    const updated: Record<string, unknown> = {
      ...content,
      storeName,
      tagline,
      address,
      phone,
      email,
      hours,
      copyrightText,
      showSocial,
      navLinks: navLinks.map((l) => ({ label: l.label, href: l.href })),
    };

    dispatch({
      type: "UPDATE_SECTION_CONTENT",
      sectionId,
      content: updated,
    });
    onClose();
  }, [content, dispatch, sectionId, storeName, tagline, address, phone, email, hours, copyrightText, showSocial, navLinks, onClose]);

  return (
    <Modal open onOpenChange={(open) => { if (!open) onClose(); }}>
      <ModalContent size="md" data-editor-ui>
        <ModalHeader>
          <ModalTitle>Editar rodape</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
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
              <div>
                <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Tagline</p>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Slogan do negocio"
                  className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                />
              </div>
            </div>

            <div>
              <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Links de navegacao</p>
              <div className="space-y-2">
                {navLinks.map((link, i) => (
                  editingIndex === i ? (
                    <div key={i} className="space-y-2 rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white p-[14px]">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => setNavLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, label: e.target.value } : l))}
                        placeholder="Nome do link"
                        className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => setNavLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, href: e.target.value } : l))}
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
                    <div key={i} className="flex items-center gap-2 rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white px-[14px] py-[12px] transition-colors hover:border-[rgba(0,0,0,0.2)]">
                      <IconGripVertical className="h-4 w-4 shrink-0 cursor-grab text-[#a3a3a3]" />
                      <span className="flex-1 truncate text-[14px]">{link.label}</span>
                      <button onClick={() => setEditingIndex(i)} className="rounded-[8px] p-1 text-[#a3a3a3] transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[#171717]">
                        <IconPencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setNavLinks((prev) => prev.filter((_, idx) => idx !== i))} className="rounded-[8px] p-1 text-[#a3a3a3] transition-colors hover:bg-[#fef2f2] hover:text-[#ef4444]">
                        <IconTrash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                ))}
              </div>
              <button
                onClick={() => setNavLinks((prev) => [...prev, { label: "Novo link", href: "#" }])}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[rgba(0,0,0,0.06)] py-2 text-[13px] font-medium text-[#737373] transition-colors hover:border-[rgba(0,0,0,0.2)] hover:text-[#171717]"
              >
                <IconPlus className="h-3.5 w-3.5" />
                Adicionar link
              </button>
            </div>

            <div>
              <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Contato</p>
              <div className="space-y-3">
                <div>
                  <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Endereco</p>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, numero, cidade"
                    className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Telefone</p>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                    />
                  </div>
                  <div>
                    <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Email</p>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contato@empresa.com"
                      className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Horario de funcionamento</p>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Seg - Sex, 08:00 - 18:00"
                className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
              />
            </div>

            <div>
              <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Texto de copyright</p>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                placeholder="© 2024 Nome da Empresa"
                className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
              />
            </div>

            <div className="flex items-center justify-between rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white px-[14px] py-[12px]">
              <div>
                <p className="text-[14px] font-medium text-[#171717]">Redes sociais</p>
                <p className="text-[13px] text-[#737373]">Mostrar icones das redes sociais</p>
              </div>
              <Switch checked={showSocial} onCheckedChange={setShowSocial} />
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
