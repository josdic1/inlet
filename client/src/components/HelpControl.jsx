import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { HelpModal } from "./HelpModal";

export function HelpControl() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="btn-icon" 
        title="Help & Guide"
      >
        <HelpCircle size={20} />
      </button>

      {isOpen && <HelpModal onClose={() => setIsOpen(false)} />}
    </>
  );
}