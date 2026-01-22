import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function ResourceForm({ onClose, initialData = null }) {
  const { addResource, updateResource } = useAuth();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    link: initialData?.link || "",
    notes: initialData?.notes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateResource(initialData.id, formData);
    } else {
      addResource({
        ...formData,
        id: crypto.randomUUID(),
        lastEngaged: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Edit Resource" : "Add Resource"}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                required
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Link</label>
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