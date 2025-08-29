export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  summary: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  achievements: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  highlights: string[];
}

export interface Skill {
  category: string;
  items: string[];
}

export interface ResumeData {
  contact: ContactInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
}

export type TemplateType = 'corporate' | 'modern' | 'creative';
