import { useState, useEffect, useMemo } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function AuthProvider({ children }) {
  const [data, setData] = useState({
    people: [],
    companies: [],
    activities: [],
    documents: [],
    resources: [], // Matches your "links" concept
    values: [],
  });
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.PROD
    ? import.meta.env.BASE_URL
    : "http://localhost:3000";

  const IS_PROD = import.meta.env.PROD;

  // 1. Initial Load (The "fetchLinks" equivalent)
  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      if (import.meta.env.PROD) {
        // GitHub Pages: load one static file
        const r = await fetch(`${import.meta.env.BASE_URL}db.json`);
        if (!r.ok) throw new Error("💥 Error fetching db.json");
        const db = await r.json();

        setData({
          people: db.people ?? [],
          companies: db.companies ?? [],
          activities: db.activities ?? [],
          documents: db.documents ?? [],
          resources: db.resources ?? [],
          values: db.values ?? [],
        });
        setLoading(false);
        return;
      }

      // Dev: hit json-server endpoints
      const [
        peopleRes,
        companiesRes,
        activitiesRes,
        documentsRes,
        resourcesRes,
        valuesRes,
      ] = await Promise.all([
        fetch(`${API_URL}/people`),
        fetch(`${API_URL}/companies`),
        fetch(`${API_URL}/activities`),
        fetch(`${API_URL}/documents`),
        fetch(`${API_URL}/resources`),
        fetch(`${API_URL}/values`),
      ]);

      if (
        !peopleRes.ok ||
        !companiesRes.ok ||
        !activitiesRes.ok ||
        !documentsRes.ok ||
        !resourcesRes.ok ||
        !valuesRes.ok
      ) {
        throw new Error("💥 Error fetching one or more collections");
      }

      const people = await peopleRes.json();
      const companies = await companiesRes.json();
      const activities = await activitiesRes.json();
      const documents = await documentsRes.json();
      const resources = await resourcesRes.json();
      const values = await valuesRes.json();

      setData({ people, companies, activities, documents, resources, values });
      setLoading(false);
    } catch (error) {
      console.error("❌ Caught error:", error);
      setLoading(false);
    }
  }

  // --- GENERIC HANDLERS (To keep code DRY but matches your style) ---

  async function handleAddNew(collection, newItem) {
    if (IS_PROD) {
      // GitHub Pages is static hosting. No server = no writes.
      console.warn("Read-only mode on GitHub Pages: cannot add", collection);
      return;
    }

    try {
      const r = await fetch(`${API_URL}/${collection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!r.ok) throw new Error(`💥 Error adding to ${collection}`);

      const savedItem = await r.json();
      setData((prev) => ({
        ...prev,
        [collection]: [...prev[collection], savedItem],
      }));
      return savedItem;
    } catch (error) {
      console.error("❌ Caught error:", error);
    }
  }

  async function handleUpdate(collection, itemToUpdate) {
    if (IS_PROD) {
      console.warn("Read-only mode on GitHub Pages: cannot update", collection);
      return;
    }

    try {
      const r = await fetch(`${API_URL}/${collection}/${itemToUpdate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemToUpdate),
      });
      if (!r.ok) throw new Error(`💥 Error updating ${collection}`);

      const savedItem = await r.json();
      setData((prev) => ({
        ...prev,
        [collection]: prev[collection].map((item) =>
          item.id === savedItem.id ? savedItem : item,
        ),
      }));
    } catch (error) {
      console.error("❌ Caught error:", error);
    }
  }

  // --- PUBLIC INTERFACE (Specific functions for your components) ---

  // 1. ACTIVITIES
  const addActivity = async (formData) => {
    const newActivity = {
      ...formData,
      status: "open",
      created: new Date().toISOString(),
      touches: [],
    };
    // No ID generation here! The server does it.
    await handleAddNew("activities", newActivity);
  };

  const touchActivity = async (activityId, note) => {
    const activity = data.activities.find((a) => a.id === activityId);
    if (!activity) return;

    const newTouches = [
      ...(activity.touches || []),
      { date: new Date().toISOString(), note },
    ];

    // We send ONLY the changes to handleUpdate
    await handleUpdate("activities", {
      id: activityId,
      status: "active",
      touches: newTouches,
    });
  };

  const updateActivityStatus = async (activityId, newStatus) => {
    await handleUpdate("activities", { id: activityId, status: newStatus });
  };

  // 2. OTHER ENTITIES
  const addPerson = async (personData) =>
    await handleAddNew("people", personData);
  const updatePerson = async (id, updates) =>
    await handleUpdate("people", { id, ...updates });

  const addCompany = async (companyData) =>
    await handleAddNew("companies", companyData);
  const updateCompany = async (id, updates) =>
    await handleUpdate("companies", { id, ...updates });

  const addDocument = async (docData) =>
    await handleAddNew("documents", docData);
  const updateDocument = async (id, updates) =>
    await handleUpdate("documents", { id, ...updates });

  const addValue = async (valData) => await handleAddNew("values", valData);
  const updateValue = async (id, updates) =>
    await handleUpdate("values", { id, ...updates });

  // 3. RESOURCES (Your "Links")
  const addResource = async (resData) => {
    const payload = {
      ...resData,
      lastEngaged: new Date().toISOString().split("T")[0],
    };
    await handleAddNew("resources", payload);
  };

  const updateResource = async (id, updates) =>
    await handleUpdate("resources", { id, ...updates });

  const updateResourceEngagement = async (resourceId) => {
    const today = new Date().toISOString().split("T")[0];
    await handleUpdate("resources", { id: resourceId, lastEngaged: today });
  };

  // --- HELPERS (Read-Only) ---
  const getPerson = (id) => data.people.find((p) => p.id === id);
  const getCompany = (id) => data.companies.find((c) => c.id === id);
  const getDocument = (id) => data.documents.find((d) => d.id === id);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatFullDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const getLatestTimestamp = (activity) =>
    activity.touches && activity.touches.length > 0
      ? new Date(activity.touches[activity.touches.length - 1].date)
      : new Date(activity.created);

  const activeItems = useMemo(
    () =>
      data.activities
        .filter((a) => a.status === "active")
        .sort((a, b) => getLatestTimestamp(b) - getLatestTimestamp(a)),
    [data.activities],
  );

  const value = {
    data,
    loading,
    loggedIn: true,

    // Helpers
    getPerson,
    getCompany,
    getDocument,
    formatDate,
    formatFullDate,
    getLatestTimestamp,
    activeItems,

    // Actions
    addActivity,
    touchActivity,
    updateActivityStatus,
    addPerson,
    updatePerson,
    addCompany,
    updateCompany,
    addDocument,
    updateDocument,
    addValue,
    updateValue,
    addResource,
    updateResource,
    updateResourceEngagement,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
