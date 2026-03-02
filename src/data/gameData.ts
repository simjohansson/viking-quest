// Game data: locations, quests, items, and facts about Vikings

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
  options?: string[]; // for multiple-choice
  correctAnswer: number; // index of correct option
  facts: string[]; // facts learned after answering
  memoryPairs?: MemoryPair[]; // for memory game (6 pairs = 12 cards)
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
  image: string; // emoji for now
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

// Viking names for character creation
export const VIKING_NAMES = [
  'Björn', 'Erik', 'Leif', 'Ragnar', 'Harald', 'Olaf', 'Sven', 'Gunnar',
  'Torsten', 'Ulf', 'Ketil', 'Hrafn', 'Astrid', 'Freya', 'Ingrid', 'Saga'
];

export const VIKING_AVATARS = [
  '🪓', '⚔️', '🛡️', '🛶', '🏔️', '🌊', '🐺', '🐻',
  '🦅', '⚡', '🪨', '🔥'
];

// All game locations
export const LOCATIONS: Location[] = [
  {
    id: 'village',
    name: 'Vikingaby',
    description: 'Din hemort med stugor, smedja och langskepp.',
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
            question: 'Vad heter den typiska vikingabyggnaden?',
            options: ['Stuga', 'Longhouse', 'Slott', 'Tempel'],
            correctAnswer: 1,
            facts: ['Longhouse kallades "hus" på fornnordiska och kunde vara upp till 70 meter långa.']
          },
          {
            id: 'v1-q2',
            type: 'multiple-choice',
            question: 'Vad använde vikingarna mest för att värma sina hus?',
            options: ['Elektriska element', 'Öppen eld i mitten', 'Solenergi', 'Värmepump'],
            correctAnswer: 1,
            facts: ['Vikingarnas hus hade en eldstad mitt i huset. Röken fick pysa ut genom hål i taket.']
          },
          {
            id: 'v1-q3',
            type: 'timing',
            question: 'Träffa tavlan!',
            correctAnswer: 0, // simplified for MVP
            facts: ['Vikingarna var skickliga jägare och behövde träffa sina mål.']
          }
        ]
      },
      {
        id: 'village-2',
        name: 'Smedens lära',
        description: 'Lär dig om vikingarnas hantverk',
        xpReward: 75,
        questions: [
          {
            id: 'v2-q1',
            type: 'multiple-choice',
            question: 'Vad smidde vikingarna sina vapen av?',
            options: ['Trä', 'Guld', 'Järn', 'Plast'],
            correctAnswer: 2,
            facts: ['Vikingarna var mästare på att smida järn. De hade smedjor i nästan varje by.']
          },
          {
            id: 'v2-q2',
            type: 'multiple-choice',
            question: 'Vad var ett "ulfheðnar"?',
            options: ['En vargpäls', 'En krigare som fick vargens kraft', 'Ett vapen', 'Ett skepp'],
            correctAnswer: 1,
            facts: ['Ulfheðnar var krigare som trance-kämpade som vargar i strid.']
          },
          {
            id: 'v2-q3',
            type: 'memory',
            question: 'Para ihop!',
            correctAnswer: 0,
            facts: ['Vikingarna använde många verktyg i smedjan: tång, hammare och städ.'],
            memoryPairs: [
              { id: 'tongs', emoji: '🔧', name: 'Tång' },
              { id: 'hammer', emoji: '🔨', name: 'Hammare' },
              { id: 'anvil', emoji: '🪨', name: 'Städ' },
              { id: 'fire', emoji: '🔥', name: 'Eld' },
              { id: 'ore', emoji: '🪨', name: 'Malma' },
              { id: 'forge', emoji: '🏚️', name: 'Smedja' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'forest',
    name: 'Den mörka skogen',
    description: 'Tät skog full av vilda djur och faror.',
    image: '🌲',
    unlocked: false,
    quests: [
      {
        id: 'forest-1',
        name: 'Jaktens väg',
        description: 'Lär dig jakta som en viking',
        xpReward: 100,
        questions: [
          {
            id: 'f1-q1',
            type: 'multiple-choice',
            question: 'Vad jagade vikingarna mest?',
            options: ['Dinosaurier', 'Älgar och vildsvin', 'Björnar', 'Fisk'],
            correctAnswer: 1,
            facts: ['Älg och vildsvin var viktiga för kött och skinn.']
          }
        ]
      }
    ]
  },
  {
    id: 'port',
    name: 'Hamn',
    description: 'Härifrån seglar vikingarna till nya länder.',
    image: '⚓',
    unlocked: false,
    quests: []
  },
  {
    id: 'battlefield',
    name: 'Stridsfältet',
    description: 'Platsen där kämpar bevisar sitt mod.',
    image: '⚔️',
    unlocked: false,
    quests: []
  },
  {
    id: 'valhalla',
    name: 'Valhalla',
    description: 'Krigarnas himmel efter ett ärorikt slut.',
    image: '🌟',
    unlocked: false,
    quests: []
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
  { id: 'golden-ring', name: 'Guldring', type: 'treasure', description: 'Tecken på rikedom', bonus: 50 }
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
  // Each level requires 100 * level XP
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
  // Returns XP needed to reach next level
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
