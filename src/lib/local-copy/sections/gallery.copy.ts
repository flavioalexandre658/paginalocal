// lib/local-seo/sections/gallery.copy.ts
import type { ModeCopy, StoreMode } from "../types"

/**
 * GallerySection:
 * SEO + emocional (conexão, autoridade, retenção) + semântica.
 *
 * Regra: mínimo 5 variações por key, em DEFAULT e em TODOS os MODES.
 */
export const GALLERY_DEFAULT: ModeCopy = {
    // ===============================
    // gallery.kicker (5)
    // ===============================
    "gallery.kicker": [
        ({ city }) => [{ t: "text", v: `Fotos reais em ${city}` }],
        ({ city }) => [{ t: "text", v: `Galeria da unidade em ${city}` }],
        ({ city }) => [{ t: "text", v: `Veja por dentro em ${city}` }],
        ({ city }) => [{ t: "text", v: `Estrutura e atendimento em ${city}` }],
        ({ city }) => [{ t: "text", v: `Ambiente e detalhes em ${city}` }],
    ],

    // ===============================
    // gallery.heading (5)
    // ===============================
    "gallery.heading": [
        ({ name }) => [
            { t: "normal", v: "Conheça a " },
            { t: "strong", v: name },
            { t: "normal", v: " por fotos" },
        ],
        ({ name, city }) => [
            { t: "normal", v: "Veja a " },
            { t: "strong", v: name },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
        ],
        ({ name }) => [
            { t: "normal", v: "Galeria de fotos da " },
            { t: "strong", v: name },
        ],
        ({ name, city }) => [
            { t: "normal", v: "Por dentro da " },
            { t: "strong", v: name },
            { t: "normal", v: " — " },
            { t: "primary", v: city },
        ],
        ({ name }) => [
            { t: "normal", v: "Estrutura e atendimento — " },
            { t: "strong", v: name },
        ],
    ],

    // ===============================
    // gallery.intro (5)
    // ===============================
    "gallery.intro": [
        ({ name, city, category, servicesCount }) => [
            { t: "text", v: "Imagens reais ajudam você a decidir com mais confiança. " },
            { t: "strong", v: name },
            { t: "text", v: ` em ${city} mostra a estrutura, o ambiente e o cuidado no atendimento` },
            ...(category ? [{ t: "text" as const, v: ` para ${category.toLowerCase()}` }] : []),
            { t: "text", v: "." },
            ...(servicesCount ? [{ t: "text" as const, v: ` São ${servicesCount} fotos para você conhecer melhor.` }] : []),
        ],
        ({ city, category, servicesCount }) => [
            { t: "text", v: `Veja a galeria em ${city} e entenda o padrão do atendimento. ` },
            { t: "text", v: category ? `Fotos do espaço, equipe e detalhes de ${category.toLowerCase()}. ` : "Fotos do espaço, equipe e detalhes importantes. " },
            ...(servicesCount ? [{ t: "text" as const, v: `${servicesCount} imagens para tirar dúvida antes de ir.` }] : [{ t: "text" as const, v: "Isso evita surpresa e economiza seu tempo." }]),
        ],
        ({ name, city }) => [
            { t: "text", v: "Se você gosta de ver antes de ir, aqui é o lugar. " },
            { t: "strong", v: name },
            { t: "text", v: ` em ${city} aparece como é de verdade: ambiente, estrutura e atendimento.` },
        ],
        ({ city, category }) => [
            { t: "text", v: `Fotos reais em ${city} para você sentir o ambiente. ` },
            { t: "text", v: category ? `A galeria mostra o que você encontra ao buscar ${category.toLowerCase()}: organização, estrutura e cuidado.` : "A galeria mostra organização, estrutura e cuidado." },
        ],
        ({ name, city, category, servicesCount }) => [
            { t: "text", v: "Prova visual vale mais do que promessa. " },
            { t: "strong", v: name },
            { t: "text", v: ` em ${city} compartilha imagens do dia a dia` },
            ...(category ? [{ t: "text" as const, v: ` em ${category.toLowerCase()}` }] : []),
            { t: "text", v: " para você chegar com segurança." },
            ...(servicesCount ? [{ t: "text" as const, v: ` (${servicesCount} fotos)` }] : []),
        ],
    ],
}

/**
 * TODOS os MODES com TODAS as keys e 5 variações por key.
 */
