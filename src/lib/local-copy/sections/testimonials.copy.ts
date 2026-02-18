// lib/local-seo/sections/testimonials.copy.ts
import type { ModeCopy, StoreMode } from "../types"

/**
 * TestimonialsSection:
 * SEO + emocional (conexão, autoridade, retenção) + semântica.
 *
 * Regra: mínimo 5 variações por key, em DEFAULT e em TODOS os MODES.
 */
export const TESTIMONIALS_DEFAULT: ModeCopy = {
    // ===============================
    // testimonials.kicker (5)
    // ===============================
    "testimonials.kicker": [
        ({ city }) => [{ t: "text", v: city ? `Avaliações em ${city}` : "Avaliações" }],
        ({ city }) => [{ t: "text", v: city ? `Opiniões de clientes em ${city}` : "Opiniões de clientes" }],
        ({ city }) => [{ t: "text", v: city ? `Experiências reais em ${city}` : "Experiências reais" }],
        ({ city }) => [{ t: "text", v: city ? `O que dizem em ${city}` : "O que dizem" }],
        ({ city }) => [{ t: "text", v: city ? `Confiança construída em ${city}` : "Confiança construída" }],
    ],

    // ===============================
    // testimonials.heading (5)
    // ===============================
    "testimonials.heading": [
        ({ name, city }) => [
            { t: "normal", v: "Avaliações sobre " },
            { t: "text", v: name || "nosso trabalho" },
            ...(city ? [{ t: "normal" as const, v: " em " }, { t: "text" as const, v: city }] : []),
        ],
        ({ name }) => [
            { t: "normal", v: "O que falam da " },
            { t: "text", v: name || "nossa equipe" },
        ],
        ({ name, city }) => [
            { t: "normal", v: "Clientes recomendam " },
            { t: "text", v: name || "a gente" },
            ...(city ? [{ t: "normal" as const, v: " em " }, { t: "text" as const, v: city }] : []),
        ],
        ({ name, city }) => [
            { t: "normal", v: "Opiniões reais sobre " },
            { t: "text", v: name || "nossos serviços" },
            ...(city ? [{ t: "normal" as const, v: " em " }, { t: "text" as const, v: city }] : []),
        ],
        ({ name }) => [
            { t: "normal", v: "Avaliações de quem já conhece " },
            { t: "text", v: name || "nosso atendimento" },
        ],
    ],

    // ===============================
    // testimonials.intro (5)
    // ===============================
    "testimonials.intro": [
        ({ name, category, city, servicesCount }) => [
            { t: "text", v: "Nada convence mais do que a experiência de quem já passou por aqui. " },
            { t: "text", v: name || "Nossa equipe" },
            ...(city ? [{ t: "text" as const, v: ` em ${city}` }] : []),
            ...(category ? [{ t: "text" as const, v: ` atua com ${category.toLowerCase()}` }] : []),
            { t: "text", v: " com atenção e responsabilidade." },
            ...(servicesCount ? [{ t: "text" as const, v: ` Veja ${servicesCount} avaliações abaixo.` }] : []),
        ],
        ({ name, city, servicesCount }) => [
            { t: "text", v: "Leia avaliações reais e entenda o que você pode esperar no atendimento. " },
            { t: "text", v: name || "Nosso trabalho" },
            ...(city ? [{ t: "text" as const, v: ` em ${city}` }] : []),
            ...(servicesCount ? [{ t: "text" as const, v: ` tem ${servicesCount} relatos para você comparar.` }] : []),
        ],
        ({ city, category }) => [
            { t: "text", v: city ? `Em ${city}, ` : "" },
            { t: "text", v: "clientes compartilham como foi a experiência: clareza, respeito e compromisso." },
            ...(category ? [{ t: "text" as const, v: ` (especialmente em ${category.toLowerCase()})` }] : []),
            { t: "text", v: "." },
        ],
        ({ name, servicesCount }) => [
            { t: "text", v: "Se você quer decidir com segurança, comece por aqui. " },
            { t: "text", v: name || "A equipe" },
            { t: "text", v: " é avaliada por quem já foi atendido." },
            ...(servicesCount ? [{ t: "text" as const, v: ` São ${servicesCount} avaliações reais.` }] : []),
        ],
        ({ name, city, category }) => [
            { t: "text", v: "Confiança se constrói no dia a dia — e os clientes percebem. " },
            { t: "text", v: name || "Nosso atendimento" },
            ...(city ? [{ t: "text" as const, v: ` em ${city}` }] : []),
            ...(category ? [{ t: "text" as const, v: ` em ${category.toLowerCase()}` }] : []),
            { t: "text", v: " aparece aqui em relatos curtos e sinceros." },
        ],
    ],

    // ===============================
    // testimonials.counter (5)
    // ctx.servicesCount = testimonials.length
    // ===============================
    "testimonials.counter": [
        ({ servicesCount }) => [{ t: "text", v: `Mostrando avaliações (${servicesCount})` }],
        ({ servicesCount }) => [{ t: "text", v: `Exibindo ${servicesCount} avaliações` }],
        ({ servicesCount }) => [{ t: "text", v: `${servicesCount} avaliações disponíveis` }],
        ({ servicesCount }) => [{ t: "text", v: `Veja mais avaliações (${servicesCount})` }],
        ({ servicesCount }) => [{ t: "text", v: `Avaliações de clientes (${servicesCount})` }],
    ],
}

