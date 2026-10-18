import { useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import {
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleDashed,
  CircleDot,
  Copy,
  FileText,
  Folder,
  Inbox,
  LayoutGrid,
  List,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button, Edge, Range, Toggle } from "./ui";

export const additionalStudies = [
  { id: "compact-tabs", title: "Compact tabs", category: "navigation" },
  {
    id: "workspace-nav",
    title: "Workspace navigation",
    category: "navigation",
  },
  { id: "view-toolbar", title: "Context toolbar", category: "navigation" },
  { id: "property-menu", title: "Property picker", category: "controls" },
  { id: "filter-builder", title: "Inline filters", category: "controls" },
  { id: "theme-mixer", title: "Color tokens", category: "surfaces" },
  { id: "inbox-list", title: "Inbox", category: "feedback" },
  { id: "activity-thread", title: "Activity thread", category: "feedback" },
  { id: "batch-actions", title: "Batch actions", category: "controls" },
] as const;

type Notify = (message: string) => void;

export function AdditionalStudy({
  id,
  notify,
}: {
  id: string;
  notify: Notify;
}) {
  switch (id) {
    case "compact-tabs":
      return <CompactTabs />;
    case "workspace-nav":
      return <WorkspaceNavigation />;
    case "view-toolbar":
      return <ViewToolbar />;
    case "property-menu":
      return <PropertyPicker />;
    case "filter-builder":
      return <InlineFilters />;
    case "theme-mixer":
      return <ColorTokens notify={notify} />;
    case "inbox-list":
      return <InboxList />;
    case "activity-thread":
      return <ActivityThread />;
    case "batch-actions":
      return <BatchActions />;
    default:
      return null;
  }
}

function moveFocus(event: KeyboardEvent<HTMLElement>, selector: string) {
  const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
  if (!keys.includes(event.key)) return;
  const items = [
    ...event.currentTarget.querySelectorAll<HTMLButtonElement>(selector),
  ];
  const current = items.indexOf(document.activeElement as HTMLButtonElement);
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? items.length - 1
        : (current + (event.key === "ArrowRight" ? 1 : -1) + items.length) %
          items.length;
  event.preventDefault();
  items[next]?.focus();
  items[next]?.click();
}

function CompactTabs() {
  const [tabs, setTabs] = useState(["Materials", "Notes"]);
  const [active, setActive] = useState("Materials");
  const [serial, setSerial] = useState(1);
  const base = useId();
  const add = () => {
    const name = `Draft ${serial}`;
    setTabs([...tabs, name]);
    setActive(name);
    setSerial(serial + 1);
    requestAnimationFrame(() =>
      document.getElementById(`${base}-${name.replaceAll(" ", "-")}`)?.focus(),
    );
  };
  const close = (name: string) => {
    const remaining = tabs.filter((tab) => tab !== name);
    setTabs(remaining);
    const next = active === name ? remaining[0] || "Home" : active;
    setActive(next);
    requestAnimationFrame(() =>
      document.getElementById(`${base}-${next.replaceAll(" ", "-")}`)?.focus(),
    );
  };
  return (
    <div className="study compact-tabs-study">
      <div className="compact-tab-scroll">
        <div
          className="compact-tab-list"
          role="tablist"
          aria-label="Open documents"
          onKeyDown={(event) => moveFocus(event, '[role="tab"]')}
        >
          <button
            className="compact-tab pinned ui-rim"
            role="tab"
            id={`${base}-Home`}
            aria-controls={`${base}-panel`}
            aria-selected={active === "Home"}
            tabIndex={active === "Home" ? 0 : -1}
            aria-label="Home"
            onClick={() => setActive("Home")}
          >
            <LayoutGrid size={14} />
          </button>
          {tabs.map((name) => (
            <div
              className={`compact-tab ui-rim ${active === name ? "selected" : ""}`}
              key={name}
            >
              <button
                role="tab"
                id={`${base}-${name.replaceAll(" ", "-")}`}
                aria-controls={`${base}-panel`}
                aria-selected={active === name}
                tabIndex={active === name ? 0 : -1}
                onClick={() => setActive(name)}
              >
                <FileText size={13} />
                <span>{name}</span>
              </button>
              <button
                className="tab-close"
                aria-label={`Close ${name}`}
                onClick={() => close(name)}
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
        <button
          className="ui-icon-button add-tab ui-rim"
          onClick={add}
          aria-label="New document"
          disabled={tabs.length >= 4}
        >
          <Plus size={15} />
        </button>
      </div>
      <div
        className="tab-content"
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-${active.replaceAll(" ", "-")}`}
        tabIndex={0}
      >
        <span className="ui-label">
          {active === "Home" ? "Workspace" : "Document"}
        </span>
        <h3>{active}</h3>
        <p>
          {active === "Materials"
            ? "Surface finishes, edge treatments and optical details."
            : active === "Notes"
              ? "A place for observations and unfinished ideas."
              : active === "Home"
                ? "Your open documents, in one place."
                : "A new document. Ready for your first thought."}
        </p>
        <div className="document-lines" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="ui-meta">
        <span>{tabs.length} open documents</span>
        <span>← → to switch</span>
      </div>
    </div>
  );
}

function WorkspaceNavigation() {
  const [active, setActive] = useState("Overview");
  const [expanded, setExpanded] = useState(true);
  const items = ["Overview", "In progress", "Archive"];
  return (
    <div className="study workspace-study">
      <nav className="workspace-navigation" aria-label="Demo workspace">
        <div className="workspace-heading">
          <span className="workspace-monogram">r</span>
          <strong>Rift studio</strong>
          <span>Personal</span>
        </div>
        <button
          className={active === "Inbox" ? "current" : ""}
          onClick={() => setActive("Inbox")}
          aria-current={active === "Inbox" ? "page" : undefined}
        >
          <Inbox size={15} />
          <span>Inbox</span>
          <small>3</small>
        </button>
        <button
          className={active === "Documents" ? "current" : ""}
          onClick={() => setActive("Documents")}
          aria-current={active === "Documents" ? "page" : undefined}
        >
          <FileText size={15} />
          <span>Documents</span>
        </button>
        <button
          className="workspace-group"
          aria-expanded={expanded}
          aria-controls="workspace-collection"
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronRight className={expanded ? "turned" : ""} size={12} />
          <span>Collection</span>
          <Folder size={13} />
        </button>
        <div
          id="workspace-collection"
          className="workspace-children"
          hidden={!expanded}
        >
          {items.map((name) => (
            <button
              className={active === name ? "current" : ""}
              key={name}
              onClick={() => setActive(name)}
              aria-current={active === name ? "page" : undefined}
            >
              <span>{name}</span>
              {name === "In progress" && <small>4</small>}
            </button>
          ))}
        </div>
      </nav>
      <div className="navigation-destination" aria-live="polite">
        <span>Viewing</span>
        <strong>{active}</strong>
        <ArrowUpRight size={14} />
      </div>
    </div>
  );
}

const surfaces = [
  { name: "Edge reflections", type: "Material", updated: 3 },
  { name: "Focus transitions", type: "Motion", updated: 1 },
  { name: "Surface grain", type: "Material", updated: 2 },
];
function ViewToolbar() {
  const [layout, setLayout] = useState("List");
  const [order, setOrder] = useState("Recent");
  const [menu, setMenu] = useState(false);
  const ordered = [...surfaces].sort((a, b) =>
    order === "Name" ? a.name.localeCompare(b.name) : a.updated - b.updated,
  );
  return (
    <div className="study toolbar-study">
      <div className="location-trail">
        <span>Workspace</span>
        <ChevronRight size={11} />
        <strong>Materials</strong>
        <span className="location-private">Private</span>
      </div>
      <div className="context-toolbar">
        <div
          className="view-tabs"
          role="group"
          aria-label="Collection layout"
          onKeyDown={(event) => moveFocus(event, "button")}
        >
          {[
            ["List", List],
            ["Grid", LayoutGrid],
          ].map(([name, Icon]) => {
            const Glyph = Icon as typeof List;
            return (
              <button
                key={String(name)}
                className="ui-rim"
                aria-label={`${name} view`}
                aria-pressed={layout === name}
                onClick={() => setLayout(String(name))}
              >
                <Glyph size={14} />
              </button>
            );
          })}
        </div>
        <span className="toolbar-name">All materials</span>
        <div
          className="sort-control"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setMenu(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setMenu(false);
              event.currentTarget.querySelector("button")?.focus();
            }
          }}
        >
          <button
            className="sort-trigger ui-rim"
            aria-expanded={menu}
            aria-controls="sort-options"
            onClick={() => setMenu(!menu)}
          >
            <SlidersHorizontal size={13} />
            <span>{order}</span>
            <ChevronDown size={11} />
          </button>
          {menu && (
            <div
              className="study-popover"
              id="sort-options"
              role="group"
              aria-label="Sort collection"
            >
              {["Recent", "Name"].map((name) => (
                <button
                  key={name}
                  aria-pressed={order === name}
                  onClick={() => {
                    setOrder(name);
                    setMenu(false);
                  }}
                >
                  {name}
                  {order === name && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={`collection-preview collection-${layout.toLowerCase()}`}>
        {ordered.map((item) => (
          <div key={item.name}>
            <span className="material-tile ui-surface">
              <LayersGlyph />
            </span>
            <span>
              <strong>{item.name}</strong>
              <small>{item.type}</small>
            </span>
          </div>
        ))}
      </div>
      <div className="ui-meta">
        <span>{ordered.length} materials</span>
        <span>
          {order === "Recent" ? "Recently edited first" : "Alphabetical order"}
        </span>
      </div>
    </div>
  );
}
function LayersGlyph() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m3 7 7-4 7 4-7 4-7-4Zm0 3 7 4 7-4M3 13l7 4 7-4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const statuses = [
  { name: "Backlog", caption: "Not yet scheduled", icon: CircleDashed },
  { name: "Planned", caption: "Ready to pick up", icon: Circle },
  { name: "In progress", caption: "Work is underway", icon: CircleDot },
  { name: "Complete", caption: "Reviewed and finished", icon: CheckCheck },
];
function PropertyPicker() {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("In progress");
  const [cursor, setCursor] = useState(0);
  const base = useId();
  const results = statuses.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase().trim()),
  );
  const choose = (name: string) => {
    setValue(name);
    setQuery("");
    setCursor(0);
  };
  return (
    <div className="study property-study">
      <Edge className="property-picker">
        <div className="picker-search">
          <Search size={14} />
          <input
            aria-label="Search statuses"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${base}-options`}
            aria-autocomplete="list"
            aria-activedescendant={
              results[cursor]
                ? `${base}-${results[cursor].name.replaceAll(" ", "-")}`
                : undefined
            }
            value={query}
            placeholder="Change status…"
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
            }}
            onKeyDown={(event) => {
              if (["ArrowDown", "ArrowUp"].includes(event.key)) {
                event.preventDefault();
                setCursor(
                  (current) =>
                    (current +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      results.length) %
                    Math.max(1, results.length),
                );
              }
              if (event.key === "Enter" && results[cursor]) {
                event.preventDefault();
                choose(results[cursor].name);
              }
              if (event.key === "Escape") {
                setQuery("");
                setCursor(0);
              }
            }}
          />
          {query && (
            <button
              className="ui-icon-button ui-rim"
              aria-label="Clear status search"
              onClick={() => {
                setQuery("");
                setCursor(0);
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>
        <div
          className="picker-options"
          role="listbox"
          id={`${base}-options`}
          aria-label="Status"
        >
          {results.map((item, index) => (
            <button
              role="option"
              id={`${base}-${item.name.replaceAll(" ", "-")}`}
              aria-selected={value === item.name}
              className={cursor === index ? "cursor" : ""}
              key={item.name}
              onPointerMove={() => setCursor(index)}
              onClick={() => choose(item.name)}
            >
              <item.icon size={16} />
              <span>
                <strong>{item.name}</strong>
                <small>{item.caption}</small>
              </span>
              {value === item.name && <Check size={13} />}
            </button>
          ))}
          {!results.length && (
            <p className="picker-empty">No matching status.</p>
          )}
        </div>
      </Edge>
      <div className="ui-meta" aria-live="polite">
        <span>Selected status</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function InlineFilters() {
  const [type, setType] = useState("All types");
  const [owner, setOwner] = useState("Anyone");
  const items = [
    { name: "Optical edge", type: "Material", owner: "Morgan" },
    { name: "Tab transition", type: "Motion", owner: "Alex" },
    { name: "Prism surface", type: "Material", owner: "Alex" },
  ];
  const results = items.filter(
    (item) =>
      (type === "All types" || item.type === type) &&
      (owner === "Anyone" || item.owner === owner),
  );
  const count = Number(type !== "All types") + Number(owner !== "Anyone");
  return (
    <div className="study filter-study">
      <div className="filter-row">
        <label
          className={`filter-token ui-rim ${type !== "All types" ? "applied" : ""}`}
        >
          <span className="sr-only">Filter by type</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option>All types</option>
            <option>Material</option>
            <option>Motion</option>
          </select>
          <ChevronDown size={11} />
        </label>
        <label
          className={`filter-token ui-rim ${owner !== "Anyone" ? "applied" : ""}`}
        >
          <span className="sr-only">Filter by owner</span>
          <select
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
          >
            <option>Anyone</option>
            <option>Morgan</option>
            <option>Alex</option>
          </select>
          <ChevronDown size={11} />
        </label>
        <button
          className="filter-clear"
          disabled={!count}
          onClick={() => {
            setType("All types");
            setOwner("Anyone");
          }}
        >
          Clear
        </button>
      </div>
      <div className="filter-result-list" aria-live="polite">
        {results.map((item) => (
          <div key={item.name}>
            <CircleDashed size={14} />
            <strong>{item.name}</strong>
            <span>{item.owner}</span>
          </div>
        ))}
        {!results.length && (
          <div className="filter-empty">
            <Search size={19} />
            <strong>No matches</strong>
            <span>Try another type or owner.</span>
          </div>
        )}
      </div>
      <div className="ui-meta">
        <span>
          {results.length} of {items.length} results
        </span>
        <span>
          {count
            ? `${count} active ${count === 1 ? "filter" : "filters"}`
            : "No filters applied"}
        </span>
      </div>
    </div>
  );
}

function ColorTokens({ notify }: { notify: Notify }) {
  const [hue, setHue] = useState(285);
  const [chroma, setChroma] = useState(5);
  const [lightness, setLightness] = useState(72);
  const color = `oklch(${lightness}% ${(chroma / 100).toFixed(2)} ${hue})`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(
          {
            reflection: {
              hue,
              chroma: chroma / 100,
              lightness: lightness / 100,
              css: color,
            },
          },
          null,
          2,
        ),
      );
      notify("Color token copied.");
    } catch {
      notify("Clipboard unavailable in this browser.");
    }
  };
  return (
    <div
      className="study color-study"
      style={{ "--token-color": color } as CSSProperties}
    >
      <div className="token-preview">
        <div className="token-glass">
          <LayersGlyph />
        </div>
        <div>
          <span className="ui-label">Reflection</span>
          <code>{color}</code>
        </div>
      </div>
      <Range label="Hue" value={hue} max={360} unit="°" onChange={setHue} />
      <Range
        label="Chroma"
        value={chroma}
        max={20}
        unit=""
        onChange={setChroma}
      />
      <Range
        label="Lightness"
        value={lightness}
        min={20}
        max={90}
        onChange={setLightness}
      />
      <div className="token-actions">
        <button
          onClick={() => {
            setHue(285);
            setChroma(5);
            setLightness(72);
          }}
        >
          Reset token
        </button>
        <Button onClick={copy} icon={<Copy size={12} />}>
          Copy JSON
        </Button>
      </div>
    </div>
  );
}

const initialInbox = [
  {
    id: 1,
    name: "Alex",
    initials: "AL",
    action: "mentioned you",
    title: "Edge reflections",
    detail: "The cooler edge works well against the warm highlight.",
    time: "2m",
  },
  {
    id: 2,
    name: "Morgan",
    initials: "MO",
    action: "requested a review",
    title: "Focus transitions",
    detail: "Ready for a keyboard and reduced-motion review.",
    time: "18m",
  },
  {
    id: 3,
    name: "Sam",
    initials: "SK",
    action: "shared a study",
    title: "Surface grain",
    detail: "A finer grain, with less contrast in the shadows.",
    time: "1h",
  },
];
function InboxList() {
  const [read, setRead] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const shown = initialInbox.filter(
    (item) => !onlyUnread || !read.includes(item.id),
  );
  const current = initialInbox.find((item) => item.id === selected);
  return (
    <div className="study inbox-study">
      <div className="inbox-heading">
        <span>{initialInbox.length - read.length} unread</span>
        <button
          aria-pressed={onlyUnread}
          onClick={() => setOnlyUnread(!onlyUnread)}
        >
          Unread only
        </button>
        <button
          className="ui-icon-button ui-rim"
          aria-label="Mark all as read"
          disabled={read.length === 3}
          onClick={() => setRead(initialInbox.map((item) => item.id))}
        >
          <CheckCheck size={15} />
        </button>
      </div>
      <div className="inbox-rows">
        {shown.map((item) => (
          <button
            className={`${read.includes(item.id) ? "read" : "unread"} ${selected === item.id ? "selected" : ""}`}
            key={item.id}
            onClick={() => {
              setSelected(item.id);
              setRead((values) =>
                values.includes(item.id) ? values : [...values, item.id],
              );
            }}
          >
            <span className="ui-avatar">{item.initials}</span>
            <span>
              <strong>{item.title}</strong>
              <small>
                {item.name} {item.action}
              </small>
            </span>
            <time>{item.time}</time>
          </button>
        ))}
        {!shown.length && (
          <div className="inbox-clear">
            <CheckCheck size={22} />
            <strong>All caught up</strong>
            <button onClick={() => setOnlyUnread(false)}>
              Show all messages
            </button>
          </div>
        )}
      </div>
      <div className="inbox-detail" aria-live="polite">
        {current ? (
          <>
            <span>{current.name}</span>
            <p>{current.detail}</p>
          </>
        ) : (
          <p>Select a message to read it.</p>
        )}
      </div>
    </div>
  );
}

function ActivityThread() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: "Alex",
      initials: "AL",
      text: "Reduced the edge contrast. The highlight now follows the pointer.",
      time: "12 min ago",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [subscribed, setSubscribed] = useState(true);
  const input = useRef<HTMLTextAreaElement>(null);
  const submit = () => {
    if (!draft.trim()) return;
    setMessages((values) => [
      ...values,
      {
        id: Date.now(),
        author: "You",
        initials: "YO",
        text: draft.trim(),
        time: "Just now",
      },
    ]);
    setDraft("");
    input.current?.focus();
  };
  return (
    <div className="study activity-study">
      <div className="activity-events">
        <span className="activity-stem" aria-hidden="true" />
        <div className="activity-event">
          <span className="event-icon">
            <CircleDot size={13} />
          </span>
          <span>
            Morgan moved this to <strong>In progress</strong>
            <small>20 min ago</small>
          </span>
        </div>
        <div className="thread-messages" role="log" aria-label="Comments">
          {messages.map((message) => (
            <div className="thread-message" key={message.id}>
              <span className="ui-avatar">{message.initials}</span>
              <div>
                <header>
                  <strong>{message.author}</strong>
                  <time>{message.time}</time>
                </header>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form
        className="comment-composer ui-rim ui-surface"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label className="sr-only" htmlFor="activity-comment">
          Add a comment
        </label>
        <textarea
          id="activity-comment"
          ref={input}
          value={draft}
          maxLength={500}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Leave a comment…"
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              submit();
            }
          }}
        />
        <div>
          <span>⌘ / Ctrl + Enter</span>
          <button
            className="ui-icon-button ui-rim"
            type="submit"
            aria-label="Send comment"
            disabled={!draft.trim()}
          >
            <Send size={14} />
          </button>
        </div>
      </form>
      <button
        className="subscribe-control"
        aria-pressed={subscribed}
        onClick={() => setSubscribed(!subscribed)}
      >
        {subscribed ? <Check size={12} /> : <Plus size={12} />}
        {subscribed ? "Subscribed to replies" : "Subscribe to replies"}
      </button>
    </div>
  );
}

function BatchActions() {
  const items = [
    "Refine edge highlight",
    "Review focus states",
    "Tune surface grain",
  ];
  const [selected, setSelected] = useState<string[]>([items[0], items[1]]);
  const [done, setDone] = useState<string[]>([]);
  const [previous, setPrevious] = useState<string[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const toggle = (name: string) =>
    setSelected((values) =>
      values.includes(name)
        ? values.filter((value) => value !== name)
        : [...values, name],
    );
  return (
    <div className="study batch-study">
      <div className="batch-list">
        {items.map((name) => (
          <label key={name} className={done.includes(name) ? "done" : ""}>
            <input
              type="checkbox"
              checked={selected.includes(name)}
              onChange={() => toggle(name)}
            />
            <span>{name}</span>
            {done.includes(name) ? (
              <CheckCheck size={14} />
            ) : (
              <CircleDashed size={14} />
            )}
          </label>
        ))}
      </div>
      <Edge
        className={`batch-bar ${selected.length ? "has-selection" : "no-selection"}`}
      >
        <span>{selected.length} selected</span>
        <button
          aria-label="Complete selected items"
          disabled={!selected.length}
          onClick={() => {
            setPrevious(done);
            setCanUndo(true);
            setDone((values) => [...new Set([...values, ...selected])]);
            setSelected([]);
          }}
        >
          <Check size={14} />
          <span>Complete</span>
        </button>
        <button
          className="ui-icon-button ui-rim"
          aria-label="Clear selection"
          disabled={!selected.length}
          onClick={() => setSelected([])}
        >
          <X size={13} />
        </button>
      </Edge>
      <div className="ui-meta" aria-live="polite">
        <span>
          {done.length} of {items.length} completed
        </span>
        <button
          disabled={!canUndo}
          onClick={() => {
            setDone(previous);
            setCanUndo(false);
          }}
        >
          Undo completion
        </button>
      </div>
      <Toggle
        label="Select all"
        checked={selected.length === items.length}
        onChange={(checked) => setSelected(checked ? items : [])}
      />
    </div>
  );
}
