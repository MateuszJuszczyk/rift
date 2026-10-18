import { useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  KeyRound,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Star,
  X,
} from "lucide-react";
import { Button, Field, IconButton, Segmented, Surface } from "../ui";

type Notify = (message: string) => void;

export const controlStudies = [
  { id: "dual-range", title: "Dual range", category: "controls" },
  { id: "dial", title: "Dial control", category: "controls" },
  { id: "stepper", title: "Number stepper", category: "controls" },
  { id: "rating", title: "Rating", category: "controls" },
  { id: "color-picker", title: "Colour picker", category: "controls" },
  { id: "checkbox-group", title: "Checkbox group", category: "controls" },
  { id: "radio-cards", title: "Radio cards", category: "controls" },
  { id: "toggle-group", title: "Toggle group", category: "controls" },
  { id: "tag-input", title: "Tag input", category: "controls" },
  { id: "otp-input", title: "One-time code", category: "controls" },
  { id: "password-field", title: "Password field", category: "controls" },
  { id: "combobox", title: "Combobox", category: "controls" },
  { id: "masked-field", title: "Masked field", category: "controls" },
  { id: "currency-field", title: "Currency field", category: "controls" },
  { id: "unit-field", title: "Unit field", category: "controls" },
  { id: "mention-field", title: "Mention field", category: "controls" },
  { id: "sortable-list", title: "Reorderable list", category: "controls" },
  { id: "transfer-list", title: "Transfer list", category: "controls" },
  { id: "tree-select", title: "Tree select", category: "controls" },
  { id: "shortcut-recorder", title: "Shortcut recorder", category: "controls" },
  { id: "preset-chips", title: "Preset chips", category: "controls" },
  { id: "setting-rows", title: "Settings rows", category: "controls" },
  { id: "validation-form", title: "Inline validation", category: "controls" },
  { id: "rating-scale", title: "Rating scale", category: "controls" },
] as const;

export function ControlStudy({ id, notify }: { id: string; notify: Notify }) {
  switch (id) {
    case "dual-range":
      return <DualRange />;
    case "dial":
      return <Dial />;
    case "stepper":
      return <Stepper />;
    case "rating":
      return <Rating notify={notify} />;
    case "color-picker":
      return <ColorPicker notify={notify} />;
    case "checkbox-group":
      return <CheckboxGroup />;
    case "radio-cards":
      return <RadioCards />;
    case "toggle-group":
      return <ToggleGroup />;
    case "tag-input":
      return <TagInput />;
    case "otp-input":
      return <OtpInput notify={notify} />;
    case "password-field":
      return <PasswordField />;
    case "combobox":
      return <Combobox />;
    case "masked-field":
      return <MaskedField />;
    case "currency-field":
      return <CurrencyField />;
    case "unit-field":
      return <UnitField />;
    case "mention-field":
      return <MentionField />;
    case "sortable-list":
      return <SortableList notify={notify} />;
    case "transfer-list":
      return <TransferList />;
    case "tree-select":
      return <TreeSelect />;
    case "shortcut-recorder":
      return <ShortcutRecorder notify={notify} />;
    case "preset-chips":
      return <PresetChips />;
    case "setting-rows":
      return <SettingRows />;
    case "validation-form":
      return <ValidationForm notify={notify} />;
    case "rating-scale":
      return <RatingScale />;
    default:
      return null;
  }
}

function fillStyle(value: number, min: number, max: number): CSSProperties {
  return { "--fill": `${((value - min) / (max - min)) * 100}%` } as CSSProperties;
}

function DualRange() {
  const min = 0;
  const max = 8000;
  const [low, setLow] = useState(1800);
  const [high, setHigh] = useState(6400);
  const at = (value: number) => ((value - min) / (max - min)) * 100;
  return (
    <div className="study ui-stack">
      <div className="ui-between">
        <span className="ui-label">Price band</span>
        <strong className="lib-num">
          €{low.toLocaleString()} – €{high.toLocaleString()}
        </strong>
      </div>
      <div className="lib-dual" aria-hidden="true">
        <span
          className="lib-dual__span"
          style={{ left: `${at(low)}%`, right: `${100 - at(high)}%` }}
        />
        <span className="lib-dual__thumb" style={{ left: `${at(low)}%` }} />
        <span className="lib-dual__thumb" style={{ left: `${at(high)}%` }} />
      </div>
      <div className="lib-grid">
        <label className="ui-stack lib-tight">
          <span className="ui-label">
            Minimum <span className="lib-num">€{low}</span>
          </span>
          <input
            type="range"
            min={min}
            max={max}
            step={100}
            value={low}
            style={fillStyle(low, min, max)}
            aria-label="Minimum price"
            onChange={(event) =>
              setLow(Math.min(Number(event.target.value), high - 100))
            }
          />
        </label>
        <label className="ui-stack lib-tight">
          <span className="ui-label">
            Maximum <span className="lib-num">€{high}</span>
          </span>
          <input
            type="range"
            min={min}
            max={max}
            step={100}
            value={high}
            style={fillStyle(high, min, max)}
            aria-label="Maximum price"
            onChange={(event) =>
              setHigh(Math.max(Number(event.target.value), low + 100))
            }
          />
        </label>
      </div>
    </div>
  );
}

