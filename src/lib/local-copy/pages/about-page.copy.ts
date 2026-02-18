import type { ModeCopy, StoreMode } from "../types"

/**
 * About Page:
 * SEO + emocional + semântico (história, confiança, compromisso, região, qualidade).
 * Evita depender de artigos (g.art / g.da) para não gerar frases erradas.
 */
export const ABOUT_PAGE_DEFAULT: ModeCopy = {
    // ===============================
    // aboutPage.kicker (5)
    // ===============================
    "aboutPage.kicker": [
        ({ city }) => [{ t: "text", v: city ? `Quem somos em ${city}` : "Quem somos" }],
        ({ city }) => [{ t: "text", v: city ? `Nossa história em ${city}` : "Nossa história" }],
        ({ city }) => [{ t: "text", v: city ? `Sobre a empresa em ${city}` : "Sobre a empresa" }],
        ({ city }) => [{ t: "text", v: city ? `Conheça a equipe em ${city}` : "Conheça a equipe" }],
        ({ city }) => [{ t: "text", v: city ? `Trabalho local em ${city}` : "Trabalho local" }],
    ],

    // ===============================
    // aboutPage.heading (5)
    // ===============================
    "aboutPage.heading": [
        ({ name, category, city }) => [
            { t: "normal", v: "Conheça " },
            { t: "text", v: name },
            { t: "normal", v: ` — ${category.toLowerCase()} em ` },
            { t: "primary", v: city },
        ],
        ({ name, city }) => [
            { t: "normal", v: "Sobre " },
            { t: "text", v: name },
            { t: "normal", v: " em " },
            { t: "primary", v: city },
        ],
        ({ name }) => [
            { t: "normal", v: "O que move " },
            { t: "text", v: name },
        ],
        ({ name, city, state }) => [
            { t: "text", v: name },
            { t: "normal", v: " — atendimento em " },
            { t: "primary", v: `${city}, ${state}` },
            { t: "normal", v: " com compromisso" },
        ],
        ({ category, city }) => [
            { t: "normal", v: `${category} em ` },
            { t: "primary", v: city },
            { t: "normal", v: " com confiança e cuidado" },
        ],
    ],

    // ===============================
    // aboutPage.intro (5)
    // ===============================
    "aboutPage.intro": [
        ({ city }) => [
            { t: "text", v: `Aqui você entende quem somos, como trabalhamos e o que priorizamos no atendimento em ${city}.` },
            { t: "text", v: " Transparência e atenção aos detalhes, do começo ao fim." },
        ],
        ({ name, category }) => [
            { t: "text", v: name },
            { t: "text", v: ` atua com ${category.toLowerCase()} com foco em resolver e orientar com clareza.` },
            { t: "text", v: " A ideia é você se sentir seguro antes, durante e depois." },
        ],
        ({ city }) => [
            { t: "text", v: `Trabalho local em ${city} com prioridade no que importa: qualidade, prazo e comunicação simples.` },
        ],
        ({ category }) => [
            { t: "text", v: `Se você procura ${category.toLowerCase()} com confiança, esta página te mostra nosso jeito de atender.` },
            { t: "text", v: " É o tipo de detalhe que evita dúvida e economiza tempo." },
        ],
        ({ name }) => [
            { t: "text", v: "Mais do que prestar um serviço, nosso objetivo é entregar tranquilidade." },
            { t: "text", v: " É isso que você encontra com " },
            { t: "text", v: name },
            { t: "text", v: "." },
        ],
    ],

    // ===============================
    // aboutPage.servicesTitle (5)
    // ===============================
    "aboutPage.servicesTitle": [
        ({ name, city }) => [{ t: "text", v: `O que ${name} oferece em ${city}` }],
        ({ category, city }) => [{ t: "text", v: `Serviços de ${category.toLowerCase()} em ${city}` }],
        ({ name }) => [{ t: "text", v: `Serviços e soluções de ${name}` }],
        ({ city }) => [{ t: "text", v: `Serviços disponíveis em ${city}` }],
        ({ name, category }) => [{ t: "text", v: `${name}: opções de ${category.toLowerCase()} para você` }],
    ],

    // ===============================
    // aboutPage.ctaTitle (5)
    // ===============================
    "aboutPage.ctaTitle": [
        ({ name, city }) => [{ t: "text", v: `Fale com ${name} em ${city}` }],
        ({ city }) => [{ t: "text", v: `Vamos te atender em ${city}` }],
        ({ name }) => [{ t: "text", v: `Pronto para falar com ${name}?` }],
        ({ name, city }) => [{ t: "text", v: `Atendimento direto — ${name} (${city})` }],
        ({ name }) => [{ t: "text", v: `Chame a equipe de ${name}` }],
    ],

    // ===============================
    // aboutPage.ctaLead (5)
    // ===============================
    "aboutPage.ctaLead": [
        ({ category, city }) => [
            { t: "text", v: `Se você precisa de ${category.toLowerCase()} em ${city}, chame no WhatsApp e explique seu caso.` },
            { t: "text", v: " A equipe orienta o melhor caminho com clareza." },
        ],
        ({ city }) => [
            { t: "text", v: `Atendimento em ${city} e região. ` },
            { t: "text", v: "Fale com a equipe e tire dúvidas antes de decidir." },
        ],
        ({ name }) => [
            { t: "text", v: name },
            { t: "text", v: " responde com atenção e transparência: você entende opções, prazos e próximos passos." },
        ],
        ({ category }) => [
            { t: "text", v: `Quer resolver ${category.toLowerCase()} sem complicação?` },
            { t: "text", v: " Mande uma mensagem e a equipe te guia." },
        ],
        ({ city }) => [
            { t: "text", v: `Para atendimento mais rápido em ${city}, o WhatsApp é o melhor caminho.` },
        ],
    ],

    // ===============================
    // aboutPage.ctaButton (5)
    // ===============================
    "aboutPage.ctaButton": [
        () => [{ t: "text", v: "Falar no WhatsApp" }],
        () => [{ t: "text", v: "Chamar no WhatsApp" }],
        () => [{ t: "text", v: "Quero atendimento agora" }],
        () => [{ t: "text", v: "Tirar dúvidas no WhatsApp" }],
        () => [{ t: "text", v: "Solicitar orientação" }],
    ],
}

