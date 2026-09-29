export interface Experience {
  _id: string;
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
