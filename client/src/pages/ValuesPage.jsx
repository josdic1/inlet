import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ValueForm } from "../components/ValueForm";

export function ValuesPage() {
  const { data } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (value) => {
    setEditingItem(value);
    setIsFormOpen(true);
  };

  const goodValues = data.values.filter((v) => v.type === "good");
  const badValues = data.values.filter((v) => v.type === "bad");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Values</h1>
          <p className="page-subtitle">Your non-negotiables and deal breakers</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary btn-with-icon">
          <Plus size={20} />
          Add Value
        </button>
      </div>

      <div className="values-grid">
        <div className="values-column">
          <h3 className="values-column-header values-column-header-good">
            <span className="values-column-icon">
              <Check size={20} />
            </span>
            Must Have
          </h3>
          <div className="values-list">
            {goodValues.map((value) => (
              <div
                key={value.id}
                className="value-card value-card-good"
                onClick={() => handleOpenEdit(value)}
                style={{ cursor: "pointer" }}
                title="Click to edit"
              >
                {value.text}
              </div>
            ))}
          </div>
        </div>

        <div className="values-column">
          <h3 className="values-column-header values-column-header-bad">
            <span className="values-column-icon">
              <X size={20} />
            </span>
            Deal Breakers
          </h3>
          <div className="values-list">
            {badValues.map((value) => (
              <div
                key={value.id}
                className="value-card value-card-bad"
                onClick={() => handleOpenEdit(value)}
                style={{ cursor: "pointer" }}
                title="Click to edit"
              >
                {value.text}
              </div>
            ))}
          </div>
        </div>
      </div>
      {isFormOpen && <ValueForm initialData={editingItem} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}