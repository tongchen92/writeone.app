"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelProvider, ModelSettings } from "@/types/ChatType";
import { getCookieByName, setCookie } from "@/utils/cookies";
import { useEffect, useState } from "react";
const providerSettings = {
  [ModelProvider.OPENAI]: { model: "gpt-3.5-turbo", apiKey: "" },
  // [ModelProvider.ANTHROPIC]: { model: "claude-3-haiku-20240307", apiKey: "" },
};

export default function ModelSetting() {
  const [currentProvider, setCurrentProvider] = useState<ModelProvider>(() => {
    return (
      (getCookieByName("currentProvider") as ModelProvider) ||
      ModelProvider.OPENAI
    );
  });
  const [settings, setSettings] = useState<ModelSettings>(() => {
    const currentProvider = getCookieByName("currentProvider") as ModelProvider;
    const settings = getCookieByName(currentProvider);
    if (settings) {
      return JSON.parse(settings);
    }
    return providerSettings[currentProvider];
  });

  // useEffect(() => {
  //   setCookie(currentProvider, JSON.stringify(settings));
  // }, [settings]);

  useEffect(() => {
    const settings = getCookieByName(currentProvider);
    if (settings) {
      setSettings(JSON.parse(settings));
    } else {
      setSettings(providerSettings[currentProvider]);
    }
  }, [currentProvider]);

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSetting = { ...settings, apiKey: event.target.value };
    setSettings(newSetting);
    setCookie(currentProvider, JSON.stringify(newSetting));
  };

  // const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();
  //   setCookie("currentModel", JSON.stringify(settings));
  // };
  return (
    <Dialog defaultOpen={false}>
      <DialogTrigger asChild>
        <Button variant="outline">Select AI Model</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select AI Model</DialogTitle>
          <DialogDescription>
            Choose your preferred AI provider and model for your projects.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1">
            <Label htmlFor="provider" className="text-base">
              Provider
            </Label>
            <RadioGroup
              id="provider"
              value={currentProvider}
              className="flex items-center gap-4"
              onValueChange={(value: ModelProvider) => {
                setCurrentProvider(value);
                setCookie("currentProvider", value);
              }}
            >
              <Label className="flex items-center gap-2 border rounded-md p-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800">
                <RadioGroupItem id="openai" value={ModelProvider.OPENAI} />
                OpenAI
              </Label>
              {/* <Label
                htmlFor="anthropic"
                className="flex items-center gap-2 border rounded-md p-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800"
              >
                <RadioGroupItem
                  id="anthropic"
                  value={ModelProvider.ANTHROPIC}
                />
                Anthropic
              </Label> */}
            </RadioGroup>
          </div>
          <div className="grid grid-cols-1">
            <Label htmlFor="model" className="text-base">
              Model
            </Label>
            <Select
              value={settings.model}
              // defaultValue={settings?.model}
              onValueChange={(value: string) => {
                const newSetting = { ...settings, model: value };
                setSettings(newSetting);
                setCookie(currentProvider, JSON.stringify(settings));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {currentProvider === ModelProvider.OPENAI ? (
                  <SelectGroup>
                    <SelectLabel>OpenAI</SelectLabel>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  </SelectGroup>
                ) : (
                  <SelectGroup>
                    <SelectLabel>Anthropic</SelectLabel>
                    <SelectItem value="claude-3-haiku-20240307">
                      Haiku
                    </SelectItem>
                    <SelectItem value="claude-3-sonnet-20240229">
                      Sonnet
                    </SelectItem>
                    <SelectItem value="claude-3-opus-20240229">Opus</SelectItem>
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="apiKey" className="text-base">
              API Key
            </Label>
            <input
              type="text"
              id="apiKey"
              name="apiKey"
              className="w-full border rounded-md p-2"
              placeholder="Enter your API key"
              value={settings?.apiKey}
              onChange={handleApiKeyChange}
            />
          </div>
        </div>
        {/* <DialogFooter>
          <Button onClick={handleSubmit} type="submit">
            Save
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
