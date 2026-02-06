import { Metadata } from 'next'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { subscription } from '@/db/schema'
import { eq, and, or } from 'drizzle-orm'
import { IconFileText } from '@tabler/icons-react'
import { LegalPageLayout, LegalSection, LegalHighlight } from '../_components/legal-page-layout'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos e condições de uso da plataforma Página Local. Leia antes de utilizar nossos serviços.',
}

async function getUserHasSubscription(userId: string): Promise<boolean> {
  const [userSubscription] = await db
    .select({ id: subscription.id })
    .from(subscription)
    .where(
      and(
        eq(subscription.userId, userId),
        or(
          eq(subscription.status, 'ACTIVE'),
          eq(subscription.status, 'TRIALING')
        )
      )
    )
    .limit(1)

  return !!userSubscription
}

export default async function TermosDeUsoPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const isLoggedIn = !!session?.user?.id
  const hasSubscription = isLoggedIn ? await getUserHasSubscription(session.user.id) : false

  return (
    <LegalPageLayout
      icon={<IconFileText className="h-8 w-8" />}
      title="Termos de Uso"
      description="Condições gerais que regem o uso da plataforma Página Local."
      lastUpdated="04 de fevereiro de 2026"
      isLoggedIn={isLoggedIn}
      hasSubscription={hasSubscription}
    >
      <LegalHighlight variant="warning">
        <strong>Importante:</strong> Ao utilizar a plataforma Página Local, você concorda com estes Termos de Uso. Se você não concordar com algum dos termos, por favor, não utilize nossos serviços.
      </LegalHighlight>

      <LegalSection title="1. Aceitação dos Termos">
        <p>
          Estes Termos de Uso constituem um acordo legal entre você (&quot;Usuário&quot;) e Página Local (&quot;nós&quot;, &quot;nosso&quot; ou &quot;Plataforma&quot;). Ao acessar ou usar nossos serviços, você declara ter lido, compreendido e concordado em estar vinculado a estes termos.
        </p>
        <p>
          Se você está usando a plataforma em nome de uma empresa ou outra entidade legal, você declara ter autoridade para vincular essa entidade a estes termos.
        </p>
      </LegalSection>

      <LegalSection title="2. Descrição do Serviço">
        <p>
          O Página Local é uma plataforma de criação de landing pages otimizadas para SEO local, que permite:
        </p>
        <ul>
          <li>Criar páginas profissionais para negócios locais</li>
          <li>Integrar com o Google Meu Negócio</li>
          <li>Gerar conteúdo otimizado por inteligência artificial</li>
          <li>Receber leads diretamente via WhatsApp</li>
          <li>Acompanhar métricas de conversão</li>
          <li>Configurar domínios personalizados</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Cadastro e Conta">
        <p>
          Para utilizar nossos serviços, você deve:
        </p>
        <ul>
          <li>Fornecer informações verdadeiras, precisas e completas</li>
          <li>Manter suas informações de cadastro atualizadas</li>
          <li>Ser responsável pela confidencialidade de sua senha</li>
          <li>Notificar-nos imediatamente sobre uso não autorizado</li>
          <li>Ter pelo menos 18 anos ou a maioridade legal em sua jurisdição</li>
        </ul>
        <p>
          Reservamo-nos o direito de recusar ou cancelar contas que violem estes termos.
        </p>
      </LegalSection>

      <LegalSection title="4. Uso Aceitável">
        <p>
          Ao usar nossa plataforma, você concorda em não:
        </p>
        <ul>
          <li>Violar leis ou regulamentos aplicáveis</li>
          <li>Publicar conteúdo ilegal, difamatório, obsceno ou ofensivo</li>
          <li>Infringir direitos de propriedade intelectual de terceiros</li>
          <li>Transmitir vírus ou código malicioso</li>
          <li>Tentar acessar sistemas ou dados não autorizados</li>
          <li>Usar a plataforma para spam ou comunicações não solicitadas</li>
          <li>Criar páginas para atividades ilegais ou fraudulentas</li>
          <li>Revender ou redistribuir nossos serviços sem autorização</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Conteúdo do Usuário">
        <p>
          Você é o único responsável por todo o conteúdo que publica em sua página, incluindo textos, imagens, logotipos e informações de contato. Ao publicar conteúdo, você declara que:
        </p>
        <ul>
          <li>Possui todos os direitos necessários sobre o conteúdo</li>
          <li>O conteúdo não viola direitos de terceiros</li>
          <li>As informações são verdadeiras e não enganosas</li>
          <li>O conteúdo está em conformidade com a legislação aplicável</li>
        </ul>
        <p>
          Concede-nos uma licença não exclusiva para exibir, hospedar e distribuir seu conteúdo conforme necessário para prestação dos serviços.
        </p>
      </LegalSection>

      <LegalSection title="6. Propriedade Intelectual">
        <p>
          A plataforma Página Local, incluindo seu código, design, funcionalidades, marca e conteúdo original, são protegidos por direitos autorais, marcas registradas e outras leis de propriedade intelectual.
        </p>
        <p>
          Você não pode copiar, modificar, distribuir, vender ou alugar qualquer parte de nossos serviços sem nossa autorização expressa por escrito.
        </p>
      </LegalSection>

      <LegalSection title="7. Planos e Pagamento">
        <p>
          Oferecemos diferentes planos de assinatura. Ao contratar um plano pago:
        </p>
        <ul>
          <li>Você autoriza a cobrança recorrente conforme o plano escolhido</li>
          <li>Os valores podem ser reajustados com aviso prévio de 30 dias</li>
          <li>Não há reembolso para períodos já utilizados</li>
          <li>O cancelamento pode ser feito a qualquer momento pelo painel</li>
          <li>Funcionalidades do plano serão mantidas até o fim do período pago</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Disponibilidade do Serviço">
        <p>
          Nos esforçamos para manter a plataforma disponível 24 horas por dia, 7 dias por semana. No entanto, não garantimos disponibilidade ininterrupta e não seremos responsáveis por:
        </p>
        <ul>
          <li>Interrupções programadas para manutenção</li>
          <li>Falhas técnicas fora de nosso controle</li>
          <li>Problemas de conectividade do usuário</li>
          <li>Eventos de força maior</li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Limitação de Responsabilidade">
        <p>
          Na máxima extensão permitida por lei, o Página Local não será responsável por danos indiretos, incidentais, especiais ou consequenciais, incluindo perda de lucros, dados ou oportunidades de negócio.
        </p>
        <p>
          Nossa responsabilidade total não excederá o valor pago pelo usuário nos últimos 12 meses.
        </p>
      </LegalSection>

      <LegalSection title="10. Rescisão">
        <p>
          Podemos suspender ou encerrar seu acesso à plataforma, a nosso critério, se você:
        </p>
        <ul>
          <li>Violar estes Termos de Uso</li>
          <li>Usar a plataforma de forma fraudulenta</li>
          <li>Não pagar as taxas devidas</li>
          <li>Prejudicar outros usuários ou a plataforma</li>
        </ul>
        <p>
          Você pode encerrar sua conta a qualquer momento através do painel de configurações.
        </p>
      </LegalSection>

      <LegalSection title="11. Alterações nos Termos">
        <p>
          Podemos modificar estes Termos de Uso a qualquer momento. Alterações significativas serão comunicadas com antecedência de 30 dias por e-mail ou aviso na plataforma. O uso continuado após as alterações constitui aceitação dos novos termos.
        </p>
      </LegalSection>

      <LegalSection title="12. Disposições Gerais">
        <p>
          Estes termos constituem o acordo integral entre você e o Página Local. Se qualquer disposição for considerada inválida, as demais permanecerão em vigor.
        </p>
        <p>
          Estes termos são regidos pelas leis do Brasil. Qualquer disputa será submetida ao foro da comarca de São Paulo/SP.
        </p>
      </LegalSection>

      <LegalHighlight variant="info">
        <strong>Dúvidas?</strong> Entre em contato conosco pelo e-mail: <strong>contato@paginalocal.com.br</strong>
      </LegalHighlight>
    </LegalPageLayout>
  )
}
