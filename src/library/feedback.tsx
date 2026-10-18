import { useEffect, useId, useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Inbox,
  Info,
  Keyboard,
  Megaphone,
  Minus,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Button, IconButton, MenuOption, Segmented, Toggle } from "../ui";

type Notify = (message: string) => void;

export const feedbackStudies = [
  { id: "toast-stack", title: "Toast stack", category: "feedback" },
  { id: "inline-alerts", title: "Inline alerts", category: "feedback" },
  { id: "announcement-banner", title: "Announcement banner", category: "feedback" },
  { id: "progress-ring", title: "Progress ring", category: "feedback" },
  { id: "loading-bar", title: "Loading bar", category: "feedback" },
  { id: "skeleton-list", title: "Skeleton list", category: "feedback" },
  { id: "empty-state", title: "Empty state", category: "feedback" },
  { id: "error-state", title: "Error state", category: "feedback" },
  { id: "status-pills", title: "Status pills", category: "feedback" },
  { id: "avatar-stack", title: "Avatar stack", category: "feedback" },
  { id: "popover", title: "Popover", category: "feedback" },
  { id: "rich-tooltip", title: "Rich tooltip", category: "feedback" },
  { id: "coach-tour", title: "Coach marks", category: "feedback" },
  { id: "permission-matrix", title: "Permission matrix", category: "feedback" },
] as const;

export function FeedbackStudy({ id, notify }: { id: string; notify: Notify }) {
  switch (id) {
    case "toast-stack":
      return <ToastStack notify={notify} />;
    case "inline-alerts":
      return <InlineAlerts notify={notify} />;
    case "announcement-banner":
      return <AnnouncementBanner notify={notify} />;
    case "progress-ring":
      return <ProgressRing />;
    case "loading-bar":
      return <LoadingBar />;
    case "skeleton-list":
      return <SkeletonList notify={notify} />;
    case "empty-state":
      return <EmptyState notify={notify} />;
    case "error-state":
      return <ErrorState notify={notify} />;
    case "status-pills":
      return <StatusPills />;
    case "avatar-stack":
      return <AvatarStack />;
    case "popover":
      return <Popover notify={notify} />;
    case "rich-tooltip":
      return <RichTooltip />;
    case "coach-tour":
      return <CoachTour notify={notify} />;
    case "permission-matrix":
      return <PermissionMatrix notify={notify} />;
    default:
      return null;
  }
}

const toneIcons = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
};

type ToastItem = {
  id: number;
  tone: "success" | "info" | "error";
  title: string;
  message: string;
  undo?: boolean;
};

const initialToasts: ToastItem[] = [
  {
    id: 1,
    tone: "success",
    title: "Deploy complete",
    message: "Production is serving build 2481.",
    undo: true,
  },
  {
    id: 2,
    tone: "info",
    title: "Preview ready",
    message: "The share link stays active for seven days.",
  },
  {
    id: 3,
    tone: "error",
    title: "Sync failed",
    message: "Two files could not be uploaded.",
    undo: true,
  },
];

