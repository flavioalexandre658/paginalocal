import { Suspense } from "react";
import { Metadata } from 'next'
import { AuthCard } from "@/components/auth/auth-card";
import { ResetForm } from "./_components/reset-form";

export const metadata: Metadata = {
  title: 'Redefinir Senha',
}

export default function ResetPage() {
  return (
    <AuthCard
      title="Redefinir senha"
      description="Digite sua nova senha"
      footer={{
        text: "Lembrou sua senha?",
        linkText: "Voltar ao login",
        linkHref: "/entrar",
      }}
    >
      <Suspense fallback={<div className="h-32" />}>
        <ResetForm />
      </Suspense>
    </AuthCard>
  );
}
