import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  shortBio: string;
  email: string;
  phone?: string;
  location: string;
  linkedin?: string;
  github?: string;
  resumeUrl?: string;
  avatarUrl?: string;
  education: {
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }[];
  interests: string[];
  currentRole?: string;
  yearsOfExperience: number;
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    shortBio: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        year: { type: String, required: true },
        gpa: { type: String },
      },
    ],
    interests: [{ type: String }],
    currentRole: { type: String, trim: true },
    yearsOfExperience: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
