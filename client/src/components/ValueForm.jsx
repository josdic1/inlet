import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function ValueForm({ onClose, initialData = null }) {
  const { addValue, updateValue } = useAuth();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    text: initialData?.text || "",
    type: initialData?.type || "good",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateValue(initialData.id, formData);
    } else {
      addValue({
        ...formData,
        id: crypto.randomUUID(),
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Edit Value" : "Add Value"}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Value / Non-Negotiable</label>
              <input
                required
                type="text"
                className="form-input"
                placeholder="e.g. Remote work, No micromanagement"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="form-type-buttons">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "good" })}
                  className={`form-type-btn ${formData.type === "good" ? "form-type-btn-active" : ""}`}
                  style={{ backgroundColor: formData.type === "good" ? "var(--color-good-light)" : "", color: formData.type === "good" ? "var(--color-good)" : "", borderColor: "var(--color-good)" }}
                >
                  Must Have (Good)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "bad" })}
                  className={`form-type-btn ${formData.type === "bad" ? "form-type-btn-active" : ""}`}
                  style={{ backgroundColor: formData.type === "bad" ? "var(--color-bad-light)" : "", color: formData.type === "bad" ? "var(--color-bad)" : "", borderColor: "var(--color-bad)" }}
                >
                  Deal Breaker (Bad)
                </button>
              </div>
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