/**
 * TODOS os MODES com TODAS as keys e 5 variações por key.
 */
export const TESTIMONIALS_BY_MODE: Record<StoreMode, ModeCopy> = {
    LOCAL_BUSINESS: TESTIMONIALS_DEFAULT,

    PRODUCT_CATALOG: {
        "testimonials.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Avaliações do catálogo em ${city}` : "Avaliações do catálogo" }],
            ({ city }) => [{ t: "text", v: city ? `Opiniões sobre produtos em ${city}` : "Opiniões sobre produtos" }],
            ({ city }) => [{ t: "text", v: city ? `Experiências de compra em ${city}` : "Experiências de compra" }],
            ({ city }) => [{ t: "text", v: city ? `O que dizem sobre as opções em ${city}` : "O que dizem sobre as opções" }],
            ({ city }) => [{ t: "text", v: city ? `Confiança na escolha em ${city}` : "Confiança na escolha" }],
        ],
        "testimonials.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Avaliações sobre " },
                { t: "text", v: name || "o catálogo" },
                ...(city ? [{ t: "normal" as const, v: " em " }, { t: "text" as const, v: city }] : []),
            ],
            ({ name }) => [{ t: "normal", v: "O que falam da " }, { t: "text", v: name || "nossa vitrine" }],
            ({ name, city }) => [
                { t: "normal", v: "Clientes contam como foi comprar com " },
                { t: "text", v: name || "a gente" },
                ...(city ? [{ t: "normal" as const, v: " em " }, { t: "text" as const, v: city }] : []),
            ],
            ({ name }) => [{ t: "normal", v: "Avaliações de quem já escolheu " }, { t: "text", v: name || "nossas opções" }],
            ({ name, city }) => [
                { t: "normal", v: "Opiniões reais sobre produtos e atendimento — " },
                { t: "text", v: name || "nossa equipe" },
                ...(city ? [{ t: "normal" as const, v: " em " }, { t: "text" as const, v: city }] : []),
            ],
        ],
        "testimonials.intro": [
            ({ name, city, category, servicesCount }) => [
                { t: "text", v: "Antes de escolher, vale ver o que os clientes acharam. " },
                { t: "text", v: name || "A equipe" },
                ...(city ? [{ t: "text" as const, v: ` em ${city}` }] : []),
                ...(category ? [{ t: "text" as const, v: ` ajuda você a decidir em ${category.toLowerCase()}` }] : []),
                { t: "text", v: " com orientação clara e transparência." },
                ...(servicesCount ? [{ t: "text" as const, v: ` Veja ${servicesCount} avaliações.` }] : []),
            ],
            ({ city, servicesCount }) => [
                { t: "text", v: city ? `Em ${city}, ` : "" },
                { t: "text", v: "clientes comentam sobre qualidade, atendimento e facilidade na escolha." },
                ...(servicesCount ? [{ t: "text" as const, v: ` (${servicesCount} avaliações)` }] : []),
            ],
            ({ name }) => [
                { t: "text", v: "Avaliação real ajuda a comprar sem arrependimento. " },
                { t: "text", v: name || "Nosso atendimento" },
                { t: "text", v: " aparece aqui em relatos sinceros." },
            ],
            ({ servicesCount }) => [
                { t: "text", v: "Leia os comentários e veja o padrão do atendimento. " },
                ...(servicesCount ? [{ t: "text" as const, v: `São ${servicesCount} avaliações para você comparar.` }] : []),
            ],
            ({ name, city }) => [
                { t: "text", v: "Confiança vem de consistência. " },
                { t: "text", v: name || "A equipe" },
                ...(city ? [{ t: "text" as const, v: ` em ${city}` }] : []),
                { t: "text", v: " mantém um padrão que os clientes reconhecem." },
            ],
        ],
        "testimonials.counter": [
            ({ servicesCount }) => [{ t: "text", v: `Mostrando avaliações (${servicesCount})` }],
            ({ servicesCount }) => [{ t: "text", v: `Exibindo ${servicesCount} avaliações` }],
            ({ servicesCount }) => [{ t: "text", v: `${servicesCount} avaliações disponíveis` }],
            ({ servicesCount }) => [{ t: "text", v: `Veja mais avaliações (${servicesCount})` }],
            ({ servicesCount }) => [{ t: "text", v: `Avaliações de clientes (${servicesCount})` }],
        ],
    },

    SERVICE_PRICING: {
        "testimonials.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Avaliações e confiança em ${city}` : "Avaliações e confiança" }],
            ({ city }) => [{ t: "text", v: city ? `Opiniões antes do orçamento em ${city}` : "Opiniões antes do orçamento" }],
            ({ city }) => [{ t: "text", v: city ? `O que dizem sobre custo-benefício em ${city}` : "O que dizem sobre custo-benefício" }],
            ({ city }) => [{ t: "text", v: city ? `Transparência reconhecida em ${city}` : "Transparência reconhecida" }],
            ({ city }) => [{ t: "text", v: city ? `Relatos de clientes em ${city}` : "Relatos de clientes" }],
        ],
        "testimonials.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Avaliações que ajudam a decidir — " },
                { t: "text", v: name || "nosso trabalho" },
                ...(city ? [{ t: "normal" as const, v: " em " }, { t: "text" as const, v: city }] : []),
            ],
            ({ name }) => [{ t: "normal", v: "Opiniões reais sobre " }, { t: "text", v: name || "o atendimento" }],
            ({ city }) => [
                { t: "normal", v: "Antes de pedir orçamento em " },
                { t: "text", v: city || "" },
                { t: "normal", v: ", veja avaliações" },
            ],
            ({ name }) => [{ t: "normal", v: "Clientes falam sobre transparência — " }, { t: "text", v: name || "nossa equipe" }],
            ({ name, city }) => [
                { t: "normal", v: "Relatos de confiança e clareza — " },
                { t: "text", v: name || "nosso atendimento" },
                ...(city ? [{ t: "normal" as const, v: " em " }, { t: "text" as const, v: city }] : []),
            ],
        ],
        "testimonials.intro": [
            ({ name, city, servicesCount }) => [
                { t: "text", v: "Avaliação real reduz dúvida e ajuda na decisão. " },
                { t: "text", v: name || "A equipe" },
                ...(city ? [{ t: "text" as const, v: ` em ${city}` }] : []),
                { t: "text", v: " é reconhecida por atendimento claro e respeito ao cliente." },
                ...(servicesCount ? [{ t: "text" as const, v: ` Veja ${servicesCount} avaliações.` }] : []),
            ],
            ({ city }) => [
                { t: "text", v: city ? `Em ${city}, ` : "" },
                { t: "text", v: "clientes contam se valeu a pena, como foi o atendimento e se houve transparência." },
            ],
            ({ name }) => [
                { t: "text", v: "Preço justo começa com comunicação honesta. " },
                { t: "text", v: name || "Nosso atendimento" },
                { t: "text", v: " aparece aqui em relatos curtos e sinceros." },
            ],
            ({ servicesCount }) => [
                { t: "text", v: "Leia os comentários e compare experiências. " },
                ...(servicesCount ? [{ t: "text" as const, v: ` São ${servicesCount} avaliações para você se orientar.` }] : []),
            ],
            ({ name, city }) => [
                { t: "text", v: "Quando o serviço é consistente, os clientes percebem. " },
                { t: "text", v: name || "A equipe" },
                ...(city ? [{ t: "text" as const, v: ` em ${city}` }] : []),
                { t: "text", v: " mantém um padrão que vira recomendação." },
            ],
        ],
        "testimonials.counter": [
            ({ servicesCount }) => [{ t: "text", v: `Mostrando avaliações (${servicesCount})` }],
            ({ servicesCount }) => [{ t: "text", v: `Exibindo ${servicesCount} avaliações` }],
            ({ servicesCount }) => [{ t: "text", v: `${servicesCount} avaliações disponíveis` }],
            ({ servicesCount }) => [{ t: "text", v: `Veja mais avaliações (${servicesCount})` }],
            ({ servicesCount }) => [{ t: "text", v: `Avaliações de clientes (${servicesCount})` }],
        ],
    },

    HYBRID: {
        "testimonials.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Avaliações do atendimento e opções em ${city}` : "Avaliações do atendimento e opções" }],
            ({ city }) => [{ t: "text", v: city ? `Relatos reais em ${city}` : "Relatos reais" }],
            ({ city }) => [{ t: "text", v: city ? `O que dizem sobre serviço + catálogo em ${city}` : "O que dizem sobre serviço + catálogo" }],
            ({ city }) => [{ t: "text", v: city ? `Experiências completas em ${city}` : "Experiências completas" }],
            ({ city }) => [{ t: "text", v: city ? `Confiança na prática em ${city}` : "Confiança na prática" }],
        ],
        "testimonials.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Avaliações sobre " },
                { t: "text", v: name || "nossa solução" },
                ...(city ? [{ t: "normal" as const, v: " em " }, { t: "text" as const, v: city }] : []),
            ],
            ({ name }) => [{ t: "normal", v: "O que falam do atendimento e das opções — " }, { t: "text", v: name || "nossa equipe" }],
            ({ city }) => [
                { t: "normal", v: "Clientes contam como foi resolver em " },
                { t: "text", v: city || "" },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Relatos reais — " },
                { t: "text", v: name || "nosso trabalho" },
                ...(city ? [{ t: "normal" as const, v: " em " }, { t: "text" as const, v: city }] : []),
            ],
            ({ name }) => [{ t: "normal", v: "Avaliações de quem já conhece " }, { t: "text", v: name || "a experiência" }],
        ],
        "testimonials.intro": [
            ({ name, city, category, servicesCount }) => [
                { t: "text", v: "Aqui você vê o que as pessoas sentiram na prática — atendimento e solução. " },
                { t: "text", v: name || "A equipe" },
                ...(city ? [{ t: "text" as const, v: ` em ${city}` }] : []),
                ...(category ? [{ t: "text" as const, v: ` trabalha com ${category.toLowerCase()}` }] : []),
                { t: "text", v: " com atenção e consistência." },
                ...(servicesCount ? [{ t: "text" as const, v: ` Veja ${servicesCount} avaliações.` }] : []),
            ],
            ({ city }) => [
                { t: "text", v: city ? `Em ${city}, ` : "" },
                { t: "text", v: "clientes contam sobre rapidez, clareza e como foi o suporte para escolher a melhor opção." },
            ],
            ({ name }) => [
                { t: "text", v: "Quando a experiência é boa, vira recomendação. " },
                { t: "text", v: name || "Nosso atendimento" },
                { t: "text", v: " aparece aqui em comentários reais." },
            ],
            ({ servicesCount }) => [
                { t: "text", v: "Leia os relatos e compare experiências. " },
                ...(servicesCount ? [{ t: "text" as const, v: ` São ${servicesCount} avaliações disponíveis.` }] : []),
            ],
            ({ name, city }) => [
                { t: "text", v: "Menos dúvida, mais confiança. " },
                { t: "text", v: name || "A equipe" },
                ...(city ? [{ t: "text" as const, v: ` em ${city}` }] : []),
                { t: "text", v: " mantém um padrão que os clientes reconhecem." },
            ],
        ],
        "testimonials.counter": [
            ({ servicesCount }) => [{ t: "text", v: `Mostrando avaliações (${servicesCount})` }],
            ({ servicesCount }) => [{ t: "text", v: `Exibindo ${servicesCount} avaliações` }],
            ({ servicesCount }) => [{ t: "text", v: `${servicesCount} avaliações disponíveis` }],
            ({ servicesCount }) => [{ t: "text", v: `Veja mais avaliações (${servicesCount})` }],
            ({ servicesCount }) => [{ t: "text", v: `Avaliações de clientes (${servicesCount})` }],
        ],
    },
}