function Dial() {
  const [value, setValue] = useState(42);
  const drag = useRef<{ y: number; value: number } | null>(null);
  const commit = (next: number) => setValue(Math.min(100, Math.max(0, next)));
  const angle = -135 + (value / 100) * 270;
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = {
      ArrowUp: 1,
      ArrowRight: 1,
      ArrowDown: -1,
      ArrowLeft: -1,
      PageUp: 10,
      PageDown: -10,
    };
    if (event.key === "Home") {
      event.preventDefault();
      commit(0);
    } else if (event.key === "End") {
      event.preventDefault();
      commit(100);
    } else if (map[event.key]) {
      event.preventDefault();
      commit(value + map[event.key] * (event.shiftKey ? 10 : 1));
    }
  };
  return (
    <div className="study ui-stack lib-center">
      <div
        className="lib-dial"
        role="slider"
        tabIndex={0}
        aria-label="Intensity"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value}%`}
        onKeyDown={onKeyDown}
        onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { y: event.clientY, value };
        }}
        onPointerMove={(event: ReactPointerEvent<HTMLDivElement>) => {
          if (!drag.current) return;
          const start = drag.current;
          commit(start.value + (start.y - event.clientY) / 1.6);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        style={{ "--dial-angle": `${angle}deg` } as CSSProperties}
      >
        <span className="lib-dial__ticks" aria-hidden="true" />
        <span className="lib-dial__face">
          <span className="lib-dial__pointer" />
        </span>
      </div>
      <div className="lib-center">
        <strong className="lib-num lib-dial__value">
          {value}
          <small>%</small>
        </strong>
        <span className="lib-caption">Drag or use arrow keys</span>
      </div>
    </div>
  );
}

function Stepper() {
  const [value, setValue] = useState(4);
  const clamp = (next: number) => setValue(Math.min(99, Math.max(1, next)));
  return (
    <div className="study ui-stack">
      <span className="ui-label">Seats</span>
      <div className="lib-stepper">
        <IconButton
          label="Remove one seat"
          disabled={value <= 1}
          onClick={() => clamp(value - 1)}
        >
          <Minus size={15} />
        </IconButton>
        <input
          className="lib-stepper__input lib-num"
          type="number"
          min={1}
          max={99}
          value={value}
          aria-label="Seats"
          onChange={(event) => clamp(Number(event.target.value) || 1)}
        />
        <IconButton
          label="Add one seat"
          disabled={value >= 99}
          onClick={() => clamp(value + 1)}
        >
          <Plus size={15} />
        </IconButton>
      </div>
      <span className="lib-caption">
        {value === 1 ? "Single seat" : `${value} seats`} · 40 px control rhythm
      </span>
    </div>
  );
}

function Rating({ notify }: { notify: Notify }) {
  const [value, setValue] = useState(4);
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="study ui-stack">
      <span className="ui-label">How was the build?</span>
      <div
        className="lib-stars"
        role="radiogroup"
        aria-label="Rating out of five"
        onPointerLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} of 5`}
            className={star <= shown ? "is-on" : ""}
            onPointerEnter={() => setHover(star)}
            onFocus={() => setHover(star)}
            onBlur={() => setHover(0)}
            onClick={() => {
              setValue(star);
              notify(`Rated ${star} of 5.`);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                event.preventDefault();
                setValue(Math.min(5, value + 1));
              }
              if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                event.preventDefault();
                setValue(Math.max(1, value - 1));
              }
            }}
          >
            <Star size={19} />
          </button>
        ))}
      </div>
      <span className="lib-caption">{shown} of 5 · keyboard arrows adjust</span>
    </div>
  );
}

const swatches = [
  { name: "Silver", hex: "#c9c4cc" },
  { name: "Dusk", hex: "#8e9cb4" },
  { name: "Moss", hex: "#93a79b" },
  { name: "Amber", hex: "#c2a373" },
  { name: "Plum", hex: "#a98aa6" },
  { name: "Ink", hex: "#2b2a2f" },
];

