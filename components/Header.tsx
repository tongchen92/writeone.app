import Link from "next/link";
import ModelSetting from "./ModelSetting";
import { Button } from "./ui/button";
export default function Header() {
  return (
    <header className="flex justify-between items-center bg-white text-black px-4 py-2">
      <div className="flex items-center">
        <span className="text-lg font-bold">writeone.app</span>
      </div>
      <div className="flex items-center gap-4">
        <ModelSetting />
        <Button variant="default">
          <Link href="/">New Transformation</Link>
        </Button>
      </div>
    </header>
  );
}
