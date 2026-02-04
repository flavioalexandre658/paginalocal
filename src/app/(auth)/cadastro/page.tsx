import { AuthCard } from '@/components/auth/auth-card'
import { SignUpForm } from './_components/sign-up-form'

export default function SignUpPage() {
  return (
    <AuthCard
      title="Criar conta"
      description="Preencha os dados abaixo para criar sua conta"
      footer={{
        text: 'Já tem uma conta?',
        linkText: 'Entrar',
        linkHref: '/entrar',
      }}
    >
      <SignUpForm />
    </AuthCard>
  )
}
