// lib/local-copy/sections/service.copy.ts
import type { ModeCopy, StoreMode } from "../types"

/**
 * Service Detail Page:
 * Textos precisam ser otimizados para SEO mas também emocional:
 * conexão, autoridade, retenção e SEO semântico.
 *
 * Regras:
 * - mínimo 5 variações por key
 * - copy determinístico via seed (getCopy)
 * - usa ctx.serviceName e ctx.serviceDesc quando disponível
 */
export const SERVICE_PAGE_DEFAULT: ModeCopy = {
    // ===============================
    // service.kicker (5)
    // ===============================
    "service.kicker": [
        ({ serviceName, city, state, category }) => [
            { t: "text", v: serviceName ? `${serviceName} em ${city}` : `${category} em ${city}` },
            { t: "text", v: state ? `, ${state}` : "" },
        ],
        ({ serviceName, city, category }) => [
            { t: "text", v: serviceName ? `Serviço: ${serviceName} em ${city}` : `Serviços de ${category.toLowerCase()} em ${city}` },
        ],
        ({ serviceName, city }) => [
            { t: "text", v: serviceName ? `Atendimento para ${serviceName} em ${city}` : `Atendimento local em ${city}` },
        ],
        ({ serviceName, city, category }) => [
            { t: "text", v: serviceName ? `${serviceName} com atendimento local` : `${category} com atendimento local` },
            { t: "text", v: ` · ${city}` },
        ],
        ({ serviceName, city, category }) => [
            { t: "text", v: serviceName ? `Detalhes do serviço em ${city}` : `Detalhes do atendimento em ${city}` },
            { t: "text", v: ` · ${category}` },
        ],
    ],

    // ===============================
    // service.heading (5)
    // ===============================
    "service.heading": [
        ({ serviceName, city, state, name }) => [
            { t: "text", v: serviceName || "Serviço" },
            { t: "normal", v: " em " },
            { t: "primary", v: `${city}${state ? `, ${state}` : ""}` },
            { t: "normal", v: " — " },
            { t: "strong", v: name },
        ],
        ({ serviceName, city, name }) => [
            { t: "text", v: serviceName || "Serviço" },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
            { t: "normal", v: " com " },
            { t: "strong", v: name },
        ],
        ({ serviceName, city, category }) => [
            { t: "text", v: serviceName || "Serviço" },
            { t: "normal", v: " para " },
            { t: "primary", v: city },
            { t: "normal", v: ` — ${category.toLowerCase()} com foco em resolver` },
        ],
        ({ serviceName, city, name }) => [
            { t: "normal", v: "Solicite " },
            { t: "text", v: serviceName || "o serviço" },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
            { t: "normal", v: " com " },
            { t: "strong", v: name },
        ],
        ({ serviceName, city, state, category }) => [
            { t: "text", v: serviceName || "Serviço" },
            { t: "normal", v: ` — ${category.toLowerCase()} em ` },
            { t: "primary", v: `${city}${state ? `, ${state}` : ""}` },
        ],
    ],

    // ===============================
    // service.intro (5)
    // ===============================
    "service.intro": [
        ({ name, serviceName, city, category }) => [
            { t: "strong", v: name },
            { t: "text", v: ` atende ${city} com ` },
            { t: "text", v: serviceName ? serviceName.toLowerCase() : category.toLowerCase() },
            { t: "text", v: " de forma clara, rápida e com cuidado no detalhe. " },
            { t: "text", v: "Se quiser, chame no WhatsApp e a equipe orienta o melhor caminho." },
        ],
        ({ serviceName, city, state, category }) => [
            { t: "text", v: `Em ${city}${state ? `, ${state}` : ""}, você encontra ` },
            { t: "text", v: serviceName ? serviceName.toLowerCase() : category.toLowerCase() },
            { t: "text", v: " com atendimento direto e sem enrolação. " },
            { t: "text", v: "Tire dúvidas, entenda o processo e combine o melhor horário." },
        ],
        ({ name, city, serviceName }) => [
            { t: "text", v: `Clientes de ${city} procuram o ` },
            { t: "strong", v: name },
            { t: "text", v: " pela confiança no atendimento e pela transparência do começo ao fim. " },
            { t: "text", v: serviceName ? `Veja detalhes sobre ${serviceName.toLowerCase()} e fale com a equipe.` : "Veja detalhes e fale com a equipe." },
        ],
        ({ serviceName, category, city }) => [
            { t: "text", v: `Se você busca ` },
            { t: "text", v: serviceName ? serviceName.toLowerCase() : category.toLowerCase() },
            { t: "text", v: ` em ${city}, aqui você encontra orientação clara, execução caprichada e atendimento humano. ` },
            { t: "primary", v: "Chame no WhatsApp" },
            { t: "text", v: " para confirmar disponibilidade." },
        ],
        ({ name, serviceDesc, serviceName, city }) => [
            { t: "strong", v: name },
            { t: "text", v: " resolve com objetividade: " },
            { t: "text", v: serviceDesc?.trim() ? serviceDesc.trim() : (serviceName ? `${serviceName.toLowerCase()} com atendimento profissional` : "atendimento profissional") },
            { t: "text", v: ` em ${city}. ` },
            { t: "text", v: "Fale com a equipe para entender valores, prazos e o que faz sentido no seu caso." },
        ],
    ],

    // ===============================
    // service.priceHint (5)
    // ===============================
    "service.priceHint": [
        () => [{ t: "text", v: "A partir de " }],
        () => [{ t: "text", v: "Valor inicial: " }],
        () => [{ t: "text", v: "Preço base: " }],
        () => [{ t: "text", v: "Estimativa a partir de " }],
        () => [{ t: "text", v: "A partir de " }],
    ],

    // ===============================
    // service.ctaTitle (5)
    // ===============================
    "service.ctaTitle": [
        ({ serviceName, city }) => [{ t: "text", v: `Solicite ${serviceName || "este serviço"} em ${city}` }],
        ({ serviceName, city }) => [{ t: "text", v: `Agende ${serviceName || "o serviço"} em ${city}` }],
        ({ serviceName, city }) => [{ t: "text", v: `Fale com a equipe sobre ${serviceName || "o serviço"} em ${city}` }],
        ({ serviceName, city }) => [{ t: "text", v: `Precisa de ${serviceName || "atendimento"} em ${city}?` }],
        ({ serviceName, city }) => [{ t: "text", v: `Orçamento para ${serviceName || "o serviço"} em ${city}` }],
    ],

    // ===============================
    // service.ctaDesc (5)
    // ===============================
    "service.ctaDesc": [
        ({ name, serviceName, city }) => [
            { t: "text", v: `Fale agora com ` },
            { t: "strong", v: name },
            { t: "text", v: ` e solicite ` },
            { t: "text", v: serviceName ? serviceName.toLowerCase() : "o serviço" },
            { t: "text", v: `. Atendemos ${city} e região com atenção e compromisso.` },
        ],
        ({ serviceName, city }) => [
            { t: "text", v: `Explique o que você precisa e a equipe orienta o melhor caminho para ` },
            { t: "text", v: serviceName ? serviceName.toLowerCase() : "o atendimento" },
            { t: "text", v: ` em ${city}.` },
        ],
        ({ name, city }) => [
            { t: "text", v: `Atendimento direto com ` },
            { t: "strong", v: name },
            { t: "text", v: ` em ${city}. ` },
            { t: "text", v: "Tire dúvidas, confirme horários e resolva com segurança." },
        ],
        ({ serviceName, city }) => [
            { t: "text", v: `Quer resolver isso hoje? Chame no WhatsApp e combine ` },
            { t: "text", v: serviceName ? serviceName.toLowerCase() : "o serviço" },
            { t: "text", v: ` em ${city} com rapidez.` },
        ],
        ({ name, serviceName }) => [
            { t: "strong", v: name },
            { t: "text", v: " atende com clareza e transparência. " },
            { t: "text", v: serviceName ? `Peça ${serviceName.toLowerCase()} e receba orientação antes de fechar.` : "Peça o serviço e receba orientação antes de fechar." },
        ],
    ],

    // ===============================
    // service.ctaWhatsapp (5)
    // ===============================
    "service.ctaWhatsapp": [
        () => [{ t: "text", v: "Solicitar via WhatsApp" }],
        () => [{ t: "text", v: "Chamar no WhatsApp" }],
        () => [{ t: "text", v: "Falar agora no WhatsApp" }],
        () => [{ t: "text", v: "Pedir orçamento no WhatsApp" }],
        () => [{ t: "text", v: "Confirmar disponibilidade no WhatsApp" }],
    ],

    // ===============================
    // service.ctaPhone (5)
    // ===============================
    "service.ctaPhone": [
        ({ name }) => [{ t: "text", v: `Ligar para ${name}` }],
        ({ name }) => [{ t: "text", v: `Chamar ${name} por telefone` }],
        ({ name }) => [{ t: "text", v: `Falar com ${name} agora` }],
        ({ name }) => [{ t: "text", v: `Ligar e tirar dúvidas com ${name}` }],
        ({ name }) => [{ t: "text", v: `Atendimento por telefone — ${name}` }],
    ],
}

