import { ApplicationConfig, Question, Section } from "@/configs/type";

export const isQuestion = (obj: any): obj is Question => {
  return (
    typeof obj.id === "string" &&
    typeof obj.question === "string" &&
    (typeof obj.validation === "function" ||
      typeof obj.validation === "undefined")
  );
};

export const isSection = (obj: any): obj is Section => {
  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    Array.isArray(obj.questions) &&
    obj.questions.every(isQuestion)
  );
};

export const isApplicationConfig = (obj: any): obj is ApplicationConfig => {
  return (
    typeof obj.name === "string" &&
    Array.isArray(obj.sections) &&
    obj.sections.every(isSection)
  );
};
