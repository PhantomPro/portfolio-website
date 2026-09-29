import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  icon?: string;
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'tools';
  order: number;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'ai', 'tools'],
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SkillSchema.index({ category: 1, order: 1 });

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
