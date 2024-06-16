"use server";
import { ApplicationConfig } from "@/configs/type";
import { isApplicationConfig } from "@/utils/validator";
import fs from "fs";
import path from "path";

const configsDir = path.resolve("./configs");

export const loadConfigs = (): { [key: string]: ApplicationConfig } => {
  const configFiles = fs.readdirSync(configsDir);
  const jsonConfigFiles = configFiles.filter((file) => file.endsWith(".json"));
  const configs = jsonConfigFiles.reduce<{ [key: string]: any }>(
    (acc, file) => {
      const filePath = path.join(configsDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const config = JSON.parse(fileContent);
      if (isApplicationConfig(config)) {
        acc[config.name] = config;
      } else {
        console.error(`Invalid config format in file: ${file}`);
      }
      return acc;
    },
    {}
  );

  return configs;
};

//load a config by name
export const loadConfigByName = (name: string): ApplicationConfig => {
  const configFiles = fs.readdirSync(configsDir);
  const jsonConfigFiles = configFiles.filter((file) => file.endsWith(".json"));

  for (const file of jsonConfigFiles) {
    const filePath = path.join(configsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedConfig = JSON.parse(fileContent);

    if (isApplicationConfig(parsedConfig) && parsedConfig.name === name) {
      return parsedConfig;
    }
  }
  throw new Error(`Config with name ${name} not found`);
};
