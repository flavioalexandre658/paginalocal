import type { TermGender, TermNumber } from '@/db/schema/stores.schema'

export type { TermGender, TermNumber }

export interface StoreGrammar {
  art: string
  Art: string
  da: string
  Da: string
  na: string
  Na: string
  aa: string
  Aa: string
  pela: string
  Pela: string
  nossa: string
  Nossa: string
  uma: string
  Uma: string
}

export function getStoreGrammar(
  gender: TermGender = 'FEMININE',
  number: TermNumber = 'SINGULAR',
): StoreGrammar {
  const isFem = gender === 'FEMININE'
  const isPlural = number === 'PLURAL'

  if (isFem && !isPlural) {
    return {
      art: 'a', Art: 'A',
      da: 'da', Da: 'Da',
      na: 'na', Na: 'Na',
      aa: 'à', Aa: 'À',
      pela: 'pela', Pela: 'Pela',
      nossa: 'nossa', Nossa: 'Nossa',
      uma: 'uma', Uma: 'Uma',
    }
  }

  if (!isFem && !isPlural) {
    return {
      art: 'o', Art: 'O',
      da: 'do', Da: 'Do',
      na: 'no', Na: 'No',
      aa: 'ao', Aa: 'Ao',
      pela: 'pelo', Pela: 'Pelo',
      nossa: 'nosso', Nossa: 'Nosso',
      uma: 'um', Uma: 'Um',
    }
  }

  if (isFem && isPlural) {
    return {
      art: 'as', Art: 'As',
      da: 'das', Da: 'Das',
      na: 'nas', Na: 'Nas',
      aa: 'às', Aa: 'Às',
      pela: 'pelas', Pela: 'Pelas',
      nossa: 'nossas', Nossa: 'Nossas',
      uma: 'umas', Uma: 'Umas',
    }
  }

  return {
    art: 'os', Art: 'Os',
    da: 'dos', Da: 'Dos',
    na: 'nos', Na: 'Nos',
    aa: 'aos', Aa: 'Aos',
    pela: 'pelos', Pela: 'Pelos',
    nossa: 'nossos', Nossa: 'Nossos',
    uma: 'uns', Uma: 'Uns',
  }
}
