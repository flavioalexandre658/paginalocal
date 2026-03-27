"use client";

import { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import {
  Modal,
  ModalContent,
} from "@/components/ui/modal-blocks";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { UpgradePanel } from "./upgrade-panel";
import { getPlans } from "@/actions/subscriptions/get-plans.action";
import { usePlanRestrictions } from "@/hooks/use-plan-restrictions";

interface Props {
  open: boolean;
  onClose: () => void;
  storeSlug?: string;
}

export function UpgradeModal({ open, onClose, storeSlug }: Props) {
  const { executeAsync, result, isExecuting } = useAction(getPlans);
  const [loaded, setLoaded] = useState(false);
  const { getPlanType } = usePlanRestrictions();

  useEffect(() => {
    if (open && !loaded) {
      executeAsync().then(() => setLoaded(true));
    }
  }, [open, loaded, executeAsync]);

  const plans = (result?.data ?? [])
    .filter((p) => p.type !== "ESSENTIAL")
    .map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      monthlyPriceInCents: p.monthlyPriceInCents,
      yearlyPriceInCents: p.yearlyPriceInCents,
    }));

  return (
    <Modal open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <ModalContent size="xl" className="p-0 overflow-hidden rounded-3xl max-w-[840px]" hideCloseButton>
        <VisuallyHidden.Root><DialogPrimitive.Title>Fazer upgrade</DialogPrimitive.Title></VisuallyHidden.Root>
        <VisuallyHidden.Root><DialogPrimitive.Description>Escolha seu plano</DialogPrimitive.Description></VisuallyHidden.Root>
        <UpgradePanel
          plans={plans}
          storeSlug={storeSlug}
          loading={isExecuting || !loaded}
          currentPlanType={getPlanType()}
        />
      </ModalContent>
    </Modal>
  );
}
