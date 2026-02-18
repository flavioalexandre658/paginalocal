import type { ModeCopy, StoreMode } from "../types"

/**
 * Contact Page:
 * SEO + emocional + semântica (contato, orçamento, localização, atendimento, WhatsApp).
 * ctx.servicesCount aqui pode ser usado como “quantidade de serviços ativos”, se você quiser (opcional).
 */
export const CONTACT_PAGE_DEFAULT: ModeCopy = {
    // ===============================
    // contactPage.kicker (5)
    // ===============================
    "contactPage.kicker": [
        ({ city }) => [{ t: "text", v: city ? `Contato em ${city}` : "Contato" }],
        ({ city }) => [{ t: "text", v: city ? `Fale com a equipe em ${city}` : "Fale com a equipe" }],
        ({ city }) => [{ t: "text", v: city ? `WhatsApp, telefone e endereço — ${city}` : "WhatsApp, telefone e endereço" }],
        ({ city }) => [{ t: "text", v: city ? `Atendimento e localização em ${city}` : "Atendimento e localização" }],
        ({ city }) => [{ t: "text", v: city ? `Canais de atendimento em ${city}` : "Canais de atendimento" }],
    ],

    // ===============================
    // contactPage.heading (5)
    // ===============================
    "contactPage.heading": [
        ({ name, city }) => [
            { t: "normal", v: "Fale com " },
            { t: "strong", v: name },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
        ],
        ({ name }) => [
            { t: "normal", v: "Entre em contato com " },
            { t: "strong", v: name },
        ],
        ({ name, city, state }) => [
            { t: "normal", v: "Contato e localização — " },
            { t: "strong", v: name },
            { t: "normal", v: " em " },
            { t: "primary", v: `${city}, ${state}` },
        ],
        ({ name, city }) => [
            { t: "normal", v: "Precisa de ajuda? " },
            { t: "normal", v: "Chame " },
            { t: "strong", v: name },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
        ],
        ({ name }) => [
            { t: "normal", v: "Vamos resolver isso juntos — " },
            { t: "strong", v: name },
        ],
    ],

    // ===============================
    // contactPage.intro (5)
    // ===============================
    "contactPage.intro": [
        ({ category, city }) => [
            { t: "text", v: `Se você procura ${category.toLowerCase()} em ${city}, aqui é o caminho mais direto.` },
            { t: "text", v: " Chame no WhatsApp, ligue ou veja o endereço para chegar sem dor de cabeça." },
        ],
        ({ name }) => [
            { t: "strong", v: name },
            { t: "text", v: " atende com clareza: você explica o que precisa e a equipe orienta o melhor próximo passo." },
        ],
        ({ city }) => [
            { t: "text", v: `Atendimento em ${city} com resposta rápida e informação objetiva.` },
            { t: "text", v: " Se preferir, mande uma mensagem e a equipe te guia." },
        ],
        ({ category }) => [
            { t: "text", v: `Dúvidas sobre ${category.toLowerCase()}?` },
            { t: "text", v: " Fale com a equipe e entenda opções, prazos e o melhor jeito de resolver." },
        ],
        ({ name, city }) => [
            { t: "text", v: "Quer agilidade?" },
            { t: "text", v: " Chame no WhatsApp e fale direto com " },
            { t: "strong", v: name },
            { t: "text", v: ` em ${city}.` },
        ],
    ],

    // ===============================
    // contactPage.cardsLead (5)
    // ===============================
    "contactPage.cardsLead": [
        () => [{ t: "text", v: "Escolha o melhor canal e fale com a equipe agora." }],
        () => [{ t: "text", v: "Chame no WhatsApp, ligue ou veja como chegar." }],
        () => [{ t: "text", v: "Contato direto, sem burocracia: é só escolher abaixo." }],
        () => [{ t: "text", v: "Para atendimento mais rápido, use WhatsApp ou ligação." }],
        () => [{ t: "text", v: "Abaixo estão os canais oficiais para falar e chegar." }],
    ],

    // ===============================
    // contactPage.whatsTitle (5)
    // ===============================
    "contactPage.whatsTitle": [
        () => [{ t: "text", v: "WhatsApp" }],
        () => [{ t: "text", v: "Chamar no WhatsApp" }],
        () => [{ t: "text", v: "Atendimento via WhatsApp" }],
        () => [{ t: "text", v: "Mensagem no WhatsApp" }],
        () => [{ t: "text", v: "WhatsApp oficial" }],
    ],

    // ===============================
    // contactPage.phoneTitle (5)
    // ===============================
    "contactPage.phoneTitle": [
        () => [{ t: "text", v: "Telefone" }],
        () => [{ t: "text", v: "Ligar agora" }],
        () => [{ t: "text", v: "Contato por telefone" }],
        () => [{ t: "text", v: "Central de atendimento" }],
        () => [{ t: "text", v: "Chamada telefônica" }],
    ],

    // ===============================
    // contactPage.addressTitle (5)
    // ===============================
    "contactPage.addressTitle": [
        () => [{ t: "text", v: "Endereço" }],
        () => [{ t: "text", v: "Como chegar" }],
        () => [{ t: "text", v: "Localização" }],
        () => [{ t: "text", v: "Ver no mapa" }],
        () => [{ t: "text", v: "Nosso endereço" }],
    ],
}

