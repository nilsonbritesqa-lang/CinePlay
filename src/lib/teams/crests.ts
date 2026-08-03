/**
 * Banco de Dados de Escudos Oficiais dos Times de Futebol (Nacionais e Internacionais)
 * Contém mais de 169 clubes da Série A, Série B, Champions League, Europa, América do Sul e Arábia.
 */

export interface TeamCrest {
  name: string;
  shortName: string;
  aliases: string[];
  crestUrl: string;
}

function getCrestProxyUrl(url: string): string {
  return url;
}

export const TEAMS_CRESTS: TeamCrest[] = [
  {
    name: "Sport Recife",
    shortName: "SPT",
    aliases: ["sport recife","sport club do recife","sport club recife","leão da ilha"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/123.png"),
  },
  {
    name: "América Mineiro",
    shortName: "AME",
    aliases: ["américa mineiro","america mineiro","américa-mg","america-mg","coelho"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/125.png"),
  },
  {
    name: "Flamengo",
    shortName: "FLA",
    aliases: ["flamengo","crf","rubro-negro","mengão","mengao"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/127.png"),
  },
  {
    name: "Palmeiras",
    shortName: "PAL",
    aliases: ["palmeiras","verdão","verdao","alviverde","sep"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/121.png"),
  },
  {
    name: "São Paulo",
    shortName: "SAO",
    aliases: ["são paulo","sao paulo","tricolor paulista","spfc"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/126.png"),
  },
  {
    name: "Corinthians",
    shortName: "COR",
    aliases: ["corinthians","timão","timao","sccp","corinthians paulista"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/131.png"),
  },
  {
    name: "Santos",
    shortName: "SAN",
    aliases: ["santos","peixe","santos fc"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/128.png"),
  },
  {
    name: "Vitória",
    shortName: "VIT",
    aliases: ["vitória","vitoria","leão da barra","ec vitoria","vitoria-ba","vitória-ba"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1782.png"),
  },
  {
    name: "Botafogo",
    shortName: "BOT",
    aliases: ["botafogo","fogão","fogao","glorioso","bfr"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/120.png"),
  },
  {
    name: "Fluminense",
    shortName: "FLU",
    aliases: ["fluminense","flu","tricolor carioca","ffc"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/124.png"),
  },
  {
    name: "Vasco da Gama",
    shortName: "VAS",
    aliases: ["vasco","vasco da gama","cruzmaltino","crvg"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/133.png"),
  },
  {
    name: "Grêmio",
    shortName: "GRE",
    aliases: ["grêmio","gremio","tricolor gaúcho","tricolor gaucho"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1767.png"),
  },
  {
    name: "Internacional",
    shortName: "INT",
    aliases: ["internacional","inter","colorado","sci"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/119.png"),
  },
  {
    name: "Atlético Mineiro",
    shortName: "CAM",
    aliases: ["atlético mineiro","atletico mineiro","atlético-mg","atletico-mg","galodoido","galo"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/1062.png"),
  },
  {
    name: "Cruzeiro",
    shortName: "CRU",
    aliases: ["cruzeiro","raposa","celeste"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/135.png"),
  },
  {
    name: "Bahia",
    shortName: "BAH",
    aliases: ["bahia","esquadrão","esquadrao","ecb"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/118.png"),
  },
  {
    name: "Fortaleza",
    shortName: "FOR",
    aliases: ["fortaleza","leão do pici","leao do pici","fec"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/154.png"),
  },
  {
    name: "Athletico Paranaense",
    shortName: "CAP",
    aliases: ["athletico","athletico-pr","atletico paranaense","atletico-pr","furacão","furacao"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/134.png"),
  },
  {
    name: "Red Bull Bragantino",
    shortName: "BGA",
    aliases: ["bragantino","red bull bragantino","massa bruta"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/794.png"),
  },
  {
    name: "Juventude",
    shortName: "JUV",
    aliases: ["juventude","papo","ec juventude"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/122.png"),
  },
  {
    name: "Criciúma",
    shortName: "CRI",
    aliases: ["criciúma","criciuma","tigre"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/129.png"),
  },
  {
    name: "Atlético Goianiense",
    shortName: "ACG",
    aliases: ["atlético goianiense","atletico goianiense","atlético-go","atletico-go","dragão"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/144.png"),
  },
  {
    name: "Cuiabá",
    shortName: "CUI",
    aliases: ["cuiabá","cuiaba","dourado"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/1126.png"),
  },
  {
    name: "Ceará",
    shortName: "CEA",
    aliases: ["ceará","ceara","vovô","vovo"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/138.png"),
  },
  {
    name: "Coritiba",
    shortName: "CFC",
    aliases: ["coritiba","coxa"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/147.png"),
  },
  {
    name: "Goiás",
    shortName: "GOI",
    aliases: ["goiás","goias","esmeraldino"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/141.png"),
  },
  {
    name: "Chapecoense",
    shortName: "CHA",
    aliases: ["chapecoense","chape"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/132.png"),
  },
  {
    name: "Novorizontino",
    shortName: "NOV",
    aliases: ["novorizontino","gremio novorizontino"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/10229.png"),
  },
  {
    name: "Mirassol",
    shortName: "MIR",
    aliases: ["mirassol"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/10607.png"),
  },
  {
    name: "Paysandu",
    shortName: "PAY",
    aliases: ["paysandu","papão"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/140.png"),
  },
  {
    name: "Guarani",
    shortName: "GUA",
    aliases: ["guarani","bugre"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/15306.png"),
  },
  {
    name: "Ponte Preta",
    shortName: "PON",
    aliases: ["ponte preta","macaca"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/148.png"),
  },
  {
    name: "Operário",
    shortName: "OPE",
    aliases: ["operário","operario","fantasma"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/15310.png"),
  },
  {
    name: "Avaí",
    shortName: "AVA",
    aliases: ["avaí","avai"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/142.png"),
  },
  {
    name: "CRB",
    shortName: "CRB",
    aliases: ["crb","galo da pajuçara"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/139.png"),
  },
  {
    name: "Vila Nova",
    shortName: "VIL",
    aliases: ["vila nova","tigrão"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/145.png"),
  },
  {
    name: "Ituano",
    shortName: "ITU",
    aliases: ["ituano","galo de itu"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/10611.png"),
  },
  {
    name: "Botafogo-SP",
    shortName: "BSP",
    aliases: ["botafogo-sp","botafogo sp","pantera"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/146.png"),
  },
  {
    name: "Real Madrid",
    shortName: "RMA",
    aliases: ["real madrid","merengues"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/60.png"),
  },
  {
    name: "Barcelona",
    shortName: "BAR",
    aliases: ["barcelona","barça","barca","fc barcelona"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/541.png"),
  },
  {
    name: "Manchester City",
    shortName: "MCI",
    aliases: ["manchester city","man city","citizens"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/50.png"),
  },
  {
    name: "Liverpool",
    shortName: "LIV",
    aliases: ["liverpool","reds"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/40.png"),
  },
  {
    name: "Paris Saint-Germain",
    shortName: "PSG",
    aliases: ["psg","paris saint-germain","paris saint germain"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/85.png"),
  },
  {
    name: "Bayern de Munique",
    shortName: "BAY",
    aliases: ["bayern","bayern de munique","bayern munich"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/157.png"),
  },
  {
    name: "Arsenal",
    shortName: "ARS",
    aliases: ["arsenal","gunners"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/42.png"),
  },
  {
    name: "Chelsea",
    shortName: "CHE",
    aliases: ["chelsea","blues"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/49.png"),
  },
  {
    name: "Manchester United",
    shortName: "MUN",
    aliases: ["manchester united","man united","red devils"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/33.png"),
  },
  {
    name: "Juventus",
    shortName: "JUV",
    aliases: ["juventus","juve"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/496.png"),
  },
  {
    name: "Inter de Milão",
    shortName: "INT",
    aliases: ["inter de milão","inter de milao","inter milan","nerazzurri"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/505.png"),
  },
  {
    name: "AC Milan",
    shortName: "ACM",
    aliases: ["ac milan","milan","rossoneri"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/489.png"),
  },
  {
    name: "Al-Nassr",
    shortName: "NAS",
    aliases: ["al-nassr","al nassr"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/2577.png"),
  },
  {
    name: "Al-Hilal",
    shortName: "HIL",
    aliases: ["al-hilal","al hilal"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/2573.png"),
  },
  {
    name: "Boca Juniors",
    shortName: "BOC",
    aliases: ["boca juniors","boca","xeneizes"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/451.png"),
  },
  {
    name: "River Plate",
    shortName: "RIV",
    aliases: ["river plate","river","millonarios"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/435.png"),
  },
  {
    name: "Peñarol",
    shortName: "PEN",
    aliases: ["peñarol","penarol"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/2281.png"),
  },
  {
    name: "Nacional",
    shortName: "NAC",
    aliases: ["nacional uruguai","nacional de montevideo"],
    crestUrl: getCrestProxyUrl("https://media.api-sports.io/football/teams/2280.png"),
  },
  {
    name: "CA Mineiro",
    shortName: "CAM",
    aliases: ["ca mineiro","ca mineiro"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1766.png"),
  },
  {
    name: "CA Paranaense",
    shortName: "CAP",
    aliases: ["ca paranaense","ca paranaense"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1768.png"),
  },
  {
    name: "SE Palmeiras",
    shortName: "PAL",
    aliases: ["se palmeiras","se palmeiras"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1769.png"),
  },
  {
    name: "EC Bahia",
    shortName: "BAH",
    aliases: ["ec bahia","ec bahia"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1777.png"),
  },
  {
    name: "SC Corinthians Paulista",
    shortName: "COR",
    aliases: ["sc corinthians paulista","sc corinthians paulista"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1779.png"),
  },
  {
    name: "CR Vasco da Gama",
    shortName: "VAS",
    aliases: ["cr vasco da gama","cr vasco da gama"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1780.png"),
  },
  {
    name: "EC Vitória",
    shortName: "VIT",
    aliases: ["ec vitória","ec vitória"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1782.png"),
  },
  {
    name: "CR Flamengo",
    shortName: "FLA",
    aliases: ["cr flamengo","cr flamengo"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1783.png"),
  },
  {
    name: "RB Bragantino",
    shortName: "RBB",
    aliases: ["rb bragantino","rb bragantino"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/4286.png"),
  },
  {
    name: "Clube do Remo",
    shortName: "CRE",
    aliases: ["clube do remo","clube do remo"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/4287.png"),
  },
  {
    name: "SC Internacional",
    shortName: "SCI",
    aliases: ["sc internacional","sc internacional"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/6684.png"),
  },
  {
    name: "Aston Villa",
    shortName: "AVL",
    aliases: ["aston villa","aston villa fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/58.png"),
  },
  {
    name: "Everton",
    shortName: "EVE",
    aliases: ["everton","everton fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/62.png"),
  },
  {
    name: "Fulham",
    shortName: "FUL",
    aliases: ["fulham","fulham fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/63.png"),
  },
  {
    name: "Newcastle United",
    shortName: "NEW",
    aliases: ["newcastle united","newcastle united fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/67.png"),
  },
  {
    name: "Sunderland AFC",
    shortName: "SUN",
    aliases: ["sunderland afc","sunderland afc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/71.png"),
  },
  {
    name: "Tottenham Hotspur",
    shortName: "TOT",
    aliases: ["tottenham hotspur","tottenham hotspur fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/73.png"),
  },
  {
    name: "Hull City AFC",
    shortName: "HUL",
    aliases: ["hull city afc","hull city afc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/322.png"),
  },
  {
    name: "Leeds United",
    shortName: "LEE",
    aliases: ["leeds united","leeds united fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/341.png"),
  },
  {
    name: "Ipswich Town",
    shortName: "IPS",
    aliases: ["ipswich town","ipswich town fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/349.png"),
  },
  {
    name: "Nottingham Forest",
    shortName: "NOT",
    aliases: ["nottingham forest","nottingham forest fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/351.png"),
  },
  {
    name: "Crystal Palace",
    shortName: "CRY",
    aliases: ["crystal palace","crystal palace fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/354.png"),
  },
  {
    name: "Brighton & Hove Albion",
    shortName: "BHA",
    aliases: ["brighton & hove albion","brighton & hove albion fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/397.png"),
  },
  {
    name: "Brentford",
    shortName: "BRE",
    aliases: ["brentford","brentford fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/402.png"),
  },
  {
    name: "AFC Bournemouth",
    shortName: "BOU",
    aliases: ["afc bournemouth","afc bournemouth"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/bournemouth.png"),
  },
  {
    name: "Coventry City",
    shortName: "COV",
    aliases: ["coventry city","coventry city fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1076.png"),
  },
  {
    name: "Athletic Club",
    shortName: "ATH",
    aliases: ["athletic club","athletic club"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/77.png"),
  },
  {
    name: "Club Atlético de Madrid",
    shortName: "ATL",
    aliases: ["club atlético de madrid","club atlético de madrid"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/78.png"),
  },
  {
    name: "CA Osasuna",
    shortName: "OSA",
    aliases: ["ca osasuna","ca osasuna"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/79.png"),
  },
  {
    name: "RCD Espanyol de Barcelona",
    shortName: "ESP",
    aliases: ["rcd espanyol de barcelona","rcd espanyol de barcelona"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/80.png"),
  },
  {
    name: "FC Barcelona",
    shortName: "FCB",
    aliases: ["fc barcelona","fc barcelona"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/81.png"),
  },
  {
    name: "Getafe CF",
    shortName: "GET",
    aliases: ["getafe cf","getafe cf"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/82.png"),
  },
  {
    name: "Málaga CF",
    shortName: "MAL",
    aliases: ["málaga cf","málaga cf"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/84.png"),
  },
  {
    name: "Real Madrid CF",
    shortName: "RMA",
    aliases: ["real madrid cf","real madrid cf"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/86.png"),
  },
  {
    name: "Rayo Vallecano de Madrid",
    shortName: "RAY",
    aliases: ["rayo vallecano de madrid","rayo vallecano de madrid"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/87.png"),
  },
  {
    name: "Levante UD",
    shortName: "LEV",
    aliases: ["levante ud","levante ud"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/88.png"),
  },
  {
    name: "Real Betis Balompié",
    shortName: "BET",
    aliases: ["real betis balompié","real betis balompié"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/90.png"),
  },
  {
    name: "Real Sociedad de Fútbol",
    shortName: "RSO",
    aliases: ["real sociedad de fútbol","real sociedad de fútbol"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/92.png"),
  },
  {
    name: "Villarreal CF",
    shortName: "VIL",
    aliases: ["villarreal cf","villarreal cf"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/94.png"),
  },
  {
    name: "Valencia CF",
    shortName: "VAL",
    aliases: ["valencia cf","valencia cf"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/95.png"),
  },
  {
    name: "Deportivo Alavés",
    shortName: "ALA",
    aliases: ["deportivo alavés","deportivo alavés"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/263.png"),
  },
  {
    name: "Elche CF",
    shortName: "ELC",
    aliases: ["elche cf","elche cf"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/285.png"),
  },
  {
    name: "RC Celta de Vigo",
    shortName: "CEL",
    aliases: ["rc celta de vigo","rc celta de vigo"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/558.png"),
  },
  {
    name: "Sevilla",
    shortName: "SEV",
    aliases: ["sevilla","sevilla fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/559.png"),
  },
  {
    name: "RC Deportivo La Coruña",
    shortName: "DEP",
    aliases: ["rc deportivo la coruña","rc deportivo la coruña"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/560.png"),
  },
  {
    name: "Real Racing Club de Santander",
    shortName: "SAN",
    aliases: ["real racing club de santander","real racing club de santander"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/5335.png"),
  },
  {
    name: "ACF Fiorentina",
    shortName: "FIO",
    aliases: ["acf fiorentina","acf fiorentina"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/99.png"),
  },
  {
    name: "AS Roma",
    shortName: "ROM",
    aliases: ["as roma","as roma"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/100.png"),
  },
  {
    name: "Atalanta BC",
    shortName: "ATA",
    aliases: ["atalanta bc","atalanta bc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/102.png"),
  },
  {
    name: "Bologna FC 1909",
    shortName: "BOL",
    aliases: ["bologna fc 1909","bologna fc 1909"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/103.png"),
  },
  {
    name: "Cagliari Calcio",
    shortName: "CAG",
    aliases: ["cagliari calcio","cagliari calcio"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/104.png"),
  },
  {
    name: "Genoa CFC",
    shortName: "GEN",
    aliases: ["genoa cfc","genoa cfc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/107.png"),
  },
  {
    name: "FC Internazionale Milano",
    shortName: "INT",
    aliases: ["fc internazionale milano","fc internazionale milano"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/108.png"),
  },
  {
    name: "SS Lazio",
    shortName: "LAZ",
    aliases: ["ss lazio","ss lazio"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/110.png"),
  },
  {
    name: "Parma Calcio 1913",
    shortName: "PAR",
    aliases: ["parma calcio 1913","parma calcio 1913"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/112.png"),
  },
  {
    name: "SSC Napoli",
    shortName: "NAP",
    aliases: ["ssc napoli","ssc napoli"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/113.png"),
  },
  {
    name: "Udinese Calcio",
    shortName: "UDI",
    aliases: ["udinese calcio","udinese calcio"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/115.png"),
  },
  {
    name: "Venezia",
    shortName: "VEN",
    aliases: ["venezia","venezia fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/454.png"),
  },
  {
    name: "Frosinone Calcio",
    shortName: "FRO",
    aliases: ["frosinone calcio","frosinone calcio"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/470.png"),
  },
  {
    name: "US Sassuolo Calcio",
    shortName: "SAS",
    aliases: ["us sassuolo calcio","us sassuolo calcio"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/471.png"),
  },
  {
    name: "Torino",
    shortName: "TOR",
    aliases: ["torino","torino fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/586.png"),
  },
  {
    name: "US Lecce",
    shortName: "USL",
    aliases: ["us lecce","us lecce"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/5890.png"),
  },
  {
    name: "AC Monza",
    shortName: "MON",
    aliases: ["ac monza","ac monza"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/5911.png"),
  },
  {
    name: "Como 1907",
    shortName: "COM",
    aliases: ["como 1907","como 1907"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/7397.png"),
  },
  {
    name: "1. FC Köln",
    shortName: "KOE",
    aliases: ["1. fc köln","1. fc köln"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1.png"),
  },
  {
    name: "TSG 1899 Hoffenheim",
    shortName: "TSG",
    aliases: ["tsg 1899 hoffenheim","tsg 1899 hoffenheim"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/2.png"),
  },
  {
    name: "Bayer 04 Leverkusen",
    shortName: "B04",
    aliases: ["bayer 04 leverkusen","bayer 04 leverkusen"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/3.png"),
  },
  {
    name: "Borussia Dortmund",
    shortName: "BVB",
    aliases: ["borussia dortmund","borussia dortmund"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/4.png"),
  },
  {
    name: "FC Bayern München",
    shortName: "FCB",
    aliases: ["fc bayern münchen","fc bayern münchen"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/5.png"),
  },
  {
    name: "FC Schalke 04",
    shortName: "S04",
    aliases: ["fc schalke 04","fc schalke 04"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/6.png"),
  },
  {
    name: "Hamburger SV",
    shortName: "HSV",
    aliases: ["hamburger sv","hamburger sv"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/7.png"),
  },
  {
    name: "VfB Stuttgart",
    shortName: "VFB",
    aliases: ["vfb stuttgart","vfb stuttgart"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/10.png"),
  },
  {
    name: "SV Werder Bremen",
    shortName: "SVW",
    aliases: ["sv werder bremen","sv werder bremen"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/12.png"),
  },
  {
    name: "1. FSV Mainz 05",
    shortName: "M05",
    aliases: ["1. fsv mainz 05","1. fsv mainz 05"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/15.png"),
  },
  {
    name: "FC Augsburg",
    shortName: "FCA",
    aliases: ["fc augsburg","fc augsburg"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/16.png"),
  },
  {
    name: "SC Freiburg",
    shortName: "SCF",
    aliases: ["sc freiburg","sc freiburg"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/17.png"),
  },
  {
    name: "Borussia Mönchengladbach",
    shortName: "BMG",
    aliases: ["borussia mönchengladbach","borussia mönchengladbach"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/18.png"),
  },
  {
    name: "Eintracht Frankfurt",
    shortName: "SGE",
    aliases: ["eintracht frankfurt","eintracht frankfurt"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/19.png"),
  },
  {
    name: "1. FC Union Berlin",
    shortName: "UNB",
    aliases: ["1. fc union berlin","1. fc union berlin"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/28.png"),
  },
  {
    name: "SC Paderborn 07",
    shortName: "SCP",
    aliases: ["sc paderborn 07","sc paderborn 07"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/29.png"),
  },
  {
    name: "SV 07 Elversberg",
    shortName: "ELV",
    aliases: ["sv 07 elversberg","sv 07 elversberg"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/719.png"),
  },
  {
    name: "RB Leipzig",
    shortName: "RBL",
    aliases: ["rb leipzig","rb leipzig"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/721.png"),
  },
  {
    name: "Toulouse",
    shortName: "TOU",
    aliases: ["toulouse","toulouse fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/511.png"),
  },
  {
    name: "Stade Brestois 29",
    shortName: "BRE",
    aliases: ["stade brestois 29","stade brestois 29"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/512.png"),
  },
  {
    name: "Olympique de Marseille",
    shortName: "MAR",
    aliases: ["olympique de marseille","olympique de marseille"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/516.png"),
  },
  {
    name: "AJ Auxerre",
    shortName: "AJA",
    aliases: ["aj auxerre","aj auxerre"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/519.png"),
  },
  {
    name: "Lille OSC",
    shortName: "LIL",
    aliases: ["lille osc","lille osc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/521.png"),
  },
  {
    name: "OGC Nice",
    shortName: "NIC",
    aliases: ["ogc nice","ogc nice"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/522.png"),
  },
  {
    name: "Olympique Lyonnais",
    shortName: "LYO",
    aliases: ["olympique lyonnais","olympique lyonnais"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/523.png"),
  },
  {
    name: "FC Lorient",
    shortName: "FCL",
    aliases: ["fc lorient","fc lorient"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/525.png"),
  },
  {
    name: "Stade Rennais FC 1901",
    shortName: "REN",
    aliases: ["stade rennais fc 1901","stade rennais fc 1901"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/529.png"),
  },
  {
    name: "ES Troyes AC",
    shortName: "ETR",
    aliases: ["es troyes ac","es troyes ac"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/531.png"),
  },
  {
    name: "Angers SCO",
    shortName: "ANG",
    aliases: ["angers sco","angers sco"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/532.png"),
  },
  {
    name: "Le Havre AC",
    shortName: "HAC",
    aliases: ["le havre ac","le havre ac"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/533.png"),
  },
  {
    name: "Le Mans",
    shortName: "LMF",
    aliases: ["le mans","le mans fc"],
    crestUrl: getCrestProxyUrl("https://upload.wikimedia.org/wikipedia/en/5/57/Le_Mans_FC_logo.svg"),
  },
  {
    name: "Racing Club de Lens",
    shortName: "RCL",
    aliases: ["racing club de lens","racing club de lens"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/546.png"),
  },
  {
    name: "AS Monaco",
    shortName: "ASM",
    aliases: ["as monaco","as monaco fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/548.png"),
  },
  {
    name: "RC Strasbourg Alsace",
    shortName: "RC ",
    aliases: ["rc strasbourg alsace","rc strasbourg alsace"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/576.png"),
  },
  {
    name: "Paris",
    shortName: "PFC",
    aliases: ["paris","paris fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1045.png"),
  },
  {
    name: "Sporting Clube de Portugal",
    shortName: "SPO",
    aliases: ["sporting clube de portugal","sporting clube de portugal"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/498.png"),
  },
  {
    name: "Galatasaray SK",
    shortName: "GAL",
    aliases: ["galatasaray sk","galatasaray sk"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/610.png"),
  },
  {
    name: "Qarabağ Ağdam FK",
    shortName: "QAR",
    aliases: ["qarabağ ağdam fk","qarabağ ağdam fk"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/611.png"),
  },
  {
    name: "PAE Olympiakos SFP",
    shortName: "OLY",
    aliases: ["pae olympiakos sfp","pae olympiakos sfp"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/654.png"),
  },
  {
    name: "PSV",
    shortName: "PSV",
    aliases: ["psv","psv"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/674.png"),
  },
  {
    name: "AFC Ajax",
    shortName: "AJA",
    aliases: ["afc ajax","afc ajax"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/678.png"),
  },
  {
    name: "Club Brugge KV",
    shortName: "BRU",
    aliases: ["club brugge kv","club brugge kv"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/851.png"),
  },
  {
    name: "SK Slavia Praha",
    shortName: "SLP",
    aliases: ["sk slavia praha","sk slavia praha"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/930.png"),
  },
  {
    name: "FC København",
    shortName: "KOB",
    aliases: ["fc københavn","fc københavn"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1876.png"),
  },
  {
    name: "Sport Lisboa e Benfica",
    shortName: "BEN",
    aliases: ["sport lisboa e benfica","sport lisboa e benfica"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/1903.png"),
  },
  {
    name: "Royale Union Saint-Gilloise",
    shortName: "USG",
    aliases: ["royale union saint-gilloise","royale union saint-gilloise"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/3929.png"),
  },
  {
    name: "FK Bodø/Glimt",
    shortName: "FK",
    aliases: ["fk bodø/glimt","fk bodø/glimt"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/5721.png"),
  },
  {
    name: "FK Kairat",
    shortName: "KAI",
    aliases: ["fk kairat","fk kairat"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/10601.png"),
  },
  {
    name: "Paphos",
    shortName: "AEP",
    aliases: ["paphos","paphos fc"],
    crestUrl: getCrestProxyUrl("https://crests.football-data.org/11034.png"),
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
    if (team.aliases.some(alias => {
      const aliasNorm = normalizeText(alias);
      return aliasNorm.length > 2 && (norm.includes(aliasNorm) || aliasNorm.includes(norm));
    })) {
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
    aliasLength: number;
  }

  const matches: FoundMatch[] = [];

  for (const team of TEAMS_CRESTS) {
    let lowestIndex = -1;
    let bestAliasLen = 0;

    for (const alias of team.aliases) {
      const aliasNorm = normalizeText(alias);
      if (aliasNorm.length < 3) continue; // Evita falsos positivos com siglas curtas genéricas

      const idx = textNorm.indexOf(aliasNorm);
      if (idx !== -1) {
        if (lowestIndex === -1 || idx < lowestIndex || (idx === lowestIndex && aliasNorm.length > bestAliasLen)) {
          lowestIndex = idx;
          bestAliasLen = aliasNorm.length;
        }
      }
    }

    if (lowestIndex !== -1) {
      matches.push({ team, index: lowestIndex, aliasLength: bestAliasLen });
    }
  }

  // Ordena os times pela posição onde foram encontrados no texto (da esquerda para a direita)
  matches.sort((a, b) => a.index - b.index);

  const home = matches[0] ? matches[0].team : null;
  const away = matches[1] && matches[1].team.name !== home?.name ? matches[1].team : null;

  return { home, away };
}
