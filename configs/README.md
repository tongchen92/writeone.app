# Adding a New Application Config

To add a new application config, follow these steps:

1. Create a new file in this directory, e.g., `newProgram.ts`.
2. Use the following template:

```typescript
interface ApplicationConfig {
  name: string;
  questions: Question[];
  transform: (input: Record<string, string>) => Record<string, string>;
}

interface Question {
  id: string;
  question: string;
  placeholder?: string;
  validation?: (answer: string) => boolean;
}

const newProgramConfig: ApplicationConfig = {
  name: "New Program",
  questions: [
    { id: "q1", question: "What is your startup idea?", placeholder: "Describe your idea..." },
    { id: "q2", question: "Who are the founders?", placeholder: "List the founders..." },
    // Add more questions as needed
  ],
  transform: (input) => {
    // Transformation logic from generic application to New Program-specific format
    return {
      idea: input["q1"],
      founders: input["q2"],
      // Map other fields as required
    };
  },
};

export default newProgramConfig;
