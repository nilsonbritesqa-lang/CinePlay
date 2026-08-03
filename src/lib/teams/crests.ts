/**
 * Banco de Dados de Escudos Oficiais dos Times de Futebol
 * URLs transparentes e oficiais via CDN API-Sports (100% Estáveis, sem 404 / CORS)
 */

export interface TeamCrest {
  name: string;
  shortName: string;
  aliases: string[];
  crestUrl: string;
}

function getCrestProxyUrl(teamId: number): string {
  const cdnUrl = `https://media.api-sports.io/football/teams/${teamId}.png`;
  return '/api/proxy-image?url=' + encodeURIComponent(cdnUrl);
}

export const TEAMS_CRESTS: TeamCrest[] = [
  // BRASIL - SÉRIE A, B e PRINCIPAIS CLUBES
  {
    name: 'Flamengo',
    shortName: 'FLA',
    aliases: ['flamengo', 'crf', 'rubro-negro', 'mengão', 'mengao'],
    crestUrl: getCrestProxyUrl(127),
  },
  {
    name: 'Palmeiras',
    shortName: 'PAL',
    aliases: ['palmeiras', 'verdão', 'verdao', 'alviverde', 'sep'],
    crestUrl: getCrestProxyUrl(121),
  },
  {
    name: 'São Paulo',
    shortName: 'SAO',
    aliases: ['são paulo', 'sao paulo', 'tricolor paulista', 'spfc'],
    crestUrl: getCrestProxyUrl(126),
  },
  {
    name: 'Corinthians',
    shortName: 'COR',
    aliases: ['corinthians', 'timão', 'timao', 'sccp', 'corinthians paulista'],
    crestUrl: getCrestProxyUrl(131),
  },
  {
    name: 'Santos',
    shortName: 'SAN',
    aliases: ['santos', 'peixe', 'santos fc'],
    crestUrl: getCrestProxyUrl(128),
  },
  {
    name: 'Vitória',
    shortName: 'VIT',
    aliases: ['vitória', 'vitoria', 'leão da barra', 'ec vitoria', 'vitoria-ba', 'vitória-ba'],
    crestUrl: getCrestProxyUrl(136),
  },
  {
    name: 'Botafogo',
    shortName: 'BOT',
    aliases: ['botafogo', 'fogão', 'fogao', 'glorioso', 'bfr'],
    crestUrl: getCrestProxyUrl(120),
  },
  {
    name: 'Fluminense',
    shortName: 'FLU',
    aliases: ['fluminense', 'flu', 'tricolor carioca', 'ffc'],
    crestUrl: getCrestProxyUrl(124),
  },
  {
    name: 'Vasco da Gama',
    shortName: 'VAS',
    aliases: ['vasco', 'vasco da gama', 'cruzmaltino', 'crvg'],
    crestUrl: getCrestProxyUrl(133),
  },
  {
    name: 'Grêmio',
    shortName: 'GRE',
    aliases: ['grêmio', 'gremio', 'tricolor gaúcho', 'tricolor gaucho'],
    crestUrl: getCrestProxyUrl(130),
  },
  {
    name: 'Internacional',
    shortName: 'INT',
    aliases: ['internacional', 'inter', 'colorado', 'sci'],
    crestUrl: getCrestProxyUrl(119),
  },
  {
    name: 'Atlético Mineiro',
    shortName: 'CAM',
    aliases: ['atlético mineiro', 'atletico mineiro', 'atlético-mg', 'atletico-mg', 'galodoido', 'galo'],
    crestUrl: getCrestProxyUrl(1062),
  },
  {
    name: 'Cruzeiro',
    shortName: 'CRU',
    aliases: ['cruzeiro', 'raposa', 'celeste'],
    crestUrl: getCrestProxyUrl(135),
  },
  {
    name: 'Bahia',
    shortName: 'BAH',
    aliases: ['bahia', 'esquadrão', 'esquadrao', 'ecb'],
    crestUrl: getCrestProxyUrl(118),
  },
  {
    name: 'Fortaleza',
    shortName: 'FOR',
    aliases: ['fortaleza', 'leão do pici', 'leao do pici', 'fec'],
    crestUrl: getCrestProxyUrl(132),
  },
  {
    name: 'Athletico Paranaense',
    shortName: 'CAP',
    aliases: ['athletico', 'athletico-pr', 'atletico paranaense', 'atletico-pr', 'furacão', 'furacao'],
    crestUrl: getCrestProxyUrl(134),
  },
  {
    name: 'Red Bull Bragantino',
    shortName: 'BGA',
    aliases: ['bragantino', 'red bull bragantino', 'massa bruta'],
    crestUrl: getCrestProxyUrl(794),
  },
  {
    name: 'Juventude',
    shortName: 'JUV',
    aliases: ['juventude', 'papo', 'ec juventude'],
    crestUrl: getCrestProxyUrl(122),
  },
  {
    name: 'Criciúma',
    shortName: 'CRI',
    aliases: ['criciúma', 'criciuma', 'tigre'],
    crestUrl: getCrestProxyUrl(129),
  },
  {
    name: 'Atlético Goianiense',
    shortName: 'ACG',
    aliases: ['atlético goianiense', 'atletico goianiense', 'atlético-go', 'atletico-go', 'dragão'],
    crestUrl: getCrestProxyUrl(144),
  },
  {
    name: 'Cuiabá',
    shortName: 'CUI',
    aliases: ['cuiabá', 'cuiaba', 'dourado'],
    crestUrl: getCrestProxyUrl(1126),
  },
  {
    name: 'Sport Recife',
    shortName: 'SPT',
    aliases: ['sport', 'sport recife', 'leão da ilha', 'sport club do recife', 'sport club recife'],
    crestUrl: getCrestProxyUrl(125),
  },
  {
    name: 'Ceará',
    shortName: 'CEA',
    aliases: ['ceará', 'ceara', 'vovô', 'vovo'],
    crestUrl: getCrestProxyUrl(138),
  },
  {
    name: 'Coritiba',
    shortName: 'CFC',
    aliases: ['coritiba', 'coxa'],
    crestUrl: getCrestProxyUrl(123),
  },
  {
    name: 'Goiás',
    shortName: 'GOI',
    aliases: ['goiás', 'goias', 'esmeraldino'],
    crestUrl: getCrestProxyUrl(141),
  },
  {
    name: 'Chapecoense',
    shortName: 'CHA',
    aliases: ['chapecoense', 'chape'],
    crestUrl: getCrestProxyUrl(147),
  },
  {
    name: 'Novorizontino',
    shortName: 'NOV',
    aliases: ['novorizontino', 'gremio novorizontino'],
    crestUrl: getCrestProxyUrl(10229),
  },
  {
    name: 'Mirassol',
    shortName: 'MIR',
    aliases: ['mirassol'],
    crestUrl: getCrestProxyUrl(10607),
  },
  {
    name: 'América Mineiro',
    shortName: 'AME',
    aliases: ['américa mineiro', 'america mineiro', 'américa-mg', 'coelho'],
    crestUrl: getCrestProxyUrl(137),
  },

  // CLUBES INTERNACIONAIS
  {
    name: 'Real Madrid',
    shortName: 'RMA',
    aliases: ['real madrid', 'merengues'],
    crestUrl: getCrestProxyUrl(60),
  },
  {
    name: 'Barcelona',
    shortName: 'BAR',
    aliases: ['barcelona', 'barça', 'barca', 'fc barcelona'],
    crestUrl: getCrestProxyUrl(541),
  },
  {
    name: 'Manchester City',
    shortName: 'MCI',
    aliases: ['manchester city', 'man city', 'citizens'],
    crestUrl: getCrestProxyUrl(50),
  },
  {
    name: 'Liverpool',
    shortName: 'LIV',
    aliases: ['liverpool', 'reds'],
    crestUrl: getCrestProxyUrl(40),
  },
  {
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    aliases: ['psg', 'paris saint-germain', 'paris saint germain'],
    crestUrl: getCrestProxyUrl(85),
  },
  {
    name: 'Bayern de Munique',
    shortName: 'BAY',
    aliases: ['bayern', 'bayern de munique', 'bayern munich'],
    crestUrl: getCrestProxyUrl(157),
  },
  {
    name: 'Arsenal',
    shortName: 'ARS',
    aliases: ['arsenal', 'gunners'],
    crestUrl: getCrestProxyUrl(42),
  },
  {
    name: 'Chelsea',
    shortName: 'CHE',
    aliases: ['chelsea', 'blues'],
    crestUrl: getCrestProxyUrl(49),
  },
  {
    name: 'Manchester United',
    shortName: 'MUN',
    aliases: ['manchester united', 'man united', 'red devils'],
    crestUrl: getCrestProxyUrl(33),
  },
  {
    name: 'Juventus',
    shortName: 'JUV',
    aliases: ['juventus', 'juve'],
    crestUrl: getCrestProxyUrl(496),
  },
  {
    name: 'Inter de Milão',
    shortName: 'INT',
    aliases: ['inter de milão', 'inter de milao', 'inter milan', 'nerazzurri'],
    crestUrl: getCrestProxyUrl(505),
  },
  {
    name: 'Al-Nassr',
    shortName: 'NAS',
    aliases: ['al-nassr', 'al nassr'],
    crestUrl: getCrestProxyUrl(2577),
  },
  {
    name: 'Al-Hilal',
    shortName: 'HIL',
    aliases: ['al-hilal', 'al hilal'],
    crestUrl: getCrestProxyUrl(2573),
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
