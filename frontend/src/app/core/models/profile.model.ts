export interface Profile {
  _id: string;
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

export interface Achievement {
  _id: string;
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  icon?: string;
  order: number;
}
