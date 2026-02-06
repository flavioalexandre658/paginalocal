import { Metadata } from 'next'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { subscription } from '@/db/schema'
import { eq, and, or } from 'drizzle-orm'
import { IconShieldLock } from '@tabler/icons-react'
import { LegalPageLayout, LegalSection, LegalHighlight } from '../_components/legal-page-layout'

export const metadata: Metadata = {
  title: 'LGPD - Lei Geral de Proteção de Dados',
  description: 'Saiba como o Página Local está em conformidade com a LGPD e protege seus dados pessoais.',
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

export default async function LGPDPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const isLoggedIn = !!session?.user?.id
  const hasSubscription = isLoggedIn ? await getUserHasSubscription(session.user.id) : false

  return (
    <LegalPageLayout
      icon={<IconShieldLock className="h-8 w-8" />}
      title="LGPD"
      description="Nosso compromisso com a Lei Geral de Proteção de Dados e a segurança das suas informações."
      lastUpdated="04 de fevereiro de 2026"
      isLoggedIn={isLoggedIn}
      hasSubscription={hasSubscription}
    >
      <LegalHighlight variant="info">
        <strong>Compromisso com sua privacidade:</strong> O Página Local está em total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), garantindo transparência e segurança no tratamento dos seus dados.
      </LegalHighlight>

      <LegalSection title="O que é a LGPD?">
        <p>
          A Lei Geral de Proteção de Dados (LGPD) é a legislação brasileira que regula as atividades de tratamento de dados pessoais. Ela estabelece regras sobre coleta, armazenamento, tratamento e compartilhamento de dados pessoais, com o objetivo de proteger os direitos fundamentais de liberdade e privacidade.
        </p>
      </LegalSection>

      <LegalSection title="Seus direitos como titular de dados">
        <p>
          Como titular de dados pessoais, você possui os seguintes direitos garantidos pela LGPD:
        </p>
        <ul>
          <li><strong>Confirmação:</strong> Saber se tratamos seus dados pessoais</li>
          <li><strong>Acesso:</strong> Acessar seus dados pessoais que mantemos</li>
          <li><strong>Correção:</strong> Solicitar a correção de dados incompletos, inexatos ou desatualizados</li>
          <li><strong>Anonimização:</strong> Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
          <li><strong>Portabilidade:</strong> Solicitar a portabilidade dos dados para outro fornecedor</li>
          <li><strong>Eliminação:</strong> Solicitar a eliminação dos dados tratados com seu consentimento</li>
          <li><strong>Informação:</strong> Ser informado sobre as entidades com as quais compartilhamos seus dados</li>
          <li><strong>Revogação:</strong> Revogar seu consentimento a qualquer momento</li>
        </ul>
      </LegalSection>

      <LegalSection title="Bases legais para tratamento">
        <p>
          O Página Local trata seus dados pessoais com base nas seguintes hipóteses legais previstas na LGPD:
        </p>
        <ul>
          <li><strong>Consentimento:</strong> Quando você autoriza expressamente o tratamento</li>
          <li><strong>Execução de contrato:</strong> Para prestação dos nossos serviços</li>
          <li><strong>Legítimo interesse:</strong> Para melhorar nossos serviços e sua experiência</li>
          <li><strong>Cumprimento de obrigação legal:</strong> Quando exigido por lei</li>
        </ul>
      </LegalSection>

      <LegalSection title="Dados que coletamos">
        <p>
          Coletamos apenas os dados necessários para prestação dos nossos serviços:
        </p>
        <ul>
          <li><strong>Dados de identificação:</strong> Nome, e-mail, telefone</li>
          <li><strong>Dados do negócio:</strong> Nome da empresa, endereço, categoria</li>
          <li><strong>Dados de uso:</strong> Informações sobre como você utiliza nossa plataforma</li>
          <li><strong>Dados de navegação:</strong> Cookies e informações técnicas</li>
        </ul>
      </LegalSection>

      <LegalSection title="Segurança dos dados">
        <p>
          Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais:
        </p>
        <ul>
          <li>Criptografia de dados em trânsito e em repouso</li>
          <li>Controle de acesso restrito aos dados</li>
          <li>Monitoramento contínuo de segurança</li>
          <li>Backups regulares e plano de recuperação</li>
          <li>Treinamento da equipe sobre proteção de dados</li>
        </ul>
      </LegalSection>

      <LegalSection title="Encarregado de Proteção de Dados (DPO)">
        <p>
          Em conformidade com a LGPD, designamos um Encarregado de Proteção de Dados (DPO) responsável por:
        </p>
        <ul>
          <li>Aceitar reclamações e comunicações dos titulares</li>
          <li>Receber comunicações da Autoridade Nacional de Proteção de Dados (ANPD)</li>
          <li>Orientar funcionários sobre práticas de proteção de dados</li>
        </ul>

        <LegalHighlight variant="success">
          <strong>Contato do DPO:</strong> Para exercer seus direitos ou esclarecer dúvidas sobre proteção de dados, entre em contato pelo e-mail: <strong>privacidade@paginalocal.com.br</strong>
        </LegalHighlight>
      </LegalSection>

      <LegalSection title="Transferência internacional de dados">
        <p>
          Alguns de nossos prestadores de serviços podem estar localizados fora do Brasil. Nesses casos, garantimos que a transferência internacional de dados ocorra apenas para países que proporcionem grau de proteção adequado ou mediante adoção de garantias apropriadas, conforme exigido pela LGPD.
        </p>
      </LegalSection>

      <LegalSection title="Retenção de dados">
        <p>
          Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletados, incluindo obrigações legais, contratuais e regulatórias. Após esse período, os dados são eliminados ou anonimizados de forma segura.
        </p>
      </LegalSection>

      <LegalSection title="Alterações nesta política">
        <p>
          Podemos atualizar esta página periodicamente para refletir mudanças em nossas práticas ou na legislação. Recomendamos que você revise esta página regularmente. Alterações significativas serão comunicadas por e-mail ou através de aviso em nossa plataforma.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
