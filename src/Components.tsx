import { useId, useRef, useState } from "react";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Copy,
  File,
  FileText,
  Folder,
  Pencil,
  Search,
  Upload,
  X,
} from "lucide-react";
import { Button, Field, IconButton, MenuOption, Surface } from "./ui";

export const componentStudies = [
  { id: "multi-select", title: "Searchable multiselect", category: "controls" },
  { id: "date-picker", title: "Date picker", category: "controls" },
  { id: "file-upload", title: "File input", category: "controls" },
  { id: "action-menu", title: "Document actions", category: "navigation" },
  { id: "inline-editor", title: "Inline editing", category: "controls" },
  { id: "process-steps", title: "Step navigation", category: "navigation" },
] as const;

export function ComponentStudy({ id }: { id: string }) {
  switch (id) {
    case "multi-select":
      return <MultiSelect />;
    case "date-picker":
      return <DatePicker />;
    case "file-upload":
      return <FileUpload />;
    case "action-menu":
      return <DocumentActions />;
    case "inline-editor":
      return <InlineEditor />;
    case "process-steps":
      return <ProcessSteps />;
    default:
      return null;
  }
}

const disciplines = [
  { label: "Interface", description: "Controls and navigation" },
  { label: "Motion", description: "Transitions and feedback" },
  { label: "Materials", description: "Surfaces and reflections" },
  { label: "Typography", description: "Type and hierarchy" },
];
function MultiSelect() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(["Interface", "Materials"]);
  const [cursor, setCursor] = useState(0);
  const id = useId();
  const matches = disciplines.filter((item) =>
    item.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const toggle = (label: string) =>
    setSelected((values) =>
      values.includes(label)
        ? values.filter((value) => value !== label)
        : [...values, label],
    );
  return (
    <div className="study ui-stack">
      <Field
        label="Disciplines"
        icon={<Search size={14} />}
        placeholder="Find a discipline…"
        value={query}
        role="combobox"
        aria-expanded="true"
        aria-autocomplete="list"
        aria-controls={id}
        aria-activedescendant={
          matches[cursor] ? `${id}-${matches[cursor].label}` : undefined
        }
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
                  matches.length) %
                Math.max(1, matches.length),
            );
          }
          if (event.key === "Enter" && matches[cursor]) {
            event.preventDefault();
            toggle(matches[cursor].label);
          }
          if (event.key === "Escape") {
            setQuery("");
            setCursor(0);
          }
        }}
      />
      <div className="ui-row ui-wrap" aria-label="Selected disciplines">
        {selected.map((label) => (
          <span className="ui-chip" key={label}>
            {label}
            <button
              aria-label={`Remove ${label}`}
              onClick={() => toggle(label)}
            >
              <X size={11} />
            </button>
          </span>
        ))}
        {!selected.length && (
          <span className="ui-hint">Choose one or more disciplines.</span>
        )}
      </div>
      <Surface
        role="listbox"
        aria-label="Disciplines"
        aria-multiselectable="true"
        id={id}
      >
        {matches.map((item, index) => (
          <MenuOption
            key={item.label}
            id={`${id}-${item.label}`}
            role="option"
            selected={selected.includes(item.label)}
            data-highlighted={cursor === index}
            label={item.label}
            description={item.description}
            onPointerMove={() => setCursor(index)}
            onClick={() => toggle(item.label)}
          />
        ))}
        {!matches.length && (
          <div className="ui-empty">
            <Search size={18} />
            <span className="ui-copy">No matching disciplines.</span>
          </div>
        )}
      </Surface>
      <div className="ui-meta" aria-live="polite">
        <span>{selected.length} selected</span>
        <button disabled={!selected.length} onClick={() => setSelected([])}>
          Clear selection
        </button>
      </div>
    </div>
  );
}

