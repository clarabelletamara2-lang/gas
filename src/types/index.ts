export interface VocabItem {
  id: string;
  word: string;
  meaning: string;
  category: 'dasar' | 'tanya' | 'aktivitas' | 'ungkapan' | 'sekolah' | 'gaul';
  context: string;
  exampleSuroboyo: string;
  exampleIndo: string;
  pronunciationHint?: string;
  audioText?: string;
}

export interface StudentProfile {
  name: string;
  grade: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  completedQuests: string[];
  badges: string[];
  quizHighScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  contextTag: string;
}

export interface DialogueChoice {
  text: string;
  isAppropriate: boolean;
  scoreChange: number;
  feedback: string;
  speakerReply: string;
  nextSceneId?: string;
}

export interface DialogueScene {
  id: string;
  title: string;
  situation: string;
  character: string;
  characterAvatar: string;
  characterRole: string;
  characterDialogue: string;
  characterDialogueIndo: string;
  choices: DialogueChoice[];
}

export interface MatchCard {
  id: string;
  text: string;
  type: 'word' | 'meaning';
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}
