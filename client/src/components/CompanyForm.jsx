import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function CompanyForm({ onClose, initialData = null }) {
  const { addCompany, updateCompany } = useAuth();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    tier: initialData?.tier || "meh",
    link: initialData?.link || "",
    notes: initialData?.notes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateCompany(initialData.id, formData);
    } else {
      addCompany({
        ...formData,
        id: crypto.randomUUID(),
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Edit Company" : "Add Company"}</h2>
          <p className="modal-subtitle">Track your target companies</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                required
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tier</label>
              <select
                className="form-select"
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
              >
                <option value="dream">Dream (★)</option>
                <option value="meh">Meh (○)</option>
                <option value="blacklist">Blacklist (✕)</option>
                <option value="researching">Researching (?)</option>
                <option value="reference">Reference (-)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Website URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}