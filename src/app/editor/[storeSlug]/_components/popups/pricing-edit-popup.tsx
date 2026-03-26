"use client";

import { useState, useCallback, useMemo } from "react";
import { IconPlus, IconTrash, IconStar } from "@tabler/icons-react";
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
import { cn } from "@/lib/utils";
import { useEditor } from "../../_lib/editor-context";

interface Plan {
  name: string;
  price: string;
  priceAnnual?: string;
  description: string;
  features: string[];
  highlighted: boolean;
  ctaText: string;
  ctaType: "whatsapp" | "link";
}

interface Props {
  sectionId: string;
  content: Record<string, unknown>;
  onClose: () => void;
}

function stripTilde(f: string) {
  return f.replace(/^~|~$/g, "");
}

function isExcluded(f: string) {
  return f.startsWith("~") && f.endsWith("~");
}

export function PricingEditPopup({ sectionId, content, onClose }: Props) {
  const { dispatch } = useEditor();

  const existingPlans = Array.isArray(content.plans)
    ? (content.plans as Plan[]).map((p) => ({
        name: p.name || "",
        price: p.price || "",
        priceAnnual: p.priceAnnual || "",
        description: p.description || "",
        features: Array.isArray(p.features) ? [...p.features] : [],
        highlighted: p.highlighted || false,
        ctaText: p.ctaText || "",
        ctaType: (p.ctaType || "whatsapp") as "whatsapp" | "link",
      }))
    : [];

  const [plans, setPlans] = useState<Plan[]>(existingPlans);
  const [activePlanIndex, setActivePlanIndex] = useState(0);

  const allFeatures = useMemo(() => {
    const set = new Set<string>();
    plans.forEach((p) => p.features.forEach((f) => set.add(stripTilde(f))));
    return Array.from(set);
  }, [plans]);

  const getFeatureStatus = (planIndex: number, featureName: string): "included" | "excluded" | "missing" => {
    const plan = plans[planIndex];
    if (!plan) return "missing";
    const found = plan.features.find((f) => stripTilde(f) === featureName);
    if (!found) return "missing";
    return isExcluded(found) ? "excluded" : "included";
  };

  const toggleFeature = (planIndex: number, featureName: string) => {
    setPlans((prev) => prev.map((p, i) => {
      if (i !== planIndex) return p;
      const idx = p.features.findIndex((f) => stripTilde(f) === featureName);
      if (idx === -1) {
        return { ...p, features: [...p.features, featureName] };
      }
      const current = p.features[idx];
      const clean = stripTilde(current);
      if (isExcluded(current)) {
        return { ...p, features: p.features.map((f, fi) => fi === idx ? clean : f) };
      }
      return { ...p, features: p.features.map((f, fi) => fi === idx ? `~${clean}~` : f) };
    }));
  };

  const removeFeatureFromAll = (featureName: string) => {
    setPlans((prev) => prev.map((p) => ({
      ...p,
      features: p.features.filter((f) => stripTilde(f) !== featureName),
    })));
  };

  const addFeature = () => {
    const name = "Novo recurso";
    setPlans((prev) => prev.map((p, i) => ({
      ...p,
      features: i === activePlanIndex ? [...p.features, name] : [...p.features, `~${name}~`],
    })));
  };

  const renameFeature = (oldName: string, newName: string) => {
    setPlans((prev) => prev.map((p) => ({
      ...p,
      features: p.features.map((f) => {
        const clean = stripTilde(f);
        if (clean !== oldName) return f;
        return isExcluded(f) ? `~${newName}~` : newName;
      }),
    })));
  };

  const updatePlan = (index: number, field: keyof Plan, value: unknown) => {
    setPlans((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const handleSave = useCallback(() => {
    const updated: Record<string, unknown> = {
      ...content,
      plans: plans.map((p) => ({
        name: p.name,
        price: p.price,
        priceAnnual: p.priceAnnual || undefined,
        description: p.description,
        features: p.features,
        highlighted: p.highlighted,
        ctaText: p.ctaText,
        ctaType: p.ctaType,
      })),
    };
    dispatch({ type: "UPDATE_SECTION_CONTENT", sectionId, content: updated });
    onClose();
  }, [content, dispatch, sectionId, plans, onClose]);

  const activePlan = plans[activePlanIndex];

  return (
    <Modal open onOpenChange={(open) => { if (!open) onClose(); }}>
      <ModalContent size="lg" data-editor-ui>
        <ModalHeader>
          <ModalTitle>Editar planos</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="flex gap-4">
            <div className="w-44 shrink-0 space-y-1 border-r border-[rgba(0,0,0,0.06)] pr-4">
              {plans.map((plan, i) => (
                <button
                  key={i}
                  onClick={() => setActivePlanIndex(i)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-[10px] px-3 py-2.5 text-left text-[14px] transition-colors",
                    activePlanIndex === i
                      ? "bg-[#171717] font-medium text-white"
                      : "text-[#737373] hover:bg-[rgba(0,0,0,0.04)]"
                  )}
                >
                  {plan.highlighted && <IconStar className="h-3.5 w-3.5 shrink-0 text-amber-500" />}
                  <span className="truncate">{plan.name || "Sem nome"}</span>
                </button>
              ))}
            </div>

            {activePlan && (
              <div className="flex-1 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Nome do plano</p>
                    <input
                      type="text"
                      value={activePlan.name}
                      onChange={(e) => updatePlan(activePlanIndex, "name", e.target.value)}
                      className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                    />
                  </div>
                  <div>
                    <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Preco</p>
                    <input
                      type="text"
                      value={activePlan.price}
                      onChange={(e) => updatePlan(activePlanIndex, "price", e.target.value)}
                      placeholder="R$ 99,90"
                      className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Descricao</p>
                  <input
                    type="text"
                    value={activePlan.description}
                    onChange={(e) => updatePlan(activePlanIndex, "description", e.target.value)}
                    className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Texto do botao</p>
                    <input
                      type="text"
                      value={activePlan.ctaText}
                      onChange={(e) => updatePlan(activePlanIndex, "ctaText", e.target.value)}
                      className="w-full rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]"
                    />
                  </div>
                  <div>
                    <p className="mb-[6px] text-[13px] font-medium text-[#737373]">Tipo do botao</p>
                    <div className="flex gap-1.5 pt-1">
                      {(["whatsapp", "link"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => updatePlan(activePlanIndex, "ctaType", t)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
                            activePlan.ctaType === t
                              ? "border-transparent bg-[#171717] text-white"
                              : "border-[rgba(0,0,0,0.06)] text-[#737373] hover:border-[rgba(0,0,0,0.2)]"
                          )}
                        >
                          {t === "whatsapp" ? "WhatsApp" : "Link"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-white px-[14px] py-[12px]">
                  <div>
                    <p className="text-[14px] font-medium text-[#171717]">Plano destaque</p>
                    <p className="text-[13px] text-[#737373]">Marcar como "Mais popular"</p>
                  </div>
                  <Switch
                    checked={activePlan.highlighted}
                    onCheckedChange={(v) => updatePlan(activePlanIndex, "highlighted", v)}
                  />
                </div>

                <div>
                  <p className="mb-[6px] text-[13px] font-medium text-[#737373]">
                    Recursos ({allFeatures.length})
                  </p>
                  <div className="space-y-1.5">
                    {allFeatures.map((featureName) => {
                      const status = getFeatureStatus(activePlanIndex, featureName);
                      const included = status === "included";
                      return (
                        <div key={featureName} className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFeature(activePlanIndex, featureName)}
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition-colors",
                              included
                                ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#16a34a]"
                                : "border-[#fecaca] bg-[#fef2f2] text-[#ef4444]"
                            )}
                          >
                            {included ? "\u2713" : "\u2715"}
                          </button>
                          <input
                            type="text"
                            value={featureName}
                            onChange={(e) => renameFeature(featureName, e.target.value)}
                            className={cn(
                              "flex-1 rounded-[10px] border border-[rgba(0,0,0,0.06)] bg-[#f5f5f4] px-[14px] py-[10px] text-[14px] outline-none placeholder:text-[#a3a3a3] focus:border-[rgba(0,0,0,0.2)]",
                              !included && "text-[#a3a3a3] line-through"
                            )}
                          />
                          <button
                            onClick={() => removeFeatureFromAll(featureName)}
                            className="rounded-[8px] p-1 text-[#a3a3a3] transition-colors hover:bg-[#fef2f2] hover:text-[#ef4444]"
                          >
                            <IconTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={addFeature}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[rgba(0,0,0,0.06)] py-2 text-[13px] font-medium text-[#737373] transition-colors hover:border-[rgba(0,0,0,0.2)] hover:text-[#171717]"
                  >
                    <IconPlus className="h-3.5 w-3.5" />
                    Adicionar recurso
                  </button>
                </div>
              </div>
            )}
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
