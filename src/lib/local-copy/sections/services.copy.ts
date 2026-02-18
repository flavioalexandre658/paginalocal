// lib/local-seo/sections/services.copy.ts
import type { ModeCopy, StoreMode } from "../types"

/**
 * ServicesSection:
 * SEO + emocional (conexão, autoridade, retenção) + semântica.
 *
 * Regra: mínimo 5 variações por key, em DEFAULT e em TODOS os MODES.
 */
export const SERVICES_DEFAULT: ModeCopy = {
    // ===============================
    // services.kicker (5)
    // ===============================
    "services.kicker": [
        ({ city }) => [{ t: "text", v: `Serviços em ${city}` }],
        ({ city }) => [{ t: "text", v: `Atendimento profissional em ${city}` }],
        ({ city }) => [{ t: "text", v: `Soluções e serviços em ${city}` }],
        ({ city }) => [{ t: "text", v: `O que fazemos em ${city}` }],
        ({ city }) => [{ t: "text", v: `Serviços disponíveis em ${city}` }],
    ],

    // ===============================
    // services.heading (5)
    // ===============================
    "services.heading": [
        ({ category, city }) => [
            { t: "normal", v: "Serviços de " },
            { t: "text", v: category.toLowerCase() },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
        ],
        ({ name, category, city }) => [
            { t: "normal", v: "Serviços de " },
            { t: "text", v: category.toLowerCase() },
            { t: "normal", v: " — " },
            { t: "strong", v: name },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
        ],
        ({ category, city, state }) => [
            { t: "normal", v: category },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
            ...(state ? [{ t: "normal" as const, v: `, ${state}` }] : []),
            { t: "normal", v: " — veja opções" },
        ],
        ({ name, city }) => [
            { t: "normal", v: "O que a " },
            { t: "strong", v: name },
            { t: "normal", v: " faz em " },
            { t: "primary", v: city },
        ],
        ({ category, city }) => [
            { t: "normal", v: "Atendimento em " },
            { t: "primary", v: city },
            { t: "normal", v: " para " },
            { t: "text", v: category.toLowerCase() },
        ],
    ],

    // ===============================
    // services.intro (5)
    // ===============================
    "services.intro": [
        ({ name, category, city, state, servicesCount }) => [
            { t: "text", v: "Aqui você encontra opções claras e atendimento de verdade. " },
            { t: "strong", v: name },
            { t: "text", v: ` atua com ${category.toLowerCase()} em ${city}` },
            ...(state ? [{ t: "text" as const, v: `, ${state}` }] : []),
            { t: "text", v: " com cuidado, transparência e foco em resolver." },
            ...(servicesCount ? [{ t: "text" as const, v: ` Veja ${servicesCount} serviços disponíveis abaixo.` }] : []),
        ],
        ({ category, city, servicesCount }) => [
            { t: "text", v: `Precisa de ${category.toLowerCase()} em ${city}? ` },
            { t: "text", v: "Escolha o serviço ideal e veja detalhes de forma simples." },
            ...(servicesCount ? [{ t: "text" as const, v: ` São ${servicesCount} opções para você comparar.` }] : []),
        ],
        ({ name, city }) => [
            { t: "text", v: "Menos enrolação, mais clareza. " },
            { t: "strong", v: name },
            { t: "text", v: ` em ${city} organiza os serviços para você entender e decidir com segurança.` },
        ],
        ({ city, category }) => [
            { t: "text", v: `Atendimento local em ${city} com padrão e compromisso. ` },
            { t: "text", v: category ? `Veja serviços de ${category.toLowerCase()} e escolha o que resolve seu caso.` : "Veja os serviços e escolha o que resolve seu caso." },
        ],
        ({ name, category, city }) => [
            { t: "text", v: "Cada caso pede uma solução certa. " },
            { t: "strong", v: name },
            { t: "text", v: ` oferece ${category.toLowerCase()} em ${city} com orientação clara e atendimento cuidadoso.` },
        ],
    ],

    // ===============================
    // services.cardCta (5) — opcional
    // ===============================
    "services.cardCta": [
        ({ }) => [{ t: "text", v: "Ver detalhes" }],
        ({ }) => [{ t: "text", v: "Saiba mais" }],
        ({ }) => [{ t: "text", v: "Ver como funciona" }],
        ({ }) => [{ t: "text", v: "Entender o serviço" }],
        ({ }) => [{ t: "text", v: "Abrir informações" }],
    ],
}

