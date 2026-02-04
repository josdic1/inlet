// src/pages/CompaniesPage.jsx
import { useMemo, useState } from "react";
import {
  Plus,
  Edit2,
  Globe,
  Star,
  Circle,
  X,
  Archive,
  Binoculars,
  Search,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { CompanyForm } from "../components/CompanyForm";

const normalize = (s) => (s ?? "").toString().toLowerCase().trim();
const toTime = (v) => {
  if (!v) return 0;
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
};

export function CompaniesPage() {
  const { data } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenAdd = (e) => {
    e.stopPropagation();
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (e, company) => {
    e.stopPropagation();
    setEditingItem(company);
    setIsFormOpen(true);
  };

  const tierConfig = {
    dream: { Icon: Star, label: "Dream" },
    meh: { Icon: Circle, label: "Meh" },
    blacklist: { Icon: X, label: "Blacklist" },
    reference: { label: "Reference", Icon: Archive },
    researching: { label: "Researching", Icon: Binoculars },
  };

  const companies = useMemo(() => {
    const q = normalize(search);
    let out = [...(data.companies ?? [])];

    if (tier !== "all") out = out.filter((c) => c.tier === tier);

    if (q) {
      out = out.filter((c) => {
        const hay =
          `${c.name ?? ""} ${c.notes ?? ""} ${c.link ?? ""}`.toLowerCase();
        return hay.includes(q);
      });
    }

    // Default sort: most recently updated (updatedAt) fallback created
    out.sort((a, b) => {
      const at = toTime(a.updatedAt) || toTime(a.created);
      const bt = toTime(b.updatedAt) || toTime(b.created);
      return bt - at;
    });

    return out;
  }, [data.companies, search, tier, refreshKey]);

  const handleReset = () => {
    setSearch("");
    setTier("all");
  };
  const handleRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Companies</h1>
          <p className="page-subtitle">Track your target companies and tiers</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn btn-primary btn-with-icon"
        >
          <Plus size={20} />
          Add Company
        </button>
      </div>

      <div className="page-controls">
        <div className="page-controls-left">
          <div className="page-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies…"
            />
          </div>

          <select
            className="page-select"
            value={tier}
            onChange={(e) => setTier(e.target.value)}
          >
            <option value="all">Tier: All</option>
            {Object.keys(tierConfig).map((t) => (
              <option key={t} value={t}>
                Tier: {tierConfig[t].label}
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
          <button onClick={handleRefresh} className="btn btn-secondary">
            Refresh
          </button>
          <div className="page-count">{companies.length}</div>
        </div>
      </div>

      <div className="card-grid">
        {companies.map((company) => {
          const relatedActivities = data.activities.filter(
            (a) => a.companyId === company.id,
          );
          const relatedPeople = data.people.filter(
            (p) => p.companyId === company.id,
          );

          const config = tierConfig[company.tier];
          const TierIcon = config?.Icon ?? Circle;

          return (
            <div
              key={company.id}
              className={`company-card company-card-${company.tier}`}
            >
              <div className="company-card-header">
                <div className="company-card-title">
                  <span className="company-card-icon">
                    <TierIcon size={18} />
                  </span>
                  <h3>{company.name}</h3>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  <span className={`badge badge-tier-${company.tier}`}>
                    {config?.label ?? company.tier}
                  </span>
                  <button
                    onClick={(e) => handleOpenEdit(e, company)}
                    className="btn-icon"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>

              {company.notes && (
                <p className="company-card-notes">{company.notes}</p>
              )}

              {company.link && (
                <a
                  href={company.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="company-card-link"
                >
                  <Globe size={14} />
                  Website
                </a>
              )}

              <div className="company-card-footer">
                <Link to={`/?company=${company.id}`}>
                  {relatedActivities.length} activities
                </Link>
                <Link to={`/people?company=${company.id}`}>
                  {relatedPeople.length} contacts
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {isFormOpen && (
        <CompanyForm
          initialData={editingItem}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
