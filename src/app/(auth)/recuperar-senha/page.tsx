import { Metadata } from 'next'
import { AuthCard } from "@/components/auth/auth-card";
import { RecoverForm } from "./_components/recover-form";

export const metadata: Metadata = {
  title: 'Recuperar Senha',
}

export default function RecoverPage() {
  return (
    <AuthCard
      title="Recuperar senha"
      description="Digite seu email para receber um link de recuperação"
      footer={{
        text: "Lembrou sua senha?",
        linkText: "Voltar ao login",
        linkHref: "/entrar",
      }}
    >
      <RecoverForm />
    </AuthCard>
  );
}