/**
 * TODOS os MODES com TODAS as keys e 5 variações por key.
 */
export const SERVICES_BY_MODE: Record<StoreMode, ModeCopy> = {
    LOCAL_BUSINESS: SERVICES_DEFAULT,

    PRODUCT_CATALOG: {
        "services.kicker": [
            ({ city }) => [{ t: "text", v: `Serviços e catálogo em ${city}` }],
            ({ city }) => [{ t: "text", v: `Soluções e itens disponíveis em ${city}` }],
            ({ city }) => [{ t: "text", v: `Serviços + opções do catálogo em ${city}` }],
            ({ city }) => [{ t: "text", v: `O que você encontra em ${city}` }],
            ({ city }) => [{ t: "text", v: `Atendimento e opções em ${city}` }],
        ],
        "services.heading": [
            ({ category, city }) => [
                { t: "normal", v: "Serviços e opções de " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Serviços e catálogo — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ category, city }) => [
                { t: "normal", v: "Escolha o que precisa em " },
                { t: "primary", v: city },
                { t: "normal", v: " — " },
                { t: "text", v: category.toLowerCase() },
            ],
            ({ name, category, city }) => [
                { t: "normal", v: "Atendimento e opções de " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ city }) => [
                { t: "normal", v: "O que está disponível em " },
                { t: "primary", v: city },
            ],
        ],
        "services.intro": [
            ({ name, category, city, servicesCount }) => [
                { t: "text", v: "Aqui você resolve de forma prática: atendimento e opções no mesmo lugar. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} organiza ${category.toLowerCase()} com clareza.` },
                ...(servicesCount ? [{ t: "text" as const, v: ` Veja ${servicesCount} opções/serviços abaixo.` }] : []),
            ],
            ({ city, category }) => [
                { t: "text", v: `Em ${city}, você encontra ${category.toLowerCase()} com orientação rápida. ` },
                { t: "text", v: "Veja detalhes e combine com a equipe o melhor caminho." },
            ],
            ({ name }) => [
                { t: "text", v: "Menos dúvida na escolha. " },
                { t: "strong", v: name },
                { t: "text", v: " deixa as opções organizadas para você decidir com confiança." },
            ],
            ({ category, city }) => [
                { t: "text", v: `Serviços e opções de ${category.toLowerCase()} em ${city}. ` },
                { t: "text", v: "Clique para ver detalhes e confirmar disponibilidade." },
            ],
            ({ name, city }) => [
                { t: "text", v: "Tudo mais simples quando está bem explicado. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} mostra opções e como funciona para você escolher sem pressa.` },
            ],
        ],
        "services.cardCta": [
            () => [{ t: "text", v: "Ver detalhes" }],
            () => [{ t: "text", v: "Ver opções" }],
            () => [{ t: "text", v: "Conferir informações" }],
            () => [{ t: "text", v: "Ver disponibilidade" }],
            () => [{ t: "text", v: "Abrir detalhes" }],
        ],
    },

    SERVICE_PRICING: {
        "services.kicker": [
            ({ city }) => [{ t: "text", v: `Serviços e preços em ${city}` }],
            ({ city }) => [{ t: "text", v: `Orçamento e opções em ${city}` }],
            ({ city }) => [{ t: "text", v: `Valores e detalhes em ${city}` }],
            ({ city }) => [{ t: "text", v: `Entenda custos e prazos em ${city}` }],
            ({ city }) => [{ t: "text", v: `Transparência de preços em ${city}` }],
        ],
        "services.heading": [
            ({ category, city }) => [
                { t: "normal", v: "Serviços e preços de " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Valores e detalhes — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ category, city }) => [
                { t: "normal", v: "Quanto custa em " },
                { t: "primary", v: city },
                { t: "normal", v: "? Veja serviços de " },
                { t: "text", v: category.toLowerCase() },
            ],
            ({ name, category, city }) => [
                { t: "normal", v: "Serviços de " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " com preços claros — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Orçamento com transparência — " },
                { t: "strong", v: name },
                { t: "normal", v: " (" },
                { t: "text", v: city },
                { t: "normal", v: ")" },
            ],
        ],
        "services.intro": [
            ({ name, city, category, servicesCount }) => [
                { t: "text", v: "Você merece clareza antes de decidir. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} apresenta serviços` },
                ...(category ? [{ t: "text" as const, v: ` de ${category.toLowerCase()}` }] : []),
                { t: "text", v: " com valores (quando disponíveis) e explicação objetiva." },
                ...(servicesCount ? [{ t: "text" as const, v: ` Veja ${servicesCount} opções abaixo.` }] : []),
            ],
            ({ category, city }) => [
                { t: "text", v: `Preços e serviços de ${category.toLowerCase()} em ${city}. ` },
                { t: "text", v: "Compare opções e chame no WhatsApp se precisar de um orçamento certinho." },
            ],
            ({ name }) => [
                { t: "text", v: "Transparência reduz ansiedade e economiza tempo. " },
                { t: "strong", v: name },
                { t: "text", v: " explica as opções para você escolher com segurança." },
            ],
            ({ city }) => [
                { t: "text", v: `Em ${city}, veja serviços com detalhes e valores quando informados. ` },
                { t: "text", v: "Se o seu caso for diferente, a equipe orienta no WhatsApp." },
            ],
            ({ name, city }) => [
                { t: "text", v: "Decisão boa começa com informação clara. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} organiza os serviços para você comparar sem dúvida.` },
            ],
        ],
        "services.cardCta": [
            () => [{ t: "text", v: "Ver preço e detalhes" }],
            () => [{ t: "text", v: "Entender valores" }],
            () => [{ t: "text", v: "Ver detalhes" }],
            () => [{ t: "text", v: "Conferir condições" }],
            () => [{ t: "text", v: "Abrir informações" }],
        ],
    },

    HYBRID: {
        "services.kicker": [
            ({ city }) => [{ t: "text", v: `Serviços e opções em ${city}` }],
            ({ city }) => [{ t: "text", v: `Atendimento + catálogo em ${city}` }],
            ({ city }) => [{ t: "text", v: `Tudo para resolver em ${city}` }],
            ({ city }) => [{ t: "text", v: `Serviços, itens e suporte em ${city}` }],
            ({ city }) => [{ t: "text", v: `Opções completas em ${city}` }],
        ],
        "services.heading": [
            ({ name, category, city }) => [
                { t: "normal", v: "Serviços e opções de " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Atendimento e catálogo — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ category, city }) => [
                { t: "normal", v: "Resolva em " },
                { t: "primary", v: city },
                { t: "normal", v: " — " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " com suporte" },
            ],
            ({ name }) => [
                { t: "normal", v: "Tudo em um só lugar — " },
                { t: "strong", v: name },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Escolha com confiança — " },
                { t: "strong", v: name },
                { t: "normal", v: " (" },
                { t: "text", v: city },
                { t: "normal", v: ")" },
            ],
        ],
        "services.intro": [
            ({ name, category, city, servicesCount }) => [
                { t: "text", v: "Quando atendimento e opções andam juntos, tudo fica mais simples. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} reúne ${category.toLowerCase()} com suporte e alternativas.` },
                ...(servicesCount ? [{ t: "text" as const, v: ` Veja ${servicesCount} opções abaixo.` }] : []),
            ],
            ({ city, category }) => [
                { t: "text", v: `Em ${city}, encontre ${category.toLowerCase()} com atendimento e opções do catálogo. ` },
                { t: "text", v: "Clique em um serviço para ver detalhes e combinar o melhor caminho." },
            ],
            ({ name }) => [
                { t: "text", v: "Você resolve mais rápido quando tem orientação. " },
                { t: "strong", v: name },
                { t: "text", v: " organiza serviços e opções para você escolher com tranquilidade." },
            ],
            ({ name, city }) => [
                { t: "text", v: "Menos dúvida, mais decisão. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} deixa claro o que faz e quais opções existem.` },
            ],
            ({ category, city }) => [
                { t: "text", v: `Serviços e opções de ${category.toLowerCase()} em ${city}. ` },
                { t: "text", v: "Aqui você entende, compara e escolhe com segurança." },
            ],
        ],
        "services.cardCta": [
            () => [{ t: "text", v: "Ver detalhes" }],
            () => [{ t: "text", v: "Saiba mais" }],
            () => [{ t: "text", v: "Ver como funciona" }],
            () => [{ t: "text", v: "Entender opções" }],
            () => [{ t: "text", v: "Abrir informações" }],
        ],
    },
}
