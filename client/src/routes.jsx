import App from "./App.jsx";
import { ErrorPage } from "./pages/ErrorPage.jsx";
import { ActivityPage } from "./pages/ActivityPage.jsx";
import { CompaniesPage } from "./pages/CompaniesPage.jsx";
import { PeoplePage } from "./pages/PeoplePage.jsx";
import { DocumentsPage } from "./pages/DocumentsPage.jsx";
import { ValuesPage } from "./pages/ValuesPage.jsx";
import { ResourcesPage } from "./pages/ResourcesPage.jsx";

export const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <ActivityPage /> },
      { path: "companies", element: <CompaniesPage /> },
      { path: "people", element: <PeoplePage /> },
      { path: "documents", element: <DocumentsPage /> },
      { path: "values", element: <ValuesPage /> },
      { path: "resources", element: <ResourcesPage /> },
    ],
  },
];
