"use client";

import { transformDocument } from "@/app/chat";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { readStreamableValue } from "ai/rsc";
import { useEffect, useState } from "react";

type ApplicationDraftProps = {
  draftId: string;
};

interface ApplicationData {
  section_title: string;
  questions: { question: string; answer: string }[];
}

export default function ApplicationDraft({ draftId }: ApplicationDraftProps) {
  const { toast } = useToast();
  const [applicationData, setApplicationData] = useState<ApplicationData[]>([]);

  async function getText(
    cachedFileContent: string,
    cachedTargetProgram: string
  ) {
    try {
      const { object } = await transformDocument({
        application: cachedFileContent,
        targetProgram: cachedTargetProgram,
      });

      for await (const partialObject of readStreamableValue(object)) {
        if (partialObject) {
          const applicationData = partialObject.applicationData;
          setApplicationData(applicationData);
          localStorage.setItem(
            `Draft#${draftId}`,
            JSON.stringify(applicationData)
          );
        }
      }
    } catch (error: any) {
      console.error("Failed to transform application:", error);
      toast({
        title: "Failed to transform application",
        description: error.message,
      });
    }
  }

  useEffect(() => {
    try {
      // Load the draft content from local storage
      const draft = localStorage.getItem(`Draft#${draftId}`);
      if (draft) {
        const parsedData = JSON.parse(draft);
        const isValid = parsedData.every((section: any) =>
          section.questions.every(
            (question: any) =>
              typeof question.question === "string" &&
              typeof question.answer === "string"
          )
        );
        if (isValid) {
          setApplicationData(parsedData);
          return;
        } else {
          console.error("Draft data is not valid, removed from storage");
          localStorage.removeItem(`Draft#${draftId}`);
        }
      }
    } catch (error) {
      // If JSON.parse throws an error, remove the corrupted draft
      localStorage.removeItem(`Draft#${draftId}`);
      console.error("Failed to parse draft data, removed from storage:", error);
    }

    // If no valid draft was loaded, attempt to load and parse content from storage
    const cachedFileContent = localStorage.getItem("fileContent");
    const cachedTargetProgram = localStorage.getItem("targetProgram");

    if (cachedFileContent && cachedTargetProgram) {
      getText(cachedFileContent, cachedTargetProgram);
    }
  }, [draftId]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <header className="mb-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-800 mb-4">
          This is your draft
        </h1>
        <Button
          variant="default"
          className=""
          onClick={() =>
            getText(
              localStorage.getItem("fileContent") || "",
              localStorage.getItem("targetProgram") || ""
            )
          }
        >
          Regenerate
        </Button>
      </header>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <div className="space-y-8">
          {applicationData &&
            applicationData?.map((section, index) => (
              <div key={index} className="pt-5">
                <h2 className="text-xl font-bold text-zinc-900">
                  {section.section_title || ""}
                </h2>
                {section.questions?.map((item, qIndex) => (
                  <div key={qIndex} className="mt-3">
                    <h3 className="text-l font-semibold text-zinc-700">
                      {item.question || ""}
                    </h3>
                    <p className="text-zinc-600 mt-1">{item.answer || ""}</p>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
