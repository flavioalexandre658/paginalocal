// lib/local-copy/sections/contact.copy.ts
import type { ModeCopy, StoreMode } from "../types"

/**
 * ContactSection:
 * SEO + emocional (conexão, autoridade, retenção) + semântica.
 *
 * Regra: mínimo 5 variações por key, em DEFAULT e em TODOS os MODES.
 */
export const CONTACT_DEFAULT: ModeCopy = {
    // ===============================
    // contact.kicker (5)
    // ===============================
    "contact.kicker": [
        ({ city }) => [{ t: "text", v: `Contato e localização em ${city}` }],
        ({ city }) => [{ t: "text", v: `Endereço e atendimento em ${city}` }],
        ({ city }) => [{ t: "text", v: `Como chegar e falar conosco em ${city}` }],
        ({ city }) => [{ t: "text", v: `Telefone, endereço e horários em ${city}` }],
        ({ city }) => [{ t: "text", v: `Localização da unidade em ${city}` }],
    ],

    // ===============================
    // contact.heading (5)
    // ===============================
    "contact.heading": [
        ({ name, city }) => [
            { t: "normal", v: "Como chegar na " },
            { t: "text", v: name },
            { t: "normal", v: " em " },
            { t: "text", v: city },
        ],
        ({ name, city, state }) => [
            { t: "normal", v: "Encontre a " },
            { t: "text", v: name },
            { t: "normal", v: " em " },
            { t: "text", v: city },
            { t: "text", v: `, ${state}` },
        ],
        ({ name, category, city }) => [
            { t: "normal", v: `${category} em ` },
            { t: "text", v: city },
            { t: "normal", v: " — localização da " },
            { t: "text", v: name },
        ],
        ({ name, city }) => [
            { t: "normal", v: "Rota rápida até a " },
            { t: "text", v: name },
            { t: "normal", v: " em " },
            { t: "text", v: city },
        ],
        ({ name, city, state }) => [
            { t: "normal", v: "Visite a " },
            { t: "text", v: name },
            { t: "normal", v: " em " },
            { t: "text", v: city },
            { t: "text", v: `, ${state}` },
        ],
    ],

    // ===============================
    // contact.intro (5)
    // ===============================
    "contact.intro": [
        ({ name, category, city, state }) => [
            { t: "text", v: name },
            { t: "text", v: ` é ${category.toLowerCase()} em ${city}, ${state}. ` },
            { t: "text", v: "Confira endereço, telefone e horários para vir com tranquilidade." },
        ],
        ({ city, category }) => [
            { t: "text", v: `Procurando ${category.toLowerCase()} em ${city}? ` },
            { t: "text", v: "Aqui você vê localização, contato e horário de funcionamento em um só lugar." },
        ],
        ({ name, city }) => [
            { t: "text", v: "Chegar até a " },
            { t: "text", v: name },
            { t: "text", v: ` em ${city} é simples. ` },
            { t: "text", v: "Abra o mapa e venha com segurança." },
        ],
        ({ name, city, state }) => [
            { t: "text", v: `Em ${city}, ${state}, a ` },
            { t: "text", v: name },
            { t: "text", v: " atende com atenção e clareza. " },
            { t: "text", v: "Veja endereço, telefone e horários antes de sair." },
        ],
        ({ name, category, city }) => [
            { t: "text", v: "Atendimento local com confiança: " },
            { t: "text", v: name },
            { t: "text", v: ` trabalha com ${category.toLowerCase()} em ${city}. ` },
            { t: "text", v: "Se preferir, ligue e tire dúvidas rapidinho." },
        ],
    ],

    // ===============================
    // contact.mapCta (5)
    // ===============================
    "contact.mapCta": [
        () => [{ t: "text", v: "Ver no Google Maps" }],
        () => [{ t: "text", v: "Abrir rota no Google Maps" }],
        () => [{ t: "text", v: "Traçar rota no Google Maps" }],
        () => [{ t: "text", v: "Ver localização no Google Maps" }],
        () => [{ t: "text", v: "Como chegar (Google Maps)" }],
    ],

    // ===============================
    // contact.noMapCta (5)
    // ===============================
    "contact.noMapCta": [
        () => [{ t: "text", v: "Ver no Google Maps" }],
        () => [{ t: "text", v: "Abrir localização no Google Maps" }],
        () => [{ t: "text", v: "Ver rota no Google Maps" }],
        () => [{ t: "text", v: "Traçar rota no Google Maps" }],
        () => [{ t: "text", v: "Conferir no Google Maps" }],
    ],

    // ===============================
    // contact.addressTitle (5)
    // ===============================
    "contact.addressTitle": [
        () => [{ t: "text", v: "Endereço" }],
        () => [{ t: "text", v: "Localização" }],
        () => [{ t: "text", v: "Onde estamos" }],
        () => [{ t: "text", v: "Nosso endereço" }],
        () => [{ t: "text", v: "Ponto de atendimento" }],
    ],

    // ===============================
    // contact.phoneTitle (5)
    // ===============================
    "contact.phoneTitle": [
        () => [{ t: "text", v: "Telefone" }],
        () => [{ t: "text", v: "Contato" }],
        () => [{ t: "text", v: "Fale com a gente" }],
        () => [{ t: "text", v: "Atendimento" }],
        () => [{ t: "text", v: "Ligue agora" }],
    ],

    // ===============================
    // contact.hoursTitle (5)
    // ===============================
    "contact.hoursTitle": [
        () => [{ t: "text", v: "Horários" }],
        () => [{ t: "text", v: "Horário de funcionamento" }],
        () => [{ t: "text", v: "Quando atendemos" }],
        () => [{ t: "text", v: "Dias e horários" }],
        () => [{ t: "text", v: "Funcionamento" }],
    ],
}

