import { useState } from "react";
import { 
  Mail, Briefcase, Users, PenTool, 
  CheckCircle, RefreshCw, XCircle, 
  MessageSquare, ExternalLink, Calendar
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function ActivityCard({ activity }) {
  const { touchActivity, updateActivityStatus, formatDate, formatFullDate, getPerson, getCompany } = useAuth();
  const [touchNote, setTouchNote] = useState("");
  const [isTouching, setIsTouching] = useState(false);

  // 1. Icon Mapping based on Type
  const typeConfig = {
    outreach: { Icon: Mail, color: "var(--color-outreach)", label: "Outreach" },
    application: { Icon: Briefcase, color: "var(--color-application)", label: "Application" },
    networking: { Icon: Users, color: "var(--color-networking)", label: "Networking" },
    content: { Icon: PenTool, color: "var(--color-content)", label: "Content" },
  };

  const config = typeConfig[activity.type] || typeConfig.outreach;
  const TypeIcon = config.Icon;
  
  // 2. Resolve Relationships
  const person = activity.personId ? getPerson(activity.personId) : null;
  const company = activity.companyId ? getCompany(activity.companyId) : null;

  const handleTouch = (e) => {
    e.preventDefault();
    if (!touchNote.trim()) return;
    touchActivity(activity.id, touchNote);
    setTouchNote("");
    setIsTouching(false);
  };

  return (
    <div className={`activity-card ${activity.status === "closed" ? "activity-card-closed" : ""}`}>
      {/* Color Accent Bar */}
      <div 
        className="activity-card-accent" 
        style={{ backgroundColor: config.color }} 
      />
      
      {/* Active Indicator Line */}
      {activity.status === "active" && (
        <div className="activity-card-active-indicator" />
      )}

      <div className="activity-card-content">
        <div className="activity-card-main">
          {/* Header */}
          <div className="activity-card-header">
            <span className={`badge badge-type-${activity.type}`}>
              <TypeIcon size={12} style={{ marginRight: 4 }} />
              {config.label}
            </span>
            <span className="activity-card-date">{formatDate(activity.created)}</span>
          </div>

          {/* Main Note */}
          <p className="activity-card-note">{activity.note}</p>

          {/* Links & Details */}
          {activity.link && (
            <a href={activity.link} target="_blank" rel="noopener noreferrer" className="activity-card-link">
              <ExternalLink size={14} />
              <span>{activity.link}</span>
            </a>
          )}

          {/* Tags (Person/Company) */}
          <div className="activity-card-tags">
            {company && (
              <span className="tag tag-company">
                <BuildingIcon size={12} style={{ marginRight: 4 }} />
                {company.name}
              </span>
            )}
            {person && (
              <span className="tag">
                <div className="tag-avatar">{person.name[0]}</div>
                {person.name}
              </span>
            )}
          </div>

          {/* Touches (History) */}
          {activity.touches && activity.touches.map((touch, i) => (
            <div key={i} className="activity-card-touch">
              <div className="activity-card-touch-icon">
                <MessageSquare size={12} color="white" />
              </div>
              <div className="activity-card-touch-content">
                <p>{touch.note}</p>
                <span>{formatFullDate(touch.date)}</span>
              </div>
            </div>
          ))}

          {/* Touch Input Area */}
          {isTouching && (
            <form onSubmit={handleTouch} className="mt-3">
              <input
                autoFocus
                type="text"
                className="form-input form-textarea-touch"
                placeholder="What happened next? (e.g. They replied, scheduled interview...)"
                value={touchNote}
                onChange={(e) => setTouchNote(e.target.value)}
              />
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="submit" className="btn btn-touch btn-sm">Add Update</button>
                <button type="button" onClick={() => setIsTouching(false)} className="btn btn-secondary btn-sm">Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* Action Buttons (Right Side) */}
        <div className="activity-card-actions">
          {!isTouching && activity.status !== "closed" && (
            <button 
              onClick={() => setIsTouching(true)} 
              className="btn-action btn-action-touch" 
              title="Log an update"
            >
              <RefreshCw size={20} />
            </button>
          )}
          
          {activity.status === "closed" ? (
            <button 
              onClick={() => updateActivityStatus(activity.id, "active")} 
              className="btn-action btn-action-reopen" 
              title="Re-open"
            >
              <RefreshCw size={20} />
            </button>
          ) : (
            <button 
              onClick={() => updateActivityStatus(activity.id, "closed")} 
              className="btn-action btn-action-close" 
              title="Close activity"
            >
              <CheckCircle size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple internal helper for the company icon
function BuildingIcon({ size, style }) {
  return (
    <svg 
      width={size} height={size} style={style} 
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="9" y1="22" x2="9" y2="22.01"></line>
      <line x1="15" y1="22" x2="15" y2="22.01"></line>
      <line x1="12" y1="22" x2="12" y2="22.01"></line>
      <line x1="12" y1="2" x2="12" y2="22"></line>
    </svg>
  );
}