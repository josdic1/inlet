// src/pages/PeoplePage.jsx
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Edit2, Linkedin, Search, RotateCcw } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { PeopleForm } from "../components/PeopleForm";

const normalize = (s) => (s ?? "").toString().toLowerCase().trim();
const toTime = (v) => {
  if (!v) return 0;
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
};

export function PeoplePage() {
  const { data, getCompany } = useAuth();
  const [searchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  const urlCompany = searchParams.get("company") || "all";

  const [search, setSearch] = useState("");
  const [company, setCompany] = useState(urlCompany);
  const [hasLinkedIn, setHasLinkedIn] = useState("any"); // any|yes|no
  const [refreshKey, setRefreshKey] = useState(0);

  const people = useMemo(() => {
    const q = normalize(search);
    let out = [...(data.people ?? [])];

    if (company !== "all") out = out.filter((p) => p.companyId === company);

    if (hasLinkedIn !== "any") {
      const want = hasLinkedIn === "yes";
      out = out.filter((p) => Boolean(p.link) === want);
    }

    if (q) {
      out = out.filter((p) => {
        const c = p.companyId ? (getCompany(p.companyId)?.name ?? "") : "";
        const hay =
          `${p.name ?? ""} ${p.role ?? ""} ${p.notes ?? ""} ${c} ${p.link ?? ""}`.toLowerCase();
        return hay.includes(q);
      });
    }

    // Default sort: updatedAt fallback created fallback name
    out.sort((a, b) => {
      const at = toTime(a.updatedAt) || toTime(a.created);
      const bt = toTime(b.updatedAt) || toTime(b.created);
      if (bt !== at) return bt - at;
      return (a.name ?? "").localeCompare(b.name ?? "");
    });

    return out;
  }, [
    data.people,
    data.companies,
    company,
    hasLinkedIn,
    search,
    refreshKey,
    getCompany,
  ]);

  const handleOpenAdd = (e) => {
    e.stopPropagation();
    setEditingPerson(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (e, person) => {
    e.stopPropagation();
    setEditingPerson(person);
    setIsFormOpen(true);
  };

  const handleReset = () => {
    setSearch("");
    setCompany(urlCompany); // return to URL default
    setHasLinkedIn("any");
  };

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">People</h1>
          <p className="page-subtitle">Your network and contacts</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn btn-primary btn-with-icon"
        >
          <Plus size={20} />
          Add Person
        </button>
      </div>

      <div className="page-controls">
        <div className="page-controls-left">
          <div className="page-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people…"
            />
          </div>

          <select
            className="page-select"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
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

          <select
            className="page-select"
            value={hasLinkedIn}
            onChange={(e) => setHasLinkedIn(e.target.value)}
          >
            <option value="any">LinkedIn: Any</option>
            <option value="yes">LinkedIn: Yes</option>
            <option value="no">LinkedIn: No</option>
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
          <button onClick={handleRefresh} className="btn btn-secondary">
            Refresh
          </button>
          <div className="page-count">{people.length}</div>
        </div>
      </div>

      <div className="card-grid">
        {people.map((person) => {
          const companyObj = person.companyId
            ? getCompany(person.companyId)
            : null;
          const relatedActivities = data.activities.filter(
            (a) => a.personId === person.id,
          );

          return (
            <div key={person.id} className="person-card">
              <div className="person-card-header">
                <div className="person-avatar">
                  {(person.name ?? "")
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="person-info">
                  <h3>{person.name}</h3>
                  <p>
                    {person.role}
                    {companyObj && ` @ ${companyObj.name}`}
                  </p>
                </div>

                <button
                  onClick={(e) => handleOpenEdit(e, person)}
                  className="btn-icon"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
              </div>

              {person.notes && (
                <p className="person-card-notes">{person.notes}</p>
              )}

              <div className="person-card-footer">
                {person.link && (
                  <a
                    href={person.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-linkedin"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                <span className="person-activity-count">
                  {relatedActivities.length} activities
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {isFormOpen && (
        <PeopleForm
          initialData={editingPerson}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
