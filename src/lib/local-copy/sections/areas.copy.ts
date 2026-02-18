// lib/local-seo/sections/areas.copy.ts
import type { ModeCopy, StoreMode } from "../types"

/**
 * AreasSection:
 * Textos precisam ser otimizados para SEO mas também emocional:
 * conexão, autoridade, retenção e SEO semântico.
 *
 * Observação: se algum MODE não tiver override, cai no DEFAULT_COPY global.
 */
export const AREAS_DEFAULT: ModeCopy = {
    // ===============================
    // areas.kicker (5)
    // ===============================
    "areas.kicker": [
        ({ city }) => [{ t: "text", v: `Áreas de atendimento em ${city}` }],
        ({ city }) => [{ t: "text", v: `Cobertura local em ${city}` }],
        ({ city }) => [{ t: "text", v: `Onde atendemos em ${city}` }],
        ({ city }) => [{ t: "text", v: `Bairros com atendimento em ${city}` }],
        ({ city }) => [{ t: "text", v: `Atendimento e cobertura em ${city}` }],
    ],

    // ===============================
    // areas.heading (5)
    // ===============================
    "areas.heading": [
        ({ category, city, state }) => [
            { t: "normal", v: `Bairros e regiões atendidas por ${category.toLowerCase()} em ` },
            { t: "text", v: city },
            { t: "text", v: `, ${state}` },
        ],
        ({ category, city, state }) => [
            { t: "normal", v: `Atendimento de ${category.toLowerCase()} em ` },
            { t: "text", v: city },
            { t: "text", v: `, ${state}` },
            { t: "normal", v: ": veja os bairros" },
        ],
        ({ category, city, state }) => [
            { t: "normal", v: `Cobertura de ${category.toLowerCase()} em ` },
            { t: "primary", v: city },
            { t: "primary", v: `, ${state}` },
            { t: "text", v: " e região" },
        ],
        ({ category, city, state }) => [
            { t: "normal", v: `${category} em ` },
            { t: "text", v: city },
            { t: "text", v: `, ${state}` },
            { t: "normal", v: " — bairros atendidos" },
        ],
        ({ category, city, state }) => [
            { t: "normal", v: `Regiões atendidas para ${category.toLowerCase()} em ` },
            { t: "primary", v: city },
            { t: "primary", v: `, ${state}` },
        ],
    ],

    // ===============================
    // areas.intro (5)
    // ===============================
    "areas.intro": [
        ({ name, city, category }) => [
            { t: "strong", v: name },
            { t: "text", v: ` atende diversos bairros de ${city} com ${category.toLowerCase()} e suporte de verdade. ` },
            { t: "text", v: "Confira abaixo as regiões onde atuamos com mais frequência." },
        ],
        ({ city, category }) => [
            { t: "text", v: `Atendemos diferentes bairros de ${city} com ${category.toLowerCase()} e orientação clara. ` },
            { t: "text", v: "Veja as regiões e confirme disponibilidade no WhatsApp." },
        ],
        ({ name, city, state, category }) => [
            { t: "text", v: `Em ${city}, ${state}, o ` },
            { t: "strong", v: name },
            { t: "text", v: ` atende com ${category.toLowerCase()} e foco em resolver rápido. ` },
            { t: "text", v: "Confira as áreas abaixo e chame a equipe se precisar." },
        ],
        ({ name, city, category }) => [
            { t: "text", v: `Se você está em ${city}, pode contar com o ` },
            { t: "strong", v: name },
            { t: "text", v: ` para ${category.toLowerCase()} com praticidade e confiança. ` },
            { t: "primary", v: "Fale no WhatsApp" },
            { t: "text", v: " e confirme a melhor opção." },
        ],
        ({ city }) => [
            { t: "text", v: `A seguir, alguns bairros de ${city} onde o atendimento é mais frequente. ` },
            { t: "text", v: "Se não achou o seu, envie sua localização e confirmamos." },
        ],
    ],

    // ===============================
    // areas.heroTitle (5)
    // ===============================
    "areas.heroTitle": [
        ({ category, city }) => [{ t: "text", v: `${category} em ${city}` }],
        ({ category, city }) => [{ t: "text", v: `${category} para ${city} e região` }],
        ({ category, city }) => [{ t: "text", v: `Atendimento de ${category.toLowerCase()} em ${city}` }],
        ({ city }) => [{ t: "text", v: `Atendimento local em ${city}` }],
        ({ category, city }) => [{ t: "text", v: `Serviços de ${category.toLowerCase()} em ${city}` }],
    ],

    // ===============================
    // areas.heroDesc (5)
    // ===============================
    "areas.heroDesc": [
        ({ name, category, city, state }) => [
            { t: "strong", v: name },
            { t: "text", v: ` atua com ${category.toLowerCase()} em ${city}, ${state}, atendendo a região com qualidade e agilidade. ` },
            { t: "text", v: "Você fala com a equipe, tira dúvidas e resolve com segurança." },
        ],
        ({ category, city, state }) => [
            { t: "text", v: `Somos ${category.toLowerCase()} em ${city}, ${state}, com atendimento claro e foco em resolver. ` },
            { t: "text", v: "Conte com orientação rápida e compromisso do começo ao fim." },
        ],
        ({ name, city }) => [
            { t: "text", v: `Clientes de ${city} confiam no ` },
            { t: "strong", v: name },
            { t: "text", v: " pela praticidade: atendimento profissional e suporte sem enrolação." },
        ],
        ({ category, city }) => [
            { t: "text", v: `Atendimento de ${category.toLowerCase()} em ${city} com compromisso e padrão de qualidade. ` },
            { t: "text", v: "Se você busca confiança e rapidez, aqui é o caminho." },
        ],
        ({ city }) => [
            { t: "text", v: `Atendemos ${city} e região. ` },
            { t: "primary", v: "Chame no WhatsApp" },
            { t: "text", v: " e confirme disponibilidade." },
        ],
    ],

    // ===============================
    // areas.footer (5)
    // ===============================
    "areas.footer": [
        ({ city }) => [
            { t: "text", v: `Não encontrou seu bairro? Envie sua localização e confirmamos atendimento em ${city}.` },
        ],
        ({ name }) => [
            { t: "text", v: `Seu bairro não está na lista? Sem problema — a equipe pode verificar disponibilidade. ` },
            { t: "primary", v: "Fale no WhatsApp" },
            { t: "text", v: "." },
        ],
        ({ city }) => [
            { t: "text", v: `Atendemos outras áreas além das listadas em ${city}. ` },
            { t: "text", v: "Entre em contato e a gente te orienta." },
        ],
        ({ }) => [
            { t: "text", v: `Basta enviar sua localização e o que você precisa — confirmamos atendimento, prazos e disponibilidade.` },
        ],
        ({ city }) => [
            { t: "text", v: `Ficou com dúvida? Chame no WhatsApp e confirmamos atendimento na sua região em ${city}.` },
        ],
    ],
}