/**
 * TODOS os MODES com TODAS as keys e 5 variações por key.
 * Assim você nunca verá warning por mode.
 */
export const CONTACT_BY_MODE: Record<StoreMode, ModeCopy> = {
    LOCAL_BUSINESS: {
        "contact.kicker": [
            ({ city }) => [{ t: "text", v: `Contato e localização em ${city}` }],
            ({ city }) => [{ t: "text", v: `Atendimento local em ${city}` }],
            ({ city }) => [{ t: "text", v: `Endereço e telefone em ${city}` }],
            ({ city }) => [{ t: "text", v: `Como chegar em ${city}` }],
            ({ city }) => [{ t: "text", v: `Visite nossa unidade em ${city}` }],
        ],
        "contact.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Como chegar na " },
                { t: "text", v: name },
                { t: "normal", v: " em " },
                { t: "text", v: city },
            ],
            ({ name, city, state }) => [
                { t: "normal", v: "Localização da " },
                { t: "text", v: name },
                { t: "normal", v: " em " },
                { t: "text", v: city },
                { t: "text", v: `, ${state}` },
            ],
            ({ name, category, city }) => [
                { t: "normal", v: `${category} em ` },
                { t: "text", v: city },
                { t: "normal", v: " — venha até a " },
                { t: "text", v: name },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Estamos em " },
                { t: "text", v: city },
                { t: "normal", v: ": como chegar na " },
                { t: "text", v: name },
            ],
            ({ name, city, state }) => [
                { t: "normal", v: "Endereço da " },
                { t: "text", v: name },
                { t: "normal", v: " em " },
                { t: "text", v: city },
                { t: "text", v: `, ${state}` },
            ],
        ],
        "contact.intro": [
            ({ name, category, city }) => [
                { t: "text", v: name },
                { t: "text", v: ` atende ${city} com ${category.toLowerCase()} e suporte de verdade. ` },
                { t: "text", v: "Confira endereço, telefone e horários para vir sem dúvida." },
            ],
            ({ city, category }) => [
                { t: "text", v: `Atendimento de ${category.toLowerCase()} em ${city}. ` },
                { t: "text", v: "Veja localização e horários — se precisar, ligue que a equipe orienta." },
            ],
            ({ name, city, state }) => [
                { t: "text", v: `Em ${city}, ${state}, a ` },
                { t: "text", v: name },
                { t: "text", v: " facilita: endereço completo, telefone e horários aqui." },
            ],
            ({ name, city }) => [
                { t: "text", v: "Antes de sair, confira a localização da " },
                { t: "text", v: name },
                { t: "text", v: ` em ${city}. ` },
                { t: "text", v: "Isso evita perda de tempo e você chega mais rápido." },
            ],
            ({ name, category, city }) => [
                { t: "text", v: "Confiança e proximidade: " },
                { t: "text", v: name },
                { t: "text", v: ` é referência em ${category.toLowerCase()} em ${city}. ` },
                { t: "text", v: "Veja como chegar e fale com a equipe." },
            ],
        ],
        "contact.mapCta": [
            () => [{ t: "text", v: "Ver no Google Maps" }],
            () => [{ t: "text", v: "Abrir rota no Google Maps" }],
            () => [{ t: "text", v: "Traçar rota no Google Maps" }],
            () => [{ t: "text", v: "Ver localização no Google Maps" }],
            () => [{ t: "text", v: "Como chegar (Google Maps)" }],
        ],
        "contact.noMapCta": [
            () => [{ t: "text", v: "Ver no Google Maps" }],
            () => [{ t: "text", v: "Abrir localização no Google Maps" }],
            () => [{ t: "text", v: "Ver rota no Google Maps" }],
            () => [{ t: "text", v: "Traçar rota no Google Maps" }],
            () => [{ t: "text", v: "Conferir no Google Maps" }],
        ],
        "contact.addressTitle": [
            () => [{ t: "text", v: "Endereço" }],
            () => [{ t: "text", v: "Localização" }],
            () => [{ t: "text", v: "Onde estamos" }],
            () => [{ t: "text", v: "Nosso endereço" }],
            () => [{ t: "text", v: "Ponto de atendimento" }],
        ],
        "contact.phoneTitle": [
            () => [{ t: "text", v: "Telefone" }],
            () => [{ t: "text", v: "Contato" }],
            () => [{ t: "text", v: "Fale com a gente" }],
            () => [{ t: "text", v: "Atendimento" }],
            () => [{ t: "text", v: "Ligue agora" }],
        ],
        "contact.hoursTitle": [
            () => [{ t: "text", v: "Horários" }],
            () => [{ t: "text", v: "Horário de funcionamento" }],
            () => [{ t: "text", v: "Quando atendemos" }],
            () => [{ t: "text", v: "Dias e horários" }],
            () => [{ t: "text", v: "Funcionamento" }],
        ],
    },

    PRODUCT_CATALOG: {
        "contact.kicker": [
            ({ city }) => [{ t: "text", v: `Retirada e contato em ${city}` }],
            ({ city }) => [{ t: "text", v: `Localização para retirada em ${city}` }],
            ({ city }) => [{ t: "text", v: `Endereço, retirada e horários em ${city}` }],
            ({ city }) => [{ t: "text", v: `Como chegar para retirar em ${city}` }],
            ({ city }) => [{ t: "text", v: `Contato e retirada na cidade de ${city}` }],
        ],
        "contact.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Onde retirar na " },
                { t: "text", v: name },
                { t: "normal", v: " em " },
                { t: "text", v: city },
            ],
            ({ name, city, state }) => [
                { t: "normal", v: "Retirada na " },
                { t: "text", v: name },
                { t: "normal", v: " em " },
                { t: "text", v: city },
                { t: "text", v: `, ${state}` },
            ],
            ({ name, category, city }) => [
                { t: "normal", v: `${category} em ` },
                { t: "text", v: city },
                { t: "normal", v: " — retirada na " },
                { t: "text", v: name },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Como chegar para retirada em " },
                { t: "text", v: city },
                { t: "normal", v: " — " },
                { t: "text", v: name },
            ],
            ({ name, city, state }) => [
                { t: "normal", v: "Localização da retirada: " },
                { t: "text", v: name },
                { t: "normal", v: " em " },
                { t: "text", v: city },
                { t: "text", v: `, ${state}` },
            ],
        ],
        "contact.intro": [
            ({ name, category, city }) => [
                { t: "text", v: name },
                { t: "text", v: ` tem ${category.toLowerCase()} em ${city}. ` },
                { t: "text", v: "Confira endereço e horários para retirada — e confirme disponibilidade pelo WhatsApp." },
            ],
            ({ city, category }) => [
                { t: "text", v: `Catálogo de ${category.toLowerCase()} em ${city}. ` },
                { t: "text", v: "Veja onde retirar, horários e contato para reservar certinho." },
            ],
            ({ name, city, state }) => [
                { t: "text", v: `Em ${city}, ${state}, ` },
                { t: "text", v: name },
                { t: "text", v: " facilita sua retirada: endereço claro e horários bem definidos." },
            ],
            ({ name, city }) => [
                { t: "text", v: "Vai retirar hoje? " },
                { t: "text", v: name },
                { t: "text", v: ` fica em ${city}. ` },
                { t: "text", v: "Abra o mapa e chame a equipe para confirmar antes de vir." },
            ],
            ({ name, category, city }) => [
                { t: "text", v: "Sem surpresa na retirada: " },
                { t: "text", v: name },
                { t: "text", v: ` organiza ${category.toLowerCase()} em ${city}. ` },
                { t: "text", v: "Veja localização e fale com a equipe." },
            ],
        ],
        "contact.mapCta": [
            () => [{ t: "text", v: "Ver no Google Maps" }],
            () => [{ t: "text", v: "Abrir rota no Google Maps" }],
            () => [{ t: "text", v: "Traçar rota no Google Maps" }],
            () => [{ t: "text", v: "Ver localização no Google Maps" }],
            () => [{ t: "text", v: "Como chegar (Google Maps)" }],
        ],
        "contact.noMapCta": [
            () => [{ t: "text", v: "Ver no Google Maps" }],
            () => [{ t: "text", v: "Abrir localização no Google Maps" }],
            () => [{ t: "text", v: "Ver rota no Google Maps" }],
            () => [{ t: "text", v: "Traçar rota no Google Maps" }],
            () => [{ t: "text", v: "Conferir no Google Maps" }],
        ],
        "contact.addressTitle": [
            () => [{ t: "text", v: "Endereço" }],
            () => [{ t: "text", v: "Localização" }],
            () => [{ t: "text", v: "Onde retirar" }],
            () => [{ t: "text", v: "Endereço para retirada" }],
            () => [{ t: "text", v: "Ponto de retirada" }],
        ],
        "contact.phoneTitle": [
            () => [{ t: "text", v: "Telefone" }],
            () => [{ t: "text", v: "Contato" }],
            () => [{ t: "text", v: "Fale com a equipe" }],
            () => [{ t: "text", v: "Atendimento" }],
            () => [{ t: "text", v: "Ligue para confirmar" }],
        ],
        "contact.hoursTitle": [
            () => [{ t: "text", v: "Horários" }],
            () => [{ t: "text", v: "Horário de retirada" }],
            () => [{ t: "text", v: "Funcionamento" }],
            () => [{ t: "text", v: "Dias e horários" }],
            () => [{ t: "text", v: "Atendimento" }],
        ],
    },

    SERVICE_PRICING: {
        "contact.kicker": [
            ({ city }) => [{ t: "text", v: `Contato para orçamento em ${city}` }],
            ({ city }) => [{ t: "text", v: `Endereço e orçamento em ${city}` }],
            ({ city }) => [{ t: "text", v: `Fale com a equipe em ${city}` }],
            ({ city }) => [{ t: "text", v: `Orçamento e atendimento em ${city}` }],
            ({ city }) => [{ t: "text", v: `Localização e contato em ${city}` }],
        ],
        "contact.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Contato e endereço da " },
                { t: "text", v: name },
                { t: "normal", v: " em " },
                { t: "text", v: city },
            ],
            ({ name, city, state }) => [
                { t: "normal", v: "Orçamento em " },
                { t: "text", v: city },
                { t: "normal", v: ": fale com a " },
                { t: "text", v: name },
                { t: "normal", v: ` — ${state}` },
            ],
            ({ name, category, city }) => [
                { t: "normal", v: `${category} em ` },
                { t: "text", v: city },
                { t: "normal", v: " — fale com a " },
                { t: "text", v: name },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Como falar com a " },
                { t: "text", v: name },
                { t: "normal", v: " em " },
                { t: "text", v: city },
            ],
            ({ name, city, state }) => [
                { t: "normal", v: "Endereço para atendimento em " },
                { t: "text", v: city },
                { t: "text", v: `, ${state}` },
                { t: "normal", v: " — " },
                { t: "text", v: name },
            ],
        ],
        "contact.intro": [
            ({ name, category, city }) => [
                { t: "text", v: name },
                { t: "text", v: ` faz ${category.toLowerCase()} em ${city} com transparência. ` },
                { t: "text", v: "Veja endereço e horários — e chame para confirmar orçamento." },
            ],
            ({ city, category }) => [
                { t: "text", v: `Precisa de ${category.toLowerCase()} em ${city}? ` },
                { t: "text", v: "Confira localização, contato e horários para alinhar valor e disponibilidade." },
            ],
            ({ name, city, state }) => [
                { t: "text", v: `Em ${city}, ${state}, ` },
                { t: "text", v: name },
                { t: "text", v: " orienta com clareza: você entende o caminho, o prazo e o melhor atendimento." },
            ],
            ({ name, city }) => [
                { t: "text", v: "Evite deslocamento à toa: fale com a " },
                { t: "text", v: name },
                { t: "text", v: ` em ${city} ` },
                { t: "text", v: "e confirme horários e orçamento antes de vir." },
            ],
            ({ name, category, city }) => [
                { t: "text", v: "Atendimento que passa segurança: " },
                { t: "text", v: name },
                { t: "text", v: ` é ${category.toLowerCase()} em ${city}. ` },
                { t: "text", v: "Veja como chegar e fale com a equipe." },
            ],
        ],
        "contact.mapCta": [
            () => [{ t: "text", v: "Ver no Google Maps" }],
            () => [{ t: "text", v: "Abrir rota no Google Maps" }],
            () => [{ t: "text", v: "Traçar rota no Google Maps" }],
            () => [{ t: "text", v: "Ver localização no Google Maps" }],
            () => [{ t: "text", v: "Como chegar (Google Maps)" }],
        ],
        "contact.noMapCta": [
            () => [{ t: "text", v: "Ver no Google Maps" }],
            () => [{ t: "text", v: "Abrir localização no Google Maps" }],
            () => [{ t: "text", v: "Ver rota no Google Maps" }],
            () => [{ t: "text", v: "Traçar rota no Google Maps" }],
            () => [{ t: "text", v: "Conferir no Google Maps" }],
        ],
        "contact.addressTitle": [
            () => [{ t: "text", v: "Endereço" }],
            () => [{ t: "text", v: "Localização" }],
            () => [{ t: "text", v: "Onde estamos" }],
            () => [{ t: "text", v: "Endereço para atendimento" }],
            () => [{ t: "text", v: "Ponto de atendimento" }],
        ],
        "contact.phoneTitle": [
            () => [{ t: "text", v: "Telefone" }],
            () => [{ t: "text", v: "Contato" }],
            () => [{ t: "text", v: "Fale com a gente" }],
            () => [{ t: "text", v: "Atendimento" }],
            () => [{ t: "text", v: "Ligue para orçamento" }],
        ],
        "contact.hoursTitle": [
            () => [{ t: "text", v: "Horários" }],
            () => [{ t: "text", v: "Horário de funcionamento" }],
            () => [{ t: "text", v: "Quando atendemos" }],
            () => [{ t: "text", v: "Dias e horários" }],
            () => [{ t: "text", v: "Funcionamento" }],
        ],
    },

    HYBRID: {
        "contact.kicker": [
            ({ city }) => [{ t: "text", v: `Contato, atendimento e retirada em ${city}` }],
            ({ city }) => [{ t: "text", v: `Endereço, horários e contato em ${city}` }],
            ({ city }) => [{ t: "text", v: `Como chegar e resolver em ${city}` }],
            ({ city }) => [{ t: "text", v: `Atendimento + catálogo em ${city}` }],
            ({ city }) => [{ t: "text", v: `Localização e suporte em ${city}` }],
        ],
        "contact.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Como chegar na " },
                { t: "text", v: name },
                { t: "normal", v: " em " },
                { t: "text", v: city },
            ],
            ({ name, city, state }) => [
                { t: "normal", v: "Encontre a " },
                { t: "text", v: name },
                { t: "normal", v: " em " },
                { t: "text", v: city },
                { t: "text", v: `, ${state}` },
            ],
            ({ name, category, city }) => [
                { t: "normal", v: `${category} em ` },
                { t: "text", v: city },
                { t: "normal", v: " — atendimento e opções na " },
                { t: "text", v: name },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Rota até a " },
                { t: "text", v: name },
                { t: "normal", v: " em " },
                { t: "text", v: city },
            ],
            ({ name, city, state }) => [
                { t: "normal", v: "Visite a " },
                { t: "text", v: name },
                { t: "normal", v: " em " },
                { t: "text", v: city },
                { t: "text", v: `, ${state}` },
            ],
        ],
        "contact.intro": [
            ({ name, category, city }) => [
                { t: "text", v: name },
                { t: "text", v: ` atua com ${category.toLowerCase()} em ${city} ` },
                { t: "text", v: "e também oferece opções do catálogo. Confira endereço, telefone e horários." },
            ],
            ({ city, category }) => [
                { t: "text", v: `Em ${city}, ${category.toLowerCase()} com atendimento e catálogo. ` },
                { t: "text", v: "Veja localização e horários para resolver do jeito mais rápido." },
            ],
            ({ name, city, state }) => [
                { t: "text", v: `Em ${city}, ${state}, a ` },
                { t: "text", v: name },
                { t: "text", v: " facilita: você escolhe, combina e resolve com orientação clara." },
            ],
            ({ name, city }) => [
                { t: "text", v: "Praticidade em um só lugar: " },
                { t: "text", v: name },
                { t: "text", v: ` em ${city}. ` },
                { t: "text", v: "Abra o mapa e fale com a equipe para alinhar o melhor caminho." },
            ],
            ({ name, category, city }) => [
                { t: "text", v: "Para " },
                { t: "text", v: category.toLowerCase() },
                { t: "text", v: ` em ${city}, a ` },
                { t: "text", v: name },
                { t: "text", v: " deixa tudo claro: endereço, contato e horários." },
            ],
        ],
        "contact.mapCta": [
            () => [{ t: "text", v: "Ver no Google Maps" }],
            () => [{ t: "text", v: "Abrir rota no Google Maps" }],
            () => [{ t: "text", v: "Traçar rota no Google Maps" }],
            () => [{ t: "text", v: "Ver localização no Google Maps" }],
            () => [{ t: "text", v: "Como chegar (Google Maps)" }],
        ],
        "contact.noMapCta": [
            () => [{ t: "text", v: "Ver no Google Maps" }],
            () => [{ t: "text", v: "Abrir localização no Google Maps" }],
            () => [{ t: "text", v: "Ver rota no Google Maps" }],
            () => [{ t: "text", v: "Traçar rota no Google Maps" }],
            () => [{ t: "text", v: "Conferir no Google Maps" }],
        ],
        "contact.addressTitle": [
            () => [{ t: "text", v: "Endereço" }],
            () => [{ t: "text", v: "Localização" }],
            () => [{ t: "text", v: "Onde estamos" }],
            () => [{ t: "text", v: "Ponto de atendimento" }],
            () => [{ t: "text", v: "Ponto de retirada/atendimento" }],
        ],
        "contact.phoneTitle": [
            () => [{ t: "text", v: "Telefone" }],
            () => [{ t: "text", v: "Contato" }],
            () => [{ t: "text", v: "Fale com a gente" }],
            () => [{ t: "text", v: "Atendimento" }],
            () => [{ t: "text", v: "Ligue agora" }],
        ],
        "contact.hoursTitle": [
            () => [{ t: "text", v: "Horários" }],
            () => [{ t: "text", v: "Horário de funcionamento" }],
            () => [{ t: "text", v: "Quando atendemos" }],
            () => [{ t: "text", v: "Dias e horários" }],
            () => [{ t: "text", v: "Funcionamento" }],
        ],
    },
}
