// lib/local-seo/sections/plans.copy.ts
import type { ModeCopy, StoreMode } from "../types"

/**
 * PricingPlansSection:
 * SEO + emocional (conexão, autoridade, retenção) + semântica.
 *
 * ctx.servicesCount aqui = quantidade de planos (plans.length)
 */
export const PLANS_DEFAULT: ModeCopy = {
    // ===============================
    // plans.kicker (5)
    // ===============================
    "plans.kicker": [
        ({ city }) => [{ t: "text", v: city ? `Planos e preços em ${city}` : "Planos e preços" }],
        ({ city }) => [{ t: "text", v: city ? `Valores e opções em ${city}` : "Valores e opções" }],
        ({ city }) => [{ t: "text", v: city ? `Escolha seu plano em ${city}` : "Escolha seu plano" }],
        ({ city }) => [{ t: "text", v: city ? `Opções de contratação em ${city}` : "Opções de contratação" }],
        ({ city }) => [{ t: "text", v: city ? `Preços transparentes em ${city}` : "Preços transparentes" }],
    ],

    // ===============================
    // plans.heading (5)
    // ===============================
    "plans.heading": [
        ({ category, name, city }) => [
            { t: "normal", v: "Planos de " },
            { t: "text", v: category.toLowerCase() },
            { t: "normal", v: " — " },
            { t: "strong", v: name },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
        ],
        ({ name, city }) => [
            { t: "normal", v: "Planos da " },
            { t: "strong", v: name },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
        ],
        ({ category, city }) => [
            { t: "normal", v: "Escolha o melhor " },
            { t: "text", v: category.toLowerCase() },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
            { t: "normal", v: " para o seu momento" },
        ],
        ({ name }) => [
            { t: "normal", v: "Planos pensados para você — " },
            { t: "strong", v: name },
        ],
        ({ city }) => [
            { t: "normal", v: "Opções claras para você em " },
            { t: "primary", v: city },
        ],
    ],

    // ===============================
    // plans.intro (5)
    // ctx.servicesCount = plans.length
    // ===============================
    "plans.intro": [
        ({ name, category, city, servicesCount }) => [
            { t: "text", v: "Aqui você entende o que está levando e escolhe com segurança. " },
            { t: "strong", v: name },
            { t: "text", v: ` em ${city} organiza planos de ${category.toLowerCase()} com clareza e compromisso.` },
            ...(servicesCount ? [{ t: "text" as const, v: ` (${servicesCount} opções)` }] : []),
        ],
        ({ city }) => [
            { t: "text", v: `Em ${city}, você pode comparar as opções e seguir com a que faz mais sentido para o seu caso.` },
        ],
        ({ category, servicesCount }) => [
            { t: "text", v: `Planos de ${category.toLowerCase()} com detalhes diretos e sem pegadinha.` },
            ...(servicesCount ? [{ t: "text" as const, v: ` Veja ${servicesCount} opções abaixo.` }] : []),
        ],
        ({ name }) => [
            { t: "text", v: "Se bater dúvida, você não fica sozinho. " },
            { t: "strong", v: name },
            { t: "text", v: " responde e orienta no WhatsApp antes de você decidir." },
        ],
        ({ city }) => [
            { t: "text", v: `Quer decidir com calma? Compare os planos e chame no WhatsApp se precisar — em ${city}.` },
        ],
    ],

    // ===============================
    // plans.badgePopular (5)
    // ===============================
    "plans.badgePopular": [
        () => [{ t: "text", v: "Mais popular" }],
        () => [{ t: "text", v: "Escolha da maioria" }],
        () => [{ t: "text", v: "Recomendado" }],
        () => [{ t: "text", v: "Mais escolhido" }],
        () => [{ t: "text", v: "Melhor custo-benefício" }],
    ],

    // ===============================
    // plans.viewAllCta (5)
    // ===============================
    "plans.viewAllCta": [
        () => [{ t: "text", v: "Ver todos os planos" }],
        () => [{ t: "text", v: "Comparar todos os planos" }],
        () => [{ t: "text", v: "Ver opções completas" }],
        () => [{ t: "text", v: "Explorar planos" }],
        () => [{ t: "text", v: "Conferir todos os planos" }],
    ],
}

