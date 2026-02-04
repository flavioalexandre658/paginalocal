import { Metadata } from 'next'
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "./_components/sign-in-form";

export const metadata: Metadata = {
  title: 'Entrar',
}

export default function SignInPage() {
  return (
    <AuthCard
      title="Entrar"
      description="Digite suas credenciais para acessar sua conta"
      footer={{
        text: "Não tem uma conta?",
        linkText: "Criar conta",
        linkHref: "/cadastro",
      }}
    >
      <SignInForm />
    </AuthCard>
  );
}
