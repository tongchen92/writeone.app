import React from "react";
interface CurrentApplicationProps {
  setFileContent: (value: string) => void;
}

const CurrentApplication: React.FC<CurrentApplicationProps> = ({
  setFileContent,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target?.result) {
          const content = e.target.result as string;
          const parser = new DOMParser();
          const htmlDoc = parser.parseFromString(content, "text/html");

          // Handle new lines and spacing
          // Convert block elements to new lines to maintain readable format
          htmlDoc
            .querySelectorAll("p, br, div, hr, h1, h2, h3, h4, h5, h6")
            .forEach((el) => {
              if (el.tagName.toLowerCase() === "br") {
                el.parentNode?.insertBefore(document.createTextNode("\n"), el);
              } else {
                el.textContent = "\n" + el.textContent?.trimStart();
              }
            });

          const textContent = htmlDoc.body.textContent || "";
          setFileContent(textContent.trim()); // Trim final string to avoid extra space at start/end
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="grid gap-2">
      <label className="font-semibold text-zinc-700">
        Existing Application
      </label>
      <input
        type="file"
        accept=".html"
        onChange={handleFileChange}
        className="border border-zinc-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default CurrentApplication;
