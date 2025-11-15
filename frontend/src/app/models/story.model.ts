export interface Chapter {
  num: number;
  title: string;
  description: string;
  isUnlocked: boolean;
  content?: {
    text?: string;
    audioUrl?: string;
    videoUrl?: string;
  };
  unlockedDate?: Date;
}

export interface HealingStory {
  id: string;
  name: string;
  title: string;
  currentStage: number;
  totalStages: number;
  thumbnail: string;
  videoUrl?: string;
  chapters: Chapter[];
  supporterCount: number;
  lastUpdated: Date;
  featured?: boolean;
}

export interface ImpactStats {
  livesTouched: number;
  storiesOfHope: number;
  recoveryRate: number;
  supportAvailable: string;
}

export interface ImpactChallenge {
  title: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}
