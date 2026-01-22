import { useState } from "react";
import { Plus, Edit2, Copy, Check, ExternalLink, Mail, FileText } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { DocumentForm } from "../components/DocumentForm";

export function DocumentsPage() {
  const { data, getPerson, getCompany, formatDate } = useAuth();
  const [copiedId, setCopiedId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setEditingItem(doc);
    setIsFormOpen(true);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">Your resumes, cover letters, and portfolio</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary btn-with-icon">
          <Plus size={20} />
          Add Document
        </button>
      </div>

      <div className="document-list">
        {data.documents.map((doc) => {
          const sentTo = data.activities
            .filter((a) => a.documentIds.includes(doc.id))
            .map((a) => ({
              activity: a,
              person: a.personId ? getPerson(a.personId) : null,
              company: a.companyId ? getCompany(a.companyId) : null,
            }));

          return (
            <div key={doc.id} className="document-card">
              <div className="document-card-main">
                <div className="document-card-icon">
                  <FileText size={24} />
                </div>
                <div className="document-card-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3>{doc.name}</h3>
                    <button onClick={() => handleOpenEdit(doc)} className="btn-icon" title="Edit">
                      <Edit2 size={16} />
                    </button>
                  </div>
                  <p>{doc.type}</p>
                </div>
                <div className="document-card-actions">
                  <button
                    onClick={() => copyToClipboard(doc.link, doc.id)}
                    className={`btn-icon ${copiedId === doc.id ? "btn-icon-success" : ""}`}
                    title="Copy link"
                  >
                    {copiedId === doc.id ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                  
                  <a href={doc.link} target="_blank" rel="noopener noreferrer" className="btn-icon" title="Open">
                    <ExternalLink size={18} />
                  </a>
                  
                  <a href={`mailto:?subject=&body=Here's my ${doc.type}: ${doc.link}`} className="btn-icon btn-icon-email" title="Email">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
              
              {sentTo.length > 0 && (
                <div className="document-card-history">
                  <p className="document-card-history-label">Sent to:</p>
                  <div className="document-card-history-tags">
                    {sentTo.map(({ activity, person, company }) => (
                      <span key={activity.id} className="tag tag-small">
                        {person?.name || company?.name || "Unknown"}
                        <span className="tag-date">• {formatDate(activity.created)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {isFormOpen && <DocumentForm initialData={editingItem} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}