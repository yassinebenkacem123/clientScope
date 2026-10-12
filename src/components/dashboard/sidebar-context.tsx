"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type SidebarContextType = {
  isOpen: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleMobileSidebar: () => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
};

const defaultValue: SidebarContextType = {
  isOpen: true,
  isMobileOpen: false,
  toggleSidebar: () => {},
  openSidebar: () => {},
  closeSidebar: () => {},
  toggleMobileSidebar: () => {},
  openMobileSidebar: () => {},
  closeMobileSidebar: () => {},
};

const SidebarContext = createContext<SidebarContextType>(defaultValue);

const STORAGE_KEY = "clientscope:sidebar-open";
const SIDEBAR_EVENT = "clientscope:sidebar-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SIDEBAR_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SIDEBAR_EVENT, callback);
  };
}

function getDesktopSnapshot(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
}

function getServerSnapshot(): boolean {
  return true;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isOpen = useSyncExternalStore(subscribe, getDesktopSnapshot, getServerSnapshot);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const openSidebar = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
      window.dispatchEvent(new Event(SIDEBAR_EVENT));
    } catch {}
  }, []);

  const closeSidebar = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "false");
      window.dispatchEvent(new Event(SIDEBAR_EVENT));
    } catch {}
  }, []);

  const openMobileSidebar = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      const next = !getDesktopSnapshot();
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
        window.dispatchEvent(new Event(SIDEBAR_EVENT));
      } catch {}
    }
  }, []);

  // Keyboard shortcut: Ctrl+B or Cmd+B to smoothly toggle sidebar
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isMobileOpen,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        toggleMobileSidebar,
        openMobileSidebar,
        closeMobileSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