/**
 * Overrides por MODE (cada key aqui tem 5 variações)
 */
export const SERVICE_PAGE_BY_MODE: Partial<Record<StoreMode, ModeCopy>> = {
    LOCAL_BUSINESS: {
        "service.kicker": [
            ({ city }) => [{ t: "text", v: `Atendimento local em ${city}` }],
            ({ city }) => [{ t: "text", v: `Serviço em ${city}` }],
            ({ city }) => [{ t: "text", v: `Chame e resolva em ${city}` }],
            ({ city }) => [{ t: "text", v: `Equipe pronta em ${city}` }],
            ({ city }) => [{ t: "text", v: `Atendimento rápido em ${city}` }],
        ],
        "service.heading": [
            ({ serviceName, city, name }) => [
                { t: "text", v: serviceName || "Serviço" },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
                { t: "normal", v: " — " },
                { t: "strong", v: name },
            ],
            ({ serviceName, city }) => [
                { t: "normal", v: "Atendimento para " },
                { t: "text", v: serviceName || "o serviço" },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ serviceName, city, state }) => [
                { t: "text", v: serviceName || "Serviço" },
                { t: "normal", v: " em " },
                { t: "primary", v: `${city}${state ? `, ${state}` : ""}` },
                { t: "normal", v: " com foco em resolver" },
            ],
            ({ serviceName, city, name }) => [
                { t: "normal", v: "Solicite " },
                { t: "text", v: serviceName || "o serviço" },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
                { t: "normal", v: " com " },
                { t: "strong", v: name },
            ],
            ({ serviceName, city }) => [
                { t: "text", v: serviceName || "Serviço" },
                { t: "normal", v: " — atendimento em " },
                { t: "primary", v: city },
            ],
        ],
        "service.intro": [
            ({ name, city, serviceName }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atende ${city} com cuidado e comunicação clara. ` },
                { t: "text", v: serviceName ? `Peça ${serviceName.toLowerCase()} e combine o melhor horário.` : "Peça o serviço e combine o melhor horário." },
            ],
            ({ city, serviceName }) => [
                { t: "text", v: `Atendimento em ${city} com orientação rápida. ` },
                { t: "text", v: serviceName ? `Explique o que precisa em ${serviceName.toLowerCase()} e a equipe te guia.` : "Explique o que precisa e a equipe te guia." },
            ],
            ({ name, city }) => [
                { t: "text", v: `Em ${city}, o ` },
                { t: "strong", v: name },
                { t: "text", v: " é conhecido por resolver com transparência e capricho. " },
                { t: "primary", v: "Chame no WhatsApp" },
                { t: "text", v: " e tire suas dúvidas." },
            ],
            ({ serviceName, city }) => [
                { t: "text", v: `Quer praticidade? Solicite ` },
                { t: "text", v: serviceName ? serviceName.toLowerCase() : "o serviço" },
                { t: "text", v: ` em ${city} e confirme disponibilidade em minutos.` },
            ],
            ({ name, serviceName, city }) => [
                { t: "strong", v: name },
                { t: "text", v: ` presta atendimento em ${city} com padrão profissional. ` },
                { t: "text", v: serviceName ? `Veja detalhes de ${serviceName.toLowerCase()} e fale com a equipe.` : "Veja detalhes e fale com a equipe." },
            ],
        ],
        "service.priceHint": [
            () => [{ t: "text", v: "A partir de " }],
            () => [{ t: "text", v: "Valor inicial: " }],
            () => [{ t: "text", v: "Preço base: " }],
            () => [{ t: "text", v: "A partir de " }],
            () => [{ t: "text", v: "Estimativa a partir de " }],
        ],
        "service.ctaTitle": [
            ({ serviceName, city }) => [{ t: "text", v: `Solicite ${serviceName || "o serviço"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Resolva ${serviceName || "isso"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Atendimento para ${serviceName || "o serviço"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Agende ${serviceName || "o serviço"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Orçamento rápido para ${serviceName || "o serviço"} em ${city}` }],
        ],
        "service.ctaDesc": [
            ({ name, serviceName, city }) => [
                { t: "text", v: `Fale com ` },
                { t: "strong", v: name },
                { t: "text", v: ` e peça ` },
                { t: "text", v: serviceName ? serviceName.toLowerCase() : "o serviço" },
                { t: "text", v: `. Atendimento em ${city} com atenção ao seu caso.` },
            ],
            ({ serviceName }) => [
                { t: "text", v: serviceName ? `Explique o que precisa em ${serviceName.toLowerCase()} e receba orientação clara antes de fechar.` : "Explique o que precisa e receba orientação clara antes de fechar." },
            ],
            ({ city }) => [{ t: "text", v: `Atendemos ${city} e região. Chame no WhatsApp e confirme o melhor horário.` }],
            ({ name }) => [
                { t: "strong", v: name },
                { t: "text", v: " responde rápido, tira dúvidas e ajuda você a decidir com segurança." },
            ],
            ({ serviceName, city }) => [
                { t: "text", v: `Quer resolver sem complicação? Solicite ` },
                { t: "text", v: serviceName ? serviceName.toLowerCase() : "o serviço" },
                { t: "text", v: ` em ${city} agora.` },
            ],
        ],
        "service.ctaWhatsapp": [
            () => [{ t: "text", v: "Chamar no WhatsApp" }],
            () => [{ t: "text", v: "Solicitar via WhatsApp" }],
            () => [{ t: "text", v: "Orçamento no WhatsApp" }],
            () => [{ t: "text", v: "Falar com a equipe no WhatsApp" }],
            () => [{ t: "text", v: "Confirmar agora no WhatsApp" }],
        ],
        "service.ctaPhone": [
            ({ name }) => [{ t: "text", v: `Ligar para ${name}` }],
            ({ name }) => [{ t: "text", v: `Telefone — ${name}` }],
            ({ name }) => [{ t: "text", v: `Chamar ${name} por telefone` }],
            ({ name }) => [{ t: "text", v: `Ligar e tirar dúvidas` }],
            ({ name }) => [{ t: "text", v: `Falar com ${name}` }],
        ],
    },

    PRODUCT_CATALOG: {
        "service.kicker": [
            ({ city }) => [{ t: "text", v: `Detalhes do item/serviço em ${city}` }],
            ({ city }) => [{ t: "text", v: `Catálogo em ${city}` }],
            ({ city }) => [{ t: "text", v: `Opções do catálogo em ${city}` }],
            ({ city }) => [{ t: "text", v: `Disponibilidade em ${city}` }],
            ({ city }) => [{ t: "text", v: `Peça e confirme em ${city}` }],
        ],
        "service.heading": [
            ({ serviceName, city, name }) => [
                { t: "text", v: serviceName || "Item do catálogo" },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
                { t: "normal", v: " — " },
                { t: "strong", v: name },
            ],
            ({ serviceName, city }) => [
                { t: "text", v: serviceName || "Item/Serviço" },
                { t: "normal", v: " disponível em " },
                { t: "primary", v: city },
            ],
            ({ serviceName, city, state }) => [
                { t: "text", v: serviceName || "Item/Serviço" },
                { t: "normal", v: " em " },
                { t: "primary", v: `${city}${state ? `, ${state}` : ""}` },
                { t: "normal", v: " — confirme disponibilidade" },
            ],
            ({ serviceName, city }) => [
                { t: "normal", v: "Peça " },
                { t: "text", v: serviceName || "o item" },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ serviceName, city, name }) => [
                { t: "text", v: serviceName || "Item/Serviço" },
                { t: "normal", v: " — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
        ],
        "service.intro": [
            ({ name, serviceName, city }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atende ${city} com opções organizadas e orientação rápida. ` },
                { t: "text", v: serviceName ? `Confirme ${serviceName.toLowerCase()} pelo WhatsApp.` : "Confirme pelo WhatsApp." },
            ],
            ({ serviceName, city }) => [
                { t: "text", v: `Em ${city}, confirme disponibilidade, condições e prazos. ` },
                { t: "text", v: serviceName ? `Chame no WhatsApp sobre ${serviceName.toLowerCase()}.` : "Chame no WhatsApp." },
            ],
            ({ name, city }) => [
                { t: "text", v: `Clientes de ${city} escolhem o ` },
                { t: "strong", v: name },
                { t: "text", v: " pela praticidade: você pergunta, confirma e resolve com rapidez." },
            ],
            ({ serviceName }) => [
                { t: "text", v: serviceName ? `Quer garantir ${serviceName.toLowerCase()}? Fale com a equipe e confirme estoque/agenda.` : "Quer garantir isso? Fale com a equipe e confirme estoque/agenda." },
            ],
            ({ city }) => [
                { t: "text", v: `Atendimento em ${city} com foco em custo-benefício e clareza. Envie sua dúvida e a equipe responde.` },
            ],
        ],
        "service.priceHint": [
            () => [{ t: "text", v: "Valor a partir de " }],
            () => [{ t: "text", v: "Preço base: " }],
            () => [{ t: "text", v: "A partir de " }],
            () => [{ t: "text", v: "Estimativa a partir de " }],
            () => [{ t: "text", v: "Valor inicial: " }],
        ],
        "service.ctaTitle": [
            ({ serviceName, city }) => [{ t: "text", v: `Confirmar ${serviceName || "disponibilidade"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Pedir ${serviceName || "este item"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Reservar ${serviceName || "o item"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Consultar condições de ${serviceName || "compra"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Falar com a equipe sobre ${serviceName || "o item"} em ${city}` }],
        ],
        "service.ctaDesc": [
            ({ name, serviceName }) => [
                { t: "text", v: `Fale com ` },
                { t: "strong", v: name },
                { t: "text", v: serviceName ? ` sobre ${serviceName.toLowerCase()} e confirme disponibilidade, prazos e valores.` : " e confirme disponibilidade, prazos e valores." },
            ],
            () => [{ t: "text", v: "Chame no WhatsApp para confirmar estoque/agenda e condições antes de sair de casa." }],
            ({ serviceName }) => [{ t: "text", v: serviceName ? `Envie sua dúvida sobre ${serviceName.toLowerCase()} e receba orientação rápida.` : "Envie sua dúvida e receba orientação rápida." }],
            ({ city }) => [{ t: "text", v: `Atendimento em ${city} e região. Combine retirada/entrega conforme disponibilidade.` }],
            ({ name }) => [{ t: "text", v: `Atendimento direto com ${name}: você pergunta e já recebe o caminho mais simples.` }],
        ],
        "service.ctaWhatsapp": [
            () => [{ t: "text", v: "Pedir no WhatsApp" }],
            () => [{ t: "text", v: "Reservar via WhatsApp" }],
            () => [{ t: "text", v: "Confirmar disponibilidade no WhatsApp" }],
            () => [{ t: "text", v: "Falar com a equipe no WhatsApp" }],
            () => [{ t: "text", v: "Consultar condições no WhatsApp" }],
        ],
        "service.ctaPhone": [
            ({ name }) => [{ t: "text", v: `Ligar para ${name}` }],
            ({ name }) => [{ t: "text", v: `Telefone — ${name}` }],
            ({ name }) => [{ t: "text", v: `Confirmar por telefone` }],
            ({ name }) => [{ t: "text", v: `Ligar e confirmar detalhes` }],
            ({ name }) => [{ t: "text", v: `Falar com ${name}` }],
        ],
    },

    SERVICE_PRICING: {
        "service.kicker": [
            ({ city }) => [{ t: "text", v: `Serviço e valores em ${city}` }],
            ({ city }) => [{ t: "text", v: `Orçamento em ${city}` }],
            ({ city }) => [{ t: "text", v: `Preço e atendimento em ${city}` }],
            ({ city }) => [{ t: "text", v: `Consultar valores em ${city}` }],
            ({ city }) => [{ t: "text", v: `Transparência de preços em ${city}` }],
        ],
        "service.heading": [
            ({ serviceName, city, name }) => [
                { t: "text", v: serviceName || "Serviço" },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
                { t: "normal", v: " — orçamento com " },
                { t: "strong", v: name },
            ],
            ({ serviceName, city, state }) => [
                { t: "text", v: serviceName || "Serviço" },
                { t: "normal", v: " em " },
                { t: "primary", v: `${city}${state ? `, ${state}` : ""}` },
                { t: "normal", v: " com valores claros" },
            ],
            ({ serviceName, city }) => [
                { t: "normal", v: "Orçamento para " },
                { t: "text", v: serviceName || "o serviço" },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ serviceName, city, name }) => [
                { t: "text", v: serviceName || "Serviço" },
                { t: "normal", v: " — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ serviceName, city }) => [
                { t: "text", v: serviceName || "Serviço" },
                { t: "normal", v: " — preços e detalhes em " },
                { t: "primary", v: city },
            ],
        ],
        "service.intro": [
            ({ name, city, serviceName }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atende ${city} com preços claros e explicação do que está incluso. ` },
                { t: "text", v: serviceName ? `Veja ${serviceName.toLowerCase()} e peça um orçamento no WhatsApp.` : "Peça um orçamento no WhatsApp." },
            ],
            ({ serviceName, city }) => [
                { t: "text", v: `Em ${city}, entenda opções, valores e prazos antes de fechar. ` },
                { t: "text", v: serviceName ? `Chame sobre ${serviceName.toLowerCase()} e confirme o melhor valor.` : "Chame e confirme o melhor valor." },
            ],
            ({ name }) => [
                { t: "text", v: `Com o ` },
                { t: "strong", v: name },
                { t: "text", v: ", você não fica no escuro: a equipe explica, orienta e ajuda você a decidir com segurança." },
            ],
            ({ serviceName }) => [
                { t: "text", v: serviceName ? `Quer comparar? Peça um orçamento para ${serviceName.toLowerCase()} e receba orientação sem pressão.` : "Quer comparar? Peça um orçamento e receba orientação sem pressão." },
            ],
            ({ city }) => [
                { t: "text", v: `Atendimento em ${city} com transparência: valores, prazo e o que faz sentido no seu caso.` },
            ],
        ],
        "service.priceHint": [
            () => [{ t: "text", v: "A partir de " }],
            () => [{ t: "text", v: "Preço base: " }],
            () => [{ t: "text", v: "Valor inicial: " }],
            () => [{ t: "text", v: "Estimativa a partir de " }],
            () => [{ t: "text", v: "A partir de " }],
        ],
        "service.ctaTitle": [
            ({ serviceName, city }) => [{ t: "text", v: `Orçamento para ${serviceName || "o serviço"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Confirmar valores de ${serviceName || "o serviço"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Solicitar preço de ${serviceName || "o serviço"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Falar sobre orçamento de ${serviceName || "o serviço"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Preço e disponibilidade — ${serviceName || "serviço"} em ${city}` }],
        ],
        "service.ctaDesc": [
            ({ name, serviceName }) => [
                { t: "text", v: `Fale com ` },
                { t: "strong", v: name },
                { t: "text", v: serviceName ? ` e peça um orçamento para ${serviceName.toLowerCase()}. ` : " e peça um orçamento. " },
                { t: "text", v: "A equipe explica opções, valores e prazos com transparência." },
            ],
            ({ city }) => [{ t: "text", v: `Atendimento em ${city}. Envie sua necessidade e receba uma orientação rápida com valores aproximados.` }],
            ({ serviceName }) => [{ t: "text", v: serviceName ? `Descreva seu caso e a equipe ajusta o orçamento de ${serviceName.toLowerCase()} para sua necessidade.` : "Descreva seu caso e a equipe ajusta o orçamento para sua necessidade." }],
            ({ name }) => [{ t: "text", v: `Com ${name}, você entende o valor e decide com segurança — sem surpresa no final.` }],
            () => [{ t: "text", v: "Chame no WhatsApp para confirmar preço, prazo e disponibilidade." }],
        ],
        "service.ctaWhatsapp": [
            () => [{ t: "text", v: "Pedir orçamento no WhatsApp" }],
            () => [{ t: "text", v: "Confirmar valores no WhatsApp" }],
            () => [{ t: "text", v: "Solicitar preço via WhatsApp" }],
            () => [{ t: "text", v: "Chamar no WhatsApp" }],
            () => [{ t: "text", v: "Orçamento rápido no WhatsApp" }],
        ],
        "service.ctaPhone": [
            ({ name }) => [{ t: "text", v: `Ligar para ${name}` }],
            ({ name }) => [{ t: "text", v: `Telefone — ${name}` }],
            ({ name }) => [{ t: "text", v: "Ligar e pedir orçamento" }],
            ({ name }) => [{ t: "text", v: "Falar por telefone" }],
            ({ name }) => [{ t: "text", v: `Tirar dúvidas com ${name}` }],
        ],
    },

    HYBRID: {
        "service.kicker": [
            ({ city }) => [{ t: "text", v: `Serviço + opções em ${city}` }],
            ({ city }) => [{ t: "text", v: `Atendimento e catálogo em ${city}` }],
            ({ city }) => [{ t: "text", v: `Resolver em ${city}` }],
            ({ city }) => [{ t: "text", v: `Disponibilidade em ${city}` }],
            ({ city }) => [{ t: "text", v: `Equipe e opções em ${city}` }],
        ],
        "service.heading": [
            ({ serviceName, city, name }) => [
                { t: "text", v: serviceName || "Serviço" },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
                { t: "normal", v: " — " },
                { t: "strong", v: name },
            ],
            ({ serviceName, city }) => [
                { t: "normal", v: "Atendimento para " },
                { t: "text", v: serviceName || "o serviço" },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
                { t: "normal", v: " (com opções)" },
            ],
            ({ serviceName, city, category }) => [
                { t: "text", v: serviceName || "Serviço" },
                { t: "normal", v: ` — ${category.toLowerCase()} em ` },
                { t: "primary", v: city },
                { t: "normal", v: " com atendimento e alternativas" },
            ],
            ({ serviceName, city, name }) => [
                { t: "normal", v: "Solicite " },
                { t: "text", v: serviceName || "o serviço" },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
                { t: "normal", v: " com " },
                { t: "strong", v: name },
            ],
            ({ serviceName, city, state }) => [
                { t: "text", v: serviceName || "Serviço" },
                { t: "normal", v: " em " },
                { t: "primary", v: `${city}${state ? `, ${state}` : ""}` },
                { t: "normal", v: " — atendimento + opções" },
            ],
        ],
        "service.intro": [
            ({ name, city, serviceName }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atende ${city} com serviço e opções para facilitar sua decisão. ` },
                { t: "text", v: serviceName ? `Veja ${serviceName.toLowerCase()} e combine pelo WhatsApp.` : "Combine pelo WhatsApp." },
            ],
            ({ serviceName, city }) => [
                { t: "text", v: `Em ${city}, você resolve com praticidade: atendimento e alternativas no mesmo lugar. ` },
                { t: "text", v: serviceName ? `Chame sobre ${serviceName.toLowerCase()} e confirme.` : "Chame e confirme." },
            ],
            ({ name }) => [
                { t: "text", v: `Com o ` },
                { t: "strong", v: name },
                { t: "text", v: ", você entende o que faz sentido no seu caso — sem complicação e com orientação humana." },
            ],
            ({ serviceName, city }) => [
                { t: "text", v: `Quer resolver rápido? Solicite ` },
                { t: "text", v: serviceName ? serviceName.toLowerCase() : "o serviço" },
                { t: "text", v: ` em ${city} e veja as melhores alternativas.` },
            ],
            ({ city }) => [
                { t: "text", v: `Atendimento em ${city} e região com foco em resolver: serviço, opções e orientação clara.` },
            ],
        ],
        "service.priceHint": [
            () => [{ t: "text", v: "A partir de " }],
            () => [{ t: "text", v: "Preço base: " }],
            () => [{ t: "text", v: "Valor inicial: " }],
            () => [{ t: "text", v: "Estimativa a partir de " }],
            () => [{ t: "text", v: "A partir de " }],
        ],
        "service.ctaTitle": [
            ({ serviceName, city }) => [{ t: "text", v: `Solicite ${serviceName || "o serviço"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Resolver ${serviceName || "isso"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Falar sobre ${serviceName || "o serviço"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Orçamento e opções — ${serviceName || "serviço"} em ${city}` }],
            ({ serviceName, city }) => [{ t: "text", v: `Agendar ${serviceName || "o serviço"} em ${city}` }],
        ],
        "service.ctaDesc": [
            ({ name, serviceName, city }) => [
                { t: "text", v: `Fale com ` },
                { t: "strong", v: name },
                { t: "text", v: ` e solicite ` },
                { t: "text", v: serviceName ? serviceName.toLowerCase() : "o serviço" },
                { t: "text", v: `. Atendemos ${city} e região com clareza e praticidade.` },
            ],
            () => [{ t: "text", v: "Chame no WhatsApp, explique sua necessidade e receba orientação rápida com as melhores opções." }],
            ({ city }) => [{ t: "text", v: `Atendimento em ${city}: combine horário, valores e a melhor alternativa para você.` }],
            ({ name }) => [{ t: "text", v: `Com ${name}, você resolve com atendimento humano e opções claras.` }],
            ({ serviceName }) => [{ t: "text", v: serviceName ? `Peça ${serviceName.toLowerCase()} e confirme detalhes antes de fechar.` : "Peça o serviço e confirme detalhes antes de fechar." }],
        ],
        "service.ctaWhatsapp": [
            () => [{ t: "text", v: "Chamar no WhatsApp" }],
            () => [{ t: "text", v: "Solicitar via WhatsApp" }],
            () => [{ t: "text", v: "Orçamento no WhatsApp" }],
            () => [{ t: "text", v: "Confirmar agora no WhatsApp" }],
            () => [{ t: "text", v: "Falar com a equipe no WhatsApp" }],
        ],
        "service.ctaPhone": [
            ({ name }) => [{ t: "text", v: `Ligar para ${name}` }],
            ({ name }) => [{ t: "text", v: `Telefone — ${name}` }],
            ({ name }) => [{ t: "text", v: "Ligar e tirar dúvidas" }],
            ({ name }) => [{ t: "text", v: "Falar por telefone" }],
            ({ name }) => [{ t: "text", v: `Atendimento por telefone — ${name}` }],
        ],
    },
}
