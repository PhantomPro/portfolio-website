import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  companyUrl?: string;
  companyLogo?: string;
  order: number;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    current: { type: Boolean, default: false },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    achievements: [{ type: String }],
    technologies: [{ type: String }],
    companyUrl: { type: String, trim: true },
    companyLogo: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ExperienceSchema.index({ order: 1 });

export const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);
