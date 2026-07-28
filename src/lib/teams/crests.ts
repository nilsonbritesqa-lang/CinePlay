/**
 * Banco de Dados de Escudos Oficiais dos Times de Futebol
 * URLs limpas de alta qualidade (SVG / PNG transparente via Wikimedia Commons)
 */

export interface TeamCrest {
  name: string;
  shortName: string;
  aliases: string[];
  crestUrl: string;
}

export const TEAMS_CRESTS: TeamCrest[] = [
  // BRASIL - SÉRIE A, B e PRINCIPAIS CLUBES
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
    name: 'Vitória',
    shortName: 'VIT',
    aliases: ['vitória', 'vitoria', 'leão da barra', 'ec vitoria', 'vitoria-ba', 'vitória-ba'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Esporte_Clube_Vit%C3%B3ria_logo.svg',
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
    aliases: ['atlético mineiro', 'atletico mineiro', 'atlético-mg', 'atletico-mg', 'galodoido', 'galo'],
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
    aliases: ['athletico', 'athletico-pr', 'atletico paranaense', 'atletico-pr', 'furacão', 'furacao'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Athletico_Paranaense_logo.svg',
  },
  {
    name: 'Red Bull Bragantino',
    shortName: 'BGA',
    aliases: ['bragantino', 'red bull bragantino', 'massa bruta'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Red_Bull_Bragantino_logo.svg',
  },
  {
    name: 'Juventude',
    shortName: 'JUV',
    aliases: ['juventude', 'papo', 'ec juventude'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/EC_Juventude_logo.svg',
  },
  {
    name: 'Criciúma',
    shortName: 'CRI',
    aliases: ['criciúma', 'criciuma', 'tigre'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Crici%C3%BAma_Esporte_Clube.svg',
  },
  {
    name: 'Atlético Goianiense',
    shortName: 'ACG',
    aliases: ['atlético goianiense', 'atletico goianiense', 'atlético-go', 'atletico-go', 'dragão'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Atl%C3%A9tico_Goianiense_logo.svg',
  },
  {
    name: 'Cuiabá',
    shortName: 'CUI',
    aliases: ['cuiabá', 'cuiaba', 'dourado'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Cuiab%C3%A1_EC.svg',
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
  {
    name: 'Coritiba',
    shortName: 'CFC',
    aliases: ['coritiba', 'coxa'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Coritiba_Foot_Ball_Club_logo.svg',
  },
  {
    name: 'Goiás',
    shortName: 'GOI',
    aliases: ['goiás', 'goias', 'esmeraldino'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Goi%C3%A1s_Esporte_Clube_logo.svg',
  },
  {
    name: 'Chapecoense',
    shortName: 'CHA',
    aliases: ['chapecoense', 'chape'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Chapecoense_logo.svg',
  },
  {
    name: 'Novorizontino',
    shortName: 'NOV',
    aliases: ['novorizontino', 'gremio novorizontino'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Gr%C3%Aamio_Novorizontino_logo.svg',
  },
  {
    name: 'Mirassol',
    shortName: 'MIR',
    aliases: ['mirassol'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Mirassol_FC_logo.svg',
  },
  {
    name: 'América Mineiro',
    shortName: 'AME',
    aliases: ['américa mineiro', 'america mineiro', 'américa-mg', 'coelho'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/America_Futebol_Clube_MG.svg',
  },

  // CLUBES INTERNACIONAIS
  {
    name: 'Real Madrid',
    shortName: 'RMA',
    aliases: ['real madrid', 'merengues'],
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
    aliases: ['manchester city', 'man city', 'citizens'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
  },
  {
    name: 'Liverpool',
    shortName: 'LIV',
    aliases: ['liverpool', 'reds'],
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
    aliases: ['bayern', 'bayern de munique', 'bayern munich'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
  },
  {
    name: 'Arsenal',
    shortName: 'ARS',
    aliases: ['arsenal', 'gunners'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  },
  {
    name: 'Chelsea',
    shortName: 'CHE',
    aliases: ['chelsea', 'blues'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  },
  {
    name: 'Manchester United',
    shortName: 'MUN',
    aliases: ['manchester united', 'man united', 'red devils'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
  },
  {
    name: 'Juventus',
    shortName: 'JUV',
    aliases: ['juventus', 'juve'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg',
  },
  {
    name: 'Inter de Milão',
    shortName: 'INT',
    aliases: ['inter de milão', 'inter de milao', 'inter milan', 'nerazzurri'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
  },
  {
    name: 'Al-Nassr',
    shortName: 'NAS',
    aliases: ['al-nassr', 'al nassr'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c5/Al_Nassr_FC.svg',
  },
  {
    name: 'Al-Hilal',
    shortName: 'HIL',
    aliases: ['al-hilal', 'al hilal'],
    crestUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Al_Hilal_SFC_Logo.svg',
  },
];

/**
 * Normaliza strings para busca sem acentos
 */
function normalizeText(str: string): string {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Encontra o escudo de um time pelo nome ou sinônimo
 */
export function findTeamCrest(teamNameStr: string): TeamCrest | null {
  if (!teamNameStr) return null;
  const norm = normalizeText(teamNameStr);
  
  for (const team of TEAMS_CRESTS) {
    if (normalizeText(team.name) === norm) return team;
    if (team.aliases.some(alias => norm.includes(normalizeText(alias)) || normalizeText(alias).includes(norm))) {
      return team;
    }
  }
  return null;
}

/**
 * Extrai times mencionados no texto do título ou conteúdo ordenados estritamente pela Posição no Texto
 */
export function extractTeamsFromTitle(text: string): { home: TeamCrest | null; away: TeamCrest | null } {
  if (!text) return { home: null, away: null };
  const textNorm = normalizeText(text);

  interface FoundMatch {
    team: TeamCrest;
    index: number;
  }

  const matches: FoundMatch[] = [];

  for (const team of TEAMS_CRESTS) {
    let lowestIndex = -1;

    for (const alias of team.aliases) {
      const aliasNorm = normalizeText(alias);
      const idx = textNorm.indexOf(aliasNorm);
      if (idx !== -1) {
        if (lowestIndex === -1 || idx < lowestIndex) {
          lowestIndex = idx;
        }
      }
    }

    if (lowestIndex !== -1) {
      matches.push({ team, index: lowestIndex });
    }
  }

  // Ordena os times pela posição onde foram encontrados no texto (da esquerda para a direita)
  matches.sort((a, b) => a.index - b.index);

  const home = matches[0] ? matches[0].team : null;
  const away = matches[1] && matches[1].team.name !== home?.name ? matches[1].team : null;

  return { home, away };
}
