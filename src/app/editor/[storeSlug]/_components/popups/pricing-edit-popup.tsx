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
import { cn } from "@/lib/utils";
import { PglButton } from "@/components/ui/pgl-button";
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

const inputClasses = "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black/80 outline-none transition-colors placeholder:text-black/30 focus:border-black/30 focus:ring-1 focus:ring-black/10";

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
            {/* Plan sidebar */}
            <div className="w-44 shrink-0 space-y-1 border-r border-black/[0.06] pr-4">
              {plans.map((plan, i) => (
                <button
                  key={i}
                  onClick={() => setActivePlanIndex(i)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-[background,color] duration-150",
                    activePlanIndex === i
                      ? "bg-black/5 font-medium text-black/80"
                      : "text-black/55 hover:bg-black/5 hover:text-black/80"
                  )}
                >
                  {plan.highlighted && <IconStar className="size-3.5 shrink-0 text-amber-500" />}
                  <span className="truncate">{plan.name || "Sem nome"}</span>
                </button>
              ))}
            </div>

            {activePlan && (
              <div className="flex-1 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1.5 text-[13px] font-medium text-black/55">Nome do plano</p>
                    <input
                      type="text"
                      value={activePlan.name}
                      onChange={(e) => updatePlan(activePlanIndex, "name", e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <p className="mb-1.5 text-[13px] font-medium text-black/55">Preco</p>
                    <input
                      type="text"
                      value={activePlan.price}
                      onChange={(e) => updatePlan(activePlanIndex, "price", e.target.value)}
                      placeholder="R$ 99,90"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 text-[13px] font-medium text-black/55">Descricao</p>
                  <input
                    type="text"
                    value={activePlan.description}
                    onChange={(e) => updatePlan(activePlanIndex, "description", e.target.value)}
                    className={inputClasses}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1.5 text-[13px] font-medium text-black/55">Texto do botao</p>
                    <input
                      type="text"
                      value={activePlan.ctaText}
                      onChange={(e) => updatePlan(activePlanIndex, "ctaText", e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <p className="mb-1.5 text-[13px] font-medium text-black/55">Tipo do botao</p>
                    <div className="flex gap-1.5 pt-1">
                      {(["whatsapp", "link"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => updatePlan(activePlanIndex, "ctaType", t)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
                            activePlan.ctaType === t
                              ? "border-transparent bg-black/80 text-white"
                              : "border-black/[0.08] text-black/55 hover:border-black/20"
                          )}
                        >
                          {t === "whatsapp" ? "WhatsApp" : "Link"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Highlight toggle — HIG toggle pattern */}
                <div className="flex items-center justify-between rounded-xl border border-black/[0.08] bg-white px-3.5 py-3">
                  <div>
                    <p className="text-sm font-medium text-black/80">Plano destaque</p>
                    <p className="text-[13px] text-black/55">Marcar como &quot;Mais popular&quot;</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={activePlan.highlighted}
                    onClick={() => updatePlan(activePlanIndex, "highlighted", !activePlan.highlighted)}
                    className={cn(
                      "relative h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors",
                      activePlan.highlighted ? "bg-black/80" : "bg-black/10",
                    )}
                  >
                    <span className={cn(
                      "block h-5 w-5 rounded-full bg-white shadow transition-transform",
                      activePlan.highlighted ? "translate-x-5" : "translate-x-0",
                    )} />
                  </button>
                </div>

                {/* Features */}
                <div>
                  <p className="mb-1.5 text-[13px] font-medium text-black/55">
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
                                ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                : "border-red-200 bg-red-50 text-red-500"
                            )}
                          >
                            {included ? "\u2713" : "\u2715"}
                          </button>
                          <input
                            type="text"
                            value={featureName}
                            onChange={(e) => renameFeature(featureName, e.target.value)}
                            className={cn(
                              inputClasses,
                              !included && "text-black/30 line-through"
                            )}
                          />
                          <button
                            onClick={() => removeFeatureFromAll(featureName)}
                            className="rounded-lg p-1 text-black/30 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <IconTrash className="size-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={addFeature}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-black/10 py-2 text-[13px] font-medium text-black/55 transition-colors hover:border-black/20 hover:text-black/80"
                  >
                    <IconPlus className="size-3.5" />
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
            <PglButton variant="ghost" size="sm" onClick={onClose}>Cancelar</PglButton>
            <PglButton variant="dark" size="sm" onClick={handleSave}>Salvar</PglButton>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
