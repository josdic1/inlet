import { useState } from "react";
import { Mail, Briefcase, Users, PenTool, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function QuickAddModal({ onClose }) {
  const { addActivity, data } = useAuth();
  
  const [formData, setFormData] = useState({
    type: "outreach",
    note: "",
    link: "",
    companyId: "",
    personId: ""
  });

  // Only close when clicking the actual overlay background
  const handleOverlayClick = (e) => {
    // Only close if the click target IS the overlay itself
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addActivity({
      ...formData,
      status: "open"
    });
    onClose();
  };

  const types = [
    { id: "outreach", label: "Outreach", Icon: Mail, color: "var(--color-outreach)" },
    { id: "application", label: "Application", Icon: Briefcase, color: "var(--color-application)" },
    { id: "networking", label: "Networking", Icon: Users, color: "var(--color-networking)" },
    { id: "content", label: "Content", Icon: PenTool, color: "var(--color-content)" },
  ];

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>Quick Add</h2>
            <p className="modal-subtitle">Log a new activity</p>
          </div>
          <button type="button" onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            {/* Type Selector */}
            <div className="form-group">
              <label className="form-label">Activity Type</label>
              <div className="form-type-buttons">
                {types.map(({ id, label, Icon, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: id })}
                    className={`form-type-btn ${formData.type === id ? "form-type-btn-active" : ""}`}
                    style={formData.type === id ? { borderColor: color, color: color, backgroundColor: `${color}10` } : {}}
                  >
                    <Icon size={16} style={{ marginBottom: 4 }} />
                    <div style={{ fontSize: 11 }}>{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Input */}
            <div className="form-group">
              <label className="form-label">What did you do?</label>
              <textarea
                autoFocus
                required
                className="form-textarea"
                rows="3"
                placeholder="E.g. Sent cold email to Sarah regarding Senior Dev role..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>

            {/* Company Dropdown */}
            <div className="form-group">
              <label className="form-label">Company (Optional)</label>
              <select
                className="form-select"
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
              >
                <option value="">-- Select Company --</option>
                {data.companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Link Input */}
            <div className="form-group">
              <label className="form-label">Link (Optional)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Log Activity</button>
          </div>
        </form>
      </div>
    </div>
  );
}