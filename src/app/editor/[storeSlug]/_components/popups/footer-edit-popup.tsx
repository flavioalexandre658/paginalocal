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

const inputClasses = "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black/80 outline-none transition-colors placeholder:text-black/30 focus:border-black/30 focus:ring-1 focus:ring-black/10";

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
                <p className="mb-1.5 text-[13px] font-medium text-black/55">Nome da loja</p>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Nome do negocio"
                  className={inputClasses}
                />
              </div>
              <div>
                <p className="mb-1.5 text-[13px] font-medium text-black/55">Tagline</p>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Slogan do negocio"
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[13px] font-medium text-black/55">Links de navegacao</p>
              <div className="space-y-2">
                {navLinks.map((link, i) => (
                  editingIndex === i ? (
                    <div key={i} className="space-y-2 rounded-xl border border-black/10 bg-white p-3.5">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => setNavLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, label: e.target.value } : l))}
                        placeholder="Nome do link"
                        className={inputClasses}
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => setNavLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, href: e.target.value } : l))}
                        placeholder="URL ou #secao"
                        className={inputClasses}
                      />
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="text-[13px] font-medium text-black/80 transition-colors hover:text-black/55"
                      >
                        Concluido
                      </button>
                    </div>
                  ) : (
                    <div key={i} className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3.5 py-3 transition-colors hover:border-black/20">
                      <IconGripVertical className="size-4 shrink-0 cursor-grab text-black/30" />
                      <span className="flex-1 truncate text-sm text-black/80">{link.label}</span>
                      <button onClick={() => setEditingIndex(i)} className="rounded-lg p-1 text-black/30 transition-colors hover:bg-black/5 hover:text-black/80">
                        <IconPencil className="size-3.5" />
                      </button>
                      <button onClick={() => setNavLinks((prev) => prev.filter((_, idx) => idx !== i))} className="rounded-lg p-1 text-black/30 transition-colors hover:bg-red-50 hover:text-red-600">
                        <IconTrash className="size-3.5" />
                      </button>
                    </div>
                  )
                ))}
              </div>
              <button
                onClick={() => setNavLinks((prev) => [...prev, { label: "Novo link", href: "#" }])}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-black/10 py-2 text-[13px] font-medium text-black/55 transition-colors hover:border-black/20 hover:text-black/80"
              >
                <IconPlus className="size-3.5" />
                Adicionar link
              </button>
            </div>

            <div>
              <p className="mb-1.5 text-[13px] font-medium text-black/55">Contato</p>
              <div className="space-y-3">
                <div>
                  <p className="mb-1.5 text-[13px] font-medium text-black/55">Endereco</p>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, numero, cidade"
                    className={inputClasses}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1.5 text-[13px] font-medium text-black/55">Telefone</p>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <p className="mb-1.5 text-[13px] font-medium text-black/55">Email</p>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contato@empresa.com"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[13px] font-medium text-black/55">Horario de funcionamento</p>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Seg - Sex, 08:00 - 18:00"
                className={inputClasses}
              />
            </div>

            <div>
              <p className="mb-1.5 text-[13px] font-medium text-black/55">Texto de copyright</p>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                placeholder="© 2024 Nome da Empresa"
                className={inputClasses}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-black/[0.08] bg-white px-3.5 py-3">
              <div>
                <p className="text-sm font-medium text-black/80">Redes sociais</p>
                <p className="text-[13px] text-black/55">Mostrar icones das redes sociais</p>
              </div>
              <button
                role="switch"
                aria-checked={showSocial}
                onClick={() => setShowSocial(!showSocial)}
                className={`relative h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${showSocial ? "bg-black/80" : "bg-black/10"}`}
              >
                <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${showSocial ? "translate-x-5" : "translate-x-0"}`} />
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
