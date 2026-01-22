import { useState } from "react";
import { Plus, Edit2, Globe, Star, Circle, X, Archive } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { CompanyForm } from "../components/CompanyForm";

export function CompaniesPage() {
  const { data } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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

  // We now use Lucide components directly in the config
  const tierConfig = {
    dream: { Icon: Star, label: "Dream" },
    meh: { Icon: Circle, label: "Meh" },
    blacklist: { Icon: X, label: "Blacklist" },
    reference: { label: "Reference", Icon: Archive, color: "#94a3b8" }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Companies</h1>
          <p className="page-subtitle">Track your target companies and tiers</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary btn-with-icon">
          <Plus size={20} />
          Add Company
        </button>
      </div>

      <div className="card-grid">
        {data.companies.map((company) => {
          const relatedActivities = data.activities.filter((a) => a.companyId === company.id);
          const relatedPeople = data.people.filter((p) => p.companyId === company.id);
          
          const config = tierConfig[company.tier];
          const TierIcon = config.Icon;

          return (
            <div key={company.id} className={`company-card company-card-${company.tier}`}>
              <div className="company-card-header">
                <div className="company-card-title">
                  <span className="company-card-icon">
                    <TierIcon size={18} />
                  </span>
                  <h3>{company.name}</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={`badge badge-tier-${company.tier}`}>{config.label}</span>
                  <button onClick={(e) => handleOpenEdit(e, company)}className="btn-icon">
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>

              {company.notes && <p className="company-card-notes">{company.notes}</p>}

              {company.link && (
                <a href={company.link} target="_blank" rel="noopener noreferrer" className="company-card-link">
                  <Globe size={14} />
                  Website
                </a>
              )}

              <div className="company-card-footer">
                <span>{relatedActivities.length} activities</span>
                <span>{relatedPeople.length} contacts</span>
              </div>
            </div>
          );
        })}
      </div>
      {isFormOpen && <CompanyForm initialData={editingItem} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}