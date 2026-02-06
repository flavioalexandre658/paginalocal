import { Metadata } from 'next'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { subscription } from '@/db/schema'
import { eq, and, or } from 'drizzle-orm'
import { IconLock } from '@tabler/icons-react'
import { LegalPageLayout, LegalSection, LegalHighlight } from '../_components/legal-page-layout'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Entenda como o Página Local coleta, usa e protege seus dados pessoais.',
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

export default async function PoliticaDePrivacidadePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const isLoggedIn = !!session?.user?.id
  const hasSubscription = isLoggedIn ? await getUserHasSubscription(session.user.id) : false

  return (
    <LegalPageLayout
      icon={<IconLock className="h-8 w-8" />}
      title="Política de Privacidade"
      description="Transparência sobre como tratamos suas informações pessoais."
      lastUpdated="04 de fevereiro de 2026"
      isLoggedIn={isLoggedIn}
      hasSubscription={hasSubscription}
    >
      <LegalHighlight variant="info">
        <strong>Sua privacidade importa:</strong> Esta política explica de forma clara e transparente como coletamos, usamos, armazenamos e protegemos seus dados pessoais ao usar a plataforma Página Local.
      </LegalHighlight>

      <LegalSection title="1. Informações que Coletamos">
        <h3>1.1 Dados fornecidos por você</h3>
        <ul>
          <li><strong>Dados de cadastro:</strong> Nome, e-mail, telefone, senha</li>
          <li><strong>Dados do negócio:</strong> Nome da empresa, endereço, categoria, CNPJ (opcional)</li>
          <li><strong>Dados de pagamento:</strong> Informações de cartão processadas por gateway seguro</li>
          <li><strong>Conteúdo:</strong> Textos, imagens e informações que você adiciona à sua página</li>
        </ul>

        <h3>1.2 Dados coletados automaticamente</h3>
        <ul>
          <li><strong>Dados de uso:</strong> Páginas visitadas, funcionalidades utilizadas, tempo de uso</li>
          <li><strong>Dados técnicos:</strong> Endereço IP, tipo de navegador, sistema operacional</li>
          <li><strong>Cookies:</strong> Identificadores armazenados no seu dispositivo</li>
          <li><strong>Dados de leads:</strong> Informações dos visitantes das suas páginas</li>
        </ul>

        <h3>1.3 Dados de terceiros</h3>
        <ul>
          <li><strong>Google Meu Negócio:</strong> Informações públicas da sua empresa (com sua autorização)</li>
          <li><strong>Provedores de pagamento:</strong> Confirmação de transações</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Como Usamos seus Dados">
        <p>
          Utilizamos suas informações para:
        </p>
        <ul>
          <li>Criar e gerenciar sua conta na plataforma</li>
          <li>Gerar e hospedar sua landing page</li>
          <li>Processar pagamentos e gerenciar assinaturas</li>
          <li>Enviar notificações sobre leads e métricas</li>
          <li>Fornecer suporte ao cliente</li>
          <li>Melhorar nossos serviços e desenvolver novos recursos</li>
          <li>Enviar comunicações de marketing (com seu consentimento)</li>
          <li>Cumprir obrigações legais e regulatórias</li>
          <li>Prevenir fraudes e garantir a segurança da plataforma</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Compartilhamento de Dados">
        <p>
          Podemos compartilhar seus dados com:
        </p>
        <ul>
          <li><strong>Provedores de infraestrutura:</strong> Serviços de hospedagem e CDN</li>
          <li><strong>Processadores de pagamento:</strong> Para processar transações financeiras</li>
          <li><strong>Ferramentas de analytics:</strong> Para análise de uso da plataforma</li>
          <li><strong>Serviços de e-mail:</strong> Para envio de notificações</li>
          <li><strong>Autoridades competentes:</strong> Quando exigido por lei</li>
        </ul>

        <LegalHighlight variant="warning">
          <strong>Nunca vendemos seus dados.</strong> Não comercializamos suas informações pessoais com terceiros para fins de marketing.
        </LegalHighlight>
      </LegalSection>

      <LegalSection title="4. Cookies e Tecnologias de Rastreamento">
        <p>
          Utilizamos cookies e tecnologias similares para:
        </p>
        <ul>
          <li><strong>Cookies essenciais:</strong> Necessários para o funcionamento da plataforma</li>
          <li><strong>Cookies de preferências:</strong> Lembrar suas configurações</li>
          <li><strong>Cookies de analytics:</strong> Entender como você usa a plataforma</li>
          <li><strong>Cookies de marketing:</strong> Personalizar anúncios (com consentimento)</li>
        </ul>
        <p>
          Você pode gerenciar suas preferências de cookies através do banner de consentimento ou nas configurações do seu navegador.
        </p>
      </LegalSection>

      <LegalSection title="5. Segurança dos Dados">
        <p>
          Implementamos medidas de segurança robustas para proteger seus dados:
        </p>
        <ul>
          <li>Criptografia SSL/TLS em todas as comunicações</li>
          <li>Criptografia de dados sensíveis em repouso</li>
          <li>Acesso restrito baseado em função (RBAC)</li>
          <li>Autenticação de dois fatores disponível</li>
          <li>Monitoramento contínuo de segurança</li>
          <li>Testes regulares de vulnerabilidade</li>
          <li>Backups automáticos e criptografados</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Retenção de Dados">
        <p>
          Mantemos seus dados pelo tempo necessário para:
        </p>
        <ul>
          <li><strong>Dados de conta:</strong> Enquanto sua conta estiver ativa</li>
          <li><strong>Dados de pagamento:</strong> Conforme exigências fiscais (5 anos)</li>
          <li><strong>Dados de leads:</strong> Enquanto você utilizar o serviço</li>
          <li><strong>Logs de acesso:</strong> Por 6 meses para segurança</li>
        </ul>
        <p>
          Após o encerramento da conta, mantemos dados por até 30 dias para possível reativação, após o que são permanentemente excluídos.
        </p>
      </LegalSection>

      <LegalSection title="7. Seus Direitos">
        <p>
          Você tem direito a:
        </p>
        <ul>
          <li><strong>Acessar:</strong> Solicitar uma cópia dos seus dados</li>
          <li><strong>Corrigir:</strong> Atualizar informações incorretas</li>
          <li><strong>Excluir:</strong> Solicitar a exclusão dos seus dados</li>
          <li><strong>Portabilidade:</strong> Exportar seus dados em formato estruturado</li>
          <li><strong>Oposição:</strong> Opor-se a determinados tratamentos</li>
          <li><strong>Revogar:</strong> Retirar seu consentimento a qualquer momento</li>
        </ul>
        <p>
          Para exercer esses direitos, acesse as configurações da sua conta ou entre em contato conosco.
        </p>
      </LegalSection>

      <LegalSection title="8. Privacidade de Menores">
        <p>
          Nossa plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se tomarmos conhecimento de que coletamos dados de um menor, excluiremos essas informações imediatamente.
        </p>
      </LegalSection>

      <LegalSection title="9. Transferências Internacionais">
        <p>
          Alguns de nossos servidores e prestadores de serviços estão localizados fora do Brasil. Quando transferimos dados internacionalmente, garantimos que:
        </p>
        <ul>
          <li>O país de destino oferece proteção adequada</li>
          <li>Utilizamos cláusulas contratuais padrão aprovadas</li>
          <li>Os prestadores estão em conformidade com a LGPD</li>
        </ul>
      </LegalSection>

      <LegalSection title="10. Alterações nesta Política">
        <p>
          Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos alterações significativas:
        </p>
        <ul>
          <li>Publicaremos a nova versão nesta página</li>
          <li>Atualizaremos a data de &quot;Última atualização&quot;</li>
          <li>Enviaremos notificação por e-mail para alterações importantes</li>
          <li>Solicitaremos novo consentimento quando necessário</li>
        </ul>
      </LegalSection>

      <LegalSection title="11. Contato">
        <p>
          Para dúvidas sobre esta política ou sobre o tratamento dos seus dados:
        </p>
        <LegalHighlight variant="success">
          <ul className="list-none p-0 m-0 space-y-2">
            <li><strong>E-mail:</strong> privacidade@paginalocal.com.br</li>
            <li><strong>Encarregado (DPO):</strong> dpo@paginalocal.com.br</li>
            <li><strong>Suporte:</strong> contato@paginalocal.com.br</li>
          </ul>
        </LegalHighlight>
      </LegalSection>
    </LegalPageLayout>
  )
}
