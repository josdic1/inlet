import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, ClipboardList, Search, RotateCcw } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ActivityCard } from "../components/ActivityCard";
import { QuickAddModal } from "../components/QuickAddModal";
import { ActiveBanner } from "../components/ActiveBanner";

const normalize = (s) => (s ?? "").toString().toLowerCase().trim();

export function ActivityPage() {
  const { data, getLatestTimestamp, getCompany } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const activityFilter = searchParams.get("type") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const urlCompanyFilter = searchParams.get("company") || "all";

  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState(urlCompanyFilter);

  const setActivityFilter = (type) => {
    const params = new URLSearchParams(searchParams);
    if (type === "all") params.delete("type");
    else params.set("type", type);
    setSearchParams(params);
  };

  const setStatusFilter = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status === "all") params.delete("status");
    else params.set("status", status);
    setSearchParams(params);
  };

  const setCompanyParam = (companyId) => {
    const params = new URLSearchParams(searchParams);
    if (!companyId || companyId === "all") params.delete("company");
    else params.set("company", companyId);

    setSearchParams(params);
    setCompanyFilter(companyId || "all");
  };

  const filteredActivities = useMemo(() => {
    const q = normalize(search);
    let filtered = [...(data.activities ?? [])];

    if (activityFilter !== "all")
      filtered = filtered.filter((a) => a.type === activityFilter);

    if (statusFilter !== "all")
      filtered = filtered.filter((a) => a.status === statusFilter);

    if (companyFilter !== "all")
      filtered = filtered.filter((a) => a.companyId === companyFilter);

    if (q) {
      filtered = filtered.filter((a) => {
        const companyName = a.companyId
          ? (getCompany?.(a.companyId)?.name ?? "")
          : "";

        const hay = `${a.note ?? ""} ${a.type ?? ""} ${
          a.status ?? ""
        } ${companyName}`.toLowerCase();

        return hay.includes(q);
      });
    }

    filtered.sort((a, b) => getLatestTimestamp(b) - getLatestTimestamp(a));

    return filtered;
  }, [
    data.activities,
    activityFilter,
    statusFilter,
    companyFilter,
    search,
    getLatestTimestamp,
    getCompany,
  ]);

  const handleReset = () => {
    setSearch("");
    setCompanyParam("all");
    setActivityFilter("all");
    setStatusFilter("all");
  };

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

      <div className="page-controls">
        <div className="page-controls-left">
          <div className="page-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search activity…"
            />
          </div>

          <select
            className="page-select"
            value={companyFilter}
            onChange={(e) => setCompanyParam(e.target.value)}
          >
            <option value="all">Company: All</option>

            {(data.companies ?? [])
              .slice()
              .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
              .map((c) => (
                <option key={c.id} value={c.id}>
                  Company: {c.name}
                </option>
              ))}
          </select>
        </div>

        <div className="page-controls-right">
          <button
            onClick={handleReset}
            className="btn btn-secondary btn-with-icon"
          >
            <RotateCcw size={18} />
            Reset
          </button>

          <span className="filter-count">
            {filteredActivities.length} activit
            {filteredActivities.length !== 1 ? "ies" : "y"}
          </span>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          {["all", "outreach", "application", "networking", "content"].map(
            (type) => (
              <button
                key={type}
                onClick={() => setActivityFilter(type)}
                className={`filter-btn ${
                  activityFilter === type ? "filter-btn-active" : ""
                }`}
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
              className={`filter-btn ${
                statusFilter === status ? "filter-btn-active" : ""
              }`}
            >
              {status === "all" ? "All Status" : status}
            </button>
          ))}
        </div>
      </div>

      <div id="active" />

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
