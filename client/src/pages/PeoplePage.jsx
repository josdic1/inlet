import { useState } from "react";
import { Plus, Edit2, Linkedin } from "lucide-react"; // <--- Look how clean imports are
import { useAuth } from "../hooks/useAuth";
import { PeopleForm } from "../components/PeopleForm";

export function PeoplePage() {
  const { data, getCompany } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

const handleOpenAdd = (e) => {
  e.stopPropagation();
  setEditingPerson(null);
  setIsFormOpen(true);
};

const handleOpenEdit = (e, person) => {
  e.stopPropagation();
  setEditingPerson(person);
  setIsFormOpen(true);
};
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">People</h1>
          <p className="page-subtitle">Your network and contacts</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn btn-primary btn-with-icon"
        >
          <Plus size={20} />
          Add Person
        </button>
      </div>

      <div className="card-grid">
        {data.people.map((person) => {
          const company = person.companyId
            ? getCompany(person.companyId)
            : null;
          const relatedActivities = data.activities.filter(
            (a) => a.personId === person.id,
          );

          return (
            <div key={person.id} className="person-card">
              <div className="person-card-header">
                <div className="person-avatar">
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="person-info">
                  <h3>{person.name}</h3>
                  <p>
                    {person.role}
                    {company && ` @ ${company.name}`}
                  </p>
                </div>

                <button onClick={(e) => handleOpenEdit(e, person)} className="btn-icon" title="Edit">
                  <Edit2 size={16} />
                </button>
              </div>

              {person.notes && (
                <p className="person-card-notes">{person.notes}</p>
              )}

              <div className="person-card-footer">
                {person.link && (
                  <a
                    href={person.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-linkedin"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                <span className="person-activity-count">
                  {relatedActivities.length} activities
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {isFormOpen && (
        <PeopleForm
          initialData={editingPerson}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