function DatePicker() {
  const now = new Date();
  const [month, setMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const [selected, setSelected] = useState(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()),
  );
  const [focusDay, setFocusDay] = useState(now.getDate());
  const id = useId();
  const year = month.getFullYear(),
    index = month.getMonth();
  const days = new Date(year, index + 1, 0).getDate();
  const offset = (month.getDay() + 6) % 7;
  const rows = Array.from(
    { length: Math.ceil((offset + days) / 7) },
    (_, row) =>
      Array.from({ length: 7 }, (_, col) => row * 7 + col - offset + 1),
  );
  const changeMonth = (delta: number) => {
    setMonth(new Date(year, index + delta, 1));
    setFocusDay(1);
  };
  const isSelected = (day: number) =>
    selected.getFullYear() === year &&
    selected.getMonth() === index &&
    selected.getDate() === day;
  return (
    <div className="study ui-stack">
      <div className="ui-between">
        <span className="ui-label">Due date</span>
        <CalendarDays size={14} aria-hidden="true" />
      </div>
      <Surface>
        <div className="ui-between calendar-heading">
          <IconButton label="Previous month" onClick={() => changeMonth(-1)}>
            <ChevronLeft size={15} />
          </IconButton>
          <h3 className="ui-title" id={`${id}-month`}>
            {month.toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <IconButton label="Next month" onClick={() => changeMonth(1)}>
            <ChevronRight size={15} />
          </IconButton>
        </div>
        <table className="calendar-grid" aria-labelledby={`${id}-month`}>
          <thead>
            <tr>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <th key={day} scope="col">
                  <abbr title={day}>{day.slice(0, 1)}</abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((week, row) => (
              <tr key={row}>
                {week.map((day, col) => (
                  <td key={col}>
                    {day > 0 && day <= days && (
                      <button
                        type="button"
                        className="ui-day ui-rim"
                        id={`${id}-${day}`}
                        aria-label={new Date(
                          year,
                          index,
                          day,
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        aria-pressed={isSelected(day)}
                        aria-current={
                          year === now.getFullYear() &&
                          index === now.getMonth() &&
                          day === now.getDate()
                            ? "date"
                            : undefined
                        }
                        tabIndex={day === Math.min(focusDay, days) ? 0 : -1}
                        onFocus={() => setFocusDay(day)}
                        onClick={() => setSelected(new Date(year, index, day))}
                        onKeyDown={(event) => {
                          const delta =
                            event.key === "ArrowRight"
                              ? 1
                              : event.key === "ArrowLeft"
                                ? -1
                                : event.key === "ArrowDown"
                                  ? 7
                                  : event.key === "ArrowUp"
                                    ? -7
                                    : 0;
                          if (
                            !delta &&
                            event.key !== "Home" &&
                            event.key !== "End"
                          )
                            return;
                          event.preventDefault();
                          const next =
                            event.key === "Home"
                              ? Math.max(1, day - col)
                              : event.key === "End"
                                ? Math.min(days, day + 6 - col)
                                : Math.max(1, Math.min(days, day + delta));
                          setFocusDay(next);
                          document.getElementById(`${id}-${next}`)?.focus();
                        }}
                      >
                        {day}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Surface>
      <div className="ui-meta" aria-live="polite">
        <strong>
          {selected.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </strong>
        <button
          onClick={() => {
            setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
            setSelected(
              new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            );
            setFocusDay(now.getDate());
          }}
        >
          Today
        </button>
      </div>
    </div>
  );
}

function FileUpload() {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const add = (incoming: FileList | null) => {
    if (!incoming) return;
    const all = Array.from(incoming);
    const valid = all.filter((file) => file.size <= 10 * 1024 * 1024);
    setError(
      valid.length < all.length ? "Files must be 10 MB or smaller." : "",
    );
    setFiles((current) =>
      [...current, ...valid].filter(
        (file, index, array) =>
          array.findIndex(
            (other) =>
              other.name === file.name &&
              other.size === file.size &&
              other.lastModified === file.lastModified,
          ) === index,
      ),
    );
  };
  return (
    <div className="study ui-stack">
      <Surface
        className={`ui-dropzone ${dragging ? "is-dragging" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          add(event.dataTransfer.files);
        }}
      >
        <div className="ui-empty">
          <Upload size={22} />
          <div className="ui-stack">
            <strong className="ui-title">Drop files here</strong>
            <span className="ui-hint">
              Up to 10 MB each · Stays on your device
            </span>
          </div>
          <Button onClick={() => input.current?.click()}>Choose files</Button>
        </div>
        <input
          className="sr-only"
          ref={input}
          type="file"
          multiple
          tabIndex={-1}
          aria-label="Choose local files"
          onChange={(event) => {
            add(event.target.files);
            event.target.value = "";
          }}
        />
      </Surface>
      {error && (
        <p className="ui-error" role="alert">
          {error}
        </p>
      )}
      <div className="ui-stack ui-scroll" aria-live="polite">
        {files.map((file, index) => (
          <div className="ui-row" key={`${file.name}-${file.lastModified}`}>
            <File size={16} />
            <span className="ui-grow">
              <strong className="ui-copy">{file.name}</strong>
              <small className="ui-label">
                {file.size < 1024
                  ? `${file.size} B`
                  : `${(file.size / 1024).toFixed(1)} KB`}
              </small>
            </span>
            <IconButton
              label={`Remove ${file.name}`}
              onClick={() =>
                setFiles((values) => values.filter((_, i) => i !== index))
              }
            >
              <X size={14} />
            </IconButton>
          </div>
        ))}
      </div>
      <div className="ui-meta">
        <span>
          {files.length} {files.length === 1 ? "file" : "files"} selected
        </span>
        <button disabled={!files.length} onClick={() => setFiles([])}>
          Remove all
        </button>
      </div>
    </div>
  );
}

function DocumentActions() {
  const [name, setName] = useState("Material notes");
  const [draft, setDraft] = useState(name);
  const [editing, setEditing] = useState(false);
  const [archived, setArchived] = useState(false);
  const [copies, setCopies] = useState(0);
  return (
    <div className="study ui-stack">
      <div className="ui-row ui-preview">
        <FileText size={18} />
        <div className="ui-grow">
          <h3 className="ui-title">{archived ? "Document archived" : name}</h3>
          <span className="ui-hint">
            {copies
              ? `${copies} ${copies === 1 ? "copy" : "copies"} created`
              : "Private document"}
          </span>
        </div>
      </div>
      {archived ? (
        <div className="ui-empty">
          <Archive size={22} />
          <Button onClick={() => setArchived(false)}>Restore document</Button>
        </div>
      ) : editing ? (
        <form
          className="ui-stack"
          onSubmit={(event) => {
            event.preventDefault();
            if (draft.trim()) {
              setName(draft.trim());
              setEditing(false);
            }
          }}
        >
          <Field
            label="Document name"
            autoFocus
            maxLength={48}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setEditing(false);
            }}
          />
          <div className="ui-actions">
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!draft.trim()}>
              Apply name
            </Button>
          </div>
        </form>
      ) : (
        <Surface
          role="menu"
          aria-label="Document actions"
          onKeyDown={(event) => {
            if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key))
              return;
            event.preventDefault();
            const items = [
              ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[role="menuitem"]',
              ),
            ];
            const current = items.indexOf(
              document.activeElement as HTMLButtonElement,
            );
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? items.length - 1
                  : (current +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      items.length) %
                    items.length;
            items[next]?.focus();
          }}
        >
          <div>
            <MenuOption
              role="menuitem"
              label="Rename"
              icon={<Pencil size={14} />}
              onClick={() => {
                setDraft(name);
                setEditing(true);
              }}
            />
            <MenuOption
              role="menuitem"
              label="Duplicate"
              icon={<Copy size={14} />}
              onClick={() => setCopies((value) => value + 1)}
            />
            <div className="ui-divider" />
            <MenuOption
              role="menuitem"
              label="Archive document"
              icon={<Archive size={14} />}
              onClick={() => setArchived(true)}
            />
          </div>
        </Surface>
      )}
      <div className="ui-meta" aria-live="polite">
        <span>
          {archived
            ? "Archived"
            : editing
              ? "Editing name"
              : "Changes stay in this demo"}
        </span>
      </div>
    </div>
  );
}

function InlineEditor() {
  const [name, setName] = useState("Edge reflections");
  const [draft, setDraft] = useState(name);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const id = useId();
  const finish = () => {
    setEditing(false);
    setError("");
    requestAnimationFrame(() => document.getElementById(id)?.focus());
  };
  const save = () => {
    if (draft.trim().length < 3) {
      setError("Use at least 3 characters.");
      return;
    }
    setName(draft.trim());
    finish();
  };
  return (
    <div className="study ui-stack">
      <div className="ui-between ui-preview">
        <div className="ui-stack">
          <span className="ui-label">Study name</span>
          <h3 className="ui-title" aria-live="polite">
            {name}
          </h3>
        </div>
        <IconButton
          id={id}
          label="Edit study name"
          aria-expanded={editing}
          onClick={() => {
            setDraft(name);
            setEditing(true);
          }}
        >
          <Pencil size={15} />
        </IconButton>
      </div>
      {editing ? (
        <form
          className="ui-stack"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <Field
            label="Rename study"
            hint="3–48 characters. Enter to save, Escape to cancel."
            error={error}
            maxLength={48}
            value={draft}
            autoFocus
            onChange={(event) => {
              setDraft(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                finish();
              }
            }}
          />
          <div className="ui-actions">
            <Button variant="ghost" onClick={finish}>
              Cancel
            </Button>
            <Button type="submit" icon={<Check size={14} />}>
              Save name
            </Button>
          </div>
        </form>
      ) : (
        <div className="ui-stack">
          <p className="ui-copy">
            Edit the name in place. Your changes appear above when saved.
          </p>
          <span className="ui-hint">
            The edit control also works with the keyboard.
          </span>
        </div>
      )}
    </div>
  );
}

const steps = [
  { name: "Details", copy: "Name the study and choose its purpose." },
  { name: "Materials", copy: "Choose a surface and review its reflection." },
  { name: "Review", copy: "Check contrast, motion and keyboard access." },
];
function ProcessSteps() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  return (
    <div className="study ui-stack">
      <nav className="ui-stack" aria-label="Study setup">
        {steps.map((item, index) => (
          <MenuOption
            key={item.name}
            label={item.name}
            description={
              index < step || complete
                ? "Completed"
                : index === step
                  ? "Current step"
                  : "Not started"
            }
            selected={!complete && step === index}
            aria-current={!complete && step === index ? "step" : undefined}
            icon={
              index < step || complete ? (
                <Check size={15} />
              ) : (
                <Folder size={15} />
              )
            }
            disabled={index > step}
            onClick={() => {
              setStep(index);
              setComplete(false);
            }}
          />
        ))}
      </nav>
      <progress
        className="ui-progress"
        aria-label="Setup progress"
        max={3}
        value={complete ? 3 : step}
      />
      <div className="ui-stack ui-preview" aria-live="polite">
        <h3 className="ui-title">
          {complete ? "Study ready" : steps[step].name}
        </h3>
        <p className="ui-copy">
          {complete ? "All three steps are complete." : steps[step].copy}
        </p>
      </div>
      <div className="ui-actions">
        {complete ? (
          <Button
            onClick={() => {
              setStep(0);
              setComplete(false);
            }}
          >
            Start again
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
              icon={<ArrowLeft size={13} />}
            >
              Back
            </Button>
            <Button
              onClick={() =>
                step === 2 ? setComplete(true) : setStep(step + 1)
              }
            >
              {step === 2 ? "Finish" : "Continue"}
              {step === 2 ? <CheckCheck size={13} /> : <ArrowRight size={13} />}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
