import { ApplicationConfig } from "@/configs/type";

export function createSystemDescription(targetProgram: string) {
  return `You are tasked with transforming the existing application to address all the questions required by the ${targetProgram} accelerator program. While reformulating the answers, you must preserve the original tone of the application. Avoid the use of vague, overly complex words. Aim for precision, clarity, and relevance in all responses.`;
}

export function createPrompt(
  application: string,
  applicationConfig: ApplicationConfig,
  targetProgram: string
) {
  return `
      Original Application Content:
      ${application}

      Questions for the ${targetProgram} accelerator program:
      ${applicationConfig.sections
        .map(
          (section, index) =>
            `${section.title}\n` +
            section.questions
              .map((question, qIndex) => `Q${qIndex + 1}: ${question.question}`)
              .join("\n")
        )
        .join("\n\n")}
    `;
}
