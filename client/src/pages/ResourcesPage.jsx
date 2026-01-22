import { useState } from "react";
import { Plus, Edit2, ExternalLink } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ResourceForm } from "../components/ResourceForm";

export function ResourcesPage() {
  const { data, formatDate } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (resource) => {
    setEditingItem(resource);
    setIsFormOpen(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Resources</h1>
          <p className="page-subtitle">Tools, communities, and support for your search</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary btn-with-icon">
          <Plus size={20} />
          Add Resource
        </button>
      </div>

      <div className="resource-list">
        {data.resources.map((resource) => (
          <div key={resource.id} className="resource-card">
            <div className="resource-card-main">
              <div className="resource-card-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3>{resource.name}</h3>
                  <button onClick={() => handleOpenEdit(resource)} className="btn-icon">
                    <Edit2 size={14} />
                  </button>
                </div>
                {resource.notes && <p>{resource.notes}</p>}
              </div>
              <div className="resource-card-engagement">
                <span className="resource-card-label">Last engaged</span>
                <span className="resource-card-date">
                  {formatDate(resource.lastEngaged)}
                </span>
              </div>
            </div>

            {resource.link && (
              <a href={resource.link} target="_blank" rel="noopener noreferrer" className="resource-card-link">
                <ExternalLink size={14} />
                {resource.link.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        ))}
      </div>
      {isFormOpen && <ResourceForm initialData={editingItem} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}