import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, ClipboardList } from "lucide-react"; // <--- Clean imports
import { useAuth } from "../hooks/useAuth";
import { ActivityCard } from "../components/ActivityCard";
import { QuickAddModal } from "../components/QuickAddModal";
import { ActiveBanner } from "../components/ActiveBanner";

export function ActivityPage() {
  const { data, getLatestTimestamp } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const activityFilter = searchParams.get("type") || "all";
  const statusFilter = searchParams.get("status") || "all";

  const setActivityFilter = (type) => {
    const params = new URLSearchParams(searchParams);
    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    setSearchParams(params);
  };

  const setStatusFilter = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    setSearchParams(params);
  };

  const filteredActivities = useMemo(() => {
    let filtered = [...data.activities];
    if (activityFilter !== "all") {
      filtered = filtered.filter((a) => a.type === activityFilter);
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }
    filtered.sort((a, b) => getLatestTimestamp(b) - getLatestTimestamp(a));
    return filtered;
  }, [data.activities, activityFilter, statusFilter, getLatestTimestamp]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Activity</h1>
          <p className="page-subtitle">
            Track everything you do in your job search
          </p>
        </div>
        <button
          onClick={() => setShowQuickAdd(true)}
          className="btn btn-primary btn-with-icon"
        >
          <Plus size={20} />
          Quick Add
        </button>
      </div>

      <ActiveBanner />

      <div className="filters">
        <div className="filter-group">
          {["all", "outreach", "application", "networking", "content"].map(
            (type) => (
              <button
                key={type}
                onClick={() => setActivityFilter(type)}
                className={`filter-btn ${activityFilter === type ? "filter-btn-active" : ""}`}
              >
                {type === "all" ? "All Types" : type}
              </button>
            ),
          )}
        </div>
        <div className="filter-group">
          {["all", "open", "active", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`filter-btn ${statusFilter === status ? "filter-btn-active" : ""}`}
            >
              {status === "all" ? "All Status" : status}
            </button>
          ))}
        </div>
        <span className="filter-count">
          {filteredActivities.length} activit
          {filteredActivities.length !== 1 ? "ies" : "y"}
        </span>
      </div>

      <div className="activity-list">
        {filteredActivities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ClipboardList size={32} />
            </div>
            <p className="empty-state-title">No activities yet</p>
            <p className="empty-state-text">Click Quick Add to get started!</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        )}
      </div>

      {showQuickAdd && <QuickAddModal onClose={() => setShowQuickAdd(false)} />}
    </div>
  );
}