function ToastStack({ notify }: { notify: Notify }) {
  const [toasts, setToasts] = useState<ToastItem[]>(() => [...initialToasts]);
  const remove = (toast: ToastItem, action: "dismissed" | "undone") => {
    setToasts((current) => current.filter((item) => item.id !== toast.id));
    notify(
      action === "undone"
        ? `Undid “${toast.title}”.`
        : `Dismissed “${toast.title}”.`,
    );
  };
  return (
    <div className="study ui-stack">
      {toasts.length ? (
        <ul className="lib-toasts" aria-label="Notifications">
          {toasts.map((toast) => {
            const ToneIcon = toneIcons[toast.tone];
            return (
              <li key={toast.id} className={`lib-toast lib-tone-${toast.tone}`}>
                <span className="lib-toast__icon" aria-hidden="true">
                  <ToneIcon size={14} />
                </span>
                <span
                  className="lib-toast__copy"
                  role={toast.tone === "error" ? "alert" : "status"}
                >
                  <strong>{toast.title}</strong>
                  <small>{toast.message}</small>
                </span>
                {toast.undo && (
                  <button
                    type="button"
                    className="lib-toast__action"
                    onClick={() => remove(toast, "undone")}
                  >
                    Undo
                  </button>
                )}
                <IconButton
                  label={`Dismiss ${toast.title}`}
                  onClick={() => remove(toast, "dismissed")}
                >
                  <X size={14} />
                </IconButton>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="lib-empty" role="status">
          All notifications cleared.
        </p>
      )}
      <div className="ui-between">
        <span className="lib-caption">
          {toasts.length} of {initialToasts.length} visible
        </span>
        <Button
          variant="ghost"
          disabled={toasts.length === initialToasts.length}
          onClick={() => setToasts([...initialToasts])}
        >
          Restore all
        </Button>
      </div>
    </div>
  );
}

const alerts: {
  tone: "info" | "success" | "warning";
  title: string;
  body: string;
  action?: string;
}[] = [
  {
    tone: "info",
    title: "Scheduled maintenance",
    body: "The build runner pauses on Sunday between 02:00 and 03:00 UTC.",
    action: "View window",
  },
  {
    tone: "success",
    title: "Domain verified",
    body: "rift.design now resolves through the edge network.",
  },
  {
    tone: "warning",
    title: "Seat limit near",
    body: "11 of 12 seats are in use. Add capacity before the next invite.",
    action: "Manage seats",
  },
];

function InlineAlerts({ notify }: { notify: Notify }) {
  return (
    <div className="study ui-stack">
      <div className="lib-alerts">
        {alerts.map((alert) => {
          const ToneIcon = toneIcons[alert.tone];
          return (
            <div
              key={alert.title}
              className={`lib-alert lib-tone-${alert.tone}`}
              role="status"
            >
              <span className="lib-alert__icon" aria-hidden="true">
                <ToneIcon size={15} />
              </span>
              <div className="lib-alert__body">
                <strong className="lib-alert__title">{alert.title}</strong>
                <p>{alert.body}</p>
                {alert.action && (
                  <button
                    type="button"
                    className="lib-alert__action"
                    onClick={() => notify(`${alert.action} · ${alert.title}`)}
                  >
                    {alert.action}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <span className="lib-caption">Three tones, one message rhythm.</span>
    </div>
  );
}

function AnnouncementBanner({ notify }: { notify: Notify }) {
  const [visible, setVisible] = useState(true);
  return (
    <div className="study ui-stack">
      {visible ? (
        <div className="lib-banner" role="region" aria-label="Product announcement">
          <span className="lib-banner__icon" aria-hidden="true">
            <Megaphone size={15} />
          </span>
          <span className="lib-banner__copy">
            <strong>Materials 2.0 is live</strong>
            <small>Every surface now ships with the prism rim and shared tokens.</small>
          </span>
          <div className="lib-banner__actions">
            <Button
              variant="secondary"
              onClick={() => notify("Opening the materials tour.")}
            >
              Take the tour
            </Button>
            <IconButton
              label="Dismiss announcement"
              onClick={() => {
                setVisible(false);
                notify("Announcement dismissed.");
              }}
            >
              <X size={15} />
            </IconButton>
          </div>
        </div>
      ) : (
        <Button variant="ghost" onClick={() => setVisible(true)}>
          Show announcement
        </Button>
      )}
      <span className="lib-caption">
        {visible ? "Dismiss hides it for this session." : "The banner can be restored."}
      </span>
    </div>
  );
}

function ProgressRing() {
  const [value, setValue] = useState(68);
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const clamp = (next: number) => setValue(Math.min(100, Math.max(0, next)));
  return (
    <div className="study ui-stack lib-center">
      <div
        className="lib-ring"
        role="progressbar"
        aria-label="Export progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value}% complete`}
      >
        <svg className="lib-ring__svg" viewBox="0 0 64 64" aria-hidden="true">
          <circle className="lib-ring__track" cx="32" cy="32" r={radius} />
          <circle
            className="lib-ring__value"
            cx="32"
            cy="32"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - value / 100)}
          />
        </svg>
        <span className="lib-ring__label">
          {value}
          <small>%</small>
        </span>
      </div>
      <div className="lib-ring__actions">
        <IconButton
          label="Decrease progress by five percent"
          disabled={value === 0}
          onClick={() => clamp(value - 5)}
        >
          <Minus size={14} />
        </IconButton>
        <span className="lib-caption lib-num">34 of 50 files · 5% steps</span>
        <IconButton
          label="Increase progress by five percent"
          disabled={value === 100}
          onClick={() => clamp(value + 5)}
        >
          <Plus size={14} />
        </IconButton>
      </div>
    </div>
  );
}

function LoadingBar() {
  const [mode, setMode] = useState("determinate");
  const [value, setValue] = useState(42);
  const step = (delta: number) =>
    setValue((current) => Math.min(100, Math.max(0, current + delta)));
  return (
    <div className="study ui-stack">
      <Segmented
        label="Loading bar mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: "determinate", label: "Determinate" },
          { value: "indeterminate", label: "Indeterminate" },
        ]}
      />
      {mode === "determinate" ? (
        <>
          <div
            className="lib-load"
            role="progressbar"
            aria-label="Upload progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            aria-valuetext={`${value}%`}
          >
            <span className="lib-load__fill" style={{ width: `${value}%` }} />
          </div>
          <div className="ui-between">
            <span className="lib-caption lib-num">{value}% · 8.4 of 20 MB</span>
            <div className="lib-load__steps">
              <IconButton
                label="Decrease progress by ten percent"
                disabled={value === 0}
                onClick={() => step(-10)}
              >
                <Minus size={14} />
              </IconButton>
              <IconButton
                label="Increase progress by ten percent"
                disabled={value === 100}
                onClick={() => step(10)}
              >
                <Plus size={14} />
              </IconButton>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="lib-load lib-load--indeterminate"
            role="progressbar"
            aria-label="Loading files"
          >
            <span className="lib-load__fill" />
          </div>
          <span className="lib-caption">Measuring the archive before transfer.</span>
        </>
      )}
    </div>
  );
}

const skeletonMembers = [
  { initials: "AK", name: "Ada Kowalska", role: "Design systems" },
  { initials: "BN", name: "Borys Nowak", role: "Platform" },
  { initials: "CL", name: "Casey Lin", role: "Product" },
];

function SkeletonList({ notify }: { notify: Notify }) {
  const [loading, setLoading] = useState(true);
  return (
    <div className="study ui-stack">
      <div className="lib-panel" aria-busy={loading}>
        <div className="lib-panel-head">
          <Users size={13} />
          <span>Team members</span>
          <span className="lib-caption lib-push">
            {loading ? "Loading" : "3 active"}
          </span>
        </div>
        <div className="lib-list">
          {loading
            ? [0, 1, 2].map((row) => (
                <div className="lib-skel__row" key={row} aria-hidden="true">
                  <span className="lib-skel__avatar" />
                  <span className="lib-skel__lines">
                    <span className="lib-skel__line" />
                    <span className="lib-skel__line lib-skel__line--short" />
                  </span>
                </div>
              ))
            : skeletonMembers.map((member) => (
                <div className="lib-row" key={member.initials}>
                  <span className="ui-avatar">{member.initials}</span>
                  <span className="lib-row__copy">
                    <strong>{member.name}</strong>
                    <small>{member.role}</small>
                  </span>
                  <span className="lib-caption">Active</span>
                </div>
              ))}
        </div>
      </div>
      <Toggle
        label="Show skeleton"
        description="Switch between placeholder rows and loaded members"
        checked={loading}
        onChange={(next) => {
          setLoading(next);
          notify(next ? "Loading members." : "Members loaded.");
        }}
      />
    </div>
  );
}

function EmptyState({ notify }: { notify: Notify }) {
  return (
    <div className="study ui-stack">
      <div className="lib-blank">
        <span className="lib-blank__icon" aria-hidden="true">
          <Inbox size={18} />
        </span>
        <strong className="lib-blank__title">No specimens yet</strong>
        <p className="lib-blank__body">
          Create a first board to collect surfaces, states and motion studies in
          one place.
        </p>
        <div className="lib-blank__actions">
          <Button
            variant="primary"
            icon={<Plus size={14} />}
            onClick={() => notify("New board created.")}
          >
            New board
          </Button>
          <Button variant="ghost" onClick={() => notify("Opening the import dialog.")}>
            Import a file
          </Button>
        </div>
      </div>
      <span className="lib-caption">
        Every empty view should point to one next step.
      </span>
    </div>
  );
}

function ErrorState({ notify }: { notify: Notify }) {
  return (
    <div className="study ui-stack">
      <div className="lib-fault">
        <span className="lib-fault__icon" aria-hidden="true">
          <AlertTriangle size={17} />
        </span>
        <strong className="lib-fault__title">We could not load this workspace</strong>
        <p className="lib-fault__body">
          The connection dropped while fetching the board. Your local changes are
          safe.
        </p>
        <code className="lib-fault__code lib-num">SYNC-5031</code>
        <div className="lib-fault__actions">
          <Button
            variant="secondary"
            icon={<RotateCcw size={14} />}
            onClick={() => notify("Retrying the workspace load.")}
          >
            Retry
          </Button>
          <button
            type="button"
            className="lib-fault__link"
            onClick={() => notify("Support request started.")}
          >
            Contact support
          </button>
        </div>
      </div>
    </div>
  );
}

const statusOrder = ["draft", "review", "live", "blocked"] as const;
type Status = (typeof statusOrder)[number];

const statusLabel: Record<Status, string> = {
  draft: "Draft",
  review: "In review",
  live: "Live",
  blocked: "Blocked",
};

const statusTone: Record<Status, string> = {
  draft: "neutral",
  review: "info",
  live: "success",
  blocked: "error",
};

function StatusPills() {
  const [items, setItems] = useState<{ name: string; status: Status }[]>([
    { name: "Optical edge", status: "live" },
    { name: "Commit gesture", status: "draft" },
    { name: "Ambient player", status: "blocked" },
  ]);
  const [announcement, setAnnouncement] = useState("");
  const cycle = (index: number) => {
    const item = items[index];
    const next =
      statusOrder[(statusOrder.indexOf(item.status) + 1) % statusOrder.length];
    setItems((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, status: next } : entry,
      ),
    );
    setAnnouncement(`${item.name} moved to ${statusLabel[next]}.`);
  };
  return (
    <div className="study ui-stack">
      <ul className="lib-pills">
        {items.map((item, index) => (
          <li key={item.name}>
            <button
              type="button"
              className={`lib-pill lib-tone-${statusTone[item.status]}`}
              aria-label={`${item.name}: ${statusLabel[item.status]}. Activate to cycle status.`}
              onClick={() => cycle(index)}
            >
              <span className="lib-pill__dot" aria-hidden="true" />
              <span className="lib-pill__name">{item.name}</span>
              <span className="lib-pill__status">{statusLabel[item.status]}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="lib-caption" aria-live="polite">
        {announcement || "Select a pill to cycle its status."}
      </p>
    </div>
  );
}

const roster = [
  { initials: "AK", name: "Ada Kowalska", online: true },
  { initials: "BN", name: "Borys Nowak", online: false },
  { initials: "CL", name: "Casey Lin", online: true },
  { initials: "DM", name: "Dara Mensah", online: true },
  { initials: "ES", name: "Eli Sand", online: false },
];

function AvatarStack() {
  const shown = roster.slice(0, 3);
  const overflow = roster.length - shown.length;
  return (
    <div className="study ui-stack">
      <span className="ui-label">Reviewers</span>
      <div className="lib-faces" role="group" aria-label="Reviewers">
        {shown.map((member) => (
          <button
            key={member.initials}
            type="button"
            className="lib-face"
            aria-label={`${member.name}, ${member.online ? "online" : "away"}`}
          >
            <span className="ui-avatar">{member.initials}</span>
            <span
              className={`lib-face__presence${member.online ? " is-on" : ""}`}
              aria-hidden="true"
            />
            <span className="lib-face__name" aria-hidden="true">
              {member.name}
            </span>
          </button>
        ))}
        <span
          className="lib-face__more"
          role="img"
          aria-label={`${overflow} more reviewers`}
        >
          +{overflow}
        </span>
      </div>
      <span className="lib-caption">
        Hover or focus an avatar to reveal the member name.
      </span>
    </div>
  );
}

const views = [
  { value: "board", label: "Board", description: "Cards grouped by status" },
  { value: "table", label: "Table", description: "Dense rows and columns" },
  { value: "timeline", label: "Timeline", description: "Work ordered by week" },
];

function Popover({ notify }: { notify: Notify }) {
  const [open, setOpen] = useState(true);
  const [view, setView] = useState("board");
  const [rows, setRows] = useState(24);
  const trigger = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const focusTrigger = () =>
    trigger.current?.querySelector<HTMLButtonElement>("button")?.focus();
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        (panel.current?.contains(target) || trigger.current?.contains(target))
      ) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      focusTrigger();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);
  return (
    <div className="study ui-stack">
      <span className="ui-label">Board layout</span>
      <div className="lib-anchor" ref={trigger}>
        <Button
          variant="secondary"
          icon={<SlidersHorizontal size={14} />}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="view-options"
          onClick={() => setOpen((current) => !current)}
        >
          View options
        </Button>
        {open && (
          <div
            ref={panel}
            id="view-options"
            className="lib-popover lib-pop"
            role="dialog"
            aria-label="View options"
          >
            <p className="lib-pop__title">View options</p>
            {views.map((option) => (
              <MenuOption
                key={option.value}
                label={option.label}
                description={option.description}
                className="lib-pop__option"
                selected={view === option.value}
                onClick={() => {
                  setView(option.value);
                  setOpen(false);
                  focusTrigger();
                  notify(`Switched to ${option.label.toLowerCase()} view.`);
                }}
              />
            ))}
            <div className="lib-pop__field">
              <label className="ui-label" htmlFor="popover-rows">
                Rows per page
              </label>
              <input
                id="popover-rows"
                className="lib-input lib-num"
                type="number"
                min={1}
                max={99}
                value={rows}
                onChange={(event) =>
                  setRows(
                    Math.min(99, Math.max(1, Number(event.target.value) || 1)),
                  )
                }
              />
            </div>
          </div>
        )}
      </div>
      <span className="lib-caption">
        {view === "board" ? "Board" : view === "table" ? "Table" : "Timeline"} ·{" "}
        {rows} rows per page
      </span>
    </div>
  );
}

function RichTooltip() {
  const [open, setOpen] = useState(true);
  const tipId = useId();
  return (
    <div className="study ui-stack">
      <span className="ui-label">Keyboard</span>
      <div className="lib-tipwrap">
        <Button
          variant="secondary"
          icon={<Keyboard size={14} />}
          aria-describedby={open ? tipId : undefined}
          onPointerEnter={() => setOpen(true)}
          onPointerLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          Shortcuts
        </Button>
        {open && (
          <div className="lib-tip" role="tooltip" id={tipId}>
            <strong className="lib-tip__title">Command palette</strong>
            <span className="lib-tip__body">
              Jump to any file, component or action.
            </span>
            <span className="lib-tip__keys">
              <kbd className="lib-key">⌘</kbd>
              <kbd className="lib-key">K</kbd>
            </span>
          </div>
        )}
      </div>
      <span className="lib-caption">
        Appears on hover and on keyboard focus.
      </span>
    </div>
  );
}

const tourSteps = [
  {
    title: "Edge lighting",
    body: "Move the pointer across a surface to see the prism rim track it.",
  },
  {
    title: "Shared tokens",
    body: "Colour, radius and height all come from one visual contract.",
  },
  {
    title: "Composed studies",
    body: "Each specimen reuses the primitives without new dependencies.",
  },
  {
    title: "Save the board",
    body: "Bookmark a specimen to keep it in your working set.",
  },
];

function CoachTour({ notify }: { notify: Notify }) {
  const [step, setStep] = useState(1);
  const last = tourSteps.length - 1;
  const finish = (message: string) => {
    setStep(0);
    notify(message);
  };
  return (
    <div className="study ui-stack">
      <div className="lib-tour">
        <div className="lib-tour__stage">
          <span className="lib-tour__spot" aria-hidden="true" />
          <div className="lib-tour__target">
            <span className="lib-tour__glyph" aria-hidden="true">
              <Sparkles size={15} />
            </span>
            <span className="lib-tour__targetcopy">
              <strong>Precision controls</strong>
              <small>4 components</small>
            </span>
          </div>
        </div>
        <div
          className="lib-tour__panel"
          role="group"
          aria-label={`Tour step ${step + 1} of ${tourSteps.length}`}
        >
          <div className="lib-tour__copy" aria-live="polite">
            <span className="lib-caption lib-num">
              Step {step + 1} of {tourSteps.length}
            </span>
            <strong className="lib-tour__title">{tourSteps[step].title}</strong>
            <p className="lib-tour__body">{tourSteps[step].body}</p>
          </div>
          <div className="lib-tour__actions">
            <Button
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              Back
            </Button>
            <div className="lib-tour__next">
              <Button variant="ghost" onClick={() => finish("Tour skipped.")}>
                Skip
              </Button>
              {step === last ? (
                <Button variant="primary" onClick={() => finish("Tour complete.")}>
                  Finish
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setStep((current) => Math.min(last, current + 1))}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const permRoles = ["Owner", "Editor", "Viewer"] as const;
const permColumns = ["View", "Edit", "Publish", "Billing"] as const;

const defaultGranted = permRoles.map((_, role) =>
  permColumns.map((_, column) => role === 0 || (role === 1 && column < 3)),
);

function PermissionMatrix({ notify }: { notify: Notify }) {
  const [granted, setGranted] = useState<boolean[][]>(() =>
    defaultGranted.map((row) => [...row]),
  );
  const isAll = (column: number) => granted.every((row) => row[column]);
  const isSome = (column: number) =>
    !isAll(column) && granted.some((row) => row[column]);
  const toggleCell = (role: number, column: number) =>
    setGranted((current) =>
      current.map((row, rowIndex) =>
        rowIndex === role
          ? row.map((value, columnIndex) =>
              columnIndex === column ? !value : value,
            )
          : row,
      ),
    );
  const toggleColumn = (column: number) => {
    const next = !isAll(column);
    setGranted((current) =>
      current.map((row) =>
        row.map((value, columnIndex) =>
          columnIndex === column ? next : value,
        ),
      ),
    );
  };
  const total = granted.flat().filter(Boolean).length;
  return (
    <div className="study ui-stack">
      <div className="lib-permwrap">
        <table className="lib-perm">
          <thead>
            <tr>
              <th scope="col">Role</th>
              {permColumns.map((permission, column) => (
                <th scope="col" key={permission}>
                  <label className="lib-check lib-check--inline lib-perm__head">
                    <input
                      type="checkbox"
                      checked={isAll(column)}
                      aria-label={`Grant ${permission} to every role`}
                      ref={(node) => {
                        if (node) node.indeterminate = isSome(column);
                      }}
                      onChange={() => toggleColumn(column)}
                    />
                    <span className="lib-check__box" aria-hidden="true">
                      <Check size={12} />
                    </span>
                    <span className="lib-perm__label">{permission}</span>
                  </label>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permRoles.map((role, row) => (
              <tr key={role}>
                <th scope="row">{role}</th>
                {permColumns.map((permission, column) => (
                  <td key={permission}>
                    <label className="lib-check lib-check--inline lib-perm__cell">
                      <input
                        type="checkbox"
                        checked={granted[row][column]}
                        aria-label={`${permission} for ${role}`}
                        onChange={() => toggleCell(row, column)}
                      />
                      <span className="lib-check__box" aria-hidden="true">
                        <Check size={12} />
                      </span>
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={permColumns.length + 1}>
                <div className="lib-perm__foot">
                  <span className="lib-caption" aria-live="polite">
                    {total} of {permRoles.length * permColumns.length} permissions
                    granted
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setGranted(defaultGranted.map((row) => [...row]));
                      notify("Permissions reset to defaults.");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
