// lib/local-seo/sections/products.copy.ts
import type { ModeCopy, StoreMode } from "../types"

/**
 * ProductsSection:
 * SEO + emocional (conexão, autoridade, retenção) + semântica.
 *
 * Regra: mínimo 5 variações por key, em DEFAULT e em TODOS os MODES.
 * ctx.servicesCount aqui = quantidade exibida (displayProducts.length).
 */
export const PRODUCTS_DEFAULT: ModeCopy = {
    // ===============================
    // products.kicker (5)
    // ===============================
    "products.kicker": [
        ({ city }) => [{ t: "text", v: city ? `Catálogo em ${city}` : "Catálogo" }],
        ({ city }) => [{ t: "text", v: city ? `Produtos disponíveis em ${city}` : "Produtos disponíveis" }],
        ({ city }) => [{ t: "text", v: city ? `Seleção de produtos em ${city}` : "Seleção de produtos" }],
        ({ city }) => [{ t: "text", v: city ? `Opções para você escolher em ${city}` : "Opções para você escolher" }],
        ({ city }) => [{ t: "text", v: city ? `Produtos em destaque em ${city}` : "Produtos em destaque" }],
    ],

    // ===============================
    // products.heading (5)
    // ===============================
    "products.heading": [
        ({ category, city }) => [
            { t: "normal", v: "Produtos de " },
            { t: "text", v: category.toLowerCase() },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
        ],
        ({ name, city }) => [
            { t: "normal", v: "Conheça o catálogo da " },
            { t: "strong", v: name },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
        ],
        ({ category, city, state }) => [
            { t: "normal", v: "Catálogo de " },
            { t: "text", v: category.toLowerCase() },
            { t: "normal", v: " — " },
            { t: "primary", v: city },
            ...(state ? [{ t: "normal" as const, v: `, ${state}` }] : []),
        ],
        ({ name, category, city }) => [
            { t: "normal", v: "Produtos selecionados — " },
            { t: "strong", v: name },
            { t: "normal", v: " (" },
            { t: "text", v: category.toLowerCase() },
            { t: "normal", v: ") em " },
            { t: "primary", v: city },
        ],
        ({ city }) => [
            { t: "normal", v: "Opções prontas para você em " },
            { t: "primary", v: city },
        ],
    ],

    // ===============================
    // products.intro (5)
    // ctx.servicesCount = displayProducts.length
    // ===============================
    "products.intro": [
        ({ name, category, city, servicesCount }) => [
            { t: "text", v: "Escolher fica mais fácil quando está tudo organizado. " },
            { t: "strong", v: name },
            { t: "text", v: ` em ${city} reúne ${category.toLowerCase()} com informações claras` },
            ...(servicesCount ? [{ t: "text" as const, v: ` — veja ${servicesCount} opções abaixo.` }] : [{ t: "text" as const, v: "." }]),
        ],
        ({ city, servicesCount }) => [
            { t: "text", v: `Em ${city}, você pode comparar e escolher com calma. ` },
            ...(servicesCount ? [{ t: "text" as const, v: `Mostramos ${servicesCount} itens em destaque.` }] : [{ t: "text" as const, v: "Veja os itens em destaque." }]),
        ],
        ({ name, servicesCount }) => [
            { t: "text", v: "Nada de catálogo confuso. " },
            { t: "strong", v: name },
            { t: "text", v: " deixa as opções objetivas para você decidir com confiança." },
            ...(servicesCount ? [{ t: "text" as const, v: ` (${servicesCount} itens)` }] : []),
        ],
        ({ category, city }) => [
            { t: "text", v: `Produtos de ${category.toLowerCase()} em ${city} com descrição clara e foco no custo-benefício. ` },
            { t: "text", v: "Se quiser, a equipe orienta pelo WhatsApp." },
        ],
        ({ name, city }) => [
            { t: "text", v: "Quer acertar na escolha? " },
            { t: "strong", v: name },
            { t: "text", v: ` em ${city} ajuda com orientação e resposta rápida no WhatsApp.` },
        ],
    ],

    // ===============================
    // products.catalogCta (5)
    // ===============================
    "products.catalogCta": [
        () => [{ t: "text", v: "Ver catálogo completo" }],
        () => [{ t: "text", v: "Abrir catálogo" }],
        () => [{ t: "text", v: "Ver todos os produtos" }],
        () => [{ t: "text", v: "Explorar catálogo" }],
        () => [{ t: "text", v: "Conferir mais opções" }],
    ],
}

