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
import { Button } from "@/components/ui/button";
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
            <div className="w-44 shrink-0 space-y-1 border-r border-border pr-4">
              {plans.map((plan, i) => (
                <button
                  key={i}
                  onClick={() => setActivePlanIndex(i)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    activePlanIndex === i
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted"
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
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Nome do plano</p>
                    <input
                      type="text"
                      value={activePlan.name}
                      onChange={(e) => updatePlan(activePlanIndex, "name", e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Preco</p>
                    <input
                      type="text"
                      value={activePlan.price}
                      onChange={(e) => updatePlan(activePlanIndex, "price", e.target.value)}
                      placeholder="R$ 99,90"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">Descricao</p>
                  <input
                    type="text"
                    value={activePlan.description}
                    onChange={(e) => updatePlan(activePlanIndex, "description", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Texto do botao</p>
                    <input
                      type="text"
                      value={activePlan.ctaText}
                      onChange={(e) => updatePlan(activePlanIndex, "ctaText", e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Tipo do botao</p>
                    <div className="flex gap-1.5 pt-1">
                      {(["whatsapp", "link"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => updatePlan(activePlanIndex, "ctaType", t)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
                            activePlan.ctaType === t
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground hover:border-primary/50"
                          )}
                        >
                          {t === "whatsapp" ? "WhatsApp" : "Link"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Plano destaque</p>
                    <p className="text-xs text-muted-foreground">Marcar como "Mais popular"</p>
                  </div>
                  <Switch
                    checked={activePlan.highlighted}
                    onCheckedChange={(v) => updatePlan(activePlanIndex, "highlighted", v)}
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                                ? "border-green-300 bg-green-50 text-green-600"
                                : "border-red-200 bg-red-50 text-red-400"
                            )}
                          >
                            {included ? "✓" : "✕"}
                          </button>
                          <input
                            type="text"
                            value={featureName}
                            onChange={(e) => renameFeature(featureName, e.target.value)}
                            className={cn(
                              "flex-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus:border-primary",
                              !included && "text-muted-foreground line-through"
                            )}
                          />
                          <button
                            onClick={() => removeFeatureFromAll(featureName)}
                            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <IconTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={addFeature}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
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
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
