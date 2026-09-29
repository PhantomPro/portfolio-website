export interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  problem?: string;
  solution?: string;
  architecture?: string;
  architectureImage?: string;
  image?: string;
  technologies: string[];
  features: string[];
  challenges?: string[];
  learnings?: string[];
  results?: string;
  githubUrl?: string;
  liveUrl?: string;
  caseStudy?: string;
  featured: boolean;
  category: 'full-stack' | 'frontend' | 'backend' | 'ai' | 'other';
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
