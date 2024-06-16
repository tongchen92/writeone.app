"use server";

import { TransformDocumentParams } from "@/types/ChatType";
import { createPrompt, createSystemDescription } from "@/utils/chat";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { cookies } from "next/headers";
import { z } from "zod";
import { loadConfigByName } from "./actions";

async function getModel(): Promise<any> {
  const cookieStore = cookies();
  const modelProvider = cookieStore.get("currentProvider");
  if (
    !modelProvider ||
    (modelProvider.value !== "openai" && modelProvider.value !== "anthropic")
  ) {
    throw new Error("Invalid model provider");
  }

  const modelSettings = cookieStore.get(modelProvider.value);
  if (!modelSettings) {
    throw new Error("Model settings not found");
  }

  const { apiKey, model } = JSON.parse(modelSettings.value);
  if (!apiKey || !model) {
    throw new Error("Model settings not found");
  }

  let modelInstance;
  if (modelProvider.value === "openai") {
    modelInstance = createOpenAI({ apiKey });
  } else if (modelProvider.value === "anthropic") {
    modelInstance = createAnthropic({ apiKey });
  }
  if (!modelInstance) {
    throw new Error("Failed to create model instance");
  }
  return modelInstance(model);
}

export async function transformDocument({
  application,
  targetProgram,
}: TransformDocumentParams) {
  "use server";
  try {
    // Load application configuration
    const applicationConfig = await loadConfigByName(targetProgram);

    if (!applicationConfig) {
      throw new Error(
        `Configuration for target program "${targetProgram}" not found.`
      );
    }

    const system = createSystemDescription(targetProgram);
    const prompt = createPrompt(application, applicationConfig, targetProgram);
    const model = await getModel();

    const stream = createStreamableValue();
    const { partialObjectStream } = await streamObject({
      model: model,
      system: system,
      schema: z.object({
        applicationData: z.array(
          z.object({
            section_title: z.string(),
            questions: z.array(
              z.object({ question: z.string(), answer: z.string() })
            ),
          })
        ),
      }),
      prompt,
    });
    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }
    stream.done();
    return { object: stream.value };
  } catch (error: any) {
    console.error("Error transforming document:", error);
    // Handle specific errors or rethrow them
    throw new Error(`Document transformation failed: ${error.message}`);
  }
}
