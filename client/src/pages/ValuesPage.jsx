// src/pages/ValuesPage.jsx
import { useMemo, useState } from "react";
import { Plus, Check, X, Search, RotateCcw } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ValueForm } from "../components/ValueForm";

const normalize = (s) => (s ?? "").toString().toLowerCase().trim();

export function ValuesPage() {
  const { data } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenAdd = (e) => {
    e.stopPropagation();
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (e, value) => {
    e.stopPropagation();
    setEditingItem(value);
    setIsFormOpen(true);
  };

  const filtered = useMemo(() => {
    const q = normalize(search);
    let out = data.values ?? [];
    if (q) out = out.filter((v) => normalize(v.text).includes(q));
    // refreshKey included so Refresh re-runs memo
    return out;
  }, [data.values, search, refreshKey]);

  const goodValues = useMemo(
    () =>
      filtered
        .filter((v) => v.type === "good")
        .sort((a, b) => a.text.localeCompare(b.text)),
    [filtered],
  );

  const badValues = useMemo(
    () =>
      filtered
        .filter((v) => v.type === "bad")
        .sort((a, b) => a.text.localeCompare(b.text)),
    [filtered],
  );

  const handleReset = () => setSearch("");
  const handleRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Values</h1>
          <p className="page-subtitle">
            Your non-negotiables and deal breakers
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn btn-primary btn-with-icon"
        >
          <Plus size={20} />
          Add Value
        </button>
      </div>

      <div className="page-controls">
        <div className="page-controls-left">
          <div className="page-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search values…"
            />
          </div>
        </div>
        <div className="page-controls-right">
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
          <div className="page-count">{filtered.length}</div>
        </div>
      </div>

      <div className="values-grid">
        <div className="values-column">
          <h3 className="values-column-header values-column-header-good">
            <span className="values-column-icon">
              <Check size={20} />
            </span>
            Must Have
          </h3>
          <div className="values-list">
            {goodValues.map((value) => (
              <div
                key={value.id}
                className="value-card value-card-good"
                onClick={(e) => handleOpenEdit(e, value)}
                style={{ cursor: "pointer" }}
                title="Click to edit"
              >
                {value.text}
              </div>
            ))}
          </div>
        </div>

        <div className="values-column">
          <h3 className="values-column-header values-column-header-bad">
            <span className="values-column-icon">
              <X size={20} />
            </span>
            Deal Breakers
          </h3>
          <div className="values-list">
            {badValues.map((value) => (
              <div
                key={value.id}
                className="value-card value-card-bad"
                onClick={(e) => handleOpenEdit(e, value)}
                style={{ cursor: "pointer" }}
                title="Click to edit"
              >
                {value.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isFormOpen && (
        <ValueForm
          initialData={editingItem}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
