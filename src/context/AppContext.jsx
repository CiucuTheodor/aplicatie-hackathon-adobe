import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);
const initialFilters = { brand: "All brands", range: "30d", source: "All sources", query: "" };

export function AppProvider({ children }) {
  const [filters, setFilters] = useState(initialFilters);
  const [theme, setTheme] = useState(() => localStorage.getItem("marketpulse-theme") || "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("marketpulse-theme", theme);
  }, [theme]);

  const updateFilter = useCallback((key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  }, []);
  const toggleTheme = useCallback(() => setTheme((current) => current === "dark" ? "light" : "dark"), []);
  const value = useMemo(() => ({ filters, updateFilter, theme, toggleTheme }), [filters, updateFilter, theme, toggleTheme]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useFilters() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useFilters must be used within AppProvider");
  return { filters: context.filters, updateFilter: context.updateFilter };
}

export function useTheme() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useTheme must be used within AppProvider");
  return { theme: context.theme, toggleTheme: context.toggleTheme };
}
