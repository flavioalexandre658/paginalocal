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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Nome da loja</p>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Nome do negocio"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Tagline</p>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Slogan do negocio"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Links de navegacao</p>
              <div className="space-y-2">
                {navLinks.map((link, i) => (
                  editingIndex === i ? (
                    <div key={i} className="space-y-2 rounded-lg border border-primary/30 bg-muted/30 p-3">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => setNavLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, label: e.target.value } : l))}
                        placeholder="Nome do link"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => setNavLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, href: e.target.value } : l))}
                        placeholder="URL ou #secao"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                      />
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="text-xs font-medium text-primary hover:text-primary/80"
                      >
                        Concluido
                      </button>
                    </div>
                  ) : (
                    <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 transition-colors hover:border-primary/30">
                      <IconGripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/50" />
                      <span className="flex-1 truncate text-sm">{link.label}</span>
                      <button onClick={() => setEditingIndex(i)} className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <IconPencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setNavLinks((prev) => prev.filter((_, idx) => idx !== i))} className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                        <IconTrash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                ))}
              </div>
              <button
                onClick={() => setNavLinks((prev) => [...prev, { label: "Novo link", href: "#" }])}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <IconPlus className="h-3.5 w-3.5" />
                Adicionar link
              </button>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contato</p>
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Endereco</p>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, numero, cidade"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Telefone</p>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Email</p>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contato@empresa.com"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Horario de funcionamento</p>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Seg - Sex, 08:00 - 18:00"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Texto de copyright</p>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                placeholder="© 2024 Nome da Empresa"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
              <div>
                <p className="text-sm font-medium">Redes sociais</p>
                <p className="text-xs text-muted-foreground">Mostrar icones das redes sociais</p>
              </div>
              <Switch checked={showSocial} onCheckedChange={setShowSocial} />
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