export const PLANS_BY_MODE: Record<StoreMode, ModeCopy> = {
    LOCAL_BUSINESS: PLANS_DEFAULT,

    PRODUCT_CATALOG: {
        "plans.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Condições e planos em ${city}` : "Condições e planos" }],
            ({ city }) => [{ t: "text", v: city ? `Planos para comprar com confiança em ${city}` : "Planos para comprar com confiança" }],
            ({ city }) => [{ t: "text", v: city ? `Opções de pedido em ${city}` : "Opções de pedido" }],
            ({ city }) => [{ t: "text", v: city ? `Planos de entrega/retirada em ${city}` : "Planos de entrega/retirada" }],
            ({ city }) => [{ t: "text", v: city ? `Escolha o melhor plano em ${city}` : "Escolha o melhor plano" }],
        ],
        "plans.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Planos do catálogo — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ category, city }) => [
                { t: "normal", v: "Planos para " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ name }) => [{ t: "normal", v: "Condições e planos — " }, { t: "strong", v: name }],
            ({ city }) => [{ t: "normal", v: "Opções para pedir com segurança em " }, { t: "primary", v: city }],
            ({ name, city }) => [
                { t: "normal", v: "Planos para você escolher — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
        ],
        "plans.intro": [
            ({ city, servicesCount }) => [
                { t: "text", v: `Em ${city}, compare as opções e escolha a melhor forma de comprar.` },
                ...(servicesCount ? [{ t: "text" as const, v: ` (${servicesCount} opções)` }] : []),
            ],
            ({ name }) => [
                { t: "text", v: "Planos claros para você decidir sem dúvida. " },
                { t: "strong", v: name },
                { t: "text", v: " ajuda no WhatsApp se precisar." },
            ],
            ({ category }) => [
                { t: "text", v: `Opções para ${category.toLowerCase()} com detalhes diretos e orientação rápida.` },
            ],
            ({ city }) => [
                { t: "text", v: `Se quiser confirmar condição/forma de pedido em ${city}, chame no WhatsApp.` },
            ],
            ({ name, city }) => [
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} organiza planos para você escolher com confiança e praticidade.` },
            ],
        ],
        "plans.badgePopular": [
            () => [{ t: "text", v: "Mais popular" }],
            () => [{ t: "text", v: "Mais escolhido" }],
            () => [{ t: "text", v: "Recomendado" }],
            () => [{ t: "text", v: "Preferido" }],
            () => [{ t: "text", v: "Melhor custo-benefício" }],
        ],
        "plans.viewAllCta": [
            () => [{ t: "text", v: "Ver todos os planos" }],
            () => [{ t: "text", v: "Ver condições completas" }],
            () => [{ t: "text", v: "Comparar opções" }],
            () => [{ t: "text", v: "Explorar planos" }],
            () => [{ t: "text", v: "Conferir planos" }],
        ],
    },

    SERVICE_PRICING: {
        "plans.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Orçamento e planos em ${city}` : "Orçamento e planos" }],
            ({ city }) => [{ t: "text", v: city ? `Valores transparentes em ${city}` : "Valores transparentes" }],
            ({ city }) => [{ t: "text", v: city ? `Planos com custo-benefício em ${city}` : "Planos com custo-benefício" }],
            ({ city }) => [{ t: "text", v: city ? `Opções e preços em ${city}` : "Opções e preços" }],
            ({ city }) => [{ t: "text", v: city ? `Decida com clareza em ${city}` : "Decida com clareza" }],
        ],
        "plans.heading": [
            ({ category, city }) => [
                { t: "normal", v: "Planos e valores de " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Planos com transparência — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ city }) => [{ t: "normal", v: "Compare planos e valores em " }, { t: "primary", v: city }],
            ({ name }) => [{ t: "normal", v: "Opções de contratação — " }, { t: "strong", v: name }],
            ({ category, city }) => [
                { t: "normal", v: "Escolha o melhor custo-benefício em " },
                { t: "primary", v: city },
                { t: "normal", v: " — " },
                { t: "text", v: category.toLowerCase() },
            ],
        ],
        "plans.intro": [
            ({ servicesCount }) => [
                { t: "text", v: "Planos com detalhes claros: você entende e decide com segurança." },
                ...(servicesCount ? [{ t: "text" as const, v: ` (${servicesCount} opções)` }] : []),
            ],
            ({ name }) => [
                { t: "text", v: "Transparência conta. " },
                { t: "strong", v: name },
                { t: "text", v: " explica e orienta antes de você fechar." },
            ],
            ({ city }) => [
                { t: "text", v: `Em ${city}, compare as opções e chame no WhatsApp se quiser confirmar o melhor plano.` },
            ],
            ({ category }) => [
                { t: "text", v: `Planos de ${category.toLowerCase()} pensados para diferentes necessidades — sem enrolação.` },
            ],
            ({ name, city }) => [
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} mantém preços e condições apresentados de forma direta.` },
            ],
        ],
        "plans.badgePopular": [
            () => [{ t: "text", v: "Mais popular" }],
            () => [{ t: "text", v: "Recomendado" }],
            () => [{ t: "text", v: "Mais escolhido" }],
            () => [{ t: "text", v: "Melhor custo-benefício" }],
            () => [{ t: "text", v: "Preferido dos clientes" }],
        ],
        "plans.viewAllCta": [
            () => [{ t: "text", v: "Ver todos os planos" }],
            () => [{ t: "text", v: "Comparar todos os planos" }],
            () => [{ t: "text", v: "Ver detalhes completos" }],
            () => [{ t: "text", v: "Explorar opções" }],
            () => [{ t: "text", v: "Conferir planos" }],
        ],
    },

    HYBRID: {
        "plans.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Planos: catálogo + atendimento em ${city}` : "Planos: catálogo + atendimento" }],
            ({ city }) => [{ t: "text", v: city ? `Opções completas em ${city}` : "Opções completas" }],
            ({ city }) => [{ t: "text", v: city ? `Escolha com ajuda em ${city}` : "Escolha com ajuda" }],
            ({ city }) => [{ t: "text", v: city ? `Planos e condições em ${city}` : "Planos e condições" }],
            ({ city }) => [{ t: "text", v: city ? `Decida com confiança em ${city}` : "Decida com confiança" }],
        ],
        "plans.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Planos e opções — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ category, city }) => [
                { t: "normal", v: "Escolha " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
                { t: "normal", v: " com suporte" },
            ],
            ({ name }) => [{ t: "normal", v: "Planos pensados para você — " }, { t: "strong", v: name }],
            ({ city }) => [{ t: "normal", v: "Opções claras para você em " }, { t: "primary", v: city }],
            ({ name, category, city }) => [
                { t: "normal", v: "Planos de " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
        ],
        "plans.intro": [
            ({ name, city, servicesCount }) => [
                { t: "text", v: "Aqui você vê opções e conta com ajuda para escolher. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} combina catálogo e atendimento para facilitar sua decisão.` },
                ...(servicesCount ? [{ t: "text" as const, v: ` (${servicesCount} opções)` }] : []),
            ],
            ({ city }) => [
                { t: "text", v: `Em ${city}, compare planos e chame no WhatsApp se quiser confirmar o melhor caminho.` },
            ],
            ({ name }) => [
                { t: "text", v: "Menos dúvida, mais acerto. " },
                { t: "strong", v: name },
                { t: "text", v: " responde e orienta com clareza." },
            ],
            ({ category }) => [
                { t: "text", v: `Planos de ${category.toLowerCase()} com detalhes objetivos para você escolher sem ansiedade.` },
            ],
            ({ servicesCount }) => [
                ...(servicesCount ? [{ t: "text" as const, v: `Veja ${servicesCount} opções abaixo e escolha a que combina com você.` }] : [{ t: "text" as const, v: "Veja as opções abaixo e escolha a que combina com você." }]),
            ],
        ],
        "plans.badgePopular": [
            () => [{ t: "text", v: "Mais popular" }],
            () => [{ t: "text", v: "Mais escolhido" }],
            () => [{ t: "text", v: "Recomendado" }],
            () => [{ t: "text", v: "Preferido" }],
            () => [{ t: "text", v: "Melhor custo-benefício" }],
        ],
        "plans.viewAllCta": [
            () => [{ t: "text", v: "Ver todos os planos" }],
            () => [{ t: "text", v: "Explorar planos" }],
            () => [{ t: "text", v: "Comparar opções" }],
            () => [{ t: "text", v: "Ver opções completas" }],
            () => [{ t: "text", v: "Conferir planos" }],
        ],
    },
}