function ColorPicker({ notify }: { notify: Notify }) {
  const [hex, setHex] = useState(swatches[1].hex);
  const valid = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex);
  return (
    <div className="study ui-stack">
      <div className="ui-between">
        <span className="ui-label">Accent</span>
        <span className="lib-caption lib-num">{swatches.find((s) => s.hex === hex)?.name ?? "Custom"}</span>
      </div>
      <div className="lib-preview" style={{ background: valid ? hex : "transparent" }}>
        <span>Edge sample</span>
      </div>
      <div className="lib-swatches" role="group" aria-label="Swatches">
        {swatches.map((swatch) => (
          <button
            key={swatch.hex}
            type="button"
            className="lib-swatch"
            style={{ background: swatch.hex }}
            aria-label={swatch.name}
            aria-pressed={hex === swatch.hex}
            onClick={() => setHex(swatch.hex)}
          />
        ))}
      </div>
      <div className="lib-row">
        <input
          className={`lib-input lib-num${valid ? "" : " has-error"}`}
          value={hex}
          aria-label="Hex value"
          aria-invalid={valid ? undefined : true}
          onChange={(event) => setHex(event.target.value.trim())}
        />
        <IconButton
          label="Copy hex value"
          onClick={() => {
            void navigator.clipboard?.writeText(hex).catch(() => undefined);
            notify(`${hex} copied.`);
          }}
        >
          <Copy size={15} />
        </IconButton>
      </div>
    </div>
  );
}

const channels = [
  { label: "Product updates", description: "Release notes, twice a month", default: true },
  { label: "Usage reports", description: "Weekly summary of component usage", default: true },
  { label: "Design reviews", description: "Invitations and change requests", default: false },
];

