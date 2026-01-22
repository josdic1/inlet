import { 
  Activity, Users, Building2, FileText, 
  BookOpen, CheckCircle, Plus 
} from "lucide-react";

export function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>How to use Job Search HQ</h2>
          <p className="modal-subtitle">A quick guide to tracking your progress</p>
        </div>

        <div className="modal-body">
          <div className="help-section">
            <h3 className="help-title">
              <Activity size={18} /> The Core Loop
            </h3>
            <p className="help-text">
              Everything centers around <strong>Activity</strong>. Did you send an email? Apply online? Meet for coffee? 
              Click <span className="help-highlight"><Plus size={12}/> Quick Add</span> to log it. 
              This builds your history automatically.
            </p>
          </div>

          <div className="help-grid">
            <div className="help-item">
              <Users size={20} className="help-icon-people" />
              <div>
                <strong>People</strong>
                <p>Recruiters & hiring managers. Link them to companies.</p>
              </div>
            </div>

            <div className="help-item">
              <Building2 size={20} className="help-icon-company" />
              <div>
                <strong>Companies</strong>
                <p>Target list. Rate them as "Dream", "Meh", or "Blacklist".</p>
              </div>
            </div>

            <div className="help-item">
              <FileText size={20} className="help-icon-doc" />
              <div>
                <strong>Documents</strong>
                <p>Upload resumes. We track which version you sent to whom.</p>
              </div>
            </div>

            <div className="help-item">
              <CheckCircle size={20} className="help-icon-val" />
              <div>
                <strong>Values</strong>
                <p>Define your "Must Haves" so you don't compromise.</p>
              </div>
            </div>
          </div>

          <div className="help-footer-note">
            <p>
              <strong>Pro Tip:</strong> Use the <BookOpen size={14}/> <strong>Resources</strong> tab to save useful tools and job board links so you don't lose them.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary" style={{ width: "100%" }}>
            Got it, let's work!
          </button>
        </div>
      </div>
    </div>
  );
}