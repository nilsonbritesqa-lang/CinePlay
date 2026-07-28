/**
 * Banco de Dados de Escudos Oficiais dos Times de Futebol
 * URLs limpas de alta qualidade (PNG/SVG transparentes) via Wikimedia Commons
 */

export interface TeamCrest {
  name: string;
  shortName: string;
  aliases: string[];
  crestUrl: string;
}

export const TEAMS_CRESTS: TeamCrest[] = [
  // BRASIL - SÉRIE A & B
  {
    name: 'Flamengo',
    shortName: 'FLA',
    aliases: ['flamengo', 'crf', 'rubro-negro', 'mengão', 'mengao'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg',
  },
  {
    name: 'Palmeiras',
    shortName: 'PAL',
    aliases: ['palmeiras', 'verdão', 'verdao', 'alviverde', 'sep'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg',
  },
  {
    name: 'São Paulo',
    shortName: 'SAO',
    aliases: ['são paulo', 'sao paulo', 'tricolor paulista', 'spfc'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Brasao_do_Sao_Paulo_Futebol_Clube.svg',
  },
  {
    name: 'Corinthians',
    shortName: 'COR',
    aliases: ['corinthians', 'timão', 'timao', 'sccp', 'corinthians paulista'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Sport_Club_Corinthians_Paulista_crest.svg',
  },
  {
    name: 'Santos',
    shortName: 'SAN',
    aliases: ['santos', 'peixe', 'santos fc'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Santos_Logo.png',
  },
  {
    name: 'Botafogo',
    shortName: 'BOT',
    aliases: ['botafogo', 'fogão', 'fogao', 'glorioso', 'bfr'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg',
  },
  {
    name: 'Fluminense',
    shortName: 'FLU',
    aliases: ['fluminense', 'flu', 'tricolor carioca', 'ffc'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Fluminense_FC_escudo.svg',
  },
  {
    name: 'Vasco da Gama',
    shortName: 'VAS',
    aliases: ['vasco', 'vasco da gama', 'cruzmaltino', 'crvg'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Vasco_da_Gama_image_logo.svg',
  },
  {
    name: 'Grêmio',
    shortName: 'GRE',
    aliases: ['grêmio', 'gremio', 'tricolor gaúcho', 'tricolor gaucho'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Gremio_logo.svg',
  },
  {
    name: 'Internacional',
    shortName: 'INT',
    aliases: ['internacional', 'inter', 'colorado', 'sci'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Escudo_do_Sport_Club_Internacional.svg',
  },
  {
    name: 'Atlético Mineiro',
    shortName: 'CAM',
    aliases: ['atlético mineiro', 'atletico mineiro', 'atlético-mg', 'galodoido', 'galo'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Clube_Atl%C3%A9tico_Mineiro_logo.svg',
  },
  {
    name: 'Cruzeiro',
    shortName: 'CRU',
    aliases: ['cruzeiro', 'raposa', 'celeste'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Cruzeiro_Esporte_Clube_%28logo_2021%29.svg',
  },
  {
    name: 'Bahia',
    shortName: 'BAH',
    aliases: ['bahia', 'esquadrão', 'esquadrao', 'ecb'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Esporte_Clube_Bahia_logo.svg',
  },
  {
    name: 'Fortaleza',
    shortName: 'FOR',
    aliases: ['fortaleza', 'leão do pici', 'leao do pici', 'fec'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Fortaleza_EC_2022.svg',
  },
  {
    name: 'Athletico Paranaense',
    shortName: 'CAP',
    aliases: ['athletico', 'athletico-pr', 'atletico paranaense', 'furacão', 'furacao'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Athletico_Paranaense_logo.svg',
  },
  {
    name: 'Red Bull Bragantino',
    shortName: 'BGA',
    aliases: ['bragantino', 'red bull bragantino', 'massa bruta'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Red_Bull_Bragantino_logo.svg',
  },
  {
    name: 'Vitória',
    shortName: 'VIT',
    aliases: ['vitória', 'vitoria', 'leão da barra', 'ec vitoria'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Esporte_Clube_Vit%C3%B3ria_logo.svg',
  },
  {
    name: 'Juventude',
    shortName: 'JUV',
    aliases: ['juventude', 'papo', 'ec juventude'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/EC_Juventude_logo.svg',
  },
  {
    name: 'Sport Recife',
    shortName: 'SPT',
    aliases: ['sport', 'sport recife', 'leão da ilha', 'sport club do recife'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Sport_Club_do_Recife_logo.svg',
  },
  {
    name: 'Ceará',
    shortName: 'CEA',
    aliases: ['ceará', 'ceara', 'vovô', 'vovo'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Cear%C3%A1_Sporting_Club_logo.svg',
  },

  // INTERNACIONAIS DE ELITE
  {
    name: 'Real Madrid',
    shortName: 'RMA',
    aliases: ['real madrid', 'merengues', 'real madrid cf'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
  },
  {
    name: 'Barcelona',
    shortName: 'BAR',
    aliases: ['barcelona', 'barça', 'barca', 'fc barcelona'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
  },
  {
    name: 'Manchester City',
    shortName: 'MCI',
    aliases: ['manchester city', 'city', 'citizens'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
  },
  {
    name: 'Liverpool',
    shortName: 'LIV',
    aliases: ['liverpool', 'reds', 'liverpool fc'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
  },
  {
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    aliases: ['psg', 'paris saint-germain', 'paris saint germain'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
  },
  {
    name: 'Bayern de Munique',
    shortName: 'BAY',
    aliases: ['bayern', 'bayern de munique', 'bayern munich', 'fc bayern'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
  },
  {
    name: 'Arsenal',
    shortName: 'ARS',
    aliases: ['arsenal', 'gunners', 'arsenal fc'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  },
];

/**
 * Encontra o escudo de um time pelo nome ou sinônimo
 */
export function findTeamCrest(teamNameStr: string): TeamCrest | null {
  if (!teamNameStr) return null;
  const clean = teamNameStr.toLowerCase().trim();
  
  for (const team of TEAMS_CRESTS) {
    if (team.name.toLowerCase() === clean) return team;
    if (team.aliases.some(alias => clean.includes(alias) || alias.includes(clean))) {
      return team;
    }
  }
  return null;
}

/**
 * Extrai até 2 times mencionados em um título de post (ex: "Flamengo x Palmeiras ao vivo")
 */
export function extractTeamsFromTitle(title: string): { home: TeamCrest | null; away: TeamCrest | null } {
  let home: TeamCrest | null = null;
  let away: TeamCrest | null = null;

  const titleLower = title.toLowerCase();

  for (const team of TEAMS_CRESTS) {
    if (team.aliases.some(alias => titleLower.includes(alias))) {
      if (!home) {
        home = team;
      } else if (!away && team.name !== home.name) {
        away = team;
        break;
      }
    }
  }

  return { home, away };
}