/**
 * TODOS os MODES com TODAS as keys e 5 variações por key.
 */
export const PRODUCTS_BY_MODE: Record<StoreMode, ModeCopy> = {
    LOCAL_BUSINESS: PRODUCTS_DEFAULT,

    PRODUCT_CATALOG: {
        "products.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Catálogo de produtos em ${city}` : "Catálogo de produtos" }],
            ({ city }) => [{ t: "text", v: city ? `Vitrine em ${city}` : "Vitrine" }],
            ({ city }) => [{ t: "text", v: city ? `Produtos prontos para retirada/entrega em ${city}` : "Produtos para retirada/entrega" }],
            ({ city }) => [{ t: "text", v: city ? `Escolhas rápidas em ${city}` : "Escolhas rápidas" }],
            ({ city }) => [{ t: "text", v: city ? `Opções disponíveis em ${city}` : "Opções disponíveis" }],
        ],
        "products.heading": [
            ({ category, city }) => [
                { t: "normal", v: "Catálogo de " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Vitrine da " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ category, city }) => [
                { t: "normal", v: "Escolha " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
                { t: "normal", v: " com mais confiança" },
            ],
            ({ name, category, city }) => [
                { t: "normal", v: "Produtos e opções — " },
                { t: "strong", v: name },
                { t: "normal", v: " (" },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: ") em " },
                { t: "primary", v: city },
            ],
            ({ city }) => [
                { t: "normal", v: "Opções prontas para você em " },
                { t: "primary", v: city },
            ],
        ],
        "products.intro": [
            ({ name, city, servicesCount }) => [
                { t: "text", v: "Veja opções reais e escolha sem pressa. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} organiza o catálogo para você comparar com tranquilidade.` },
                ...(servicesCount ? [{ t: "text" as const, v: ` Mostrando ${servicesCount} destaques.` }] : []),
            ],
            ({ city }) => [
                { t: "text", v: `Em ${city}, você encontra catálogo atualizado e atendimento rápido para tirar dúvidas.` },
            ],
            ({ category, servicesCount }) => [
                { t: "text", v: `Opções de ${category.toLowerCase()} com descrição clara e foco no que importa.` },
                ...(servicesCount ? [{ t: "text" as const, v: ` (${servicesCount} destaques)` }] : []),
            ],
            ({ name }) => [
                { t: "text", v: "Se bater dúvida, a equipe orienta. " },
                { t: "strong", v: name },
                { t: "text", v: " ajuda você a escolher com honestidade." },
            ],
            ({ city }) => [
                { t: "text", v: `Quer comprar sem erro em ${city}? Veja os destaques e chame no WhatsApp para confirmar.` },
            ],
        ],
        "products.catalogCta": [
            () => [{ t: "text", v: "Ver catálogo completo" }],
            () => [{ t: "text", v: "Ver todos os itens" }],
            () => [{ t: "text", v: "Explorar mais produtos" }],
            () => [{ t: "text", v: "Abrir vitrine completa" }],
            () => [{ t: "text", v: "Conferir catálogo" }],
        ],
    },

    SERVICE_PRICING: {
        "products.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Opções e preços em ${city}` : "Opções e preços" }],
            ({ city }) => [{ t: "text", v: city ? `Catálogo com valores em ${city}` : "Catálogo com valores" }],
            ({ city }) => [{ t: "text", v: city ? `Comparar custo-benefício em ${city}` : "Comparar custo-benefício" }],
            ({ city }) => [{ t: "text", v: city ? `Produtos com transparência em ${city}` : "Produtos com transparência" }],
            ({ city }) => [{ t: "text", v: city ? `Escolha consciente em ${city}` : "Escolha consciente" }],
        ],
        "products.heading": [
            ({ category, city }) => [
                { t: "normal", v: "Produtos de " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
                { t: "normal", v: " — compare preços" },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Catálogo com valores — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ category, city }) => [
                { t: "normal", v: "Escolha com custo-benefício em " },
                { t: "primary", v: city },
                { t: "normal", v: " — " },
                { t: "text", v: category.toLowerCase() },
            ],
            ({ city }) => [
                { t: "normal", v: "Veja opções e valores em " },
                { t: "primary", v: city },
            ],
            ({ name }) => [
                { t: "normal", v: "Transparência no catálogo — " },
                { t: "strong", v: name },
            ],
        ],
        "products.intro": [
            ({ servicesCount }) => [
                { t: "text", v: "Compare opções e entenda valores quando informados. " },
                ...(servicesCount ? [{ t: "text" as const, v: `Mostrando ${servicesCount} destaques.` }] : []),
            ],
            ({ name, city }) => [
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} mantém o catálogo claro para você decidir com mais segurança.` },
            ],
            ({ category, city }) => [
                { t: "text", v: `Produtos de ${category.toLowerCase()} em ${city} com foco em custo-benefício e orientação rápida.` },
            ],
            ({ city }) => [
                { t: "text", v: `Se você quer acertar na compra em ${city}, veja os destaques e tire dúvidas no WhatsApp.` },
            ],
            ({ name }) => [
                { t: "text", v: "Decisão boa começa com informação clara. " },
                { t: "strong", v: name },
                { t: "text", v: " organiza as opções para você comparar sem ansiedade." },
            ],
        ],
        "products.catalogCta": [
            () => [{ t: "text", v: "Ver catálogo completo" }],
            () => [{ t: "text", v: "Ver todos os produtos" }],
            () => [{ t: "text", v: "Comparar mais opções" }],
            () => [{ t: "text", v: "Abrir catálogo" }],
            () => [{ t: "text", v: "Conferir catálogo completo" }],
        ],
    },

    HYBRID: {
        "products.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Catálogo + suporte em ${city}` : "Catálogo + suporte" }],
            ({ city }) => [{ t: "text", v: city ? `Produtos e atendimento em ${city}` : "Produtos e atendimento" }],
            ({ city }) => [{ t: "text", v: city ? `Opções para resolver em ${city}` : "Opções para resolver" }],
            ({ city }) => [{ t: "text", v: city ? `Escolhas rápidas com ajuda em ${city}` : "Escolhas rápidas com ajuda" }],
            ({ city }) => [{ t: "text", v: city ? `Vitrine e orientação em ${city}` : "Vitrine e orientação" }],
        ],
        "products.heading": [
            ({ name, category, city }) => [
                { t: "normal", v: "Produtos e suporte — " },
                { t: "strong", v: name },
                { t: "normal", v: " (" },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: ") em " },
                { t: "primary", v: city },
            ],
            ({ category, city }) => [
                { t: "normal", v: "Escolha " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
                { t: "normal", v: " com orientação" },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Catálogo com atendimento — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ city }) => [
                { t: "normal", v: "Opções prontas para você em " },
                { t: "primary", v: city },
            ],
            ({ name }) => [
                { t: "normal", v: "Produtos selecionados — " },
                { t: "strong", v: name },
            ],
        ],
        "products.intro": [
            ({ name, city, servicesCount }) => [
                { t: "text", v: "Aqui você encontra opções e também apoio para escolher. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} combina catálogo e atendimento para você decidir com confiança.` },
                ...(servicesCount ? [{ t: "text" as const, v: ` Mostrando ${servicesCount} destaques.` }] : []),
            ],
            ({ category, city }) => [
                { t: "text", v: `Produtos de ${category.toLowerCase()} em ${city} com descrição clara. ` },
                { t: "text", v: "Se precisar, a equipe orienta no WhatsApp." },
            ],
            ({ name }) => [
                { t: "text", v: "Menos dúvida, mais acerto. " },
                { t: "strong", v: name },
                { t: "text", v: " organiza o catálogo e ajuda você a escolher." },
            ],
            ({ city }) => [
                { t: "text", v: `Quer resolver em ${city} sem complicação? Veja os destaques e chame no WhatsApp.` },
            ],
            ({ servicesCount }) => [
                ...(servicesCount ? [{ t: "text" as const, v: `Veja ${servicesCount} produtos em destaque e explore o catálogo completo se quiser.` }] : [{ t: "text" as const, v: "Veja produtos em destaque e explore o catálogo completo se quiser." }]),
            ],
        ],
        "products.catalogCta": [
            () => [{ t: "text", v: "Ver catálogo completo" }],
            () => [{ t: "text", v: "Explorar catálogo" }],
            () => [{ t: "text", v: "Ver mais opções" }],
            () => [{ t: "text", v: "Abrir todos os produtos" }],
            () => [{ t: "text", v: "Conferir catálogo" }],
        ],
    },
}
