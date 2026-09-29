import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  icon?: string;
  order: number;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: Number, required: true },
    suffix: { type: String, default: '+' },
    prefix: { type: String, default: '' },
    icon: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Achievement = mongoose.model<IAchievement>('Achievement', AchievementSchema);
