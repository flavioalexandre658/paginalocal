// lib/local-seo/sections/about.copy.ts
import type { ModeCopy, StoreMode } from "../types"

/**
 * Sobre / AboutSection:
 * Textos precisam ser otimizados para SEO mas também emocional:
 * conexão, autoridade, retenção e SEO semântico.
 *
 * Aqui ficam APENAS keys do AboutSection (e blocos ligados a ele).
 */
export const ABOUT_DEFAULT: ModeCopy = {
    // ===============================
    // about.heading (5)
    // ===============================
    "about.heading": [
        ({ name, category, city, state }) => [
            { t: "normal", v: name },
            { t: "text", v: " – " },
            { t: "text", v: `${category} em ` },
            { t: "primary", v: city },
            { t: "text", v: `, ${state}` },
        ],
        ({ name, category, city, state }) => [
            { t: "text", v: `${category} em ` },
            { t: "normal", v: `${city}, ${state}` },
            { t: "text", v: " – " },
            { t: "normal", v: name },
        ],
        ({ name, category, city, state }) => [
            { t: "normal", v: name },
            { t: "text", v: " – " },
            { t: "text", v: `${category} com atendimento de qualidade ` },
            { t: "normal", v: `em ${city}, ${state}` },
        ],
        ({ name, category, city }) => [
            { t: "text", v: `Atendimento de ${category.toLowerCase()} em ${city} – ` },
            { t: "normal", v: name },
        ],
        ({ name, category, city, state }) => [
            { t: "text", v: `Conheça ${name}: ${category.toLowerCase()} em ` },
            { t: "primary", v: city },
            { t: "text", v: `, ${state}` },
        ],
    ],

    // ===============================
    // about.desc (5)
    // ===============================
    "about.desc": [
        ({ name, category, city, state }) => [
            { t: "strong", v: name },
            { t: "text", v: ` atua com ${category.toLowerCase()} em ${city}, ${state}. ` },
            { t: "text", v: "Aqui você encontra atendimento claro, compromisso e orientação do começo ao fim. " },
            { t: "primary", v: "Chame no WhatsApp" },
            { t: "text", v: " e tire suas dúvidas." },
        ],
        ({ category, city }) => [
            { t: "text", v: `Se você procura ${category.toLowerCase()} em ${city}, está no lugar certo. ` },
            { t: "text", v: "A equipe atende com atenção e foco em resolver sem enrolação. " },
            { t: "primary", v: "Fale no WhatsApp" },
            { t: "text", v: " para combinar o melhor atendimento." },
        ],
        ({ name, category, city }) => [
            { t: "strong", v: name },
            { t: "text", v: ` atende ${city} com ${category.toLowerCase()} e padrão de qualidade. ` },
            { t: "text", v: "Se você quer segurança na escolha, pode contar com a gente." },
        ],
        ({ category, city, state }) => [
            { t: "text", v: `Atendimento de ${category.toLowerCase()} em ${city}, ${state} com atenção aos detalhes e suporte rápido. ` },
            { t: "text", v: "Fale com a equipe e receba orientação personalizada." },
        ],
        ({ name, city }) => [
            { t: "text", v: `Em ${city}, o ` },
            { t: "strong", v: name },
            { t: "text", v: " é reconhecido pelo atendimento próximo e compromisso com o cliente." },
        ],
    ],
}

/**
 * Overrides por MODE: só o que difere do default global/da seção.
 * (cada key aqui tem 5 variações)
 */
