// Game data: locations, quests, items, and facts about Vikings
// Based on historical research about Viking Age (793-1100 AD)

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'food' | 'treasure';
  description: string;
  bonus: number;
}

export interface MemoryPair {
  id: string;
  emoji: string;
  name: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'memory' | 'timing';
  question: string;
  options?: string[];
  correctAnswer: number;
  facts: string[];
  memoryPairs?: MemoryPair[];
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  xpReward: number;
  itemReward?: Item;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  quests: Quest[];
  unlocked: boolean;
}

export interface Player {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  health: number;
  inventory: Item[];
  currentLocation: string;
  completedQuests: string[];
}

export const VIKING_AVATARS = [
  '🪓', '⚔️', '🛡️', '🛶', '🏔️', '🌊', '🐺', '🐻',
  '🦅', '⚡', '🪨', '🔥'
];

// All game locations
export const LOCATIONS: Location[] = [
  {
    id: 'village',
    name: 'Vikingaby',
    description: 'Din hemort med stugor, smedja och långskepp.',
    image: '🏘️',
    unlocked: true,
    quests: [
      {
        id: 'village-1',
        name: 'Välkommen till byn',
        description: 'Lär känna ditt nya hem',
        xpReward: 50,
        questions: [
          {
            id: 'v1-q1',
            type: 'multiple-choice',
            question: 'Hur länge varade vikingatiden?',
            options: ['100 år', '300 år', '500 år', '1000 år'],
            correctAnswer: 1,
            facts: ['Vikingatiden varade i ungefär 300 år, från slutet av 700-talet till cirka år 1100.']
          },
          {
            id: 'v1-q2',
            type: 'multiple-choice',
            question: 'Vad kallades huset där en stor familj bodde tillsammans?',
            options: ['Stuga', 'Långhus', 'Slott', 'Koja'],
            correctAnswer: 1,
            facts: ['Långhuset var den vanliga bostaden där stora hushåll med 7-10 personer, ibland upp till 40, levde tillsammans.']
          },
          {
            id: 'v1-q3',
            type: 'multiple-choice',
            question: 'Vem ansvarade för jordbruk och försvar i en familj?',
            options: ['Husfrun', 'Barnen', 'Mannen (husbonden)', 'Trälarna'],
            correctAnswer: 2,
            facts: ['Mannen, husbonden, ansvarade för jordbruk, jakt och försvar medan kvinnan styrde hushållet inomhus.']
          }
        ]
      },
      {
        id: 'village-2',
        name: 'Kvinnans plats',
        description: 'Lär dig om kvinnans roll i vikingasamhället',
        xpReward: 75,
        questions: [
          {
            id: 'v2-q1',
            type: 'multiple-choice',
            question: 'Vad kunde en kvinna i vikingatiden göra som var ovanligt för sin tid?',
            options: ['Ingenting särskilt', 'Äga mark och ta skilsmässa', 'Endast arbeta i hushållet', 'Aldrig lämna gården'],
            correctAnswer: 1,
            facts: ['Kvinnor i vikingatiden hade en relativt stark ställning jämfört med många andra samtida kulturer. De kunde äga mark, kräva skilsmässa och bestämma över sina ägodelar.']
          },
          {
            id: 'v2-q2',
            type: 'multiple-choice',
            question: 'Vad heter kvinnan som styrde över hushållet inomhus?',
            options: ['Dronning', 'Husfrun', 'Sköldmö', 'Trollkona'],
            correctAnswer: 1,
            facts: ['Husfrun styrde över hushållet inomhus, medan mannen ansvarade för arbeten utanför hemmet.']
          },
          {
            id: 'v2-q3',
            type: 'memory',
            question: 'Para ihop!',
            correctAnswer: 0,
            facts: ['Kvinnans roll var viktig för familjens överlevnad och ekonomi.'],
            memoryPairs: [
              { id: 'housewife', emoji: '🧕', name: 'Husfrun' },
              { id: 'land', emoji: '🌾', name: 'Mark' },
              { id: 'divorce', emoji: '📜', name: 'Skilsmässa' },
              { id: 'property', emoji: '🏠', name: 'Ägodelar' },
              { id: 'children', emoji: '👶', name: 'Barn' },
              { id: 'craft', emoji: '🧶', name: 'Handarbete' }
            ]
          }
        ]
      },
      {
        id: 'village-3',
        name: 'Barnens liv',
        description: 'Upptäck hur barnen levde',
        xpReward: 75,
        questions: [
          {
            id: 'v3-q1',
            type: 'multiple-choice',
            question: 'Hur många barn dog innan de fyllde tio år?',
            options: ['10%', '25%', '50%', '75%'],
            correctAnswer: 2,
            facts: ['Barnadödligheten var hög – hälften av alla barn dog före tio års ålder.']
          },
          {
            id: 'v3-q2',
            type: 'multiple-choice',
            question: 'Vem var "Birkaflickan"?',
            options: ['En sagofigur', 'Ett arkeologiskt fynd av ett barn', 'En modersgudinna', 'En berömd vikingakvinn'],
            correctAnswer: 1,
            facts: ['Birkaflickan var ett arkeologiskt fynd som visar att barn var viktiga och kunde få påkostade begravningar med dyra gåvor.']
          },
          {
            id: 'v3-q3',
            type: 'multiple-choice',
            question: 'Vad lekte vikingabarn med?',
            options: ['Endast små arbeten', 'Lek och dockor och träsvärd', 'Ingenting – de arbetade hela tiden', 'Bollar och brickor'],
            correctAnswer: 1,
            facts: ['Barnen förbereddes tidigt för vuxenlivet men hade också tid för lek med dockor och träsvärd.']
          }
        ]
      },
      {
        id: 'village-4',
        name: 'Samhällets botten',
        description: 'Lär dig om trälarna',
        xpReward: 75,
        questions: [
          {
            id: 'v4-q1',
            type: 'multiple-choice',
            question: 'Vilka var de ofria människorna längst ner i samhället?',
            options: ['Bönder', 'Krigare', 'Trälar', 'Hantverkare'],
            correctAnswer: 2,
            facts: ['Trälarna var ofria människor utan rättigheter som utförde det tyngsta arbetet på gårdarna.']
          },
          {
            id: 'v4-q2',
            type: 'multiple-choice',
            question: 'Vad kallades samhället där släkttillhörighet var viktigast?',
            options: ['Kungadöme', 'Ättesamhälle', 'Demokrati', 'Feodalt system'],
            correctAnswer: 1,
            facts: ['Vikingasamhället var ett ättesamhälle där medlemskap i en släkt var livsviktigt för individens trygghet och rättsliga status.']
          },
          {
            id: 'v4-q3',
            type: 'timing',
            question: 'Arbeta hårt!',
            correctAnswer: 0,
            facts: ['Trälarna utförde de svåraste uppgifterna: städa, bära ved, arbeta i fält.']
          }
        ]
      }
    ]
  },
  {
    id: 'port',
    name: 'Hamn & Skepp',
    description: 'Härifrån seglar vikingarna till nya länder.',
    image: '⚓',
    unlocked: false,
    quests: [
      {
        id: 'port-1',
        name: 'Skeppens mästare',
        description: 'Lär dig om vikingaskeppen',
        xpReward: 100,
        questions: [
          {
            id: 'p1-q1',
            type: 'multiple-choice',
            question: 'Vad heter den teknik vikingarna använde för att bygga skepp?',
            options: ['Spontning', 'Klinkerbyggnad', 'Limning', 'Sömning'],
            correctAnswer: 1,
            facts: ['Genom klinkerbyggnadsteknik skapades skepp som var både lätta och starka, vilket gjorde det möjligt att korsa öppna hav och färdas längs grunda floder.'],
            memoryPairs: [
              { id: 'bow', emoji: '🏹', name: 'Stäv' },
              { id: 'stern', emoji: '🔚', name: 'Akter' },
              { id: 'mast', emoji: '🎋', name: 'Mast' },
              { id: 'sail', emoji: '🏳️', name: 'Segel' },
              { id: 'oar', emoji: '🥢', name: 'Åra' },
              { id: 'hull', emoji: '🚤', name: 'Skrov' }
            ]
          },
          {
            id: 'p1-q2',
            type: 'multiple-choice',
            question: 'Vad använde vikingarna för att navigera till havs?',
            options: ['GPS', 'Kompass', 'Sol, stjärnor och naturens tecken', 'Kartor från utlandet'],
            correctAnswer: 2,
            facts: ['Vikingarna var skickliga navigatörer som använde solen, stjärnorna och naturens tecken för att hitta rätt.']
          },
          {
            id: 'p1-q3',
            type: 'multiple-choice',
            question: 'Vad kunde vikingaskeppen göra som var speciellt?',
            options: ['Endast segla på djupt vatten', 'Korsa öppna hav OCH färdas längs grunda floder', 'Endast segla längs kusten', 'Flyga'],
            correctAnswer: 1,
            facts: ['Vikingaskeppen kunde både korsa öppna hav och färdas långt in i landet längs grunda floder.']
          }
        ]
      },
      {
        id: 'port-2',
        name: 'Handel & Resor',
        description: 'Vikingarnas internationella kontakter',
        xpReward: 125,
        questions: [
          {
            id: 'p2-q1',
            type: 'multiple-choice',
            question: 'Vilken handelsplats blev en internationell knutpunkt?',
            options: ['Visby', 'Birka', 'Lund', 'Sigtuna'],
            correctAnswer: 1,
            facts: ['Handelsplatser som Birka blev internationella knutpunkter där nordbor bytte varor som pälsar och bärnsten mot silver, siden och glas.']
          },
          {
            id: 'p2-q2',
            type: 'multiple-choice',
            question: 'Vad sålde vikingarna ofta i handeln?',
            options: ['Guld och diamanter', 'Pälsar och bärnsten', 'Kryddor och tee', 'Tekoppar'],
            correctAnswer: 1,
            facts: ['Vikingarna sålde pälsar och bärnsten och fick tillbaka silver, siden och glas.']
          },
          {
            id: 'p2-q3',
            type: 'timing',
            question: 'Styr skeppet rätt!',
            correctAnswer: 0,
            facts: ['Vikingarnas handelsresor sträckte sig från Skandinavien till Konstantinopel i söder.']
          }
        ]
      }
    ]
  },
  {
    id: 'temple',
    name: 'Asatron',
    description: 'Gudarnas tempel och tro.',
    image: '🏛️',
    unlocked: false,
    quests: [
      {
        id: 'temple-1',
        name: 'Gudarna',
        description: 'Lär känna de nordiska gudarna',
        xpReward: 100,
        questions: [
          {
            id: 't1-q1',
            type: 'multiple-choice',
            question: 'Vilka tre gudar tillbad vikingarna främst?',
            options: ['Zeus, Hera, Poseidon', 'Oden, Tor, Freja', 'Mars, Jupiter, Venus', 'Freyr, Frö, Balder'],
            correctAnswer: 1,
            facts: ['Man trodde på gudar som Oden, Tor och Freja, och offrade till dem för att få god skörd eller framgång i strid.']
          },
          {
            id: 't1-q2',
            type: 'multiple-choice',
            question: 'Vad offrade vikingarna till gudarna för att få hjälp?',
            options: ['Böcker', 'Djur och mat', 'Guld och silver', 'Tysta böner'],
            correctAnswer: 1,
            facts: ['Vikingarna offrade djur och mat till gudarna för att få god skörd, framgång i strid eller beskydd.']
          },
          {
            id: 't1-q3',
            type: 'memory',
            question: 'Para ihop gudarna!',
            correctAnswer: 0,
            facts: ['Asatron genomsyrade vardagen och rättsordningen i vikingasamhället.'],
            memoryPairs: [
              { id: 'odin', emoji: '👁️', name: 'Oden' },
              { id: 'thor', emoji: '⚡', name: 'Tor' },
              { id: 'freya', emoji: '🌹', name: 'Freja' },
              { id: 'loki', emoji: '😈', name: 'Loki' },
              { id: 'tyr', emoji: '✋', name: 'Tyr' },
              { id: 'freyr', emoji: '🌾', name: 'Freyr' }
            ]
          }
        ]
      },
      {
        id: 'temple-2',
        name: 'Runstenar',
        description: 'Minnesmärken från vikingatiden',
        xpReward: 100,
        questions: [
          {
            id: 't2-q1',
            type: 'multiple-choice',
            question: 'Vad användes runstenar till?',
            options: ['Endast som dekoration', 'Minnesmärken över döda och resenärer', 'Födelsemärken', 'Gränsmärken'],
            correctAnswer: 1,
            facts: ['Under periodens senare del rests många runstenar som minnesmärken över döda släktingar eller personer som dött under långväga resor.']
          },
          {
            id: 't2-q2',
            type: 'multiple-choice',
            question: 'Vad betyder ordet "runa"?',
            options: ['Hemligt språk', 'Hemlighet/wisdom', 'Krigslarm', 'Seger'],
            correctAnswer: 1,
            facts: ['Runor betyder "hemlighet" eller "visdom" på fornnordiska och var ett skriftspråk.']
          },
          {
            id: 't2-q3',
            type: 'timing',
            question: 'Rista din runsten!',
            correctAnswer: 0,
            facts: ['Att rista runer var ett hantverk som krävde skicklighet och precision.']
          }
        ]
      }
    ]
  },
  {
    id: 'battlefield',
    name: 'Slutet',
    description: 'Vikingatidens övergång till medeltiden.',
    image: '⚔️',
    unlocked: false,
    quests: [
      {
        id: 'battlefield-1',
        name: 'Kristendomens intåg',
        description: 'När en ny tro kom till Norden',
        xpReward: 150,
        questions: [
          {
            id: 'b1-q1',
            type: 'multiple-choice',
            question: 'Vilken kung dopades omkring år 1008 och representerar kristnandet av Sverige?',
            options: ['Gustav Vasa', 'Olof Skötkonung', 'Harald Bluetooth', 'Ragnar Lodbrok'],
            correctAnswer: 1,
            facts: ['I Sverige räknas ofta kung Olof Skötkonungs dop omkring år 1008 som en symbolisk vändpunkt mot den kristna medeltiden.']
          },
          {
            id: 'b1-q2',
            type: 'multiple-choice',
            question: 'Vad förde kristendomen med sig?',
            options: ['Endast kyrkobyggen', 'Nya lagar och fredligare ideal', 'Ingen förändring', 'Mindre handel'],
            correctAnswer: 1,
            facts: ['Kristendomen spreds och förde med sig nya lagar och fredligare ideal.']
          },
          {
            id: 'b1-q3',
            type: 'multiple-choice',
            question: 'Vilka av dessa bidrog till vikingatidens slut?',
            options: ['Kristendomen och starkare kungamakt', 'Bara klimatförändringar', 'Endast inre strider', 'Utanförliggande orsaker'],
            correctAnswer: 0,
            facts: ['Flera faktorer samverkade: kristendomen, starkare kungamakt i enade riken, och förändrade handelsvägar i samband med korstågen.']
          }
        ]
      },
      {
        id: 'battlefield-2',
        name: 'Tekniska nyheter',
        description: 'Innovationer under vikingatiden',
        xpReward: 125,
        questions: [
          {
            id: 'b2-q1',
            type: 'multiple-choice',
            question: 'Vilket område såg stora tekniska innovationer under vikingatiden?',
            options: ['Endast jordbruk', 'Skeppsbygge', 'Endast vapentillverkning', 'Endast matlagning'],
            correctAnswer: 1,
            facts: ['Vikingatiden präglades av tekniska innovationer inom skeppsbygge som möjliggjorde långa resor.']
          },
          {
            id: 'b2-q2',
            type: 'multiple-choice',
            question: 'Vad möjliggjorde vikingarnas framgångar till havs?',
            options: ['Tur', 'Avancerade skepp och navigationskonst', 'Större arméer', 'Bättre väder'],
            correctAnswer: 1,
            facts: ['De avancerade vikingaskeppen kombinerat med skicklig navigationskonst möjliggjorde både plundringståg och omfattande handel.']
          },
          {
            id: 'b2-q3',
            type: 'memory',
            question: 'Para ihop!',
            correctAnswer: 0,
            facts: ['Vikingarnas tekniska och sjöfartmässiga förmågor gjorde dem till herrar över haven under 300 år.'],
            memoryPairs: [
              { id: 'ship', emoji: '🚤', name: 'Skepp' },
              { id: 'sail', emoji: '🏳️', name: 'Segel' },
              { id: 'sun', emoji: '☀️', name: 'Solsten' },
              { id: 'stars', emoji: '⭐', name: 'Stjärnor' },
              { id: 'trade', emoji: '⚖️', name: 'Handel' },
              { id: 'explore', emoji: '🧭', name: 'Utforskning' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'valhalla',
    name: 'Efterspel',
    description: 'Arvet efter vikingatiden.',
    image: '🌟',
    unlocked: false,
    quests: [
      {
        id: 'valhalla-1',
        name: 'Vikingarnas arv',
        description: 'Vad lämnade vikingarna efter sig?',
        xpReward: 200,
        questions: [
          {
            id: 'va1-q1',
            type: 'multiple-choice',
            question: 'Vilka länder grundades av vikingar genom expansion?',
            options: ['Endast Norge', 'England, Frankrike (Normandiet), Sicilien', 'Endast Danmark', 'Inga'],
            correctAnswer: 1,
            facts: ['Vikingarna grundade nya samhällen i England (Danelagen), Frankrike (Normandiet) och på Sicilien.']
          },
          {
            id: 'va1-q2',
            type: 'multiple-choice',
            question: 'Vad är vikingarnas mest kända arv idag?',
            options: ['Endast skepp', 'Sagaberättelser, språkliga influenser, arkeologiska fynd', 'Endast vapen', 'Ingenting'],
            correctAnswer: 1,
            facts: ['Idag känner vi vikingarna genom sagaberättelser, språkliga influenser i engelska och nordiska språk, samt arkeologiska fynd.']
          },
          {
            id: 'va1-q3',
            type: 'multiple-choice',
            question: 'Vad visar arkeologiska utgrävningar om vikingarna?',
            options: ['De levde enkelt utan kultur', 'De var avancerade hantverkare med rikt kulturliv', 'De hade inga hus', 'De hade inga smycken'],
            correctAnswer: 1,
            facts: ['Arkeologiska utgrävningar visar att vikingarna var avancerade hantverkare med ett rikt kulturliv och fina smycken.']
          }
        ]
      },
      {
        id: 'valhalla-2',
        name: 'Tidslinje',
        description: 'Sammanfattning av vikingatiden',
        xpReward: 250,
        questions: [
          {
            id: 'va2-q1',
            type: 'multiple-choice',
            question: 'När brukar vikingatiden anses börja?',
            options: ['År 500', 'År 793 ( attacken på Lindisfarne)', 'År 1000', 'År 1200'],
            correctAnswer: 1,
            facts: ['Vikingatiden brukar räknas från år 793 när vikingarna attackerade kloster på Lindisfarne i England.']
          },
          {
            id: 'va2-q2',
            type: 'multiple-choice',
            question: 'När brukar vikingatiden anses sluta?',
            options: ['År 793', 'År 1066', 'År 1100', 'År 1500'],
            correctAnswer: 2,
            facts: ['Vikingatiden varade i ungefär 300 år, från slutet av 700-talet till cirka år 1100.']
          },
          {
            id: 'va2-q3',
            type: 'multiple-choice',
            question: 'Vilket år nådde vikingarna Nordamerika?',
            options: ['1492', 'Cirka 1000 e.Kr.', 'År 800', 'Aldrig'],
            correctAnswer: 1,
            facts: ['Leif Eriksson nådde Nordamerika cirka 1000 e.Kr., nästan 500 år före Columbus!']
          }
        ]
      }
    ]
  }
];

// Items available in the game
export const ITEMS: Item[] = [
  { id: 'wooden-sword', name: 'Träsvärd', type: 'weapon', description: 'Ett enkelt svärd för nybörjare', bonus: 5 },
  { id: 'iron-axe', name: 'Järnyxa', type: 'weapon', description: 'En stark yxa av järn', bonus: 15 },
  { id: 'spear', name: 'Spjut', type: 'weapon', description: 'Långt vapen för distans', bonus: 12 },
  { id: 'leather-armor', name: 'Läderrustning', type: 'armor', description: 'Skydd av djurskinn', bonus: 10 },
  { id: 'chainmail', name: 'Ringbrynja', type: 'armor', description: 'Metallskydd för krigare', bonus: 25 },
  { id: 'meat', name: 'Kött', type: 'food', description: 'Ger kraft och energi', bonus: 10 },
  { id: 'fish', name: 'Fisk', type: 'food', description: 'Näring från havet', bonus: 5 },
  { id: 'silver-coin', name: 'Silvermynt', type: 'treasure', description: 'Värdefull valuta', bonus: 20 },
  { id: 'golden-ring', name: 'Guldring', type: 'treasure', description: 'Tecken på rikedom', bonus: 50 },
  { id: 'amber', name: 'Bärnsten', type: 'treasure', description: 'Gul ädelsten från Östersjön', bonus: 30 },
  { id: 'fur', name: 'Päls', type: 'treasure', description: 'Varm päls från norr', bonus: 25 }
];

export const STORAGE_KEY = 'viking-quest-save';

export function saveGame(player: Player): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

export function loadGame(): Player | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as Player;
    }
  } catch (e) {
    console.error('Failed to load game:', e);
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

export function createNewPlayer(name: string, avatar: string): Player {
  return {
    name,
    avatar,
    level: 1,
    xp: 0,
    health: 100,
    inventory: [
      ITEMS[0], // wooden sword
      ITEMS[5]  // meat
    ],
    currentLocation: 'village',
    completedQuests: []
  };
}

export function calculateLevel(totalXp: number): number {
  let level = 1;
  let xpNeeded = 100;
  let remainingXp = totalXp;
  
  while (remainingXp >= xpNeeded) {
    remainingXp -= xpNeeded;
    level++;
    xpNeeded = level * 100;
  }
  return level;
}

export function xpToNextLevel(totalXp: number): number {
  let level = 1;
  let xpNeeded = 100;
  let remainingXp = totalXp;
  
  while (remainingXp >= xpNeeded) {
    remainingXp -= xpNeeded;
    level++;
    xpNeeded = level * 100;
  }
  return xpNeeded - remainingXp;
}
