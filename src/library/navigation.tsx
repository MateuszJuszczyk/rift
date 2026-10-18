import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  Copy,
  Ellipsis,
  EllipsisVertical,
  File,
  FileText,
  Folder,
  FolderOpen,
  Globe,
  Hash,
  History,
  House,
  Inbox,
  Layers,
  LayoutGrid,
  List,
  Menu,
  Palette,
  Search,
  Settings,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  Button,
  Edge,
  Field,
  IconButton,
  MenuOption,
  Modal,
  Segmented,
  Surface,
} from "../ui";

type Notify = (message: string) => void;

export const navigationStudies = [
  { id: "breadcrumbs", title: "Breadcrumbs", category: "navigation" },
  { id: "vertical-tabs", title: "Vertical tabs", category: "navigation" },
  { id: "sidebar-sections", title: "Sidebar sections", category: "navigation" },
  { id: "pagination", title: "Pagination", category: "navigation" },
  { id: "wizard-steps", title: "Wizard steps", category: "navigation" },
  { id: "command-palette", title: "Command palette", category: "navigation" },
  { id: "mega-menu", title: "Mega menu", category: "navigation" },
  { id: "nested-menu", title: "Nested menu", category: "navigation" },
  { id: "context-menu", title: "Context menu", category: "navigation" },
  { id: "tree-view", title: "Tree view", category: "navigation" },
  { id: "on-this-page", title: "On this page", category: "navigation" },
  { id: "history-nav", title: "History controls", category: "navigation" },
  { id: "page-dots", title: "Page indicators", category: "navigation" },
  { id: "mobile-tab-bar", title: "Mobile tab bar", category: "navigation" },
  { id: "drawer-nav", title: "Drawer navigation", category: "navigation" },
  { id: "view-switcher", title: "View switcher", category: "navigation" },
] as const;

export function NavigationStudy({ id, notify }: { id: string; notify: Notify }) {
  switch (id) {
    case "breadcrumbs":
      return <Breadcrumbs />;
    case "vertical-tabs":
      return <VerticalTabs />;
    case "sidebar-sections":
      return <SidebarSections />;
    case "pagination":
      return <Pagination />;
    case "wizard-steps":
      return <WizardSteps />;
    case "command-palette":
      return <CommandPalette notify={notify} />;
    case "mega-menu":
      return <MegaMenu />;
    case "nested-menu":
      return <NestedMenu />;
    case "context-menu":
      return <ContextMenu notify={notify} />;
    case "tree-view":
      return <TreeView />;
    case "on-this-page":
      return <OnThisPage />;
    case "history-nav":
      return <HistoryNav notify={notify} />;
    case "page-dots":
      return <PageDots />;
    case "mobile-tab-bar":
      return <MobileTabBar />;
    case "drawer-nav":
      return <DrawerNav />;
    case "view-switcher":
      return <ViewSwitcher notify={notify} />;
    default:
      return null;
  }
}

const crumbTrail = [
  { id: "workspace", label: "Workspace" },
  { id: "library", label: "Library" },
  { id: "navigation", label: "Navigation" },
  { id: "breadcrumbs", label: "Breadcrumbs" },
];

type CrumbNode =
  | { kind: "crumb"; crumb: { id: string; label: string } }
  | { kind: "gap" };

function Breadcrumbs() {
  const [expanded, setExpanded] = useState(false);
  const [current, setCurrent] = useState("breadcrumbs");
  const last = crumbTrail[crumbTrail.length - 1];
  const nodes: CrumbNode[] = expanded
    ? crumbTrail.map((crumb) => ({ kind: "crumb" as const, crumb }))
    : [
        { kind: "crumb", crumb: crumbTrail[0] },
        { kind: "gap" },
        { kind: "crumb", crumb: last },
      ];
  const activeLabel =
    crumbTrail.find((crumb) => crumb.id === current)?.label ?? "";
  return (
    <nav className="study ui-stack" aria-label="Breadcrumbs">
      <ol className="lib-crumbs">
        {nodes.map((node, index) => (
          <li
            className="lib-crumbs__item"
            key={node.kind === "crumb" ? node.crumb.id : `gap-${index}`}
          >
            {index > 0 && (
              <ChevronRight
                className="lib-crumbs__sep"
                size={12}
                aria-hidden="true"
              />
            )}
            {node.kind === "gap" ? (
              <button
                type="button"
                className="lib-crumbs__more"
                aria-label={`Show ${crumbTrail.length - 2} hidden pages`}
                aria-expanded={false}
                onClick={() => setExpanded(true)}
              >
                <Ellipsis size={13} />
              </button>
            ) : (
              <button
                type="button"
                className="lib-crumbs__link"
                aria-current={node.crumb.id === last.id ? "page" : undefined}
                onClick={() => setCurrent(node.crumb.id)}
              >
                {node.crumb.label}
              </button>
            )}
          </li>
        ))}
      </ol>
      <div className="ui-between">
        <span className="lib-caption" aria-live="polite">
          {current === last.id ? "Full trail visible" : `Viewing ${activeLabel}`}
        </span>
        {expanded && (
          <Button variant="ghost" onClick={() => setExpanded(false)}>
            Collapse path
          </Button>
        )}
      </div>
    </nav>
  );
}

