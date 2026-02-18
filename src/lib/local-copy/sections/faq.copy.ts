// lib/local-seo/sections/faq.copy.ts
import type { ModeCopy, StoreMode } from "../types"

/**
 * FAQSection:
 * SEO + emocional (conexão, autoridade, retenção) + semântica.
 *
 * Regra: mínimo 5 variações por key, em DEFAULT e em TODOS os MODES.
 */
export const FAQ_DEFAULT: ModeCopy = {
    // ===============================
    // faq.kicker (5)
    // ===============================
    "faq.kicker": [
        ({ city }) => [{ t: "text", v: city ? `Dúvidas frequentes em ${city}` : "Dúvidas frequentes" }],
        ({ city }) => [{ t: "text", v: city ? `Perguntas e respostas em ${city}` : "Perguntas e respostas" }],
        ({ city }) => [{ t: "text", v: city ? `FAQ — atendimento em ${city}` : "FAQ do atendimento" }],
        ({ city }) => [{ t: "text", v: city ? `Tire suas dúvidas em ${city}` : "Tire suas dúvidas" }],
        ({ city }) => [{ t: "text", v: city ? `Respostas rápidas em ${city}` : "Respostas rápidas" }],
    ],

    // ===============================
    // faq.heading (5)
    // ===============================
    "faq.heading": [
        ({ name, city }) => [
            { t: "normal", v: "Perguntas frequentes sobre " },
            { t: "strong", v: name },
            ...(city ? [{ t: "normal" as const, v: " em " }, { t: "text" as const, v: city }] : []),
        ],
        ({ name, city }) => [
            { t: "normal", v: "Dúvidas comuns sobre a " },
            { t: "strong", v: name },
            ...(city ? [{ t: "normal" as const, v: " — " }, { t: "text" as const, v: city }] : []),
        ],
        ({ name, category, city }) => [
            { t: "normal", v: "FAQ de " },
            { t: "text", v: category.toLowerCase() },
            { t: "normal", v: " — " },
            { t: "strong", v: name },
            ...(city ? [{ t: "normal" as const, v: " em " }, { t: "primary" as const, v: city }] : []),
        ],
        ({ name, city }) => [
            { t: "normal", v: "Tudo que você precisa saber sobre " },
            { t: "strong", v: name },
            ...(city ? [{ t: "normal" as const, v: " em " }, { t: "primary" as const, v: city }] : []),
        ],
        ({ name, city }) => [
            { t: "normal", v: "Perguntas e respostas — " },
            { t: "strong", v: name },
            ...(city ? [{ t: "normal" as const, v: " (" }, { t: "text" as const, v: city }, { t: "normal" as const, v: ")" }] : []),
        ],
    ],

    // ===============================
    // faq.intro (5)
    // ===============================
    "faq.intro": [
        ({ name, category, city }) => [
            { t: "text", v: "Reunimos as dúvidas mais comuns para você decidir com confiança. " },
            { t: "strong", v: name },
            { t: "text", v: category && city ? ` atende com ${category.toLowerCase()} em ${city}. ` : " está pronta para te atender. " },
            { t: "text", v: "Se não encontrar a resposta, chame no WhatsApp." },
        ],
        ({ category, city }) => [
            { t: "text", v: category && city ? `Veja as respostas sobre ${category.toLowerCase()} em ${city}. ` : "Veja as respostas mais comuns. " },
            { t: "text", v: "É rápido, direto e ajuda você a evitar perda de tempo." },
        ],
        ({ name }) => [
            { t: "text", v: "Aqui você encontra respostas objetivas e transparentes. " },
            { t: "strong", v: name },
            { t: "text", v: " explica como funciona o atendimento, prazos e detalhes importantes." },
        ],
        ({ name, city }) => [
            { t: "text", v: "Antes de falar com a equipe, tire suas dúvidas aqui. " },
            { t: "strong", v: name },
            ...(city ? [{ t: "text" as const, v: ` em ${city} ` }] : [{ t: "text" as const, v: " " }]),
            { t: "text", v: "tem respostas rápidas para você seguir com segurança." },
        ],
        ({ category }) => [
            { t: "text", v: "Respostas claras geram escolhas melhores. " },
            { t: "text", v: category ? `Nesta seção, explicamos pontos comuns sobre ${category.toLowerCase()}. ` : "Nesta seção, explicamos pontos comuns do atendimento. " },
            { t: "text", v: "Se precisar, fale no WhatsApp e a equipe orienta." },
        ],
    ],
}

/**
 * TODOS os MODES com TODAS as keys e 5 variações por key.
 * Assim você nunca verá warning por mode.
 */
