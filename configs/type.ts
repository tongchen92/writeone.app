export interface Question {
  id: string;
  question: string;
  placeholder?: string;
  validation?: (answer: string) => boolean;
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface ApplicationConfig {
  name: string;
  sections: Section[];
  transform: Record<string, string>;
}
