import "./TabBar.css";

export interface TabOption {
  id: string;
  label: string;
  count?: string;
}

interface TabBarProps {
  tabs: TabOption[];
  currentTabId: string;
  onSelectTab: (tabId: string) => void;
}

export function TabBar({ tabs, currentTabId, onSelectTab }: TabBarProps) {
  return (
    <div className="tab-bar" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === currentTabId}
          className={`tab-bar-tab ${tab.id === currentTabId ? "is-current" : ""}`}
          onClick={() => onSelectTab(tab.id)}
        >
          {tab.label}
          {tab.count && <span className="tab-bar-count">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}
