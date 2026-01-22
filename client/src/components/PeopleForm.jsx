import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function PeopleForm({ onClose, initialData = null }) {
  const { data, addPerson, updatePerson } = useAuth();
  
  // If initialData exists, we are editing. If null, we are creating.
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    role: initialData?.role || "",
    companyId: initialData?.companyId || "",
    link: initialData?.link || "",
    notes: initialData?.notes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      updatePerson(initialData.id, formData);
    } else {
      addPerson({
        ...formData,
        id: crypto.randomUUID(), // distinct ID generation
        dateAdded: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Edit Person" : "Add Person"}</h2>
          <p className="modal-subtitle">
            {isEditing ? "Update contact details" : "Add someone to your network"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                required
                type="text"
                className="form-input"
                placeholder="e.g. Sarah Connor"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label">Role</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Senior Recruiter"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
            </div>

            {/* Company Select */}
            <div className="form-group">
              <label className="form-label">Company</label>
              <select
                className="form-select"
                value={formData.companyId}
                onChange={(e) =>
                  setFormData({ ...formData, companyId: e.target.value })
                }
              >
                <option value="">No Company / Freelance</option>
                {data.companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {/* LinkedIn/Social Link */}
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://linkedin.com/in/..."
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
              />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Met at generic tech meetup..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Save Changes" : "Add Person"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}