/**
 * Todos os MODES precisam existir e ter >= 5 variações por key.
 */
export const ABOUT_PAGE_BY_MODE: Record<StoreMode, ModeCopy> = {
    LOCAL_BUSINESS: ABOUT_PAGE_DEFAULT,

    PRODUCT_CATALOG: {
        "aboutPage.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Sobre e catálogo em ${city}` : "Sobre e catálogo" }],
            ({ city }) => [{ t: "text", v: city ? `Quem somos — loja em ${city}` : "Quem somos — loja" }],
            ({ city }) => [{ t: "text", v: city ? `Nossa loja em ${city}` : "Nossa loja" }],
            ({ city }) => [{ t: "text", v: city ? `Produtos e atendimento em ${city}` : "Produtos e atendimento" }],
            ({ city }) => [{ t: "text", v: city ? `Conheça a loja em ${city}` : "Conheça a loja" }],
        ],
        "aboutPage.heading": [
            ({ name, city }) => [{ t: "normal", v: "Conheça a loja " }, { t: "text", v: name }, { t: "normal", v: " em " }, { t: "primary", v: city }],
            ({ name }) => [{ t: "normal", v: "Sobre a loja " }, { t: "text", v: name }],
            ({ category, city }) => [{ t: "normal", v: `Produtos de ${category.toLowerCase()} em ` }, { t: "primary", v: city }],
            ({ name }) => [{ t: "normal", v: "Atendimento e produtos — " }, { t: "text", v: name }],
            ({ name, city }) => [{ t: "text", v: name }, { t: "normal", v: " — pedidos e dúvidas em " }, { t: "primary", v: city }],
        ],
        "aboutPage.intro": [
            ({ city }) => [{ t: "text", v: `Aqui você conhece a loja, como atendemos e como é mais fácil pedir em ${city}.` }],
            ({ name }) => [{ t: "text", v: name }, { t: "text", v: " trabalha com atendimento direto: você chama, tira dúvidas e escolhe com segurança." }],
            ({ category }) => [{ t: "text", v: `Para escolher ${category.toLowerCase()} sem erro, a equipe orienta e confirma detalhes do pedido.` }],
            ({ city }) => [{ t: "text", v: `Em ${city}, é simples: WhatsApp para pedido e endereço para chegar sem confusão.` }],
            ({ name }) => [{ t: "text", v: "A ideia é você comprar com confiança — e isso começa com informação clara." }, { t: "text", v: " " }, { t: "text", v: name }, { t: "text", v: "." }],
        ],
        "aboutPage.servicesTitle": [
            ({ city }) => [{ t: "text", v: `O que você encontra na loja em ${city}` }],
            ({ name }) => [{ t: "text", v: `Categorias e destaques de ${name}` }],
            ({ category, city }) => [{ t: "text", v: `Opções de ${category.toLowerCase()} em ${city}` }],
            ({ name }) => [{ t: "text", v: `Mais procurados na ${name}` }],
            ({ city }) => [{ t: "text", v: `Produtos e opções em ${city}` }],
        ],
        "aboutPage.ctaTitle": [
            ({ city }) => [{ t: "text", v: `Peça pelo WhatsApp em ${city}` }],
            ({ name }) => [{ t: "text", v: `Fale com a loja ${name}` }],
            ({ name, city }) => [{ t: "text", v: `Atendimento para pedidos — ${name} (${city})` }],
            ({ city }) => [{ t: "text", v: `Tire dúvidas e peça em ${city}` }],
            ({ name }) => [{ t: "text", v: `Chame no WhatsApp — ${name}` }],
        ],
        "aboutPage.ctaLead": [
            ({ city }) => [{ t: "text", v: `Quer confirmar preço e disponibilidade em ${city}? Chame no WhatsApp e a equipe te ajuda.` }],
            ({ category }) => [{ t: "text", v: `Escolha ${category.toLowerCase()} com orientação rápida e atendimento direto.` }],
            ({ name }) => [{ t: "text", v: name }, { t: "text", v: " responde rápido para pedidos, dúvidas e combinações." }],
            ({ city }) => [{ t: "text", v: `WhatsApp é o caminho mais rápido em ${city}. Se preferir, visite o endereço e fale presencialmente.` }],
            ({ city }) => [{ t: "text", v: `Pedido sem complicação: mande mensagem e resolva em ${city}.` }],
        ],
        "aboutPage.ctaButton": [
            () => [{ t: "text", v: "Pedir no WhatsApp" }],
            () => [{ t: "text", v: "Quero fazer um pedido" }],
            () => [{ t: "text", v: "Consultar disponibilidade" }],
            () => [{ t: "text", v: "Falar com a loja" }],
            () => [{ t: "text", v: "Chamar agora" }],
        ],
    },

    SERVICE_PRICING: {
        "aboutPage.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Sobre e orçamento em ${city}` : "Sobre e orçamento" }],
            ({ city }) => [{ t: "text", v: city ? `Transparência e valores em ${city}` : "Transparência e valores" }],
            ({ city }) => [{ t: "text", v: city ? `Quem somos — atendimento em ${city}` : "Quem somos — atendimento" }],
            ({ city }) => [{ t: "text", v: city ? `Serviço com clareza em ${city}` : "Serviço com clareza" }],
            ({ city }) => [{ t: "text", v: city ? `Atendimento e confiança em ${city}` : "Atendimento e confiança" }],
        ],
        "aboutPage.heading": [
            ({ name, city }) => [{ t: "normal", v: "Orçamento e atendimento — " }, { t: "text", v: name }, { t: "normal", v: " em " }, { t: "primary", v: city }],
            ({ name }) => [{ t: "normal", v: "Entenda como " }, { t: "text", v: name }, { t: "normal", v: " trabalha" }],
            ({ category, city }) => [{ t: "normal", v: `Valores e serviço de ${category.toLowerCase()} em ` }, { t: "primary", v: city }],
            ({ name }) => [{ t: "normal", v: "Transparência do começo ao fim — " }, { t: "text", v: name }],
            ({ name, city }) => [{ t: "text", v: name }, { t: "normal", v: " — orçamento em " }, { t: "primary", v: city }],
        ],
        "aboutPage.intro": [
            ({ city }) => [{ t: "text", v: `Aqui você entende nosso jeito de atender em ${city}: clareza, orientação e compromisso.` }],
            ({ category }) => [{ t: "text", v: `Para ${category.toLowerCase()}, a gente acredita que o cliente precisa entender antes de fechar.` }],
            ({ name }) => [{ t: "text", v: name }, { t: "text", v: " trabalha com comunicação simples: você sabe o que será feito e por quê." }],
            ({ city }) => [{ t: "text", v: `Sem surpresa: fale com a equipe em ${city} e confirme valores de acordo com o seu caso.` }],
            ({ city }) => [{ t: "text", v: `Orçamento com foco em resolver, não em empurrar. É assim que atendemos em ${city}.` }],
        ],
        "aboutPage.servicesTitle": [
            ({ city }) => [{ t: "text", v: `Serviços e valores em ${city}` }],
            ({ name }) => [{ t: "text", v: `O que ${name} faz (com transparência)` }],
            ({ category }) => [{ t: "text", v: `Serviços de ${category.toLowerCase()} com preço claro` }],
            ({ city }) => [{ t: "text", v: `Opções de serviço em ${city}` }],
            ({ name, city }) => [{ t: "text", v: `Serviços de ${name} em ${city}` }],
        ],
        "aboutPage.ctaTitle": [
            ({ city }) => [{ t: "text", v: `Peça um orçamento em ${city}` }],
            ({ name }) => [{ t: "text", v: `Fale com ${name} e tire dúvidas` }],
            ({ name, city }) => [{ t: "text", v: `Atendimento para orçamento — ${name} (${city})` }],
            ({ city }) => [{ t: "text", v: `Confirme valores e disponibilidade em ${city}` }],
            ({ name }) => [{ t: "text", v: `Chame no WhatsApp — ${name}` }],
        ],
        "aboutPage.ctaLead": [
            ({ city }) => [{ t: "text", v: `Explique seu caso no WhatsApp e a equipe orienta o melhor caminho em ${city}.` }],
            ({ category }) => [{ t: "text", v: `Orçamento de ${category.toLowerCase()} com clareza: entenda opções e valores antes de fechar.` }],
            ({ name }) => [{ t: "text", v: name }, { t: "text", v: " responde com transparência para você decidir com segurança." }],
            ({ city }) => [{ t: "text", v: `Atendimento rápido em ${city}: mande mensagem e confirme detalhes do orçamento.` }],
            ({ city }) => [{ t: "text", v: `Se preferir, ligue. A equipe orienta e confirma o melhor valor para seu caso em ${city}.` }],
        ],
        "aboutPage.ctaButton": [
            () => [{ t: "text", v: "Pedir orçamento no WhatsApp" }],
            () => [{ t: "text", v: "Quero saber valores" }],
            () => [{ t: "text", v: "Solicitar atendimento" }],
            () => [{ t: "text", v: "Tirar dúvidas agora" }],
            () => [{ t: "text", v: "Falar com a equipe" }],
        ],
    },

    HYBRID: {
        "aboutPage.kicker": [
            ({ city }) => [{ t: "text", v: city ? `Sobre, serviços e opções em ${city}` : "Sobre, serviços e opções" }],
            ({ city }) => [{ t: "text", v: city ? `Atendimento completo em ${city}` : "Atendimento completo" }],
            ({ city }) => [{ t: "text", v: city ? `Quem somos — resolver e escolher em ${city}` : "Quem somos — resolver e escolher" }],
            ({ city }) => [{ t: "text", v: city ? `Serviço + catálogo em ${city}` : "Serviço + catálogo" }],
            ({ city }) => [{ t: "text", v: city ? `Confiança local em ${city}` : "Confiança local" }],
        ],
        "aboutPage.heading": [
            ({ name, city }) => [{ t: "normal", v: "Resolver e escolher — " }, { t: "text", v: name }, { t: "normal", v: " em " }, { t: "primary", v: city }],
            ({ name, category, city }) => [{ t: "text", v: name }, { t: "normal", v: ` — ${category.toLowerCase()} em ` }, { t: "primary", v: city }],
            ({ city }) => [{ t: "normal", v: "Atendimento completo em " }, { t: "primary", v: city }],
            ({ name }) => [{ t: "normal", v: "Sobre " }, { t: "text", v: name }, { t: "normal", v: ": atendimento e opções" }],
            ({ name, city }) => [{ t: "text", v: name }, { t: "normal", v: " — WhatsApp e localização em " }, { t: "primary", v: city }],
        ],
        "aboutPage.intro": [
            ({ city }) => [{ t: "text", v: `Aqui você conhece nossa forma de atender em ${city}: resolver com clareza e oferecer opções quando fizer sentido.` }],
            ({ name }) => [{ t: "text", v: name }, { t: "text", v: " une atendimento e alternativas: você entende, escolhe e segue com segurança." }],
            ({ category }) => [{ t: "text", v: `Em ${category.toLowerCase()}, a gente acredita em praticidade: atendimento + opções no mesmo lugar.` }],
            ({ city }) => [{ t: "text", v: `Seja para atendimento ou para escolher opções, a equipe te guia em ${city}.` }],
            ({ name }) => [{ t: "text", v: "Nosso foco é resolver sem complicar — e isso aparece no atendimento do dia a dia." }, { t: "text", v: " " }, { t: "text", v: name }, { t: "text", v: "." }],
        ],
        "aboutPage.servicesTitle": [
            ({ city }) => [{ t: "text", v: `Serviços e opções em ${city}` }],
            ({ name }) => [{ t: "text", v: `O que você encontra com ${name}` }],
            ({ category, city }) => [{ t: "text", v: `${category} em ${city}: atendimento e alternativas` }],
            ({ name, city }) => [{ t: "text", v: `Soluções de ${name} em ${city}` }],
            ({ city }) => [{ t: "text", v: `O que oferecemos em ${city}` }],
        ],
        "aboutPage.ctaTitle": [
            ({ city }) => [{ t: "text", v: `Chame no WhatsApp em ${city}` }],
            ({ name }) => [{ t: "text", v: `Fale com ${name}` }],
            ({ name, city }) => [{ t: "text", v: `Atendimento direto — ${name} (${city})` }],
            ({ city }) => [{ t: "text", v: `Resolver agora em ${city}` }],
            ({ name }) => [{ t: "text", v: `Vamos te orientar — ${name}` }],
        ],
        "aboutPage.ctaLead": [
            ({ city }) => [{ t: "text", v: `Mande uma mensagem e a equipe orienta o melhor caminho em ${city}.` }],
            ({ category }) => [{ t: "text", v: `Dúvidas sobre ${category.toLowerCase()}? A equipe ajuda você a entender e escolher.` }],
            ({ name }) => [{ t: "text", v: name }, { t: "text", v: " responde com clareza, do primeiro contato ao pós-atendimento." }],
            ({ city }) => [{ t: "text", v: `Atendimento em ${city} e região — WhatsApp é o caminho mais rápido.` }],
            ({ city }) => [{ t: "text", v: `Se preferir, visite o endereço: a equipe atende presencialmente em ${city}.` }],
        ],
        "aboutPage.ctaButton": [
            () => [{ t: "text", v: "Falar no WhatsApp" }],
            () => [{ t: "text", v: "Chamar a equipe" }],
            () => [{ t: "text", v: "Quero orientação" }],
            () => [{ t: "text", v: "Tirar dúvidas" }],
            () => [{ t: "text", v: "Atendimento agora" }],
        ],
    },
}
