import { NavLink } from "react-router-dom";
import {
  ClipboardList,
  Building2,
  Users,
  FileText,
  Heart,
  Bookmark,
  Layers, // I replaced the logo with a clean Lucide icon too
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { HelpControl } from "../components/HelpControl";

export function NavBar() {
  const { activeItems } = useAuth();

  // We can pass the Icon Component directly in the array now!
  const navItems = [
    { path: "/", label: "Activity", Icon: ClipboardList },
    { path: "/companies", label: "Companies", Icon: Building2 },
    { path: "/people", label: "People", Icon: Users },
    { path: "/documents", label: "Documents", Icon: FileText },
    { path: "/values", label: "Values", Icon: Heart },
    { path: "/resources", label: "Resources", Icon: Bookmark },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">
          {/* I replaced the complex SVG with a clean Lucide icon */}
          <Layers size={24} color="white" />
        </div>
        <span className="navbar-title">Inlet</span>
      </div>

      <div className="navbar-links">
        {navItems.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `navbar-link ${isActive ? "navbar-link-active" : ""}`
            }
          >
            {/* Render the icon component directly */}
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        {activeItems.length > 0 && (
          <div className="navbar-badge">
            <div className="navbar-badge-dot"></div>
            <span>{activeItems.length} active</span>
          </div>
        )}

        {/* Added your Help Button here */}
        <HelpControl />
      </div>
    </nav>
  );
}
