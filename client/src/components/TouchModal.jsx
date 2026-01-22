import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function TouchModal({ activityId, onClose }) {
  const { touchActivity } = useAuth();
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    touchActivity(activityId, note);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Something Happened!</h2>
          <p className="modal-subtitle">Record the response or update</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What happened? e.g., They responded! Setting up a call..."
            className="form-textarea form-textarea-touch"
            rows={3}
            autoFocus
          />
        </form>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!note.trim()}
            className="btn btn-touch"
          >
            Record Touch
          </button>
        </div>
      </div>
    </div>
  );
}
