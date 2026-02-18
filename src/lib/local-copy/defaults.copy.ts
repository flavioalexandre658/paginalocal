// lib/local-seo/defaults.copy.ts
import type { ModeCopy } from "./types"

/**
 * Fallback global “DEFAULT”:
 * - garante texto aceitável se um key novo ainda não tiver copy específico
 * - mínimo 5 variações por key (SEO + emocional leve)
 */
export const DEFAULT_COPY: ModeCopy = {
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

    "about.desc": [
        ({ name, category, city, state }) => [
            { t: "strong", v: name },
            { t: "text", v: ` atua com ${category.toLowerCase()} em ${city}, ${state}. ` },
            { t: "text", v: "Fale com a equipe para tirar dúvidas e confirmar atendimento." },
        ],
        ({ category, city }) => [
            { t: "text", v: `Se você procura ${category.toLowerCase()} em ${city}, aqui você encontra orientação clara. ` },
            { t: "primary", v: "Chame no WhatsApp" },
            { t: "text", v: " para conversar." },
        ],
        ({ name, category, city }) => [
            { t: "strong", v: name },
            { t: "text", v: ` atende ${city} com ${category.toLowerCase()} e foco em qualidade.` },
        ],
        ({ category, city, state }) => [
            { t: "text", v: `Atendimento de ${category.toLowerCase()} em ${city}, ${state} com suporte rápido.` },
        ],
        ({ city }) => [{ t: "text", v: `Atendimento em ${city} e região. Se precisar, chame no WhatsApp.` }],
    ],

    "services.title": [
        ({ city }) => [{ t: "text", v: `Serviços mais procurados em ${city}` }],
        ({ city }) => [{ t: "text", v: `Destaques do atendimento em ${city}` }],
        ({ }) => [{ t: "text", v: `Principais opções disponíveis` }],
        ({ city }) => [{ t: "text", v: `O que mais atendemos em ${city}` }],
        ({ }) => [{ t: "text", v: `Serviços e opções` }],
    ],

    "hours.hint": [
        ({ }) => [{ t: "text", v: `Confirme horários e disponibilidade no WhatsApp antes de ir.` }],
        ({ }) => [{ t: "text", v: `Para evitar espera, envie uma mensagem e confirme o melhor horário.` }],
        ({ }) => [{ t: "text", v: `Horários podem variar. Confirme no WhatsApp.` }],
        ({ }) => [{ t: "text", v: `Chame no WhatsApp para confirmar atendimento.` }],
        ({ }) => [{ t: "text", v: `Se tiver dúvida, fale com a equipe no WhatsApp.` }],
    ],

    "neigh.header": [
        ({ city }) => [{ t: "text", v: `Regiões atendidas em ${city}` }],
        ({ city }) => [{ t: "text", v: `Bairros atendidos em ${city}` }],
        ({ city }) => [{ t: "text", v: `Áreas de cobertura em ${city}` }],
        ({ city }) => [{ t: "text", v: `Atendimento por bairros em ${city}` }],
        ({ city }) => [{ t: "text", v: `Cobertura local em ${city}` }],
    ],

    "neigh.intro": [
        ({ city, state }) => [{ t: "text", v: `Atendimento em ${city}, ${state} e proximidades. Veja alguns bairros abaixo.` }],
        ({ city }) => [{ t: "text", v: `Confira alguns bairros de ${city} onde o atendimento é mais frequente.` }],
        ({ }) => [{ t: "text", v: `Veja abaixo bairros e regiões atendidas.` }],
        ({ city }) => [{ t: "text", v: `Atendemos diversos bairros de ${city}. Se precisar, confirme pelo WhatsApp.` }],
        ({ city, state }) => [{ t: "text", v: `Cobertura em ${city}, ${state} e região. Consulte a equipe se estiver fora da lista.` }],
    ],

    "neigh.footer": [
        ({ city }) => [{ t: "text", v: `Não achou seu bairro? Chame no WhatsApp e confirme atendimento em ${city} e região.` }],
        ({ }) => [{ t: "text", v: `Envie sua localização no WhatsApp para confirmar disponibilidade.` }],
        ({ }) => [{ t: "text", v: `Se estiver fora da lista, fale com a equipe para confirmar atendimento.` }],
        ({ }) => [{ t: "text", v: `Basta mandar sua localização e a gente confirma.` }],
        ({ city }) => [{ t: "text", v: `Atendemos outras regiões além das listadas em ${city}. Consulte no WhatsApp.` }],
    ],

    // --- AreasSection (fallback global) ---
    "areas.kicker": [
        ({ city }) => [{ t: "text", v: `Áreas de atendimento em ${city}` }],
        ({ city }) => [{ t: "text", v: `Cobertura local em ${city}` }],
        ({ city }) => [{ t: "text", v: `Onde atendemos em ${city}` }],
        ({ city }) => [{ t: "text", v: `Bairros com atendimento em ${city}` }],
        ({ city }) => [{ t: "text", v: `Atendimento e cobertura em ${city}` }],
    ],

    "areas.heading": [
        ({ category, city, state }) => [
            { t: "text", v: `Bairros e regiões atendidas por ${category.toLowerCase()} em ` },
            { t: "primary", v: city },
            { t: "text", v: `, ${state}` },
        ],
        ({ category, city, state }) => [
            { t: "text", v: `Atendimento de ${category.toLowerCase()} em ` },
            { t: "primary", v: city },
            { t: "text", v: `, ${state}` },
            { t: "text", v: ": veja os bairros" },
        ],
        ({ category, city, state }) => [
            { t: "text", v: `Cobertura de ${category.toLowerCase()} em ` },
            { t: "primary", v: city },
            { t: "text", v: `, ${state}` },
            { t: "text", v: " e região" },
        ],
        ({ category, city, state }) => [
            { t: "text", v: `${category} em ` },
            { t: "primary", v: city },
            { t: "text", v: `, ${state}` },
            { t: "text", v: " — bairros atendidos" },
        ],
        ({ category, city, state }) => [
            { t: "text", v: `Regiões atendidas para ${category.toLowerCase()} em ` },
            { t: "primary", v: city },
            { t: "text", v: `, ${state}` },
        ],
    ],

    "areas.intro": [
        ({ name, city, category }) => [
            { t: "strong", v: name },
            { t: "text", v: ` atende diversos bairros de ${city} com ${category.toLowerCase()} de qualidade. ` },
            { t: "text", v: "Confira as regiões e confirme disponibilidade no WhatsApp." },
        ],
        ({ city, category }) => [
            { t: "text", v: `Atendemos diversos bairros de ${city} com ${category.toLowerCase()} e suporte rápido. ` },
            { t: "text", v: "Veja abaixo as regiões onde atuamos." },
        ],
        ({ name, city }) => [
            { t: "text", v: `Se você está em ${city}, pode contar com o ` },
            { t: "strong", v: name },
            { t: "text", v: ` para atendimento profissional e orientação clara.` },
        ],
        ({ city }) => [{ t: "text", v: `Confira abaixo alguns bairros de ${city} onde o atendimento é mais frequente.` }],
        ({ city }) => [{ t: "text", v: `Não achou seu bairro? Envie sua localização e a equipe confirma a possibilidade de atendimento.` }],
    ],

    "areas.heroTitle": [
        ({ category, city }) => [{ t: "text", v: `${category} em ${city}` }],
        ({ category, city }) => [{ t: "text", v: `${category} para ${city} e região` }],
        ({ category, city }) => [{ t: "text", v: `Atendimento de ${category.toLowerCase()} em ${city}` }],
        ({ city }) => [{ t: "text", v: `Atendimento local em ${city}` }],
        ({ category, city }) => [{ t: "text", v: `Serviços de ${category.toLowerCase()} em ${city}` }],
    ],

    "areas.heroDesc": [
        ({ name, category, city, state }) => [
            { t: "strong", v: name },
            { t: "text", v: ` atua com ${category.toLowerCase()} em ${city}, ${state}, atendendo a região com qualidade e agilidade.` },
        ],
        ({ category, city, state }) => [
            { t: "text", v: `Somos ${category.toLowerCase()} em ${city}, ${state}, com atendimento claro e foco em resolver.` },
        ],
        ({ name, city }) => [
            { t: "text", v: `Clientes de ${city} contam com o ` },
            { t: "strong", v: name },
            { t: "text", v: " pela praticidade e suporte rápido." },
        ],
        ({ category, city }) => [
            { t: "text", v: `Atendimento de ${category.toLowerCase()} em ${city} com compromisso e padrão de qualidade.` },
        ],
        ({ city }) => [{ t: "text", v: `Atendemos ${city} e região. Chame no WhatsApp para confirmar disponibilidade.` }],
    ],

    "areas.footer": [
        ({ city }) => [{ t: "text", v: `Não encontrou seu bairro? Envie sua localização e confirmamos atendimento em ${city}.` }],
        ({ }) => [{ t: "text", v: `Fale com a equipe no WhatsApp e confirme disponibilidade na sua região.` }],
        ({ }) => [{ t: "text", v: `Basta mandar sua localização e a gente verifica a melhor forma de atendimento.` }],
        ({ city }) => [{ t: "text", v: `Atendemos outras áreas além das listadas em ${city}. Consulte no WhatsApp.` }],
        ({ }) => [{ t: "text", v: `Se estiver fora da lista, é só chamar: confirmamos atendimento e prazos.` }],
    ],
}
