export interface Skill {
  _id: string;
  name: string;
  icon?: string;
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'tools';
  order: number;
}

export interface SkillGroup {
  category: string;
  label: string;
  icon: string;
  skills: Skill[];
}
