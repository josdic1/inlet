import { Download, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function DemoBanner() {
  const { isDemo, downloadSnapshot } = useAuth();

  if (!isDemo) return null;

  return (
    <div className="demo-banner">
      <div className="demo-banner-left">
        <div className="demo-banner-title">
          <Lock size={16} />
          Demo Mode
        </div>
        <div className="demo-banner-subtitle">
          Read-only GitHub Pages build. Download a snapshot anytime.
        </div>
      </div>

      <button
        type="button"
        onClick={downloadSnapshot}
        className="btn btn-secondary btn-with-icon demo-banner-btn"
        title="Download a JSON snapshot of the current data"
      >
        <Download size={18} />
        Download snapshot
      </button>
    </div>
  );
}
