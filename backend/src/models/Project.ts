import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    longDescription: { type: String, trim: true },
    problem: { type: String, trim: true },
    solution: { type: String, trim: true },
    architecture: { type: String, trim: true },
    architectureImage: { type: String, trim: true },
    image: { type: String, trim: true },
    technologies: [{ type: String, required: true }],
    features: [{ type: String }],
    challenges: [{ type: String }],
    learnings: [{ type: String }],
    results: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    caseStudy: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    category: {
      type: String,
      enum: ['full-stack', 'frontend', 'backend', 'ai', 'other'],
      default: 'full-stack',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProjectSchema.index({ featured: 1, order: 1 });
ProjectSchema.index({ category: 1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