const vtabs = [
  {
    id: "overview",
    label: "Overview",
    icon: <Layers size={14} />,
    body: "Tokens, surfaces and radii rendered in a single pass.",
    meta: "12 blocks",
  },
  {
    id: "activity",
    label: "Activity",
    icon: <History size={14} />,
    body: "Recent edits across the navigation family, newest first.",
    meta: "3 today",
  },
  {
    id: "members",
    label: "Members",
    icon: <Users size={14} />,
    body: "People with access to this workspace and their roles.",
    meta: "8 seats",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings size={14} />,
    body: "Workspace defaults, publishing and review scopes.",
    meta: "2 pending",
  },
];

function VerticalTabs() {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const select = (next: number) => {
    const clamped = (next + vtabs.length) % vtabs.length;
    setIndex(clamped);
    tabRefs.current[clamped]?.focus();
  };
  const active = vtabs[index];
  return (
    <div className="study ui-stack">
      <div className="lib-vtabs">
        <div
          className="lib-vtabs__rail"
          role="tablist"
          aria-label="Workspace sections"
          aria-orientation="vertical"
        >
          {vtabs.map((tab, i) => (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[i] = element;
              }}
              id={`vtab-${tab.id}`}
              type="button"
              role="tab"
              className="ui-rim"
              aria-selected={i === index}
              aria-controls="vtab-panel"
              tabIndex={i === index ? 0 : -1}
              onClick={() => setIndex(i)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                  event.preventDefault();
                  select(index + 1);
                } else if (
                  event.key === "ArrowUp" ||
                  event.key === "ArrowLeft"
                ) {
                  event.preventDefault();
                  select(index - 1);
                } else if (event.key === "Home") {
                  event.preventDefault();
                  select(0);
                } else if (event.key === "End") {
                  event.preventDefault();
                  select(vtabs.length - 1);
                }
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <div
          className="lib-vtabs__panel"
          id="vtab-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`vtab-${active.id}`}
        >
          <div className="ui-between">
            <strong className="ui-title">{active.label}</strong>
            <span className="lib-caption lib-num">{active.meta}</span>
          </div>
          <p className="ui-copy">{active.body}</p>
          <div className="lib-meter" aria-hidden="true">
            <span style={{ width: `${((index + 1) / vtabs.length) * 100}%` }} />
          </div>
        </div>
      </div>
      <span className="lib-caption" aria-live="polite">
        Panel {index + 1} of {vtabs.length} · arrows move between tabs
      </span>
    </div>
  );
}

const navGroups = [
  {
    id: "workspace",
    label: "Workspace",
    icon: <Layers size={14} />,
    items: ["Overview", "Projects", "Activity"],
  },
  {
    id: "team",
    label: "Team",
    icon: <Users size={14} />,
    items: ["Members", "Invitations", "Roles"],
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings size={14} />,
    items: ["General", "Billing", "Integrations"],
  },
];

function SidebarSections() {
  const [open, setOpen] = useState<string[]>(["workspace", "team"]);
  const [active, setActive] = useState("Overview");
  return (
    <nav className="study ui-stack" aria-label="Sidebar sections">
      <div className="lib-sections">
        {navGroups.map((group) => {
          const expanded = open.includes(group.id);
          return (
            <div className="lib-sections__group" key={group.id}>
              <button
                type="button"
                className="lib-sections__head ui-rim"
                aria-expanded={expanded}
                aria-controls={`section-${group.id}`}
                onClick={() =>
                  setOpen((values) =>
                    values.includes(group.id)
                      ? values.filter((value) => value !== group.id)
                      : [...values, group.id],
                  )
                }
              >
                {group.icon}
                <span className="lib-sections__label">{group.label}</span>
                <span className="lib-sections__count lib-num">
                  {group.items.length}
                </span>
                <ChevronDown
                  className={`lib-sections__twist${expanded ? " is-open" : ""}`}
                  size={13}
                  aria-hidden="true"
                />
              </button>
              {expanded && (
                <div className="lib-sections__items" id={`section-${group.id}`}>
                  {group.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="lib-row lib-row--interactive ui-rim"
                      aria-current={active === item ? "page" : undefined}
                      onClick={() => setActive(item)}
                    >
                      <span className="lib-dot" aria-hidden="true" />
                      <span className="lib-row__copy">{item}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="lib-caption" aria-live="polite">
        {active} · {open.length} sections open
      </span>
    </nav>
  );
}

function Pagination() {
  const total = 8;
  const [page, setPage] = useState(4);
  const pages: (number | "gap")[] =
    page <= 3
      ? [1, 2, 3, 4, "gap", total]
      : page >= total - 2
        ? [1, "gap", total - 3, total - 2, total - 1, total]
        : [1, "gap", page - 1, page, page + 1, "gap", total];
  return (
    <nav className="study ui-stack" aria-label="Pagination">
      <div className="lib-pager">
        <IconButton
          label="Previous page"
          disabled={page === 1}
          onClick={() => setPage((value) => Math.max(1, value - 1))}
        >
          <ChevronLeft size={15} />
        </IconButton>
        {pages.map((item, index) =>
          item === "gap" ? (
            <span
              className="lib-pager__gap"
              key={`gap-${index}`}
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className="lib-pager__page ui-rim lib-num"
              aria-current={item === page ? "page" : undefined}
              aria-label={`Page ${item}`}
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          ),
        )}
        <IconButton
          label="Next page"
          disabled={page === total}
          onClick={() => setPage((value) => Math.min(total, value + 1))}
        >
          <ChevronRight size={15} />
        </IconButton>
      </div>
      <span className="lib-caption" aria-live="polite">
        Page {page} of {total} · 24 items per page
      </span>
    </nav>
  );
}

const wizardSteps = ["Account", "Workspace", "Billing", "Review"];

function WizardSteps() {
  const [step, setStep] = useState(1);
  return (
    <div className="study ui-stack">
      <ol className="lib-wizard">
        {wizardSteps.map((label, index) => {
          const state =
            index < step ? "done" : index === step ? "current" : "next";
          return (
            <li
              className={`lib-wizard__step is-${state}`}
              key={label}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span className="lib-wizard__mark" aria-hidden="true">
                {state === "done" ? (
                  <Check size={12} />
                ) : (
                  <span className="lib-num">{index + 1}</span>
                )}
              </span>
              <span className="lib-wizard__copy">
                <strong>{label}</strong>
                <small>
                  {state === "done"
                    ? "Complete"
                    : state === "current"
                      ? "In progress"
                      : "Upcoming"}
                </small>
              </span>
            </li>
          );
        })}
      </ol>
      <div className="ui-actions">
        <Button
          variant="ghost"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
        >
          Back
        </Button>
        <span className="lib-caption" aria-live="polite">
          Step {step + 1} of {wizardSteps.length}
        </span>
        <Button
          variant="primary"
          disabled={step === wizardSteps.length - 1}
          onClick={() =>
            setStep((value) => Math.min(wizardSteps.length - 1, value + 1))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}

const paletteCommands = [
  {
    id: "new-component",
    group: "Create",
    label: "New component",
    hint: "N",
    icon: <Blocks size={14} />,
  },
  {
    id: "new-token",
    group: "Create",
    label: "New design token",
    hint: "T",
    icon: <Palette size={14} />,
  },
  {
    id: "open-settings",
    group: "Navigate",
    label: "Open settings",
    hint: "S",
    icon: <Settings size={14} />,
  },
  {
    id: "open-members",
    group: "Navigate",
    label: "Open members",
    hint: "M",
    icon: <Users size={14} />,
  },
  {
    id: "toggle-theme",
    group: "Actions",
    label: "Toggle light theme",
    hint: "L",
    icon: <Globe size={14} />,
  },
  {
    id: "copy-link",
    group: "Actions",
    label: "Copy page link",
    hint: "C",
    icon: <Copy size={14} />,
  },
];

function CommandPalette({ notify }: { notify: Notify }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle
      ? paletteCommands.filter((command) =>
          command.label.toLowerCase().includes(needle),
        )
      : paletteCommands;
  }, [query]);
  const groups = useMemo(
    () =>
      ["Create", "Navigate", "Actions"]
        .map((name) => ({
          name,
          items: matches.filter((command) => command.group === name),
        }))
        .filter((group) => group.items.length > 0),
    [matches],
  );
  const safeCursor = Math.min(cursor, Math.max(0, matches.length - 1));
  const activeCommand = matches[safeCursor];
  const run = (command: (typeof paletteCommands)[number]) => {
    setQuery("");
    setCursor(0);
    notify(`${command.label} · ${command.group.toLowerCase()}`);
  };
  return (
    <div className="study ui-stack">
      <Surface className="lib-palette">
        <div className="lib-palette__search">
          <Search size={14} aria-hidden="true" />
          <input
            className="lib-palette__input"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            aria-activedescendant={
              activeCommand ? `palette-${activeCommand.id}` : undefined
            }
            placeholder="Search commands…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                const size = Math.max(1, matches.length);
                setCursor(
                  (value) =>
                    (value + (event.key === "ArrowDown" ? 1 : -1) + size) %
                    size,
                );
              }
              if (event.key === "Enter" && matches[safeCursor]) {
                event.preventDefault();
                run(matches[safeCursor]);
              }
              if (event.key === "Escape") {
                setQuery("");
                setCursor(0);
              }
            }}
          />
          <span className="lib-key" aria-hidden="true">
            ⌘K
          </span>
        </div>
        <div
          className="lib-palette__list"
          id="palette-list"
          role="listbox"
          aria-label="Commands"
        >
          {groups.length ? (
            groups.map((group) => (
              <div className="lib-palette__group" key={group.name}>
                <span className="lib-palette__grouphead">{group.name}</span>
                {group.items.map((command) => {
                  const index = matches.indexOf(command);
                  return (
                    <button
                      key={command.id}
                      id={`palette-${command.id}`}
                      type="button"
                      role="option"
                      aria-selected={index === safeCursor}
                      className={`lib-option${index === safeCursor ? " is-current" : ""}`}
                      onPointerEnter={() => setCursor(index)}
                      onClick={() => run(command)}
                    >
                      {command.icon}
                      <span className="lib-option-copy">
                        <strong>{command.label}</strong>
                      </span>
                      <span className="lib-key" aria-hidden="true">
                        {command.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <p className="lib-empty">No command matches “{query}”.</p>
          )}
        </div>
      </Surface>
      <span className="lib-caption" aria-live="polite">
        {activeCommand
          ? `Enter runs “${activeCommand.label}”`
          : "Type to filter commands"}
      </span>
    </div>
  );
}

const megaColumns = [
  { title: "Product", links: ["Overview", "Materials", "Tokens", "Changelog"] },
  {
    title: "Developers",
    links: ["Install", "Theming", "Components", "API reference"],
  },
  { title: "Resources", links: ["Guides", "Examples", "Support"] },
];

function MegaMenu() {
  const [open, setOpen] = useState(true);
  return (
    <div
      className="study ui-stack lib-mega"
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <Button
        variant={open ? "primary" : "secondary"}
        icon={<Layers size={14} />}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="mega-panel"
        onClick={() => setOpen((value) => !value)}
      >
        Browse library
      </Button>
      {open && (
        <div className="lib-mega__panel" id="mega-panel">
          <div className="lib-grid lib-grid--3">
            {megaColumns.map((column) => (
              <div className="lib-mega__column" key={column.title}>
                <span className="lib-mega__title">{column.title}</span>
                {column.links.map((link) => (
                  <button
                    key={link}
                    type="button"
                    className="lib-mega__link ui-rim"
                    onClick={() => setOpen(false)}
                  >
                    {link}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <Edge className="lib-mega__promo">
            <span className="lib-mega__promo-mark" aria-hidden="true">
              <Sparkles size={14} />
            </span>
            <span className="lib-row__copy">
              <strong>Muted Prism kit</strong>
              <small>100 components, both themes, one token set.</small>
            </span>
            <ArrowRight size={14} aria-hidden="true" />
          </Edge>
        </div>
      )}
      <span className="lib-caption">
        {open ? "Escape closes the panel" : "Open the multi-column panel"}
      </span>
    </div>
  );
}

const nestedItems = [
  {
    id: "new",
    label: "New file",
    icon: <FileText size={14} />,
    shortcut: "⌘N",
  },
  {
    id: "export",
    label: "Export as",
    icon: <Share2 size={14} />,
    children: ["PDF", "Markdown", "HTML"],
  },
  { id: "duplicate", label: "Duplicate", icon: <Copy size={14} />, shortcut: "⌘D" },
  { id: "rename", label: "Rename…", icon: <Tag size={14} />, shortcut: "F2" },
];

function NestedMenu() {
  const [submenu, setSubmenu] = useState<string | null>("export");
  return (
    <div className="study ui-stack">
      <div className="lib-nested" role="menu" aria-label="File actions">
        {nestedItems.map((item) => (
          <div
            className="lib-nested__slot"
            key={item.id}
            onPointerLeave={() => {
              if (item.children) setSubmenu(null);
            }}
          >
            <button
              type="button"
              role="menuitem"
              className="lib-option"
              aria-haspopup={item.children ? "menu" : undefined}
              aria-expanded={
                item.children ? submenu === item.id : undefined
              }
              onPointerEnter={() => setSubmenu(item.children ? item.id : null)}
              onFocus={() => setSubmenu(item.children ? item.id : null)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" && item.children) {
                  event.preventDefault();
                  setSubmenu(item.id);
                }
                if (event.key === "ArrowLeft") setSubmenu(null);
              }}
            >
              {item.icon}
              <span className="lib-option-copy">
                <strong>{item.label}</strong>
              </span>
              {item.shortcut && (
                <span className="lib-key" aria-hidden="true">
                  {item.shortcut}
                </span>
              )}
              {item.children && <ChevronRight size={13} aria-hidden="true" />}
            </button>
            {item.children && submenu === item.id && (
              <div
                className="lib-nested__flyout"
                role="menu"
                aria-label={`${item.label} submenu`}
              >
                {item.children.map((child) => (
                  <button
                    key={child}
                    type="button"
                    role="menuitem"
                    className="lib-option"
                    onClick={() => setSubmenu(null)}
                  >
                    <span className="lib-option-copy">
                      <strong>{child}</strong>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <span className="lib-caption">
        Hover or focus “Export as” to reveal the flyout
      </span>
    </div>
  );
}

const contextItems = [
  { label: "Copy", hint: "⌘C", icon: <Copy size={14} />, danger: false },
  { label: "Duplicate", hint: "⌘D", icon: <Blocks size={14} />, danger: false },
  { label: "Rename", hint: "F2", icon: <Tag size={14} />, danger: false },
  { label: "Delete", hint: "⌫", icon: <Trash2 size={14} />, danger: true },
];

function ContextMenu({ notify }: { notify: Notify }) {
  const [point, setPoint] = useState<{ x: number; y: number } | null>({
    x: 64,
    y: 58,
  });
  const [confirming, setConfirming] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!point) return;
    menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [point]);
  const openAt = (x: number, y: number) => {
    setPoint({ x: Math.max(8, x), y: Math.max(8, y) });
  };
  return (
    <div className="study ui-stack">
      <div
        className="lib-ctx"
        onContextMenu={(event) => {
          event.preventDefault();
          const rect = event.currentTarget.getBoundingClientRect();
          openAt(
            Math.min(event.clientX - rect.left, rect.width - 172),
            Math.min(event.clientY - rect.top, rect.height - 156),
          );
        }}
      >
        <span className="lib-ctx__hint">
          {point ? "Menu open" : "Right-click anywhere on this surface"}
        </span>
        {point && (
          <div
            className="lib-ctx__menu"
            ref={menuRef}
            role="menu"
            aria-label="Surface actions"
            style={{ left: point.x, top: point.y }}
            onKeyDown={(event) => {
              const items =
                menuRef.current?.querySelectorAll<HTMLButtonElement>(
                  "[role='menuitem']",
                );
              if (!items?.length) return;
              const list = Array.from(items);
              const at = list.indexOf(
                document.activeElement as HTMLButtonElement,
              );
              if (event.key === "Escape") {
                setPoint(null);
              } else if (event.key === "ArrowDown") {
                event.preventDefault();
                list[(at + 1) % list.length].focus();
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                list[(at - 1 + list.length) % list.length].focus();
              }
            }}
          >
            {contextItems.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                className={`lib-option${item.danger ? " ui-danger" : ""}`}
                onClick={() => {
                  setPoint(null);
                  if (item.danger) setConfirming(true);
                }}
              >
                {item.icon}
                <span className="lib-option-copy">
                  <strong>{item.label}</strong>
                </span>
                <span className="lib-key" aria-hidden="true">
                  {item.hint}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="ui-between">
        <Button
          variant="secondary"
          icon={<EllipsisVertical size={14} />}
          onClick={() => openAt(28, 44)}
        >
          Open menu
        </Button>
        <span className="lib-caption" aria-live="polite">
          {point ? "Opened at pointer" : "No menu"}
        </span>
      </div>
      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Delete file"
      >
        <p className="ui-copy">
          This removes the file from the project tree. The action can be undone
          for 30 days.
        </p>
        <div className="ui-actions">
          <Button variant="ghost" onClick={() => setConfirming(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setConfirming(false);
              notify("File deleted.");
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

type TreeNode = {
  id: string;
  label: string;
  level: number;
  folder: boolean;
  parent: string | null;
};

const treeNodes: TreeNode[] = [
  { id: "src", label: "src", level: 1, folder: true, parent: null },
  {
    id: "components",
    label: "components",
    level: 2,
    folder: true,
    parent: "src",
  },
  {
    id: "button",
    label: "Button.tsx",
    level: 3,
    folder: false,
    parent: "components",
  },
  {
    id: "surface",
    label: "Surface.tsx",
    level: 3,
    folder: false,
    parent: "components",
  },
  { id: "tokens", label: "tokens.css", level: 2, folder: false, parent: "src" },
  { id: "index", label: "index.ts", level: 1, folder: false, parent: null },
  { id: "readme", label: "README.md", level: 1, folder: false, parent: null },
];

function TreeView() {
  const [expanded, setExpanded] = useState<string[]>(["src", "components"]);
  const [cursor, setCursor] = useState("surface");
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const visible = treeNodes.filter((entry) => {
    let parent = entry.parent;
    while (parent) {
      if (!expanded.includes(parent)) return false;
      parent = treeNodes.find((node) => node.id === parent)?.parent ?? null;
    }
    return true;
  });
  const focusNode = (id: string) => {
    setCursor(id);
    nodeRefs.current[id]?.focus();
  };
  const move = (nextIndex: number) => {
    const entry =
      visible[Math.max(0, Math.min(visible.length - 1, nextIndex))];
    if (entry) focusNode(entry.id);
  };
  return (
    <div className="study ui-stack">
      <Surface
        className="lib-filetree"
        role="tree"
        aria-label="Project files"
        onKeyDown={(event) => {
          const index = visible.findIndex((entry) => entry.id === cursor);
          const entry = visible[index];
          if (!entry) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            move(index + 1);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            move(index - 1);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            if (entry.folder && !expanded.includes(entry.id)) {
              setExpanded((values) => [...values, entry.id]);
            } else {
              move(index + 1);
            }
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            if (entry.folder && expanded.includes(entry.id)) {
              setExpanded((values) =>
                values.filter((value) => value !== entry.id),
              );
            } else if (entry.parent) {
              focusNode(entry.parent);
            }
          }
        }}
      >
        {visible.map((entry) => {
          const isOpen = expanded.includes(entry.id);
          const selected = cursor === entry.id;
          return (
            <div
              key={entry.id}
              ref={(element) => {
                nodeRefs.current[entry.id] = element;
              }}
              role="treeitem"
              tabIndex={selected ? 0 : -1}
              aria-level={entry.level}
              aria-selected={selected}
              aria-expanded={entry.folder ? isOpen : undefined}
              className={`lib-filetree__node${selected ? " is-selected" : ""}`}
              style={{ "--depth": entry.level - 1 } as CSSProperties}
              onClick={() => setCursor(entry.id)}
            >
              {entry.folder ? (
                isOpen ? (
                  <FolderOpen size={14} />
                ) : (
                  <Folder size={14} />
                )
              ) : (
                <File size={14} />
              )}
              <span className="lib-filetree__label">{entry.label}</span>
            </div>
          );
        })}
      </Surface>
      <span className="lib-caption" aria-live="polite">
        {cursor} · arrows move, left and right collapse or expand
      </span>
    </div>
  );
}

const anchorSections = ["Overview", "Install", "Theming", "Tokens", "Changelog"];

function OnThisPage() {
  const [active, setActive] = useState(2);
  const progress = ((active + 1) / anchorSections.length) * 100;
  return (
    <nav className="study ui-stack" aria-label="On this page">
      <div className="lib-anchors">
        <div className="lib-anchors__rail" aria-hidden="true">
          <span
            className="lib-anchors__fill"
            style={{ height: `${progress}%` }}
          />
          <span className="lib-anchors__marker" style={{ top: `${progress}%` }} />
        </div>
        <ol className="lib-anchors__list">
          {anchorSections.map((section, index) => (
            <li key={section}>
              <a
                className="lib-anchors__link ui-rim"
                href={`#${section.toLowerCase()}`}
                aria-current={index === active ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  setActive(index);
                }}
              >
                <Hash size={12} aria-hidden="true" />
                {section}
                <span className="lib-caption lib-num">{index + 1}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <span className="lib-caption" aria-live="polite">
        Reading {anchorSections[active]} · {Math.round(progress)}% down the page
      </span>
    </nav>
  );
}

const historyEntries = [
  "Overview",
  "Components",
  "Navigation",
  "Tree view",
  "Changelog",
];

function HistoryNav({ notify }: { notify: Notify }) {
  const [index, setIndex] = useState(3);
  const [open, setOpen] = useState(false);
  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(historyEntries.length - 1, next));
    setIndex(clamped);
    setOpen(false);
    notify(`Opened ${historyEntries[clamped]}.`);
  };
  return (
    <div className="study ui-stack">
      <div className="lib-history">
        <IconButton
          label="Go back"
          disabled={index === 0}
          onClick={() => go(index - 1)}
        >
          <ArrowLeft size={15} />
        </IconButton>
        <IconButton
          label="Go forward"
          disabled={index === historyEntries.length - 1}
          onClick={() => go(index + 1)}
        >
          <ArrowRight size={15} />
        </IconButton>
        <div className="lib-history__menu">
          <button
            type="button"
            className="lib-history__trigger ui-rim"
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => setOpen((value) => !value)}
          >
            <History size={14} aria-hidden="true" />
            <span className="lib-history__current">
              {historyEntries[index]}
            </span>
            <ChevronDown size={13} aria-hidden="true" />
          </button>
          {open && (
            <div
              className="lib-popover lib-scroll"
              role="listbox"
              aria-label="Recently visited"
            >
              {historyEntries.map((entry, i) => (
                <button
                  key={entry}
                  type="button"
                  role="option"
                  aria-selected={i === index}
                  className={`lib-option${i === index ? " is-current" : ""}`}
                  onClick={() => go(i)}
                >
                  <Clock size={13} aria-hidden="true" />
                  <span className="lib-option-copy">
                    <strong>{entry}</strong>
                  </span>
                  <span className="lib-caption lib-num">{i + 1}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <span className="lib-caption" aria-live="polite">
        {index + 1} of {historyEntries.length} entries in history
      </span>
    </div>
  );
}

const dotSlides = [
  "Optical edge",
  "Prism surfaces",
  "Precision controls",
  "Ambient motion",
  "Token sets",
];

function PageDots() {
  const [index, setIndex] = useState(1);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const go = (next: number) => {
    const clamped = (next + dotSlides.length) % dotSlides.length;
    setIndex(clamped);
    dotRefs.current[clamped]?.focus();
  };
  return (
    <div className="study ui-stack">
      <div className="lib-dots" role="group" aria-label="Slides">
        {dotSlides.map((slide, i) => (
          <button
            key={slide}
            ref={(element) => {
              dotRefs.current[i] = element;
            }}
            type="button"
            className="lib-dots__dot ui-rim"
            aria-current={i === index ? "true" : undefined}
            aria-label={`Slide ${i + 1}: ${slide}`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                go(index + 1);
              } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                go(index - 1);
              } else if (event.key === "Home") {
                event.preventDefault();
                go(0);
              } else if (event.key === "End") {
                event.preventDefault();
                go(dotSlides.length - 1);
              }
            }}
          />
        ))}
      </div>
      <div className="lib-dots__stage" aria-live="polite">
        <span className="lib-dots__index lib-num">
          {index + 1}/{dotSlides.length}
        </span>
        <strong>{dotSlides[index]}</strong>
      </div>
    </div>
  );
}

const tabbarItems = [
  { id: "browse", label: "Browse", icon: <House size={17} /> },
  { id: "search", label: "Search", icon: <Search size={17} /> },
  { id: "inbox", label: "Inbox", icon: <Inbox size={17} />, badge: 3 },
  { id: "you", label: "You", icon: <Users size={17} /> },
];

function MobileTabBar() {
  const [active, setActive] = useState("browse");
  const current = tabbarItems.find((item) => item.id === active);
  return (
    <div className="study ui-stack">
      <nav className="lib-tabbar" aria-label="Mobile navigation">
        {tabbarItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="lib-tabbar__item ui-rim"
            aria-current={active === item.id ? "page" : undefined}
            onClick={() => setActive(item.id)}
          >
            <span className="lib-tabbar__icon">
              {item.icon}
              {item.badge ? (
                <span
                  className="lib-tabbar__badge lib-num"
                  aria-label={`${item.badge} unread`}
                >
                  {item.badge}
                </span>
              ) : null}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
      <span className="lib-caption" aria-live="polite">
        {current?.label} selected
      </span>
    </div>
  );
}

const drawerLinks = [
  "Overview",
  "Components",
  "Navigation",
  "Tokens",
  "Changelog",
];

function DrawerNav() {
  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState("");
  const [active, setActive] = useState("Navigation");
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const links = drawerLinks.filter((link) =>
    link.toLowerCase().includes(filter.trim().toLowerCase()),
  );
  return (
    <div className="study ui-stack">
      <Button
        variant="secondary"
        icon={<Menu size={14} />}
        aria-expanded={open}
        aria-controls="drawer-panel"
        onClick={() => setOpen(true)}
      >
        Open navigation
      </Button>
      <div className={`lib-drawer${open ? " is-open" : ""}`}>
        <button
          type="button"
          className="lib-drawer__backdrop"
          aria-label="Close navigation"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />
        <div
          className="lib-drawer__panel"
          id="drawer-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="lib-panel-head">
            <Layers size={13} aria-hidden="true" />
            <span>Navigation</span>
            <IconButton
              label="Close navigation"
              className="lib-drawer__close"
              onClick={() => setOpen(false)}
            >
              <X size={15} />
            </IconButton>
          </div>
          <Field
            label="Filter pages"
            icon={<Search size={13} />}
            placeholder="Filter pages…"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
          <div className="lib-list" role="listbox" aria-label="Pages">
            {links.map((link) => (
              <button
                key={link}
                type="button"
                role="option"
                aria-selected={active === link}
                className="lib-option"
                onClick={() => {
                  setActive(link);
                  setOpen(false);
                }}
              >
                <span className="lib-option-copy">
                  <strong>{link}</strong>
                </span>
              </button>
            ))}
            {!links.length && (
              <p className="lib-empty">No page matches “{filter}”.</p>
            )}
          </div>
        </div>
      </div>
      <span className="lib-caption" aria-live="polite">
        {open ? "Press Escape or pick a page to close" : `Viewing ${active}`}
      </span>
    </div>
  );
}

const densityOptions = [
  { value: "compact", label: "Compact" },
  { value: "cozy", label: "Cozy" },
  { value: "spacious", label: "Spacious" },
];

const viewCounts: Record<string, number> = {
  list: 24,
  board: 18,
  calendar: 9,
};

function ViewSwitcher({ notify }: { notify: Notify }) {
  const [view, setView] = useState("board");
  const [density, setDensity] = useState("cozy");
  const [open, setOpen] = useState(false);
  return (
    <div className="study ui-stack">
      <Segmented
        label="View"
        value={view}
        onChange={setView}
        options={[
          {
            value: "list",
            label: (
              <span className="lib-viewbar__option">
                <List size={13} />
                List
              </span>
            ),
          },
          {
            value: "board",
            label: (
              <span className="lib-viewbar__option">
                <LayoutGrid size={13} />
                Board
              </span>
            ),
          },
          {
            value: "calendar",
            label: (
              <span className="lib-viewbar__option">
                <Calendar size={13} />
                Calendar
              </span>
            ),
          },
        ]}
      />
      <div className="ui-between">
        <span className="lib-caption lib-num" aria-live="polite">
          {viewCounts[view]} results
        </span>
        <div className="lib-viewbar__menu">
          <button
            type="button"
            className="lib-viewbar__trigger ui-rim"
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => setOpen((value) => !value)}
          >
            <SlidersHorizontal size={13} aria-hidden="true" />
            Density
            <ChevronsUpDown size={12} aria-hidden="true" />
          </button>
          {open && (
            <div className="lib-popover" role="listbox" aria-label="Density">
              {densityOptions.map((option) => (
                <MenuOption
                  key={option.value}
                  role="option"
                  label={option.label}
                  selected={density === option.value}
                  onClick={() => {
                    setDensity(option.value);
                    setOpen(false);
                    notify(`Density set to ${option.label.toLowerCase()}.`);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
