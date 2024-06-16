"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ConfigSelector from "./ConfigSelector";
import CurrentApplication from "./CurrentApplication";
import { Textarea } from "./ui/textarea";

export default function ApplicationTransformer() {
  const [fileContent, setFileContent] = useState<string>("");
  const [targetProgram, setTargetProgram] = useState<string>("");
  const router = useRouter();
  //use local storage to save file content adn target
  useEffect(() => {
    const fileContent = localStorage.getItem("fileContent");
    if (fileContent) {
      setFileContent(fileContent);
    }
    const targetProgram = localStorage.getItem("targetProgram");
    if (targetProgram) {
      setTargetProgram(targetProgram);
    }
  }, []);

  //save file content and target program to local storage
  useEffect(() => {
    if (fileContent === "" || targetProgram === "") {
      return;
    }
    console.log("saving to cache", targetProgram);
    localStorage.setItem("fileContent", fileContent);
    localStorage.setItem("targetProgram", targetProgram);
  }, [fileContent, targetProgram]);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (fileContent === "" || targetProgram === "") {
      return;
    }
    //create a unique id
    const id = uuidv4();
    router.push(`/draft/${id}`);
  };

  return (
    <div className="w-full max-w-lg">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Write Once Apply To All</h1>
        <p className="text-lg text-zinc-600">
          The common application for VC funding application
        </p>
        <p className="text-zinc-500">
          Upload your existing Y Combinator or TechStars application and select
          the accelerator program you want to transform it for.
        </p>
      </header>
      <div>
        <form className="grid gap-6">
          <CurrentApplication setFileContent={setFileContent} />
          <ConfigSelector setTargetProgram={setTargetProgram} />
          <Button variant="outline" onClick={handleSubmit}>
            Transform
          </Button>
          {fileContent.length > 1 && (
            <div className="">
              <Textarea
                rows={25}
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