export const ABOUT_BY_MODE: Partial<Record<StoreMode, ModeCopy>> = {
    LOCAL_BUSINESS: {
        "about.heading": [
            ({ name, category, city, state }) => [
                { t: "normal", v: `${name}` },
                { t: "text", v: " – " },
                { t: "text", v: `${category} de confiança ` },
                { t: "normal", v: `em ${city}, ${state}` },
            ],
            ({ name, category, city, state }) => [
                { t: "normal", v: `${name}` },
                { t: "text", v: " – " },
                { t: "text", v: `${category} em ` },
                { t: "primary", v: `${city}` },
                { t: "text", v: `, ${state}` },
            ],
            ({ name, category, city, state }) => [
                { t: "text", v: `${category} em ` },
                { t: "primary", v: `${city}` },
                { t: "text", v: `, ${state}` },
                { t: "text", v: " com atendimento excelente – " },
                { t: "normal", v: `${name}` },
            ],
            ({ name, category, city, state }) => [
                { t: "normal", v: `${name}` },
                { t: "text", v: " – " },
                { t: "text", v: `${category} ` },
                { t: "text", v: "com atendimento de qualidade " },
                { t: "normal", v: `em ${city}, ${state}` },
            ],
            ({ name, category, city, state }) => [
                { t: "text", v: `${category} em ` },
                { t: "normal", v: `${city}, ${state}` },
                { t: "text", v: " – " },
                { t: "normal", v: `${name}` },
                { t: "text", v: " para quem busca confiança" },
            ],
        ],

        "about.desc": [
            ({ name, category, city, state, servicesCount }) => [
                { t: "strong", v: name },
                { t: "text", v: ` é referência em ${category.toLowerCase()} em ${city}, ${state}. ` },
                { t: "text", v: `Atendemos clientes da região com compromisso, qualidade e atenção aos detalhes. ` },
                servicesCount
                    ? { t: "text", v: `São ${servicesCount} serviços disponíveis para resolver sua necessidade com eficiência. ` }
                    : { t: "text", v: `Nosso foco é oferecer soluções práticas e atendimento confiável. ` },
                { t: "primary", v: "Fale conosco no WhatsApp" },
                { t: "text", v: " e receba orientação personalizada." },
            ],
            ({ name, category, city, state }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atua em ${city}, ${state} oferecendo ${category.toLowerCase()} com profissionalismo e transparência. ` },
                { t: "text", v: `Nossa prioridade é entregar segurança, agilidade e um atendimento que realmente resolve. ` },
                { t: "text", v: `Se você busca ${category.toLowerCase()} em ${city}, está no lugar certo.` },
            ],
            ({ name, category, city }) => [
                { t: "text", v: `Procurando ${category.toLowerCase()} em ${city}? ` },
                { t: "strong", v: name },
                { t: "text", v: ` combina experiência, atendimento humanizado e soluções sob medida. ` },
                { t: "text", v: "Aqui você encontra suporte rápido e atendimento claro do início ao fim." },
            ],
            ({ name, category, city, state }) => [
                { t: "strong", v: name },
                { t: "text", v: ` oferece ${category.toLowerCase()} em ${city}, ${state} com padrão elevado de qualidade. ` },
                { t: "text", v: `Nosso compromisso é garantir que você seja atendido com atenção, confiança e agilidade.` },
            ],
            ({ name, category, city }) => [
                { t: "text", v: `Em ${city}, quem procura ${category.toLowerCase()} encontra no ` },
                { t: "strong", v: name },
                { t: "text", v: ` um atendimento diferenciado e focado na satisfação. ` },
                { t: "text", v: "Entre em contato e descubra a melhor solução para você." },
            ],
        ],

        "services.title": [
            ({ city }) => [{ t: "text", v: `Serviços mais procurados em ${city}` }],
            ({ category, city }) => [{ t: "text", v: `Principais serviços de ${category.toLowerCase()} em ${city}` }],
            ({ city }) => [{ t: "text", v: `O que mais atendemos em ${city}` }],
            ({ category }) => [{ t: "text", v: `Especialidades em ${category.toLowerCase()}` }],
            ({ city }) => [{ t: "text", v: `Soluções disponíveis para clientes de ${city}` }],
        ],

        "hours.hint": [
            ({ name }) => [{ t: "text", v: `Para garantir atendimento imediato, fale com ${name} no WhatsApp antes de ir.` }],
            ({ city }) => [{ t: "text", v: `Os horários podem variar em ${city}. Confirme pelo WhatsApp antes da visita.` }],
            ({ }) => [{ t: "text", v: `Quer evitar espera? Envie uma mensagem e confirme disponibilidade.` }],
            ({ name }) => [{ t: "text", v: `A equipe do ${name} responde rápido no WhatsApp para confirmar horários.` }],
            ({ }) => [{ t: "text", v: `Entre em contato antes da visita para garantir o melhor horário de atendimento.` }],
        ],

        "neigh.header": [
            ({ city }) => [{ t: "text", v: `Regiões atendidas em ${city}` }],
            ({ city }) => [{ t: "text", v: `Bairros atendidos em ${city}` }],
            ({ city }) => [{ t: "text", v: `Áreas de cobertura em ${city}` }],
            ({ city }) => [{ t: "text", v: `Atendimento em diversos bairros de ${city}` }],
            ({ city }) => [{ t: "text", v: `Cobertura local em ${city}` }],
        ],

        "neigh.intro": [
            ({ name, city, state }) => [{ t: "strong", v: name }, { t: "text", v: ` atende ${city}, ${state} e bairros próximos com rapidez e eficiência.` }],
            ({ city }) => [{ t: "text", v: `Clientes de diferentes bairros de ${city} contam com nosso atendimento ágil e confiável.` }],
            ({ city, state }) => [{ t: "text", v: `Estamos presentes em ${city}, ${state}, oferecendo atendimento local com qualidade.` }],
            ({ name, city }) => [{ t: "text", v: `Se você está em ${city}, pode contar com o ` }, { t: "strong", v: name }, { t: "text", v: ` para um atendimento rápido e profissional.` }],
            ({ city }) => [{ t: "text", v: `Confira abaixo alguns dos bairros de ${city} onde realizamos atendimento frequente.` }],
        ],

        "neigh.footer": [
            ({ city }) => [{ t: "text", v: `Seu bairro não está na lista? Fale conosco e confirme atendimento em ${city} e região.` }],
            ({ }) => [{ t: "text", v: `Entre em contato pelo WhatsApp e informe sua localização para verificar disponibilidade.` }],
            ({ city }) => [{ t: "text", v: `Atendemos outras áreas além das listadas em ${city}. Consulte a equipe.` }],
            ({ }) => [{ t: "text", v: `Basta enviar sua localização para verificarmos a melhor forma de atendimento.` }],
            ({ city }) => [{ t: "text", v: `Mesmo que seu bairro não apareça, podemos atender você em ${city}.` }],
        ],
    },

    PRODUCT_CATALOG: {
        "about.heading": [
            ({ name, category, city, state }) => [
                { t: "normal", v: name },
                { t: "text", v: " – " },
                { t: "text", v: `${category} ` },
                { t: "normal", v: `em ${city}, ${state}` },
            ],
            ({ name, category, city, state }) => [
                { t: "text", v: `Catálogo de ${category.toLowerCase()} em ` },
                { t: "primary", v: city },
                { t: "text", v: `, ${state}` },
                { t: "text", v: " – " },
                { t: "normal", v: name },
            ],
            ({ name, category, city, state }) => [
                { t: "text", v: `${category} em ` },
                { t: "primary", v: city },
                { t: "text", v: `, ${state}` },
                { t: "text", v: " com variedade e qualidade" },
            ],
            ({ name, category, city }) => [
                { t: "normal", v: name },
                { t: "text", v: " – " },
                { t: "text", v: `opções de ${category.toLowerCase()} para clientes de ${city}` },
            ],
            ({ name, category, city, state }) => [
                { t: "text", v: `Encontre ${category.toLowerCase()} em ` },
                { t: "normal", v: `${city}, ${state}` },
                { t: "text", v: " – " },
                { t: "normal", v: name },
            ],
        ],

        "about.desc": [
            ({ name, category, city, state }) => [
                { t: "strong", v: name },
                { t: "text", v: ` é ${category.toLowerCase()} em ${city}, ${state}, com variedade e atendimento próximo. ` },
                { t: "text", v: "Nosso catálogo é atualizado para você escolher com mais segurança. " },
                { t: "primary", v: "Fale no WhatsApp" },
                { t: "text", v: " e confirme disponibilidade e valores." },
            ],
            ({ name, category, city }) => [
                { t: "text", v: `Se você procura ${category.toLowerCase()} em ${city}, o ` },
                { t: "strong", v: name },
                { t: "text", v: ` oferece opções selecionadas com foco em qualidade e custo-benefício. ` },
                { t: "text", v: "Chame a equipe para tirar dúvidas ou reservar seu item." },
            ],
            ({ name, category, city, state }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atende ${city}, ${state} com um catálogo variado de ${category.toLowerCase()}. ` },
                { t: "text", v: "Trabalhamos para oferecer produtos confiáveis e atendimento transparente." },
            ],
            ({ category, city }) => [
                { t: "text", v: `Confira nosso catálogo de ${category.toLowerCase()} em ${city} e encontre a opção ideal. ` },
                { t: "text", v: "Se precisar, a equipe orienta você na escolha certa." },
            ],
            ({ name, category, city }) => [
                { t: "text", v: `Em ${city}, o ` },
                { t: "strong", v: name },
                { t: "text", v: ` se destaca pela variedade de ${category.toLowerCase()} e atendimento claro. ` },
                { t: "text", v: "Entre em contato e receba atendimento personalizado." },
            ],
        ],

        "services.title": [
            ({ city }) => [{ t: "text", v: `Produtos mais procurados em ${city}` }],
            ({ category }) => [{ t: "text", v: `Itens disponíveis em ${category.toLowerCase()}` }],
            ({ city }) => [{ t: "text", v: `Destaques do catálogo para clientes de ${city}` }],
            ({ category }) => [{ t: "text", v: `Opções em ${category.toLowerCase()}` }],
            ({ city }) => [{ t: "text", v: `Variedade de produtos em ${city}` }],
        ],

        "hours.hint": [
            ({ city }) => [{ t: "text", v: `Para retirada ou visita em ${city}, confirme o melhor horário pelo WhatsApp.` }],
            ({ }) => [{ t: "text", v: `Horários podem variar. Entre em contato antes de ir.` }],
            ({ name }) => [{ t: "text", v: `A equipe do ${name} responde rápido para confirmar disponibilidade.` }],
            ({ }) => [{ t: "text", v: `Envie uma mensagem para verificar estoque e condições atualizadas.` }],
            ({ city }) => [{ t: "text", v: `Antes de sair, confirme pelo WhatsApp a disponibilidade em ${city}.` }],
        ],

        "neigh.header": [
            ({ city }) => [{ t: "text", v: `Áreas de entrega em ${city}` }],
            ({ city }) => [{ t: "text", v: `Regiões atendidas em ${city}` }],
            ({ city }) => [{ t: "text", v: `Entrega e retirada em ${city}` }],
            ({ city }) => [{ t: "text", v: `Cobertura de atendimento em ${city}` }],
            ({ city }) => [{ t: "text", v: `Atendimento para diversos bairros de ${city}` }],
        ],

        "neigh.intro": [
            ({ name, city, state }) => [{ t: "strong", v: name }, { t: "text", v: ` realiza atendimento e entrega em ${city}, ${state} e regiões próximas.` }],
            ({ city }) => [{ t: "text", v: `Clientes de diferentes bairros de ${city} contam com nosso catálogo atualizado.` }],
            ({ city }) => [{ t: "text", v: `Oferecemos retirada e entrega em diversos bairros de ${city}.` }],
            ({ name, city }) => [{ t: "text", v: `Se você está em ${city}, pode contar com o ` }, { t: "strong", v: name }, { t: "text", v: ` para atendimento rápido e seguro.` }],
            ({ city }) => [{ t: "text", v: `Confira abaixo alguns bairros onde atendemos com maior frequência em ${city}.` }],
        ],

        "neigh.footer": [
            ({ city }) => [{ t: "text", v: `Seu bairro não está listado? Consulte atendimento em ${city} pelo WhatsApp.` }],
            ({ }) => [{ t: "text", v: `Envie sua localização e confirme possibilidade de entrega.` }],
            ({ city }) => [{ t: "text", v: `Atendemos outras regiões além das listadas em ${city}.` }],
            ({ }) => [{ t: "text", v: `Entre em contato para verificar prazos e disponibilidade.` }],
            ({ city }) => [{ t: "text", v: `Mesmo fora dos bairros listados, podemos atender você em ${city}.` }],
        ],
    },

    SERVICE_PRICING: {
        "about.heading": [
            ({ name, category, city, state }) => [
                { t: "normal", v: name },
                { t: "text", v: " – " },
                { t: "text", v: `preços e serviços de ${category.toLowerCase()} ` },
                { t: "normal", v: `em ${city}, ${state}` },
            ],
            ({ category, city, state }) => [
                { t: "text", v: `Tabela de preços de ${category.toLowerCase()} em ` },
                { t: "primary", v: city },
                { t: "text", v: `, ${state}` },
            ],
            ({ name, category, city, state }) => [
                { t: "text", v: `${category} em ` },
                { t: "primary", v: city },
                { t: "text", v: `, ${state}` },
                { t: "text", v: " – " },
                { t: "normal", v: name },
                { t: "text", v: " (valores e serviços)" },
            ],
            ({ name, category, city, state }) => [
                { t: "normal", v: name },
                { t: "text", v: " – " },
                { t: "text", v: `${category} com preços claros ` },
                { t: "normal", v: `em ${city}, ${state}` },
            ],
            ({ category, city, state }) => [
                { t: "text", v: `Serviços e valores de ${category.toLowerCase()} em ` },
                { t: "normal", v: `${city}, ${state}` },
                { t: "text", v: " – confira a tabela" },
            ],
        ],

        "about.desc": [
            ({ category, city }) => [
                { t: "text", v: `Confira a tabela de preços e serviços de ${category.toLowerCase()} em ${city}. ` },
                { t: "text", v: "Aqui você vê valores base e opções para decidir com mais segurança. " },
                { t: "primary", v: "Chame no WhatsApp" },
                { t: "text", v: " para confirmar o valor ideal para o seu caso." },
            ],
            ({ category, city }) => [
                { t: "text", v: `Transparência faz diferença: veja preços e serviços de ${category.toLowerCase()} em ${city}. ` },
                { t: "text", v: "Os valores podem variar conforme a necessidade, então vale confirmar antes. " },
                { t: "primary", v: "Fale no WhatsApp" },
                { t: "text", v: " e tire dúvidas rapidamente." },
            ],
            ({ category, city }) => [
                { t: "text", v: `Veja abaixo os serviços e preços de ${category.toLowerCase()} em ${city}. ` },
                { t: "text", v: "A equipe orienta qual opção faz mais sentido para você — sem enrolação. " },
                { t: "primary", v: "Chame no WhatsApp" },
                { t: "text", v: " e confirme detalhes." },
            ],
            ({ name, category, city }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atende ${city} com ${category.toLowerCase()} e preços claros. ` },
                { t: "text", v: "Aqui você compara opções, entende o que está incluso e escolhe com tranquilidade." },
            ],
            ({ category, city }) => [
                { t: "text", v: `Preços e serviços de ${category.toLowerCase()} em ${city} com informações objetivas e fáceis de entender. ` },
                { t: "text", v: "Se houver particularidade no atendimento, confirmamos o valor antes de você fechar." },
            ],
        ],

        "services.title": [
            ({ city }) => [{ t: "text", v: `Serviços e preços em ${city}` }],
            ({ category }) => [{ t: "text", v: `Tabela de preços de ${category.toLowerCase()}` }],
            ({ city }) => [{ t: "text", v: `Valores atualizados para ${city}` }],
            ({ category, city }) => [{ t: "text", v: `Serviços de ${category.toLowerCase()} em ${city}: preços e opções` }],
            ({ }) => [{ t: "text", v: `Lista de serviços e valores` }],
        ],

        "hours.hint": [
            ({ }) => [{ t: "text", v: `Para valores atualizados e encaixe de horário, chame no WhatsApp.` }],
            ({ }) => [{ t: "text", v: `Quer confirmar preço e disponibilidade? Envie uma mensagem no WhatsApp.` }],
            ({ }) => [{ t: "text", v: `Antes de ir, confirme no WhatsApp o melhor horário e o valor para o seu atendimento.` }],
            ({ name }) => [{ t: "text", v: `A equipe do ${name} confirma valores e horários pelo WhatsApp.` }],
            ({ }) => [{ t: "text", v: `Evite deslocamento à toa: confirme preço e horário pelo WhatsApp.` }],
        ],
    },

    HYBRID: {
        "about.heading": [
            ({ name, category, city, state }) => [
                { t: "normal", v: name },
                { t: "text", v: " – " },
                { t: "text", v: `${category} + catálogo ` },
                { t: "normal", v: `em ${city}, ${state}` },
            ],
            ({ category, city, state }) => [
                { t: "text", v: `Serviços e catálogo de ${category.toLowerCase()} em ` },
                { t: "primary", v: city },
                { t: "text", v: `, ${state}` },
            ],
            ({ name, category, city }) => [
                { t: "normal", v: name },
                { t: "text", v: " – " },
                { t: "text", v: `${category} com atendimento e opções do catálogo em ${city}` },
            ],
            ({ category, city, state }) => [
                { t: "text", v: `Tudo em um só lugar: ${category.toLowerCase()} em ` },
                { t: "primary", v: city },
                { t: "text", v: `, ${state}` },
                { t: "text", v: " – serviços e catálogo" },
            ],
            ({ name, category, city, state }) => [
                { t: "text", v: `${category} em ` },
                { t: "primary", v: city },
                { t: "text", v: `, ${state}` },
                { t: "text", v: " com serviços + catálogo – " },
                { t: "normal", v: name },
            ],
        ],

        "about.desc": [
            ({ name, category, city, state }) => [
                { t: "strong", v: name },
                { t: "text", v: ` é ${category.toLowerCase()} em ${city}, ${state}. ` },
                { t: "text", v: "Aqui você resolve com a equipe e também encontra opções no catálogo — tudo no mesmo lugar. " },
                { t: "primary", v: "Chame no WhatsApp" },
                { t: "text", v: " para confirmar disponibilidade, valores e o melhor caminho para você." },
            ],
            ({ name, category, city }) => [
                { t: "text", v: `Em ${city}, o ` },
                { t: "strong", v: name },
                { t: "text", v: ` reúne ${category.toLowerCase()} com atendimento completo e um catálogo de opções. ` },
                { t: "text", v: "Fale com a equipe e receba orientação rápida, do jeito certo." },
            ],
            ({ category, city, state }) => [
                { t: "text", v: `Procurando ${category.toLowerCase()} em ${city}, ${state}? ` },
                { t: "text", v: "Você pode escolher atendimento com a equipe ou consultar o catálogo — o que for mais rápido. " },
                { t: "primary", v: "Fale no WhatsApp" },
                { t: "text", v: " e confirme detalhes." },
            ],
            ({ name, category, city, state }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atende ${city}, ${state} com ${category.toLowerCase()} e também oferece opções no catálogo. ` },
                { t: "text", v: "Se você busca praticidade e confiança, aqui você encontra as duas coisas." },
            ],
            ({ name, category, city }) => [
                { t: "text", v: `Mais praticidade em ${city}: ` },
                { t: "strong", v: name },
                { t: "text", v: ` combina atendimento profissional com um catálogo de opções em ${category.toLowerCase()}. ` },
                { t: "text", v: "Entre em contato e a gente te direciona para a melhor escolha." },
            ],
        ],
    },
}
