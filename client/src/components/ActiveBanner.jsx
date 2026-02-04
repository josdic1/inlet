import { ArrowRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ActiveBanner() {
  const { activeItems } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!activeItems || activeItems.length === 0) return null;

  const viewNextSteps = () => {
    const params = new URLSearchParams(searchParams);

    // Force: All Types + Active + All Companies
    params.delete("type");
    params.delete("company");
    params.set("status", "active");

    setSearchParams(params);
  };

  return (
    <div className="active-banner">
      <div className="active-banner-dot">
        <div className="active-banner-dot-ping"></div>
        <div className="active-banner-dot-solid"></div>
      </div>

      <div className="active-banner-text">
        <span style={{ fontWeight: 800 }}>{activeItems.length}</span> Active
        Threads
        <span
          style={{
            fontWeight: 400,
            marginLeft: "0.5rem",
            opacity: 0.8,
          }}
        >
          (Waiting on replies or next steps)
        </span>
      </div>

      <button onClick={viewNextSteps} className="active-banner-link">
        View Next Steps
        <ArrowRight size={14} style={{ marginLeft: 4 }} />
      </button>
    </div>
  );
}
