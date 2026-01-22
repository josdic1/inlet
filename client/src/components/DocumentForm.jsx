import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function DocumentForm({ onClose, initialData = null }) {
  const { addDocument, updateDocument } = useAuth();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "Resume",
    link: initialData?.link || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateDocument(initialData.id, formData);
    } else {
      addDocument({
        ...formData,
        id: crypto.randomUUID(),
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Edit Document" : "Add Document"}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Document Name</label>
              <input
                required
                type="text"
                className="form-input"
                placeholder="e.g. Resume V2 - Tech Focus"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="form-doc-buttons">
                {["Resume", "Cover Letter", "Portfolio"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`form-doc-btn ${formData.type === type ? "form-doc-btn-active" : ""}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Link</label>
              <input
                required
                type="url"
                className="form-input"
                placeholder="Google Drive link..."
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
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