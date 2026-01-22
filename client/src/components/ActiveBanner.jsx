import { Zap, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function ActiveBanner() {
  const { activeItems } = useAuth();

  if (activeItems.length === 0) return null;

  return (
    <div className="active-banner">
      <div className="active-banner-dot">
        <div className="active-banner-dot-ping"></div>
        <div className="active-banner-dot-solid"></div>
      </div>
      
      <div className="active-banner-text">
        <span style={{ fontWeight: 800 }}>{activeItems.length}</span> Active Threads
        <span style={{ fontWeight: 400, marginLeft: "0.5rem", opacity: 0.8 }}>
          (Waiting on replies or next steps)
        </span>
      </div>

      <a href="#active" className="active-banner-link">
        View Next Steps <ArrowRight size={14} style={{ marginLeft: 4 }}/>
      </a>
    </div>
  );
}