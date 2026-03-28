import { Metadata } from 'next'
import { AuthCard } from "@/components/auth/auth-card"
import { SignInForm } from "./_components/sign-in-form"

export const metadata: Metadata = {
  title: 'Entrar',
}

export default function SignInPage() {
  return (
    <AuthCard
      title="Bem-vindo de volta!"
      description="Faca login para continuar"
      footer={{
        text: "Nao tem uma conta?",
        linkText: "Sign up",
        linkHref: "/cadastro",
      }}
    >
      <SignInForm />
    </AuthCard>
  )
}
