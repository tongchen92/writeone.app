export enum ModelProvider {
  OPENAI = "openai",
  //   ANTHROPIC = "anthropic",
}

export interface TransformDocumentParams {
  application: string;
  targetProgram: string;
}

export interface ModelSettings {
  model: string;
  apiKey: string;
}
