// src/pages/DocumentsPage.jsx
import { useMemo, useState } from "react";
import {
  Plus,
  Edit2,
  Copy,
  Check,
  ExternalLink,
  Mail,
  FileText,
  Search,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { DocumentForm } from "../components/DocumentForm";

const normalize = (s) => (s ?? "").toString().toLowerCase().trim();
const toTime = (v) => {
  if (!v) return 0;
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
};

const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));

export function DocumentsPage() {
  const { data, getPerson, getCompany, formatDate } = useAuth();
  const [copiedId, setCopiedId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const docTypes = useMemo(
    () => uniq((data.documents ?? []).map((d) => d.type)).sort(),
    [data.documents],
  );

  const documents = useMemo(() => {
    const q = normalize(search);
    let out = [...(data.documents ?? [])];

    if (type !== "all") out = out.filter((d) => d.type === type);

    if (q) {
      out = out.filter((d) => {
        const hay =
          `${d.name ?? ""} ${d.type ?? ""} ${d.link ?? ""}`.toLowerCase();
        return hay.includes(q);
      });
    }

    out.sort((a, b) => {
      const at = toTime(a.updatedAt) || toTime(a.created);
      const bt = toTime(b.updatedAt) || toTime(b.created);
      return bt - at;
    });

    return out;
  }, [data.documents, search, type, refreshKey]);

  const handleOpenAdd = (e) => {
    e.stopPropagation();
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (e, doc) => {
    e.stopPropagation();
    setEditingItem(doc);
    setIsFormOpen(true);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setSearch("");
    setType("all");
  };
  const handleRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">
            Your resumes, cover letters, and portfolio
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn btn-primary btn-with-icon"
        >
          <Plus size={20} />
          Add Document
        </button>
      </div>

      <div className="page-controls">
        <div className="page-controls-left">
          <div className="page-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents…"
            />
          </div>

          <select
            className="page-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">Type: All</option>
            {docTypes.map((t) => (
              <option key={t} value={t}>
                Type: {t}
              </option>
            ))}
          </select>
        </div>

        <div className="page-controls-right">
          <button
            onClick={handleReset}
            className="btn btn-secondary btn-with-icon"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          <button onClick={handleRefresh} className="btn btn-secondary">
            Refresh
          </button>
          <div className="page-count">{documents.length}</div>
        </div>
      </div>

      <div className="document-list">
        {documents.map((doc) => {
          const sentTo = data.activities
            .filter((a) => a.documentIds?.includes(doc.id))
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <h3>{doc.name}</h3>
                    <button
                      onClick={(e) => handleOpenEdit(e, doc)}
                      className="btn-icon"
                      title="Edit"
                    >
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
                    {copiedId === doc.id ? (
                      <Check size={18} />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>

                  <a
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-icon"
                    title="Open"
                  >
                    <ExternalLink size={18} />
                  </a>

                  <a
                    href={`mailto:?subject=&body=Here's my ${doc.type}: ${doc.link}`}
                    className="btn-icon btn-icon-email"
                    title="Email"
                  >
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
                        <span className="tag-date">
                          • {formatDate(activity.created)}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isFormOpen && (
        <DocumentForm
          initialData={editingItem}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