/**
 * Overrides por MODE: só quando o “tom / intenção” muda bastante.
 * (cada key aqui tem 5 variações)
 */
export const AREAS_BY_MODE: Partial<Record<StoreMode, ModeCopy>> = {
    LOCAL_BUSINESS: {
        "areas.kicker": [
            ({ city }) => [{ t: "text", v: `Áreas de atendimento em ${city}` }],
            ({ city }) => [{ t: "text", v: `Bairros atendidos em ${city}` }],
            ({ city }) => [{ t: "text", v: `Atendimento local em ${city}` }],
            ({ city }) => [{ t: "text", v: `Onde atendemos em ${city}` }],
            ({ city }) => [{ t: "text", v: `Cobertura e regiões atendidas em ${city}` }],
        ],
        "areas.intro": [
            ({ name, city, category }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atende diversos bairros de ${city} com ${category.toLowerCase()} de forma rápida e organizada. ` },
                { t: "text", v: "Veja abaixo as regiões onde atuamos com mais frequência." },
            ],
            ({ city, category }) => [
                { t: "text", v: `Atendemos bairros de ${city} com ${category.toLowerCase()} e suporte quando você precisa. ` },
                { t: "text", v: "Confira as regiões e chame no WhatsApp para confirmar disponibilidade." },
            ],
            ({ name, city }) => [
                { t: "text", v: `Se você está em ${city}, pode contar com o ` },
                { t: "strong", v: name },
                { t: "text", v: " para atendimento com agilidade, clareza e foco em resolver." },
            ],
            ({ city }) => [{ t: "text", v: `Abaixo você vê alguns bairros de ${city} onde o atendimento acontece com mais frequência.` }],
            ({ city }) => [{ t: "text", v: `Não viu seu bairro? Envie sua localização e confirmamos atendimento em ${city} e região.` }],
        ],
        "areas.heroDesc": [
            ({ name, category, city, state }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atua com ${category.toLowerCase()} em ${city}, ${state}, atendendo a região com qualidade e compromisso. ` },
                { t: "text", v: "A equipe orienta e resolve com agilidade." },
            ],
            ({ category, city }) => [
                { t: "text", v: `Atendimento de ${category.toLowerCase()} em ${city} com padrão de qualidade e atenção aos detalhes. ` },
                { t: "text", v: "Se você busca confiança e rapidez, aqui é o caminho." },
            ],
            ({ name, city }) => [
                { t: "text", v: `Clientes de ${city} escolhem o ` },
                { t: "strong", v: name },
                { t: "text", v: " pela transparência e por resolver sem complicação." },
            ],
            ({ category, city, state }) => [
                { t: "text", v: `${category} em ${city}, ${state} com atendimento claro e foco na sua necessidade. ` },
                { t: "primary", v: "Chame no WhatsApp" },
                { t: "text", v: " e confirme o melhor atendimento." },
            ],
            ({ city }) => [{ t: "text", v: `Atendemos ${city} e bairros próximos. Envie sua localização e confirmamos disponibilidade.` }],
        ],
        "areas.footer": [
            ({ city }) => [{ t: "text", v: `Não encontrou seu bairro? Envie sua localização e confirmamos atendimento em ${city}.` }],
            ({ }) => [{ t: "text", v: `Fale no WhatsApp e confirme disponibilidade na sua região.` }],
            ({ }) => [{ t: "text", v: `Basta mandar sua localização e a equipe confirma a melhor forma de atendimento.` }],
            ({ city }) => [{ t: "text", v: `Atendemos outras áreas além das listadas em ${city}. Consulte no WhatsApp.` }],
            ({ }) => [{ t: "text", v: `Se estiver fora da lista, é só chamar: confirmamos atendimento e prazos.` }],
        ],
    },

    PRODUCT_CATALOG: {
        "areas.kicker": [
            ({ city }) => [{ t: "text", v: `Entrega e retirada em ${city}` }],
            ({ city }) => [{ t: "text", v: `Bairros com atendimento em ${city}` }],
            ({ city }) => [{ t: "text", v: `Cobertura do catálogo em ${city}` }],
            ({ city }) => [{ t: "text", v: `Onde atendemos em ${city}` }],
            ({ city }) => [{ t: "text", v: `Regiões atendidas em ${city}` }],
        ],
        "areas.intro": [
            ({ name, city, category }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atende diversos bairros de ${city} com ${category.toLowerCase()} e opções do catálogo. ` },
                { t: "text", v: "Veja abaixo regiões de entrega/retirada e confirme disponibilidade no WhatsApp." },
            ],
            ({ city, category }) => [
                { t: "text", v: `Atendemos bairros de ${city} com ${category.toLowerCase()} e suporte para você escolher certo. ` },
                { t: "text", v: "Confira as regiões e confirme estoque/condições no WhatsApp." },
            ],
            ({ name, city }) => [
                { t: "text", v: `Se você está em ${city}, o ` },
                { t: "strong", v: name },
                { t: "text", v: " ajuda com retirada/entrega e orientação rápida sobre itens do catálogo." },
            ],
            ({ city }) => [{ t: "text", v: `Confira alguns bairros de ${city} onde a entrega/retirada é mais frequente.` }],
            ({ city }) => [{ t: "text", v: `Não achou seu bairro? Envie sua localização e verificamos entrega/retirada em ${city}.` }],
        ],
        "areas.heroDesc": [
            ({ category, city, state }) => [
                { t: "text", v: `Catálogo de ${category.toLowerCase()} em ${city}, ${state} com opções atualizadas e atendimento transparente. ` },
                { t: "text", v: "Confirme disponibilidade e condições pelo WhatsApp." },
            ],
            ({ name, city }) => [
                { t: "text", v: `Clientes de ${city} contam com o ` },
                { t: "strong", v: name },
                { t: "text", v: " para escolher, reservar e confirmar retirada/entrega com rapidez." },
            ],
            ({ category, city }) => [
                { t: "text", v: `Opções de ${category.toLowerCase()} em ${city} com foco em qualidade e custo-benefício. ` },
                { t: "text", v: "A equipe orienta e confirma estoque." },
            ],
            ({ city }) => [
                { t: "text", v: `Atendimento em ${city} e região com retirada/entrega conforme disponibilidade. ` },
                { t: "primary", v: "Chame no WhatsApp" },
                { t: "text", v: " e confirme." },
            ],
            ({ category, city }) => [{ t: "text", v: `Em ${city}, encontre ${category.toLowerCase()} com suporte rápido e catálogo organizado.` }],
        ],
        "areas.footer": [
            ({ city }) => [{ t: "text", v: `Seu bairro não está na lista? Envie sua localização e confirmamos entrega/retirada em ${city}.` }],
            ({ }) => [{ t: "text", v: `Chame no WhatsApp e confirme estoque, condições e atendimento na sua região.` }],
            ({ city }) => [{ t: "text", v: `Atendemos outras áreas além das listadas em ${city}. Consulte pelo WhatsApp.` }],
            ({ }) => [{ t: "text", v: `Mande sua localização e a equipe confirma a melhor opção: retirada ou entrega.` }],
            ({ }) => [{ t: "text", v: `Fale com a equipe no WhatsApp e confirmamos disponibilidade para sua região.` }],
        ],
    },

    SERVICE_PRICING: {
        "areas.kicker": [
            ({ city }) => [{ t: "text", v: `Atendimento por bairros em ${city}` }],
            ({ city }) => [{ t: "text", v: `Cobertura do serviço em ${city}` }],
            ({ city }) => [{ t: "text", v: `Regiões atendidas em ${city}` }],
            ({ city }) => [{ t: "text", v: `Onde atendemos em ${city}` }],
            ({ city }) => [{ t: "text", v: `Bairros com atendimento em ${city}` }],
        ],
        "areas.intro": [
            ({ name, city, category }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atende bairros de ${city} com ${category.toLowerCase()} e preços claros. ` },
                { t: "text", v: "Confira as regiões e chame no WhatsApp para confirmar orçamento." },
            ],
            ({ city, category }) => [
                { t: "text", v: `Atendimento de ${category.toLowerCase()} em bairros de ${city}. ` },
                { t: "text", v: "Veja abaixo as regiões e confirme valor e disponibilidade no WhatsApp." },
            ],
            ({ name, city }) => [
                { t: "text", v: `Se você está em ${city}, o ` },
                { t: "strong", v: name },
                { t: "text", v: " ajuda você a entender opções e confirmar valores com transparência." },
            ],
            ({ city }) => [{ t: "text", v: `A seguir, alguns bairros de ${city} onde o atendimento é mais frequente.` }],
            ({ city }) => [{ t: "text", v: `Fora da lista? Envie sua localização e confirmamos atendimento e orçamento em ${city}.` }],
        ],
        "areas.heroDesc": [
            ({ category, city }) => [
                { t: "text", v: `Serviços e preços de ${category.toLowerCase()} em ${city} com informações claras. ` },
                { t: "text", v: "Confirme o valor ideal para o seu caso no WhatsApp." },
            ],
            ({ name, city }) => [
                { t: "text", v: `Em ${city}, clientes escolhem o ` },
                { t: "strong", v: name },
                { t: "text", v: " pela transparência: você entende, compara e decide com segurança." },
            ],
            ({ category, city }) => [
                { t: "text", v: `Atendimento de ${category.toLowerCase()} em ${city} com orientação para você escolher a melhor opção.` },
            ],
            ({ city }) => [
                { t: "text", v: `Atendemos ${city} e região. ` },
                { t: "primary", v: "Chame no WhatsApp" },
                { t: "text", v: " para confirmar valores e disponibilidade." },
            ],
            ({ category, city }) => [{ t: "text", v: `Em ${city}, veja regiões atendidas e confirme orçamento para ${category.toLowerCase()}.` }],
        ],
        "areas.footer": [
            ({ city }) => [{ t: "text", v: `Não achou seu bairro? Envie sua localização e confirmamos atendimento e valores em ${city}.` }],
            ({ }) => [{ t: "text", v: `Fale no WhatsApp e confirme orçamento e disponibilidade para sua região.` }],
            ({ city }) => [{ t: "text", v: `Atendemos outras áreas além das listadas em ${city}. Consulte pelo WhatsApp.` }],
            ({ }) => [{ t: "text", v: `Envie sua localização e o que precisa — confirmamos atendimento e valor certinho.` }],
            ({ }) => [{ t: "text", v: `Chame no WhatsApp e a equipe confirma a melhor opção para seu caso.` }],
        ],
    },

    HYBRID: {
        "areas.kicker": [
            ({ city }) => [{ t: "text", v: `Áreas de atendimento em ${city}` }],
            ({ city }) => [{ t: "text", v: `Serviço + catálogo em ${city}` }],
            ({ city }) => [{ t: "text", v: `Cobertura em ${city} e região` }],
            ({ city }) => [{ t: "text", v: `Onde atendemos em ${city}` }],
            ({ city }) => [{ t: "text", v: `Bairros com atendimento em ${city}` }],
        ],
        "areas.intro": [
            ({ name, city, category }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atende diversos bairros de ${city} com ${category.toLowerCase()} e opções do catálogo. ` },
                { t: "text", v: "Veja abaixo as regiões onde o atendimento é mais frequente e confirme no WhatsApp." },
            ],
            ({ name, city, state, category }) => [
                { t: "text", v: `Em ${city}, ${state}, o ` },
                { t: "strong", v: name },
                { t: "text", v: ` atende com ${category.toLowerCase()} e também oferece soluções do catálogo. ` },
                { t: "text", v: "Isso ajuda você a resolver mais rápido, com orientação clara." },
            ],
            ({ city, category }) => [
                { t: "text", v: `Atendemos bairros de ${city} com ${category.toLowerCase()} e suporte no que você precisar. ` },
                { t: "text", v: "Confira as regiões abaixo e chame no WhatsApp para combinar o melhor caminho." },
            ],
            ({ name, city, category }) => [
                { t: "text", v: `Se você está em ${city}, pode contar com o ` },
                { t: "strong", v: name },
                { t: "text", v: ` para ${category.toLowerCase()} com praticidade — atendimento e catálogo no mesmo lugar. ` },
                { t: "primary", v: "Fale no WhatsApp" },
                { t: "text", v: " e confirme a melhor opção." },
            ],
            ({ city, category }) => [
                { t: "text", v: `Confira alguns bairros de ${city} atendidos com ${category.toLowerCase()}. ` },
                { t: "text", v: "Se estiver fora da lista, envie sua localização e confirmamos a possibilidade." },
            ],
        ],
        "areas.heroDesc": [
            ({ name, category, city, state }) => [
                { t: "strong", v: name },
                { t: "text", v: ` atua com ${category.toLowerCase()} em ${city}, ${state}, atendendo a região com qualidade e agilidade. ` },
                { t: "text", v: "Seja para atendimento com a equipe ou para opções do catálogo, você encontra praticidade aqui." },
            ],
            ({ category, city, state }) => [
                { t: "text", v: `Somos ${category.toLowerCase()} em ${city}, ${state}, com foco em atendimento claro, rápido e confiável. ` },
                { t: "text", v: "Nossa equipe orienta você e também facilita com opções do catálogo." },
            ],
            ({ name, city }) => [
                { t: "text", v: `Clientes de ${city} contam com o ` },
                { t: "strong", v: name },
                { t: "text", v: " pela praticidade: atendimento profissional e alternativas do catálogo para resolver sem complicação." },
            ],
            ({ category, city }) => [
                { t: "text", v: `Atendimento de ${category.toLowerCase()} em ${city} com compromisso e padrão de qualidade. ` },
                { t: "text", v: "Se você busca confiança e rapidez, aqui é o caminho." },
            ],
            ({ category, city, state }) => [
                { t: "text", v: `Em ${city}, ${state}, reunimos ${category.toLowerCase()} e catálogo para você escolher a melhor solução. ` },
                { t: "primary", v: "Chame no WhatsApp" },
                { t: "text", v: " e confirmamos detalhes." },
            ],
        ],
        "areas.footer": [
            ({ city }) => [{ t: "text", v: `Não encontrou seu bairro? Envie sua localização e confirmamos atendimento em ${city}.` }],
            ({ name, city }) => [
                { t: "text", v: `Seu bairro não está na lista? Sem problema. O ` },
                { t: "strong", v: name },
                { t: "text", v: ` pode atender outras regiões de ${city}. ` },
                { t: "text", v: "Chame no WhatsApp e confirme." },
            ],
            ({ city }) => [
                { t: "text", v: `Atendemos outras áreas além das listadas em ${city}. ` },
                { t: "text", v: "Entre em contato e verificamos a melhor forma de atendimento para você." },
            ],
            ({ }) => [{ t: "text", v: `Basta enviar sua localização e o que você precisa — confirmamos atendimento, prazos e disponibilidade.` }],
            ({ city }) => [{ t: "text", v: `Ficou com dúvida? Chame no WhatsApp e confirmamos atendimento na sua região em ${city}.` }],
        ],
    },
}