function CheckboxGroup() {
  const [checked, setChecked] = useState(channels.map((c) => c.default));
  const all = checked.every(Boolean);
  const some = checked.some(Boolean) && !all;
  const toggle = (index: number) =>
    setChecked((values) => values.map((v, i) => (i === index ? !v : v)));
  return (
    <div className="study ui-stack">
      <label className="lib-check lib-check--parent">
        <input
          type="checkbox"
          checked={all}
          ref={(node) => {
            if (node) node.indeterminate = some;
          }}
          onChange={() => setChecked(channels.map(() => !all))}
        />
        <span className="lib-check__box" aria-hidden="true">
          <Check size={12} />
        </span>
        <span className="lib-check__copy">
          <strong>Email notifications</strong>
          <small>{checked.filter(Boolean).length} of {channels.length} channels</small>
        </span>
      </label>
      <div className="lib-check__children">
        {channels.map((channel, index) => (
          <label className="lib-check" key={channel.label}>
            <input
              type="checkbox"
              checked={checked[index]}
              onChange={() => toggle(index)}
            />
            <span className="lib-check__box" aria-hidden="true">
              <Check size={12} />
            </span>
            <span className="lib-check__copy">
              <strong>{channel.label}</strong>
              <small>{channel.description}</small>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

const plans = [
  { value: "static", label: "Static build", description: "Pre-rendered HTML with no runtime data." },
  { value: "edge", label: "Edge rendered", description: "Per-request rendering close to the visitor." },
  { value: "hybrid", label: "Hybrid", description: "Static shell with streamed personalisation." },
];

function RadioCards() {
  const [value, setValue] = useState("edge");
  return (
    <fieldset className="study ui-stack lib-plain">
      <legend className="ui-label">Rendering strategy</legend>
      {plans.map((plan) => (
        <label
          className={`lib-radio-card${value === plan.value ? " is-on" : ""}`}
          key={plan.value}
        >
          <input
            type="radio"
            name="render-strategy"
            value={plan.value}
            checked={value === plan.value}
            onChange={() => setValue(plan.value)}
          />
          <span className="lib-radio-card__mark" aria-hidden="true" />
          <span className="lib-check__copy">
            <strong>{plan.label}</strong>
            <small>{plan.description}</small>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

const marks = ["Bold", "Italic", "Underline", "Strikethrough"];

function ToggleGroup() {
  const [on, setOn] = useState<string[]>(["Bold"]);
  return (
    <div className="study ui-stack">
      <span className="ui-label">Text style</span>
      <div className="lib-toolbar" role="group" aria-label="Text style">
        {marks.map((mark) => (
          <button
            key={mark}
            type="button"
            className="ui-rim"
            aria-pressed={on.includes(mark)}
            onClick={() =>
              setOn((values) =>
                values.includes(mark)
                  ? values.filter((value) => value !== mark)
                  : [...values, mark],
              )
            }
          >
            {mark}
          </button>
        ))}
      </div>
      <p className={`lib-sample ${on.length ? "is-styled" : ""}`}>
        {on.includes("Bold") && <strong>Bold </strong>}
        <span
          style={{
            fontStyle: on.includes("Italic") ? "italic" : "normal",
            textDecoration:
              [on.includes("Underline") ? "underline" : "", on.includes("Strikethrough") ? "line-through" : ""]
                .filter(Boolean)
                .join(" ") || "none",
          }}
        >
          Materials are shared, states are local.
        </span>
      </p>
    </div>
  );
}

function TagInput() {
  const [tags, setTags] = useState(["surfaces", "motion"]);
  const [draft, setDraft] = useState("");
  const add = () => {
    const value = draft.trim().toLowerCase();
    if (!value || tags.includes(value)) {
      setDraft("");
      return;
    }
    setTags((values) => [...values, value]);
    setDraft("");
  };
  return (
    <div className="study ui-stack">
      <label className="ui-label" htmlFor="tag-field">
        Topics
      </label>
      <div className="lib-tagfield ui-rim">
        {tags.map((tag) => (
          <span className="ui-chip" key={tag}>
            {tag}
            <button
              aria-label={`Remove ${tag}`}
              onClick={() => setTags((values) => values.filter((value) => value !== tag))}
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          id="tag-field"
          className="lib-tagfield__input"
          value={draft}
          placeholder="Add a topic…"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              add();
            }
            if (event.key === "Backspace" && !draft) {
              setTags((values) => values.slice(0, -1));
            }
          }}
          onBlur={add}
        />
      </div>
      <span className="lib-caption">{tags.length} topics · Enter or comma adds, Backspace removes</span>
    </div>
  );
}

function OtpInput({ notify }: { notify: Notify }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const set = (index: number, value: string) =>
    setDigits((current) => current.map((d, i) => (i === index ? value : d)));
  const complete = digits.every((digit) => digit !== "");
  return (
    <div className="study ui-stack">
      <span className="ui-label">Verification code</span>
      <div
        className="lib-otp"
        role="group"
        aria-label="Six digit verification code"
        onPaste={(event) => {
          const text = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
          if (!text) return;
          event.preventDefault();
          setDigits(text.split("").concat(Array(6).fill("")).slice(0, 6));
          refs.current[Math.min(text.length, 5)]?.focus();
        }}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            className="lib-otp__cell lib-num"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            aria-label={`Digit ${index + 1}`}
            onChange={(event) => {
              const value = event.target.value.replace(/\D/g, "").slice(-1);
              set(index, value);
              if (value) refs.current[Math.min(index + 1, 5)]?.focus();
            }}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !digits[index] && index > 0) {
                refs.current[index - 1]?.focus();
                set(index - 1, "");
              }
              if (event.key === "ArrowLeft") refs.current[Math.max(0, index - 1)]?.focus();
              if (event.key === "ArrowRight") refs.current[Math.min(5, index + 1)]?.focus();
            }}
          />
        ))}
      </div>
      <div className="ui-between">
        <span className="lib-caption">
          {complete ? "Code complete" : `${digits.filter(Boolean).length} of 6 digits`}
        </span>
        <Button
          variant="ghost"
          onClick={() => {
            setDigits(["", "", "", "", "", ""]);
            refs.current[0]?.focus();
            notify("Code cleared.");
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

const rules = [
  { label: "12 characters or more", test: (value: string) => value.length >= 12 },
  { label: "Upper and lower case", test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { label: "A number", test: (value: string) => /\d/.test(value) },
  { label: "A symbol", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

function PasswordField() {
  const [value, setValue] = useState("Obsidian-42");
  const [visible, setVisible] = useState(false);
  const passed = rules.filter((rule) => rule.test(value)).length;
  return (
    <div className="study ui-stack">
      <label className="ui-label" htmlFor="password-field">
        Password
      </label>
      <div className="lib-row lib-tight">
        <input
          id="password-field"
          className="lib-input"
          type={visible ? "text" : "password"}
          value={value}
          autoComplete="new-password"
          onChange={(event) => setValue(event.target.value)}
        />
        <IconButton
          label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </IconButton>
      </div>
      <div className="lib-meter" aria-hidden="true">
        <span style={{ width: `${(passed / rules.length) * 100}%` }} />
      </div>
      <ul className="lib-rules">
        {rules.map((rule) => {
          const ok = rule.test(value);
          return (
            <li key={rule.label} className={ok ? "is-on" : ""}>
              <Check size={11} />
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const cities = [
  { value: "wro", label: "Wrocław", hint: "Poland · UTC+1" },
  { value: "ber", label: "Berlin", hint: "Germany · UTC+1" },
  { value: "ams", label: "Amsterdam", hint: "Netherlands · UTC+1" },
  { value: "lis", label: "Lisbon", hint: "Portugal · UTC+0" },
];

function Combobox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);
  const matches = useMemo(
    () =>
      cities.filter((city) =>
        city.label.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  );
  const chosen = cities.find((city) => city.value === value);
  return (
    <div className="study ui-stack">
      <span className="ui-label">Home base</span>
      <div className="lib-combobox">
        <div className="lib-row lib-tight lib-input ui-rim">
          <Search size={14} />
          <input
            className="lib-combobox__input"
            role="combobox"
            aria-expanded={open}
            aria-controls="combobox-list"
            aria-autocomplete="list"
            aria-activedescendant={open && matches[cursor] ? `city-${matches[cursor].value}` : undefined}
            placeholder={chosen ? chosen.label : "Search a city…"}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              setCursor(0);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                setOpen(true);
                setCursor(
                  (current) =>
                    (current + (event.key === "ArrowDown" ? 1 : -1) + matches.length) %
                    Math.max(1, matches.length),
                );
              }
              if (event.key === "Enter" && matches[cursor]) {
                event.preventDefault();
                setValue(matches[cursor].value);
                setQuery("");
                setOpen(false);
              }
              if (event.key === "Escape") setOpen(false);
            }}
          />
        </div>
        {open && (
          <div className="lib-popover lib-scroll" id="combobox-list" role="listbox" aria-label="Cities">
            {matches.length ? (
              matches.map((city, index) => (
                <button
                  key={city.value}
                  id={`city-${city.value}`}
                  role="option"
                  aria-selected={value === city.value}
                  className={`lib-option${index === cursor ? " is-current" : ""}`}
                  onPointerEnter={() => setCursor(index)}
                  onClick={() => {
                    setValue(city.value);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <span className="lib-check__copy">
                    <strong>{city.label}</strong>
                    <small>{city.hint}</small>
                  </span>
                  {value === city.value && <Check size={13} />}
                </button>
              ))
            ) : (
              <p className="lib-empty">No city matches “{query}”.</p>
            )}
          </div>
        )}
      </div>
      <span className="lib-caption">
        {chosen ? `Selected ${chosen.label}` : "Type to filter, arrows to move"}
      </span>
    </div>
  );
}

function maskedPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").replace(/^48/, "").slice(0, 9);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)].filter(Boolean);
  return digits ? `+48 ${parts.join(" ")}` : "";
}

function MaskedField() {
  const [phone, setPhone] = useState("+48 601 234 567");
  const complete = phone.replace(/\D/g, "").length === 11;
  return (
    <div className="study ui-stack">
      <label className="ui-label" htmlFor="masked-phone">
        Phone number
      </label>
      <input
        id="masked-phone"
        className="lib-input lib-num"
        inputMode="tel"
        value={phone}
        placeholder="+48 ___ ___ ___"
        onChange={(event) => setPhone(maskedPhone(event.target.value))}
      />
      <span className={complete ? "lib-caption" : "ui-hint"}>
        {complete ? "Looks complete · digits are grouped as you type" : "Keep typing, the mask handles the grouping"}
      </span>
    </div>
  );
}

const currencies = [
  { value: "eur", label: "EUR", symbol: "€", rate: 1 },
  { value: "pln", label: "PLN", symbol: "zł", rate: 4.3 },
  { value: "usd", label: "USD", symbol: "$", rate: 1.08 },
];

function CurrencyField() {
  const [amount, setAmount] = useState(2400);
  const [currency, setCurrency] = useState("eur");
  const active = currencies.find((item) => item.value === currency) ?? currencies[0];
  const converted = Math.round(amount * active.rate);
  return (
    <div className="study ui-stack">
      <Segmented
        label="Currency"
        options={currencies.map((item) => ({ value: item.value, label: item.label }))}
        value={currency}
        onChange={setCurrency}
      />
      <label className="ui-label" htmlFor="currency-amount">
        Amount in {active.label}
      </label>
      <div className="lib-money">
        <span className="lib-money__symbol">{active.symbol}</span>
        <input
          id="currency-amount"
          className="lib-money__input lib-num"
          inputMode="decimal"
          value={amount.toLocaleString("en-US")}
          onChange={(event) =>
            setAmount(
              Math.min(999999, Math.max(0, Number(event.target.value.replace(/\D/g, "")) || 0)),
            )
          }
        />
      </div>
      <span className="lib-caption lib-num">
        {active.symbol} {converted.toLocaleString("en-US")} at today&rsquo;s reference rate
      </span>
    </div>
  );
}

const units = ["px", "rem", "em", "%"];

function UnitField() {
  const [value, setValue] = useState(12);
  const [unit, setUnit] = useState("px");
  return (
    <div className="study ui-stack">
      <span className="ui-label">Corner radius</span>
      <div className="lib-unit">
        <button
          type="button"
          className="lib-unit__step"
          aria-label="Decrease radius"
          onClick={() => setValue((current) => Math.max(0, current - 1))}
        >
          <Minus size={13} />
        </button>
        <input
          className="lib-unit__input lib-num"
          inputMode="numeric"
          aria-label={`Radius in ${unit}`}
          value={value}
          onChange={(event) => setValue(Math.min(999, Math.max(0, Number(event.target.value.replace(/\D/g, "")) || 0)))}
        />
        <select
          className="lib-unit__select"
          aria-label="Radius unit"
          value={unit}
          onChange={(event) => setUnit(event.target.value)}
        >
          {units.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="lib-unit__step"
          aria-label="Increase radius"
          onClick={() => setValue((current) => Math.min(999, current + 1))}
        >
          <Plus size={13} />
        </button>
      </div>
      <div className="lib-unit__preview" aria-hidden="true">
        <span style={{ borderRadius: `${value}${unit}` }} />
      </div>
    </div>
  );
}

const people = [
  { value: "ada", label: "Ada Kowalska" },
  { value: "borys", label: "Borys Nowak" },
  { value: "casey", label: "Casey Lin" },
];

function MentionField() {
  const [text, setText] = useState("Ship the Muted Prism pass with ");
  const [open, setOpen] = useState(false);
  const reference = useRef<HTMLTextAreaElement>(null);
  const insert = (name: string) => {
    setText((current) => `${current}@${name} `);
    setOpen(false);
    reference.current?.focus();
  };
  return (
    <div className="study ui-stack">
      <label className="ui-label" htmlFor="mention-field">
        Review request
      </label>
      <div className="lib-combobox">
        <textarea
          id="mention-field"
          ref={reference}
          className="lib-textarea"
          role="combobox"
          aria-expanded={open}
          aria-controls="mention-list"
          aria-autocomplete="list"
          value={text}
          onChange={(event) => {
            const next = event.target.value;
            setText(next);
            setOpen(/@[a-z]*$/i.test(next));
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
            if (event.key === "Enter" && open) {
              event.preventDefault();
              insert(people[0].label);
            }
          }}
        />
        {open && (
          <div className="lib-popover" id="mention-list" role="listbox" aria-label="People">
            {people.map((person) => (
              <button
                key={person.value}
                role="option"
                aria-selected={false}
                className="lib-option"
                onClick={() => insert(person.label)}
              >
                <span className="ui-avatar">{person.label.slice(0, 2).toUpperCase()}</span>
                <span className="lib-check__copy">
                  <strong>{person.label}</strong>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <span className="lib-caption">Type @ to mention a teammate</span>
    </div>
  );
}

function SortableList({ notify }: { notify: Notify }) {
  const [items, setItems] = useState(["Optical edge", "Precision controls", "Ambient player", "Commit gesture"]);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    setItems((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    notify(`Moved to position ${to + 1}.`);
  };
  return (
    <div className="study ui-stack">
      <span className="ui-label">Display order</span>
      <ul className="lib-sortable">
        {items.map((item, index) => (
          <li key={item} className="lib-row">
            <GripVertical size={13} aria-hidden="true" />
            <span className="lib-row__copy">
              <strong>{item}</strong>
            </span>
            <span className="lib-sortable__move">
              <IconButton
                label={`Move ${item} up`}
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
              >
                <ArrowUp size={13} />
              </IconButton>
              <IconButton
                label={`Move ${item} down`}
                disabled={index === items.length - 1}
                onClick={() => move(index, index + 1)}
              >
                <ArrowDown size={13} />
              </IconButton>
            </span>
          </li>
        ))}
      </ul>
      <span className="lib-caption" aria-live="polite">
        Order: {items.join(" → ")}
      </span>
    </div>
  );
}

const available = ["Audit log", "API keys", "Billing", "Webhooks", "Custom domains", "SSO"];
const assignedDefault = ["Audit log", "Billing"];

function TransferList() {
  const [assigned, setAssigned] = useState(assignedDefault);
  const [picked, setPicked] = useState<string[]>([]);
  const pool = available.filter((item) => !assigned.includes(item));
  const toggle = (item: string) =>
    setPicked((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  const move = (direction: "in" | "out") => {
    if (direction === "in") {
      setAssigned((current) => [...current, ...picked]);
    } else {
      setAssigned((current) => current.filter((item) => !picked.includes(item)));
    }
    setPicked([]);
  };
  return (
    <div className="study ui-stack">
      <span className="ui-label">Enabled modules</span>
      <div className="lib-transfer">
        <div className="lib-transfer__pane">
          <span className="lib-caption">Available</span>
          {pool.map((item) => (
            <button
              key={item}
              type="button"
              className="lib-row lib-row--interactive"
              aria-pressed={picked.includes(item)}
              onClick={() => toggle(item)}
            >
              {item}
            </button>
          ))}
          {!pool.length && <p className="lib-caption">Everything is assigned.</p>}
        </div>
        <div className="lib-transfer__buttons">
          <IconButton label="Enable selected" disabled={!picked.length} onClick={() => move("in")}>
            <ChevronRightIcon />
          </IconButton>
          <IconButton label="Disable selected" disabled={!picked.length} onClick={() => move("out")}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <div className="lib-transfer__pane">
          <span className="lib-caption">Enabled</span>
          {assigned.map((item) => (
            <button
              key={item}
              type="button"
              className="lib-row lib-row--interactive"
              aria-pressed={picked.includes(item)}
              onClick={() => toggle(item)}
            >
              {item}
            </button>
          ))}
          {!assigned.length && <p className="lib-caption">Nothing enabled yet.</p>}
        </div>
      </div>
      <span className="lib-caption">{assigned.length} of {available.length} modules enabled</span>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

const tree = [
  {
    label: "Components",
    children: ["Buttons", "Surfaces", "Ranges"],
  },
  {
    label: "Navigation",
    children: ["Tabs", "Menus"],
  },
  {
    label: "Tokens",
    children: ["Colour", "Spacing"],
  },
];

function TreeSelect() {
  const [open, setOpen] = useState([0]);
  const [checked, setChecked] = useState(["Buttons", "Colour"]);
  const toggleCheck = (leaf: string) =>
    setChecked((current) =>
      current.includes(leaf) ? current.filter((value) => value !== leaf) : [...current, leaf],
    );
  return (
    <div className="study ui-stack">
      <span className="ui-label">Export scope</span>
      <div className="lib-tree" role="tree" aria-label="Export scope">
        {tree.map((group, index) => {
          const expanded = open.includes(index);
          const all = group.children.every((leaf) => checked.includes(leaf));
          return (
            <div key={group.label} role="treeitem" aria-expanded={expanded}>
              <div className="lib-row">
                <button
                  type="button"
                  className="lib-tree__twist"
                  aria-label={`${expanded ? "Collapse" : "Expand"} ${group.label}`}
                  aria-expanded={expanded}
                  onClick={() =>
                    setOpen((current) =>
                      current.includes(index)
                        ? current.filter((value) => value !== index)
                        : [...current, index],
                    )
                  }
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ transform: expanded ? "rotate(90deg)" : "none" }}>
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </button>
                <label className="lib-check lib-check--inline">
                  <input
                    type="checkbox"
                    checked={all}
                    onChange={(event) =>
                      setChecked((current) =>
                        event.target.checked
                          ? Array.from(new Set([...current, ...group.children]))
                          : current.filter((value) => !group.children.includes(value)),
                      )
                    }
                  />
                  <span className="lib-check__box" aria-hidden="true">
                    <Check size={12} />
                  </span>
                  <span className="lib-row__copy">
                    <strong>{group.label}</strong>
                  </span>
                </label>
              </div>
              {expanded && (
                <div className="lib-tree__children">
                  {group.children.map((leaf) => (
                    <label className="lib-check lib-check--inline" key={leaf}>
                      <input
                        type="checkbox"
                        checked={checked.includes(leaf)}
                        onChange={() => toggleCheck(leaf)}
                      />
                      <span className="lib-check__box" aria-hidden="true">
                        <Check size={12} />
                      </span>
                      <span className="lib-row__copy">{leaf}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="lib-caption">{checked.length} items selected</span>
    </div>
  );
}

const pretty = (event: KeyboardEvent<HTMLButtonElement>) => {
  const parts: string[] = [];
  if (event.metaKey) parts.push("⌘");
  if (event.ctrlKey) parts.push("Ctrl");
  if (event.altKey) parts.push("Alt");
  if (event.shiftKey) parts.push("⇧");
  const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
  if (!["Meta", "Control", "Alt", "Shift"].includes(event.key)) parts.push(key);
  return parts.join("+");
};

function ShortcutRecorder({ notify }: { notify: Notify }) {
  const [shortcuts, setShortcuts] = useState(["⌘+K", "⇧+Enter"]);
  const [listening, setListening] = useState(false);
  return (
    <div className="study ui-stack">
      <span className="ui-label">Custom shortcuts</span>
      <div className="lib-keys">
        {shortcuts.map((shortcut) => (
          <span className="lib-key" key={shortcut}>
            {shortcut}
            <button
              aria-label={`Remove ${shortcut}`}
              onClick={() => setShortcuts((current) => current.filter((value) => value !== shortcut))}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        {!shortcuts.length && <span className="lib-caption">No shortcuts recorded.</span>}
      </div>
      <Button
        variant={listening ? "primary" : "secondary"}
        icon={<KeyRound size={14} />}
        onClick={() => setListening(true)}
        onKeyDown={(event) => {
          if (!listening) return;
          if (["Meta", "Control", "Alt", "Shift"].includes(event.key)) return;
          event.preventDefault();
          const combo = pretty(event);
          setListening(false);
          if (!combo) return;
          setShortcuts((current) => (current.includes(combo) ? current : [...current, combo]));
          notify(`${combo} recorded.`);
        }}
        onBlur={() => setListening(false)}
      >
        {listening ? "Press keys…" : "Record shortcut"}
      </Button>
    </div>
  );
}

const presets = [
  { value: "compact", label: "Compact", note: "4 px gaps" },
  { value: "balanced", label: "Balanced", note: "8 px gaps" },
  { value: "spacious", label: "Spacious", note: "14 px gaps" },
];

function PresetChips() {
  const [value, setValue] = useState("balanced");
  const gap = value === "compact" ? 4 : value === "spacious" ? 14 : 8;
  return (
    <div className="study ui-stack">
      <span className="ui-label">Density preset</span>
      <div className="lib-chips" role="radiogroup" aria-label="Density preset">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            role="radio"
            aria-checked={value === preset.value}
            className="ui-rim"
            onClick={() => setValue(preset.value)}
          >
            {preset.label}
            <small>{preset.note}</small>
          </button>
        ))}
      </div>
      <div className="lib-tile" aria-hidden="true">
        <div className="lib-density" style={{ gap }}>
          {[0, 1, 2, 3].map((index) => (
            <span key={index} className="lib-density__cell" />
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingRows() {
  const [rows, setRows] = useState([
    { label: "Edge illumination", value: 68 },
    { label: "Surface frost", value: 42 },
  ]);
  const [locked, setLocked] = useState(false);
  return (
    <div className="study ui-stack">
      <div className="lib-settings">
        {rows.map((row, index) => (
          <div className="lib-settings__row" key={row.label}>
            <div className="ui-between">
              <span className="ui-label">{row.label}</span>
              <output className="lib-caption lib-num">{row.value}%</output>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={row.value}
              disabled={locked}
              style={fillStyle(row.value, 0, 100)}
              aria-label={row.label}
              onChange={(event) =>
                setRows((current) =>
                  current.map((item, i) =>
                    i === index ? { ...item, value: Number(event.target.value) } : item,
                  ),
                )
              }
            />
          </div>
        ))}
      </div>
      <label className="lib-check lib-check--inline">
        <input type="checkbox" checked={locked} onChange={() => setLocked((current) => !current)} />
        <span className="lib-check__box" aria-hidden="true">
          <Check size={12} />
        </span>
        <span className="lib-row__copy">Lock values</span>
      </label>
    </div>
  );
}

function ValidationForm({ notify }: { notify: Notify }) {
  const [form, setForm] = useState({ email: "mateusz@", seats: "0" });
  const [touched, setTouched] = useState({ email: false, seats: false });
  const emailError =
    touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ? "Enter a complete email address"
      : undefined;
  const seatsError =
    touched.seats && Number(form.seats) < 1 ? "At least one seat is required" : undefined;
  const submit = () => {
    setTouched({ email: true, seats: true });
    const valid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && Number(form.seats) >= 1;
    notify(valid ? "Workspace created." : "Fix the highlighted fields.");
  };
  return (
    <div className="study ui-stack">
      <Field
        label="Work email"
        error={emailError}
        value={form.email}
        autoComplete="email"
        onChange={(event) => setForm({ ...form, email: event.target.value })}
        onBlur={() => setTouched((current) => ({ ...current, email: true }))}
      />
      <Field
        label="Seats"
        error={seatsError}
        value={form.seats}
        inputMode="numeric"
        onChange={(event) => setForm({ ...form, seats: event.target.value.replace(/\D/g, "") })}
        onBlur={() => setTouched((current) => ({ ...current, seats: true }))}
      />
      <div className="ui-actions">
        <Button variant="primary" onClick={submit}>
          Create workspace
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setForm({ email: "", seats: "" });
            setTouched({ email: false, seats: false });
          }}
          icon={<RotateCcw size={14} />}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

const scale = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "Slightly" },
  { value: 3, label: "Moderately" },
  { value: 4, label: "Very" },
  { value: 5, label: "Extremely" },
];

function RatingScale() {
  const [value, setValue] = useState(3);
  const active = scale.find((item) => item.value === value) ?? scale[2];
  return (
    <fieldset className="study ui-stack lib-plain">
      <legend className="ui-label">How clear was the material system?</legend>
      <div className="lib-scale" role="radiogroup" aria-label="How clear was the material system?">
        {scale.map((item) => (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={value === item.value}
            aria-label={item.label}
            className="ui-rim"
            onClick={() => setValue(item.value)}
          >
            <span className="lib-num">{item.value}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </div>
      <Surface className="lib-tile">
        <span className="lib-caption">Selected: {active.label}</span>
      </Surface>
    </fieldset>
  );
}