/**
 * Todos os MODES precisam existir e ter >= 5 variações.
 * Aqui eu dou um “tom” diferente por modo, mas sem ficar exagerado.
 */
export const CONTACT_PAGE_BY_MODE: Record<StoreMode, ModeCopy> = {
    LOCAL_BUSINESS: CONTACT_PAGE_DEFAULT,

    PRODUCT_CATALOG: {
        "contactPage.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Pedido e atendimento em ${city}` : "Pedido e atendimento" }],
            ({ city }) => [{ t: "text", v: city ? `Fale sobre produtos em ${city}` : "Fale sobre produtos" }],
            ({ city }) => [{ t: "text", v: city ? `WhatsApp para pedidos — ${city}` : "WhatsApp para pedidos" }],
            ({ city }) => [{ t: "text", v: city ? `Contato do catálogo em ${city}` : "Contato do catálogo" }],
            ({ city }) => [{ t: "text", v: city ? `Tire dúvidas e peça em ${city}` : "Tire dúvidas e peça" }],
        ],
        "contactPage.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Peça pelo WhatsApp — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ name }) => [{ t: "normal", v: "Fale sobre produtos com " }, { t: "strong", v: name }],
            ({ city }) => [{ t: "normal", v: "Contato para pedidos em " }, { t: "primary", v: city }],
            ({ name, city }) => [
                { t: "normal", v: "Atendimento para compras — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ name }) => [{ t: "normal", v: "Dúvidas? Chame " }, { t: "strong", v: name }],
        ],
        "contactPage.intro": [
            ({ city }) => [{ t: "text", v: `Quer confirmar preço, disponibilidade ou retirada/entrega em ${city}? Chame no WhatsApp.` }],
            ({ name }) => [{ t: "strong", v: name }, { t: "text", v: " responde rápido e orienta o melhor jeito de pedir." }],
            ({ category }) => [{ t: "text", v: `Fale com a equipe e escolha ${category.toLowerCase()} com mais confiança.` }],
            ({ city }) => [{ t: "text", v: `Contato direto em ${city}: mande mensagem e a equipe te guia.` }],
            ({ name, city }) => [{ t: "text", v: "Pedido sem complicação: " }, { t: "strong", v: name }, { t: "text", v: ` em ${city}.` }],
        ],
        "contactPage.cardsLead": [
            () => [{ t: "text", v: "Para pedir mais rápido, use WhatsApp." }],
            () => [{ t: "text", v: "Confirme detalhes do pedido pelos canais abaixo." }],
            () => [{ t: "text", v: "Escolha o canal e fale com a equipe agora." }],
            () => [{ t: "text", v: "WhatsApp é o caminho mais rápido para pedido e dúvidas." }],
            () => [{ t: "text", v: "Fale com a equipe e combine a melhor forma de atendimento." }],
        ],
        "contactPage.whatsTitle": CONTACT_PAGE_DEFAULT["contactPage.whatsTitle"]!,
        "contactPage.phoneTitle": CONTACT_PAGE_DEFAULT["contactPage.phoneTitle"]!,
        "contactPage.addressTitle": CONTACT_PAGE_DEFAULT["contactPage.addressTitle"]!,
    },

    SERVICE_PRICING: {
        "contactPage.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Orçamento e contato em ${city}` : "Orçamento e contato" }],
            ({ city }) => [{ t: "text", v: city ? `Fale sobre valores em ${city}` : "Fale sobre valores" }],
            ({ city }) => [{ t: "text", v: city ? `Atendimento para orçamento — ${city}` : "Atendimento para orçamento" }],
            ({ city }) => [{ t: "text", v: city ? `Contato para serviço em ${city}` : "Contato para serviço" }],
            ({ city }) => [{ t: "text", v: city ? `Tire dúvidas e confirme valores em ${city}` : "Tire dúvidas e confirme valores" }],
        ],
        "contactPage.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Peça um orçamento — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ city }) => [{ t: "normal", v: "Contato para orçamento em " }, { t: "primary", v: city }],
            ({ name }) => [{ t: "normal", v: "Fale com " }, { t: "strong", v: name }, { t: "normal", v: " e entenda o melhor plano" }],
            ({ name, city }) => [{ t: "normal", v: "Atendimento transparente — " }, { t: "strong", v: name }, { t: "normal", v: " em " }, { t: "primary", v: city }],
            ({ name }) => [{ t: "normal", v: "Vamos fechar com clareza — " }, { t: "strong", v: name }],
        ],
        "contactPage.intro": [
            ({ category, city }) => [{ t: "text", v: `Se você quer orçamento de ${category.toLowerCase()} em ${city}, chame no WhatsApp e explique seu caso.` }],
            ({ name }) => [{ t: "strong", v: name }, { t: "text", v: " orienta com transparência para você decidir com segurança." }],
            ({ city }) => [{ t: "text", v: `Em ${city}, atendimento direto: você tira dúvidas e confirma o melhor valor para o seu caso.` }],
            ({ category }) => [{ t: "text", v: `Sem enrolação: fale com a equipe e entenda opções de ${category.toLowerCase()} antes de fechar.` }],
            ({ city }) => [{ t: "text", v: `Preferir ligação? Ligue e resolva rápido em ${city}.` }],
        ],
        "contactPage.cardsLead": CONTACT_PAGE_DEFAULT["contactPage.cardsLead"]!,
        "contactPage.whatsTitle": CONTACT_PAGE_DEFAULT["contactPage.whatsTitle"]!,
        "contactPage.phoneTitle": CONTACT_PAGE_DEFAULT["contactPage.phoneTitle"]!,
        "contactPage.addressTitle": CONTACT_PAGE_DEFAULT["contactPage.addressTitle"]!,
    },

    HYBRID: {
        "contactPage.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Contato completo em ${city}` : "Contato completo" }],
            ({ city }) => [{ t: "text", v: city ? `Atendimento + catálogo em ${city}` : "Atendimento + catálogo" }],
            ({ city }) => [{ t: "text", v: city ? `Resolver e escolher em ${city}` : "Resolver e escolher" }],
            ({ city }) => [{ t: "text", v: city ? `WhatsApp e localização — ${city}` : "WhatsApp e localização" }],
            ({ city }) => [{ t: "text", v: city ? `Fale com a equipe em ${city}` : "Fale com a equipe" }],
        ],
        "contactPage.heading": [
            ({ name, city }) => [{ t: "normal", v: "Fale e resolva — " }, { t: "strong", v: name }, { t: "normal", v: " em " }, { t: "primary", v: city }],
            ({ name }) => [{ t: "normal", v: "Atendimento e opções com " }, { t: "strong", v: name }],
            ({ city }) => [{ t: "normal", v: "Contato rápido em " }, { t: "primary", v: city }],
            ({ name }) => [{ t: "normal", v: "Chame no WhatsApp — " }, { t: "strong", v: name }],
            ({ name, city }) => [{ t: "normal", v: "Vamos achar a melhor solução — " }, { t: "strong", v: name }, { t: "normal", v: " em " }, { t: "primary", v: city }],
        ],
        "contactPage.intro": [
            ({ city }) => [{ t: "text", v: `Em ${city}, você fala com a equipe e decide o melhor caminho: atendimento, opções e orientação.` }],
            ({ name }) => [{ t: "strong", v: name }, { t: "text", v: " ajuda você a escolher e resolver, com clareza." }],
            ({ category }) => [{ t: "text", v: `Fale com a equipe e avance com segurança em ${category.toLowerCase()}.` }],
            ({ city }) => [{ t: "text", v: `WhatsApp é o mais rápido — e o endereço está logo abaixo para você chegar fácil em ${city}.` }],
            ({ name, city }) => [{ t: "text", v: "Sem perder tempo: " }, { t: "strong", v: name }, { t: "text", v: ` em ${city}.` }],
        ],
        "contactPage.cardsLead": CONTACT_PAGE_DEFAULT["contactPage.cardsLead"]!,
        "contactPage.whatsTitle": CONTACT_PAGE_DEFAULT["contactPage.whatsTitle"]!,
        "contactPage.phoneTitle": CONTACT_PAGE_DEFAULT["contactPage.phoneTitle"]!,
        "contactPage.addressTitle": CONTACT_PAGE_DEFAULT["contactPage.addressTitle"]!,
    },
}
