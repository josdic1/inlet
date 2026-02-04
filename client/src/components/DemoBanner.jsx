import { Download, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function DemoBanner() {
  const { isDemo, downloadSnapshot } = useAuth();

  if (!isDemo) return null;

  return (
    <div className="demo-banner">
      <div className="demo-banner-left">
        <span className="demo-banner-icon">
          <Lock size={16} />
        </span>

        <div className="demo-banner-text">
          <div className="demo-banner-title">Demo Mode (read-only)</div>
          <div className="demo-banner-subtitle">
            Changes won’t save on GitHub Pages. Download a snapshot to update
            your db.json later.
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-secondary btn-with-icon demo-banner-btn"
        onClick={downloadSnapshot}
      >
        <Download size={18} />
        Download db.json snapshot
      </button>
    </div>
  );
}
