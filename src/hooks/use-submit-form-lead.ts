"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { submitFormLeadAction } from "@/actions/leads/submit-form-lead.action";
import { useStoreId } from "@/components/site-renderer/store-context";

interface FormData {
  name: string;
  email?: string;
  phone?: string;
  message?: string;
}

export function useSubmitFormLead() {
  const storeId = useStoreId();
  const [submitted, setSubmitted] = useState(false);

  const { execute, isExecuting } = useAction(submitFormLeadAction, {
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const submit = (data: FormData) => {
    if (!storeId) return;

    const device = typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop";
    const sessionId = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("pgl_session_id") || undefined : undefined;

    execute({
      storeId,
      name: data.name,
      email: data.email,
      phone: data.phone?.replace(/\D/g, "") || undefined,
      message: data.message,
      device: device as "mobile" | "desktop",
      sessionId: sessionId ?? undefined,
      referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    });
  };

  return { submit, isSubmitting: isExecuting, submitted, storeId };
}
