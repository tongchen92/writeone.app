"use client";

import { loadConfigs } from "@/app/actions";
import React, { useEffect, useState } from "react";

interface ConfigSelectorProps {
  setTargetProgram: (value: string) => void;
}

const ConfigSelector: React.FC<ConfigSelectorProps> = ({
  setTargetProgram,
}) => {
  const [configs, setConfigs] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await loadConfigs();
        setConfigs(response);

        // Set the first program as default
        setTargetProgram(Object.keys(response)[0]);
      } catch (error) {
        console.error("Error fetching configs:", error);
      }
    };

    fetchConfigs();
  }, [setTargetProgram]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetProgram(event.target.value);
  };

  return (
    <div className="grid gap-2">
      <label className="font-semibold text-zinc-700">
        Transform to Program
      </label>
      <select
        // defaultValue={defaultValue}
        onChange={handleChange}
        className="border border-zinc-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <optgroup label="Programs">
          {Object.keys(configs).map((key) => (
            <option key={key} value={key}>
              {configs[key].name}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
};

export default ConfigSelector;
