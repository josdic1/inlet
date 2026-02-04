// src/pages/ResourcesPage.jsx
import { useMemo, useState } from "react";
import { Plus, Edit2, ExternalLink, Search, RotateCcw } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ResourceForm } from "../components/ResourceForm";

const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));

const toTime = (v) => {
  if (!v) return 0;
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
};

const normalize = (s) => (s ?? "").toString().toLowerCase().trim();

export function ResourcesPage() {
  const { data, formatDate } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // filters (UI state)
  const [search, setSearch] = useState("");
  const [filterHasLink, setFilterHasLink] = useState("any"); // any | yes | no
  const [filterEngaged, setFilterEngaged] = useState("any"); // any | yes | no

  // "Refresh" triggers a re-apply (and is a good place to re-fetch if you later add it)
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenAdd = (e) => {
    e.stopPropagation();
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (e, resource) => {
    e.stopPropagation();
    setEditingItem(resource);
    setIsFormOpen(true);
  };

  const resources = data?.resources ?? [];

  // optional: build dropdown options if you later add a "category" or "type" field
  // const categories = useMemo(() => uniq(resources.map(r => r.category)), [resources]);

  const filteredAndSorted = useMemo(() => {
    const q = normalize(search);

    let out = resources.filter((r) => {
      // text search (name + notes + link)
      if (q) {
        const hay =
          `${r.name ?? ""} ${r.notes ?? ""} ${r.link ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // has link filter
      if (filterHasLink !== "any") {
        const has = Boolean(r.link);
        if (filterHasLink === "yes" && !has) return false;
        if (filterHasLink === "no" && has) return false;
      }

      // engaged filter (based on lastEngaged existing)
      if (filterEngaged !== "any") {
        const has = Boolean(r.lastEngaged);
        if (filterEngaged === "yes" && !has) return false;
        if (filterEngaged === "no" && has) return false;
      }

      return true;
    });

    // default sort: most recently updated
    // uses updatedAt if present, otherwise falls back to lastEngaged, otherwise 0
    out.sort((a, b) => {
      const at = toTime(a.updatedAt) || toTime(a.lastEngaged);
      const bt = toTime(b.updatedAt) || toTime(b.lastEngaged);
      return bt - at;
    });

    return out;
    // refreshKey intentionally included to re-run when you press "Refresh"
  }, [resources, search, filterHasLink, filterEngaged, refreshKey]);

  const handleReset = () => {
    setSearch("");
    setFilterHasLink("any");
    setFilterEngaged("any");
  };

  const handleRefresh = () => {
    // If you later add a data re-fetch, call it here too.
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Resources</h1>
          <p className="page-subtitle">
            Tools, communities, and support for your search
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn btn-primary btn-with-icon"
        >
          <Plus size={20} />
          Add Resource
        </button>
      </div>

      {/* Controls: search + dropdowns + reset/refresh */}
      <div className="resource-controls">
        <div className="resource-controls-left">
          <div className="resource-search">
            <Search size={16} />
            <input
              className="resource-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources…"
              aria-label="Search resources"
            />
          </div>

          <select
            className="resource-select"
            value={filterHasLink}
            onChange={(e) => setFilterHasLink(e.target.value)}
            aria-label="Filter by link"
          >
            <option value="any">Link: Any</option>
            <option value="yes">Link: Yes</option>
            <option value="no">Link: No</option>
          </select>

          <select
            className="resource-select"
            value={filterEngaged}
            onChange={(e) => setFilterEngaged(e.target.value)}
            aria-label="Filter by engaged"
          >
            <option value="any">Engaged: Any</option>
            <option value="yes">Engaged: Yes</option>
            <option value="no">Engaged: No</option>
          </select>
        </div>

        <div className="resource-controls-right">
          <button
            onClick={handleReset}
            className="btn btn-secondary btn-with-icon"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          <button onClick={handleRefresh} className="btn btn-secondary">
            Refresh
          </button>
          <div className="resource-count">
            {filteredAndSorted.length} / {resources.length}
          </div>
        </div>
      </div>

      <div className="resource-list">
        {filteredAndSorted.map((resource) => (
          <div key={resource.id} className="resource-card">
            <div className="resource-card-main">
              <div className="resource-card-info">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <h3>{resource.name}</h3>
                  <button
                    onClick={(e) => handleOpenEdit(e, resource)}
                    className="btn-icon"
                    aria-label={`Edit ${resource.name}`}
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
                {resource.notes && <p>{resource.notes}</p>}
              </div>

              <div className="resource-card-engagement">
                <span className="resource-card-label">
                  {resource.updatedAt ? "Last updated" : "Last engaged"}
                </span>
                <span className="resource-card-date">
                  {formatDate(resource.updatedAt || resource.lastEngaged)}
                </span>
              </div>
            </div>

            {resource.link && (
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-card-link"
              >
                <ExternalLink size={14} />
                {resource.link.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        ))}
      </div>

      {isFormOpen && (
        <ResourceForm
          initialData={editingItem}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