export const FAQ_BY_MODE: Record<StoreMode, ModeCopy> = {
    LOCAL_BUSINESS: FAQ_DEFAULT,

    PRODUCT_CATALOG: {
        "faq.kicker": [
            ({ city }) => [{ t: "text", v: city ? `FAQ do catálogo em ${city}` : "FAQ do catálogo" }],
            ({ city }) => [{ t: "text", v: city ? `Dúvidas sobre produtos em ${city}` : "Dúvidas sobre produtos" }],
            ({ city }) => [{ t: "text", v: city ? `Perguntas sobre compra e retirada em ${city}` : "Perguntas sobre compra e retirada" }],
            ({ city }) => [{ t: "text", v: city ? `Respostas sobre disponibilidade em ${city}` : "Respostas sobre disponibilidade" }],
            ({ city }) => [{ t: "text", v: city ? `Ajuda rápida: catálogo em ${city}` : "Ajuda rápida do catálogo" }],
        ],
        "faq.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Perguntas frequentes do catálogo — " },
                { t: "strong", v: name },
                ...(city ? [{ t: "normal" as const, v: " em " }, { t: "primary" as const, v: city }] : []),
            ],
            ({ name, city }) => [
                { t: "normal", v: "Dúvidas sobre produtos e retirada — " },
                { t: "strong", v: name },
                ...(city ? [{ t: "normal" as const, v: " (" }, { t: "text" as const, v: city }, { t: "normal" as const, v: ")" }] : []),
            ],
            ({ name, category, city }) => [
                { t: "normal", v: "FAQ de " },
                { t: "text", v: category.toLowerCase() },
                { t: "normal", v: " — " },
                { t: "strong", v: name },
                ...(city ? [{ t: "normal" as const, v: " em " }, { t: "primary" as const, v: city }] : []),
            ],
            ({ name, city }) => [
                { t: "normal", v: "Compras, prazos e retirada — " },
                { t: "strong", v: name },
                ...(city ? [{ t: "normal" as const, v: " em " }, { t: "text" as const, v: city }] : []),
            ],
            ({ name }) => [
                { t: "normal", v: "Perguntas comuns sobre o catálogo da " },
                { t: "strong", v: name },
            ],
        ],
        "faq.intro": [
            ({ name, city }) => [
                { t: "text", v: "Aqui você entende como funciona disponibilidade, retirada e atendimento. " },
                { t: "strong", v: name },
                ...(city ? [{ t: "text" as const, v: ` em ${city} ` }] : [{ t: "text" as const, v: " " }]),
                { t: "text", v: "responde as dúvidas mais comuns para você comprar com confiança." },
            ],
            ({ category, city }) => [
                { t: "text", v: `Dúvidas sobre ${category.toLowerCase()}${city ? ` em ${city}` : ""}? ` },
                { t: "text", v: "Veja respostas rápidas sobre estoque, prazos e retirada." },
            ],
            ({ name }) => [
                { t: "text", v: "Respostas diretas para evitar idas e voltas. " },
                { t: "strong", v: name },
                { t: "text", v: " ajuda você a escolher, reservar e confirmar detalhes." },
            ],
            ({ name }) => [
                { t: "text", v: "Se a sua dúvida é compra, entrega ou retirada, começa aqui. " },
                { t: "strong", v: name },
                { t: "text", v: " explica o essencial em linguagem simples." },
            ],
            ({ city }) => [
                { t: "text", v: city ? `Em ${city}, ` : "" },
                { t: "text", v: "as perguntas mais comuns estão respondidas aqui. Se precisar, chame no WhatsApp." },
            ],
        ],
    },

    SERVICE_PRICING: {
        "faq.kicker": [
            ({ city }) => [{ t: "text", v: city ? `FAQ de orçamento em ${city}` : "FAQ de orçamento" }],
            ({ city }) => [{ t: "text", v: city ? `Dúvidas sobre preços em ${city}` : "Dúvidas sobre preços" }],
            ({ city }) => [{ t: "text", v: city ? `Perguntas sobre valores e prazos em ${city}` : "Perguntas sobre valores e prazos" }],
            ({ city }) => [{ t: "text", v: city ? `Respostas sobre orçamento em ${city}` : "Respostas sobre orçamento" }],
            ({ city }) => [{ t: "text", v: city ? `Orçamento sem dúvida em ${city}` : "Orçamento sem dúvida" }],
        ],
        "faq.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Perguntas frequentes sobre orçamento — " },
                { t: "strong", v: name },
                ...(city ? [{ t: "normal" as const, v: " em " }, { t: "primary" as const, v: city }] : []),
            ],
            ({ name, category, city }) => [
                { t: "normal", v: `Dúvidas de ${category.toLowerCase()} ` },
                ...(city ? [{ t: "normal" as const, v: "em " }, { t: "primary" as const, v: city }, { t: "normal" as const, v: " — " }] : [{ t: "normal" as const, v: "— " }]),
                { t: "strong", v: name },
            ],
            ({ name }) => [
                { t: "normal", v: "Valores, prazos e atendimento — " },
                { t: "strong", v: name },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Quanto custa? Como funciona? — " },
                { t: "strong", v: name },
                ...(city ? [{ t: "normal" as const, v: " (" }, { t: "text" as const, v: city }, { t: "normal" as const, v: ")" }] : []),
            ],
            ({ name, city }) => [
                { t: "normal", v: "FAQ de preços e condições — " },
                { t: "strong", v: name },
                ...(city ? [{ t: "normal" as const, v: " em " }, { t: "text" as const, v: city }] : []),
            ],
        ],
        "faq.intro": [
            ({ name, city }) => [
                { t: "text", v: "Respostas claras para você entender orçamento, prazos e condições. " },
                { t: "strong", v: name },
                ...(city ? [{ t: "text" as const, v: ` em ${city} ` }] : [{ t: "text" as const, v: " " }]),
                { t: "text", v: "explica de forma simples para você decidir com segurança." },
            ],
            ({ category, city }) => [
                { t: "text", v: `Dúvidas sobre valores de ${category.toLowerCase()}${city ? ` em ${city}` : ""}? ` },
                { t: "text", v: "Veja respostas rápidas e, se precisar, peça orçamento no WhatsApp." },
            ],
            ({ name }) => [
                { t: "text", v: "Menos enrolação, mais clareza. " },
                { t: "strong", v: name },
                { t: "text", v: " responde perguntas comuns para você comparar e decidir sem dúvida." },
            ],
            ({ city }) => [
                { t: "text", v: city ? `Em ${city}, ` : "" },
                { t: "text", v: "as perguntas mais comuns sobre orçamento estão aqui. Se algo variar no seu caso, chame no WhatsApp." },
            ],
            ({ name }) => [
                { t: "text", v: "Aqui você entende o essencial antes de falar com a equipe. " },
                { t: "strong", v: name },
                { t: "text", v: " deixa o processo transparente do começo ao fim." },
            ],
        ],
    },

    HYBRID: {
        "faq.kicker": [
            ({ city }) => [{ t: "text", v: city ? `FAQ: atendimento e catálogo em ${city}` : "FAQ: atendimento e catálogo" }],
            ({ city }) => [{ t: "text", v: city ? `Dúvidas sobre serviço + produtos em ${city}` : "Dúvidas sobre serviço + produtos" }],
            ({ city }) => [{ t: "text", v: city ? `Perguntas comuns em ${city}` : "Perguntas comuns" }],
            ({ city }) => [{ t: "text", v: city ? `Respostas rápidas em ${city}` : "Respostas rápidas" }],
            ({ city }) => [{ t: "text", v: city ? `Ajuda e informações em ${city}` : "Ajuda e informações" }],
        ],
        "faq.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Perguntas frequentes — " },
                { t: "strong", v: name },
                ...(city ? [{ t: "normal" as const, v: " em " }, { t: "primary" as const, v: city }] : []),
            ],
            ({ name, category, city }) => [
                { t: "normal", v: `${category} em ` },
                { t: "primary", v: city ?? "" },
                { t: "normal", v: " — FAQ da " },
                { t: "strong", v: name },
            ],
            ({ name }) => [
                { t: "normal", v: "Atendimento e catálogo — dúvidas sobre " },
                { t: "strong", v: name },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Tudo em um só lugar: " },
                { t: "strong", v: name },
                ...(city ? [{ t: "normal" as const, v: " (" }, { t: "text" as const, v: city }, { t: "normal" as const, v: ")" }] : []),
            ],
            ({ name }) => [
                { t: "normal", v: "FAQ completo da " },
                { t: "strong", v: name },
            ],
        ],
        "faq.intro": [
            ({ name }) => [
                { t: "text", v: "Reunimos respostas sobre atendimento e opções do catálogo. " },
                { t: "strong", v: name },
                { t: "text", v: " deixa tudo claro para você resolver mais rápido." },
            ],
            ({ category, city }) => [
                { t: "text", v: `Dúvidas sobre ${category.toLowerCase()}${city ? ` em ${city}` : ""}? ` },
                { t: "text", v: "Veja respostas objetivas e, se precisar, chame no WhatsApp." },
            ],
            ({ name, city }) => [
                { t: "text", v: "Antes de decidir, tire suas dúvidas aqui. " },
                { t: "strong", v: name },
                ...(city ? [{ t: "text" as const, v: ` em ${city} ` }] : [{ t: "text" as const, v: " " }]),
                { t: "text", v: "explica o essencial para você seguir com confiança." },
            ],
            ({ city }) => [
                { t: "text", v: city ? `Em ${city}, ` : "" },
                { t: "text", v: "as perguntas mais comuns estão respondidas. Se algo for específico, a equipe responde no WhatsApp." },
            ],
            ({ name }) => [
                { t: "text", v: "Respostas claras geram escolhas melhores. " },
                { t: "strong", v: name },
                { t: "text", v: " ajuda você a entender opções, prazos e como funciona." },
            ],
        ],
    },
}
