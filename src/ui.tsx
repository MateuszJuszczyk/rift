import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import {
  Check,
  LoaderCircle,
  X,
  Bookmark,
  ArrowUpRight,
  GripVertical,
} from "lucide-react";

export function Edge({
  children,
  className = "",
  style,
  ...props
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    frame.current?.style.setProperty(
      "--light-x",
      `${((event.clientX - rect.left) / rect.width) * 100}%`,
    );
    frame.current?.style.setProperty(
      "--light-y",
      `${((event.clientY - rect.top) / rect.height) * 100}%`,
    );
  };
  return (
    <div
      ref={frame}
      className={`edge ${className}`}
      onPointerMove={move}
      onPointerLeave={() => {
        frame.current?.style.removeProperty("--light-x");
        frame.current?.style.removeProperty("--light-y");
      }}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export function Specimen({
  id,
  title,
  index,
  category,
  children,
  className = "",
  saved,
  onSave,
  style,
  zoom = 1,
}: {
  id: string;
  title: string;
  index: string;
  category: string;
  children: ReactNode;
  className?: string;
  saved: boolean;
  onSave: () => void;
  style?: CSSProperties;
  zoom?: number;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null,
  );
  return (
    <section
      id={id}
      className={`specimen ${className} ${dragging ? "dragging" : ""}`}
      style={
        {
          ...style,
          "--node-dx": `${position.x}px`,
          "--node-dy": `${position.y}px`,
        } as CSSProperties
      }
      aria-labelledby={`${id}-title`}
    >
      <header className="specimen-heading">
        <div>
          <button
            className="drag-handle"
            aria-label={`Move ${title}. Use arrow keys to reposition.`}
            onPointerDown={(event) => {
              if (innerWidth < 900) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              start.current = {
                x: event.clientX,
                y: event.clientY,
                px: position.x,
                py: position.y,
              };
              setDragging(true);
            }}
            onPointerMove={(event) => {
              if (start.current) {
                const initial = start.current;
                setPosition({
                  x: initial.px + (event.clientX - initial.x) / zoom,
                  y: initial.py + (event.clientY - initial.y) / zoom,
                });
              }
            }}
            onPointerUp={() => {
              start.current = null;
              setDragging(false);
            }}
            onPointerCancel={() => {
              start.current = null;
              setDragging(false);
            }}
            onKeyDown={(event) => {
              const step = event.shiftKey ? 50 : 10;
              if (
                ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                  event.key,
                )
              ) {
                event.preventDefault();
                setPosition((value) => ({
                  x:
                    value.x +
                    (event.key === "ArrowRight"
                      ? step
                      : event.key === "ArrowLeft"
                        ? -step
                        : 0),
                  y:
                    value.y +
                    (event.key === "ArrowDown"
                      ? step
                      : event.key === "ArrowUp"
                        ? -step
                        : 0),
                }));
              }
            }}
          >
            <GripVertical size={12} />
          </button>
          <span className="index">{index}</span>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <button
          className={`icon-button save-button ${saved ? "is-saved" : ""}`}
          aria-label={`${saved ? "Unsave" : "Save"} ${title}`}
          aria-pressed={saved}
          onClick={onSave}
        >
          <Bookmark size={14} />
        </button>
      </header>
      <div className="specimen-body">{children}</div>
      <footer className="specimen-footer">
        <span>{category}</span>
        <span className="live-mark">
          <i /> Interactive
        </span>
      </footer>
    </section>
  );
}

export function Button({
  children,
  variant = "secondary",
  className = "",
  loading,
  icon,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  icon?: ReactNode;
}) {
  return (
    <button
      {...props}
      className={`button ${variant} ${className}`}
      disabled={props.disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? <LoaderCircle className="spin" size={15} /> : icon}
      {children}
    </button>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="toggle-row">
      <label htmlFor={id}>
        <span>{label}</span>
        {description && <small>{description}</small>}
      </label>
      <button
        id={id}
        type="button"
        className="switch"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      >
        <span>
          <Check size={10} />
        </span>
      </button>
    </div>
  );
}

export function Range({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  unit = "%",
  icon,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
  icon?: ReactNode;
}) {
  const id = useId();
  return (
    <div className="range-field">
      <label htmlFor={id}>
        {icon}
        <span>{label}</span>
        <output htmlFor={id}>
          {value}
          {unit}
        </output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={
          {
            "--fill": `${((value - min) / (max - min)) * 100}%`,
          } as CSSProperties
        }
      />
    </div>
  );
}

export function Segmented({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: string; label: ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const selected = options.findIndex((option) => option.value === value);
  return (
    <div
      className="segmented"
      role="group"
      aria-label={label}
      style={
        { "--count": options.length, "--selected": selected } as CSSProperties
      }
    >
      <div className="segmented-indicator" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onKeyDown={(event) => {
            const direction =
              event.key === "ArrowRight"
                ? 1
                : event.key === "ArrowLeft"
                  ? -1
                  : 0;
            if (!direction && event.key !== "Home" && event.key !== "End")
              return;
            event.preventDefault();
            const index =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? options.length - 1
                  : (selected + direction + options.length) % options.length;
            onChange(options[index].value);
            const buttons =
              event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                "button",
              );
            buttons?.[index].focus();
          }}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog?.open) dialog?.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-labelledby={heading}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onClose={onClose}
    >
      <div className="modal-content">
        <header className="modal-header">
          <h2 id={heading}>{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}

export function ActionButton({ notify }: { notify: (text: string) => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const activate = () => {
    setStatus("loading");
    timer.current = setTimeout(() => {
      setStatus("done");
      notify("Interaction complete. A little detail, well considered.");
      timer.current = setTimeout(() => setStatus("idle"), 2200);
    }, 950);
  };
  return (
    <Button
      variant="primary"
      className={status === "done" ? "success-button" : ""}
      loading={status === "loading"}
      icon={
        status === "done" ? <Check size={15} /> : <ArrowUpRight size={15} />
      }
      onClick={activate}
    >
      {status === "done"
        ? "All done"
        : status === "loading"
          ? "Working"
          : "Make it happen"}
    </Button>
  );
}
