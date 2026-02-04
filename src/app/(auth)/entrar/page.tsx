import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "./_components/sign-in-form";

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