export const GALLERY_BY_MODE: Record<StoreMode, ModeCopy> = {
    LOCAL_BUSINESS: GALLERY_DEFAULT,

    PRODUCT_CATALOG: {
        "gallery.kicker": [
            ({ city }) => [{ t: "text", v: `Fotos do espaço e produtos em ${city}` }],
            ({ city }) => [{ t: "text", v: `Galeria do catálogo em ${city}` }],
            ({ city }) => [{ t: "text", v: `Veja detalhes antes de comprar em ${city}` }],
            ({ city }) => [{ t: "text", v: `Estrutura e itens disponíveis em ${city}` }],
            ({ city }) => [{ t: "text", v: `Ambiente, vitrine e estoque em ${city}` }],
        ],
        "gallery.heading": [
            ({ name }) => [
                { t: "normal", v: "Conheça o catálogo da " },
                { t: "strong", v: name },
                { t: "normal", v: " por fotos" },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Veja produtos e estrutura — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ name }) => [
                { t: "normal", v: "Galeria de produtos e ambiente — " },
                { t: "strong", v: name },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Vitrine e detalhes da " },
                { t: "strong", v: name },
                { t: "normal", v: " — " },
                { t: "primary", v: city },
            ],
            ({ name }) => [
                { t: "normal", v: "Fotos reais para comprar com confiança — " },
                { t: "strong", v: name },
            ],
        ],
        "gallery.intro": [
            ({ name, city, category, servicesCount }) => [
                { t: "text", v: "Escolher bem começa vendo o que é real. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} mostra fotos do espaço e dos itens` },
                ...(category ? [{ t: "text" as const, v: ` de ${category.toLowerCase()}` }] : []),
                { t: "text", v: " para você comprar com mais segurança." },
                ...(servicesCount ? [{ t: "text" as const, v: ` (${servicesCount} fotos)` }] : []),
            ],
            ({ city, category, servicesCount }) => [
                { t: "text", v: `Veja a galeria em ${city} e entenda o padrão de organização e atendimento. ` },
                { t: "text", v: category ? `Fotos de ${category.toLowerCase()} e do ambiente para você decidir melhor. ` : "Fotos do ambiente para você decidir melhor. " },
                ...(servicesCount ? [{ t: "text" as const, v: `${servicesCount} imagens para tirar dúvidas antes de comprar.` }] : []),
            ],
            ({ name, city }) => [
                { t: "text", v: "Sem surpresa: você vê antes e decide melhor. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} mostra fotos reais para você escolher com tranquilidade.` },
            ],
            ({ city, category }) => [
                { t: "text", v: `Fotos reais em ${city} para você avaliar detalhes. ` },
                { t: "text", v: category ? `Veja itens de ${category.toLowerCase()}, ambiente e organização.` : "Veja ambiente e organização." },
            ],
            ({ name, city, category }) => [
                { t: "text", v: "Confiança se constrói no detalhe. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} mostra a vitrine e o ambiente` },
                ...(category ? [{ t: "text" as const, v: ` de ${category.toLowerCase()}` }] : []),
                { t: "text", v: " para você decidir sem pressa." },
            ],
        ],
    },

    SERVICE_PRICING: {
        "gallery.kicker": [
            ({ city }) => [{ t: "text", v: `Fotos do atendimento em ${city}` }],
            ({ city }) => [{ t: "text", v: `Estrutura e serviço em ${city}` }],
            ({ city }) => [{ t: "text", v: `Veja como é na prática em ${city}` }],
            ({ city }) => [{ t: "text", v: `Ambiente e padrão de qualidade em ${city}` }],
            ({ city }) => [{ t: "text", v: `Antes de pedir orçamento, veja em ${city}` }],
        ],
        "gallery.heading": [
            ({ name, city }) => [
                { t: "normal", v: "Veja a estrutura antes do orçamento — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ name }) => [
                { t: "normal", v: "Fotos reais do atendimento — " },
                { t: "strong", v: name },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Por dentro do serviço em " },
                { t: "primary", v: city },
                { t: "normal", v: " — " },
                { t: "strong", v: name },
            ],
            ({ name }) => [
                { t: "normal", v: "Estrutura e confiança em imagens — " },
                { t: "strong", v: name },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Conheça antes de decidir — " },
                { t: "strong", v: name },
                { t: "normal", v: " (" },
                { t: "text", v: city },
                { t: "normal", v: ")" },
            ],
        ],
        "gallery.intro": [
            ({ name, city, category, servicesCount }) => [
                { t: "text", v: "Quando você vê, decide melhor. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} mostra estrutura e atendimento` },
                ...(category ? [{ t: "text" as const, v: ` para ${category.toLowerCase()}` }] : []),
                { t: "text", v: " com transparência." },
                ...(servicesCount ? [{ t: "text" as const, v: ` (${servicesCount} fotos)` }] : []),
            ],
            ({ city, servicesCount }) => [
                { t: "text", v: `Fotos reais em ${city} para você entender o padrão do serviço. ` },
                ...(servicesCount ? [{ t: "text" as const, v: `${servicesCount} imagens que ajudam a alinhar expectativa antes do orçamento.` }] : [{ t: "text" as const, v: "Isso ajuda a alinhar expectativa antes do orçamento." }]),
            ],
            ({ name }) => [
                { t: "text", v: "Transparência é parte do atendimento. " },
                { t: "strong", v: name },
                { t: "text", v: " mostra imagens reais para você chegar com mais segurança." },
            ],
            ({ city, category }) => [
                { t: "text", v: `Em ${city}, veja fotos do ambiente e do atendimento. ` },
                { t: "text", v: category ? `Para ${category.toLowerCase()}, a estrutura faz diferença — e você consegue ver isso aqui.` : "A estrutura faz diferença — e você consegue ver isso aqui." },
            ],
            ({ name, city }) => [
                { t: "text", v: "Menos dúvida, mais clareza. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} mostra como é na prática.` },
            ],
        ],
    },

    HYBRID: {
        "gallery.kicker": [
            ({ city }) => [{ t: "text", v: `Fotos do serviço e catálogo em ${city}` }],
            ({ city }) => [{ t: "text", v: `Galeria completa em ${city}` }],
            ({ city }) => [{ t: "text", v: `Veja por dentro: atendimento + opções em ${city}` }],
            ({ city }) => [{ t: "text", v: `Estrutura, atendimento e itens em ${city}` }],
            ({ city }) => [{ t: "text", v: `Tudo em imagens reais em ${city}` }],
        ],
        "gallery.heading": [
            ({ name }) => [
                { t: "normal", v: "Conheça a " },
                { t: "strong", v: name },
                { t: "normal", v: " por dentro" },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Atendimento e opções — " },
                { t: "strong", v: name },
                { t: "normal", v: " em " },
                { t: "primary", v: city },
            ],
            ({ name }) => [
                { t: "normal", v: "Galeria completa da " },
                { t: "strong", v: name },
            ],
            ({ name, city }) => [
                { t: "normal", v: "Por dentro da " },
                { t: "strong", v: name },
                { t: "normal", v: " — " },
                { t: "primary", v: city },
            ],
            ({ name }) => [
                { t: "normal", v: "Fotos reais para decidir melhor — " },
                { t: "strong", v: name },
            ],
        ],
        "gallery.intro": [
            ({ name, city, category, servicesCount }) => [
                { t: "text", v: "Aqui você vê o que encontra na prática. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} reúne atendimento` },
                ...(category ? [{ t: "text" as const, v: ` em ${category.toLowerCase()}` }] : []),
                { t: "text", v: " e opções do catálogo para resolver mais rápido." },
                ...(servicesCount ? [{ t: "text" as const, v: ` (${servicesCount} fotos)` }] : []),
            ],
            ({ city }) => [
                { t: "text", v: `Fotos reais em ${city} para você sentir o ambiente e entender como funciona. ` },
                { t: "text", v: "Se preferir, chame no WhatsApp e a equipe orienta o melhor caminho." },
            ],
            ({ name }) => [
                { t: "text", v: "Praticidade começa com clareza. " },
                { t: "strong", v: name },
                { t: "text", v: " mostra imagens reais de atendimento e opções para você decidir sem dúvida." },
            ],
            ({ city, category, servicesCount }) => [
                { t: "text", v: `Veja a galeria em ${city}: ambiente, equipe e detalhes. ` },
                { t: "text", v: category ? `Tudo pensado para ${category.toLowerCase()} com confiança. ` : "Tudo pensado para você com confiança. " },
                ...(servicesCount ? [{ t: "text" as const, v: `${servicesCount} fotos para tirar dúvidas.` }] : []),
            ],
            ({ name, city }) => [
                { t: "text", v: "Prova visual, decisão mais tranquila. " },
                { t: "strong", v: name },
                { t: "text", v: ` em ${city} mostra como é de verdade.` },
            ],
        ],
    },
}
