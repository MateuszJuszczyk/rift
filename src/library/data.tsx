import { useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileCode,
  GitBranch,
  Layers,
  MoreHorizontal,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import {
  Button,
  Field,
  IconButton,
  MenuOption,
  Segmented,
  Surface,
} from "../ui";

type Notify = (message: string) => void;

export const dataStudies = [
  { id: "stat-tiles", title: "Stat tiles", category: "surfaces" },
  { id: "data-table", title: "Data table", category: "surfaces" },
  { id: "list-rows", title: "List rows", category: "surfaces" },
  { id: "timeline", title: "Timeline", category: "surfaces" },
  { id: "month-calendar", title: "Month calendar", category: "surfaces" },
  { id: "date-range", title: "Date range", category: "surfaces" },
  { id: "bar-chart", title: "Bar chart", category: "surfaces" },
  { id: "sparkline", title: "Sparkline", category: "surfaces" },
  { id: "distribution-bar", title: "Distribution bar", category: "surfaces" },
  { id: "kanban", title: "Board columns", category: "surfaces" },
  { id: "disclosure-tree", title: "Disclosure list", category: "surfaces" },
  { id: "split-pane", title: "Split pane", category: "surfaces" },
  { id: "card-carousel", title: "Card carousel", category: "surfaces" },
  { id: "marquee", title: "Marquee", category: "surfaces" },
  { id: "code-block", title: "Code block", category: "surfaces" },
  { id: "diff-view", title: "Diff view", category: "surfaces" },
  { id: "json-tree", title: "JSON tree", category: "surfaces" },
  { id: "activity-heatmap", title: "Activity heatmap", category: "surfaces" },
] as const;

export function DataStudy({ id, notify }: { id: string; notify: Notify }) {
  switch (id) {
    case "stat-tiles":
      return <StatTiles />;
    case "data-table":
      return <DataTable notify={notify} />;
    case "list-rows":
      return <ListRows notify={notify} />;
    case "timeline":
      return <Timeline />;
    case "month-calendar":
      return <MonthCalendar />;
    case "date-range":
      return <DateRange />;
    case "bar-chart":
      return <BarChart />;
    case "sparkline":
      return <Sparkline />;
    case "distribution-bar":
      return <DistributionBar />;
    case "kanban":
      return <Kanban notify={notify} />;
    case "disclosure-tree":
      return <DisclosureTree />;
    case "split-pane":
      return <SplitPane />;
    case "card-carousel":
      return <CardCarousel />;
    case "marquee":
      return <Marquee />;
    case "code-block":
      return <CodeBlock notify={notify} />;
    case "diff-view":
      return <DiffView />;
    case "json-tree":
      return <JsonTree />;
    case "activity-heatmap":
      return <ActivityHeatmap />;
    default:
      return null;
  }
}

const statTiles = [
  { label: "Active readers", value: "18,204", delta: 12.4 },
  { label: "Median session", value: "4m 12s", delta: -3.1 },
  { label: "Error rate", value: "0.42%", delta: -0.8 },
];

function StatTiles() {
  return (
    <div className="study ui-stack">
      <div className="ui-between">
        <span className="ui-label">Last 30 days</span>
        <span className="lib-caption">Compared with the previous period</span>
      </div>
      <div className="lib-grid lib-stats">
        {statTiles.map((tile) => {
          const up = tile.delta >= 0;
          return (
            <Surface className="lib-stat" key={tile.label}>
              <span className="lib-stat__label">{tile.label}</span>
              <strong className="lib-stat__value lib-num">{tile.value}</strong>
              <span className={`lib-stat__delta ${up ? "is-up" : "is-down"}`}>
                {up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                <span className="lib-num">
                  {Math.abs(tile.delta).toFixed(1)}%
                </span>
              </span>
            </Surface>
          );
        })}
      </div>
    </div>
  );
}

type SortKey = "component" | "owner" | "updated";

const tableRows = [
  { component: "Edge", owner: "Ada", updated: "2 days ago" },
  { component: "Segmented", owner: "Borys", updated: "5 days ago" },
  { component: "Sparkline", owner: "Casey", updated: "9 days ago" },
  { component: "Kanban", owner: "Ada", updated: "14 days ago" },
];

const tableColumns: { key: SortKey; label: string }[] = [
  { key: "component", label: "Component" },
  { key: "owner", label: "Owner" },
  { key: "updated", label: "Updated" },
];

function DataTable({ notify }: { notify: Notify }) {
  const [key, setKey] = useState<SortKey>("updated");
  const [ascending, setAscending] = useState(true);
  const rows = useMemo(() => {
    return [...tableRows].sort((a, b) => {
      const value = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
      return ascending ? value : -value;
    });
  }, [key, ascending]);
  const cycle = (next: SortKey) => {
    const direction = next === key ? !ascending : true;
    setKey(next);
    setAscending(direction);
    notify(`Sorted by ${next} ${direction ? "ascending" : "descending"}.`);
  };
  return (
    <div className="study ui-stack">
      <div className="lib-table-wrap">
        <table className="lib-table">
          <caption className="ui-label">Library inventory</caption>
          <thead>
            <tr>
              {tableColumns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    key === column.key
                      ? ascending
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    type="button"
                    className="lib-table__sort"
                    onClick={() => cycle(column.key)}
                  >
                    {column.label}
                    {key === column.key &&
                      (ascending ? (
                        <ArrowUp size={11} />
                      ) : (
                        <ArrowDown size={11} />
                      ))}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.component}>
                <td>{row.component}</td>
                <td>{row.owner}</td>
                <td className="lib-num">{row.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span className="lib-caption" aria-live="polite">
        {rows.length} rows · sorted by {key}
      </span>
    </div>
  );
}

const listRows = [
  { icon: GitBranch, title: "Merged pull request #142", meta: "Ada · 2 hours ago" },
  { icon: Layers, title: "Published 12 surface tokens", meta: "Borys · yesterday" },
  { icon: Sparkles, title: "Refined the prism rim gradient", meta: "Casey · 3 days ago" },
  { icon: FileCode, title: "Documented the data module", meta: "Ada · last week" },
];

function ListRows({ notify }: { notify: Notify }) {
  return (
    <div className="study ui-stack">
      <span className="ui-label">Recent activity</span>
      <ul className="lib-list">
        {listRows.map((row) => {
          const Icon = row.icon;
          return (
            <li className="lib-row" key={row.title}>
              <span className="lib-data-icon">
                <Icon size={15} />
              </span>
              <span className="lib-row__copy">
                <strong>{row.title}</strong>
                <small>{row.meta}</small>
              </span>
              <IconButton
                label={`Open ${row.title}`}
                onClick={() => notify(`Opened ${row.title}.`)}
              >
                <MoreHorizontal size={15} />
              </IconButton>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const events = [
  { time: "09:12", actor: "Ada", text: "Opened the release checklist and pinned the build." },
  { time: "10:40", actor: "Borys", text: "Reviewed the prism rim tokens and requested one change." },
  { time: "13:05", actor: "Casey", text: "Merged the data-display module into main." },
  { time: "16:48", actor: "Pipeline", text: "Deployed preview build 218 to staging." },
];

function Timeline() {
  return (
    <div className="study ui-stack">
      <span className="ui-label">Today</span>
      <ol className="lib-timeline">
        {events.map((event) => (
          <li className="lib-timeline__item" key={event.time}>
            <span className="lib-timeline__dot" aria-hidden="true" />
            <time className="lib-timeline__time lib-num">{event.time}</time>
            <span className="lib-row__copy">
              <strong>{event.actor}</strong>
              <small>{event.text}</small>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function monthCells(year: number, month: number) {
  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  const previous = new Date(year, month, 0).getDate();
  const cells: { day: number; muted: boolean }[] = [];
  for (let index = lead - 1; index >= 0; index -= 1)
    cells.push({ day: previous - index, muted: true });
  for (let day = 1; day <= total; day += 1) cells.push({ day, muted: false });
  let next = 1;
  while (cells.length % 7 !== 0) cells.push({ day: next++, muted: true });
  return cells;
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function MonthCalendar() {
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState(21);
  const weeks = useMemo(() => {
    const cells = monthCells(2026, 9);
    return Array.from({ length: cells.length / 7 }, (_, index) =>
      cells.slice(index * 7, index * 7 + 7),
    );
  }, []);
  if (!visible) {
    return (
      <div className="study ui-stack lib-center">
        <span className="lib-caption">Calendar dismissed.</span>
        <Button variant="secondary" onClick={() => setVisible(true)}>
          Restore calendar
        </Button>
      </div>
    );
  }
  return (
    <div className="study ui-stack">
      <div className="ui-between">
        <span className="lib-cal__title">October 2026</span>
        <IconButton label="Dismiss calendar" onClick={() => setVisible(false)}>
          <X size={14} />
        </IconButton>
      </div>
      <div className="lib-cal" role="grid" aria-label="October 2026">
        <div className="lib-cal__row" role="row">
          {weekdays.map((day) => (
            <span
              className="lib-cal__weekday"
              role="columnheader"
              key={day}
              aria-label={day}
            >
              {day}
            </span>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div className="lib-cal__row" role="row" key={weekIndex}>
            {week.map((cell, index) => {
              const today = !cell.muted && cell.day === 18;
              const isSelected = !cell.muted && cell.day === selected;
              return (
                <button
                  key={index}
                  type="button"
                  role="gridcell"
                  className={`lib-cal__day${cell.muted ? " is-muted" : ""}${
                    isSelected ? " is-selected" : ""
                  }`}
                  aria-selected={isSelected}
                  aria-current={today ? "date" : undefined}
                  aria-label={`${cell.day} October 2026`}
                  disabled={cell.muted}
                  onClick={() => setSelected(cell.day)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <span className="lib-caption" aria-live="polite">
        Selected {selected} October 2026
      </span>
    </div>
  );
}

const ranges = {
  today: { label: "Today", from: "2026-10-18", to: "2026-10-18" },
  week: { label: "Last 7 days", from: "2026-10-12", to: "2026-10-18" },
  month: { label: "This month", from: "2026-10-01", to: "2026-10-18" },
  custom: { label: "Custom", from: "2026-09-21", to: "2026-10-18" },
};

type RangeKey = keyof typeof ranges;

function DateRange() {
  const [range, setRange] = useState<RangeKey>("week");
  const active = ranges[range];
  const days =
    Math.round((Date.parse(active.to) - Date.parse(active.from)) / 86_400_000) +
    1;
  return (
    <div className="study ui-stack">
      <Segmented
        label="Date preset"
        options={Object.entries(ranges).map(([value, item]) => ({
          value,
          label: item.label,
        }))}
        value={range}
        onChange={(next) => setRange(next as RangeKey)}
      />
      <div className="lib-grid">
        <Field
          label="From"
          type="date"
          readOnly
          value={active.from}
          icon={<CalendarDays size={14} />}
        />
        <Field label="To" type="date" readOnly value={active.to} />
      </div>
      <p className="lib-caption" aria-live="polite">
        {active.label} · {days} {days === 1 ? "day" : "days"}
      </p>
    </div>
  );
}

const bars = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 58 },
  { label: "Wed", value: 51 },
  { label: "Thu", value: 74 },
  { label: "Fri", value: 88 },
  { label: "Sat", value: 34 },
  { label: "Sun", value: 27 },
];

function BarChart() {
  const [active, setActive] = useState(4);
  const current = bars[active];
  return (
    <div className="study ui-stack">
      <div className="ui-between">
        <span className="ui-label">Weekly builds</span>
        <span className="lib-caption lib-num" aria-live="polite">
          {current.label} · {current.value}
        </span>
      </div>
      <div className="lib-chart">
        <div className="lib-chart__axis" aria-hidden="true">
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>
        <div className="lib-chart__plot" role="group" aria-label="Weekly builds">
          {bars.map((bar, index) => (
            <button
              key={bar.label}
              type="button"
              className={`lib-bar lib-bars__bar${
                index === active ? " is-active" : ""
              }`}
              style={{ height: `${bar.value}%` }}
              aria-label={`${bar.label}: ${bar.value} builds`}
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            />
          ))}
        </div>
      </div>
      <div className="lib-bars__labels" aria-hidden="true">
        {bars.map((bar, index) => (
          <span key={bar.label} className={index === active ? "is-active" : ""}>
            {bar.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const spark = [12, 16, 14, 21, 19, 26, 31, 29, 36, 42];

function Sparkline() {
  const max = 46;
  const width = 240;
  const height = 64;
  const step = width / (spark.length - 1);
  const line = spark
    .map(
      (value, index) =>
        `${index ? "L" : "M"}${(index * step).toFixed(1)},${(
          height -
          (value / max) * height
        ).toFixed(1)}`,
    )
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const last = spark[spark.length - 1];
  return (
    <div className="study ui-stack">
      <div className="ui-between">
        <span className="ui-label">Weekly sessions</span>
        <span className="lib-caption lib-num">
          {spark[0]} → {last}
        </span>
      </div>
      <div className="lib-spark">
        <svg
          className="lib-spark__svg"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`Rising trend from ${spark[0]} to ${last} sessions`}
        >
          <defs>
            <linearGradient id="lib-spark-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93a3bf" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#93a3bf" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#lib-spark-fill)" />
          <path
            d={line}
            fill="none"
            stroke="#9cafa8"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="ui-between lib-caption lib-num">
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

const segments = [
  { label: "Desktop", value: 54 },
  { label: "Mobile", value: 31 },
  { label: "Tablet", value: 11 },
  { label: "Other", value: 4 },
];

function DistributionBar() {
  return (
    <div className="study ui-stack">
      <span className="ui-label">Sessions by device</span>
      <div className="lib-dist" role="img" aria-label="Desktop 54 percent, mobile 31, tablet 11, other 4">
        {segments.map((segment) => (
          <span
            key={segment.label}
            className="lib-dist__seg"
            style={{ width: `${segment.value}%` }}
          />
        ))}
      </div>
      <ul className="lib-dist__legend">
        {segments.map((segment, index) => (
          <li className="lib-dist__item" key={segment.label}>
            <i className={`is-${index + 1}`} aria-hidden="true" />
            <span>{segment.label}</span>
            <span className="lib-num">{segment.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type BoardColumn = { id: string; title: string; cards: string[] };

const board: BoardColumn[] = [
  { id: "backlog", title: "Backlog", cards: ["Audit empty states", "Token sweep"] },
  { id: "progress", title: "In progress", cards: ["Heatmap palette"] },
  { id: "shipped", title: "Shipped", cards: ["Bar chart", "Timeline"] },
];

function Kanban({ notify }: { notify: Notify }) {
  const [columns, setColumns] = useState(board);
  const [selected, setSelected] = useState("Bar chart");
  const add = (column: BoardColumn) => {
    const title = `New task ${column.cards.length + 1}`;
    setColumns((current) =>
      current.map((item) =>
        item.id === column.id
          ? { ...item, cards: [...item.cards, title] }
          : item,
      ),
    );
    setSelected(title);
    notify(`Added to ${column.title}.`);
  };
  return (
    <div className="study ui-stack">
      <div className="lib-board">
        {columns.map((column) => (
          <div className="lib-board__col" key={column.id}>
            <div className="lib-board__head">
              <strong>{column.title}</strong>
              <span className="lib-board__count lib-num">
                {column.cards.length}
              </span>
              <IconButton
                label={`Add card to ${column.title}`}
                onClick={() => add(column)}
              >
                <Plus size={14} />
              </IconButton>
            </div>
            <div className="lib-board__cards" role="listbox" aria-label={column.title}>
              {column.cards.map((card) => (
                <button
                  key={card}
                  type="button"
                  role="option"
                  className="lib-board__card"
                  aria-selected={selected === card}
                  onClick={() => setSelected(card)}
                >
                  {card}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <span className="lib-caption" aria-live="polite">
        Selected: {selected}
      </span>
    </div>
  );
}

const sections = [
  { id: "anatomy", title: "Anatomy", body: "A shared frame, a hairline border and a translucent wash." },
  { id: "tokens", title: "Tokens", body: "Colour, radius and rhythm resolve from the same variables." },
  { id: "motion", title: "Motion", body: "Transitions stay under 240 ms and ease without overshoot." },
  { id: "states", title: "States", body: "Hover, focus and selection each shift a single property." },
];

function DisclosureTree() {
  const [open, setOpen] = useState<string | null>("anatomy");
  return (
    <div className="study ui-stack">
      <div className="lib-disclosure">
        {sections.map((section) => {
          const expanded = open === section.id;
          return (
            <div className="lib-disclosure__item" key={section.id}>
              <h3>
                <button
                  type="button"
                  id={`lib-head-${section.id}`}
                  className="lib-disclosure__head"
                  aria-expanded={expanded}
                  aria-controls={`lib-panel-${section.id}`}
                  onClick={() => setOpen(expanded ? null : section.id)}
                >
                  <ChevronRight size={13} className={expanded ? "is-open" : ""} />
                  {section.title}
                </button>
              </h3>
              <div
                id={`lib-panel-${section.id}`}
                className="lib-disclosure__panel"
                role="region"
                aria-labelledby={`lib-head-${section.id}`}
                hidden={!expanded}
              >
                <p className="lib-caption">{section.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const records = [
  { id: "edge", title: "Edge", meta: "Surface", detail: "Ambient rim that follows the pointer across the frame." },
  { id: "segmented", title: "Segmented", meta: "Control", detail: "One travelling indicator, keyboard arrows included." },
  { id: "sparkline", title: "Sparkline", meta: "Chart", detail: "A quiet trend line with a gradient area fill." },
];

function SplitPane() {
  const [active, setActive] = useState("edge");
  const record = records.find((item) => item.id === active) ?? records[0];
  return (
    <div className="study ui-stack">
      <div className="lib-split">
        <div className="lib-split__master" role="listbox" aria-label="Components">
          {records.map((item) => (
            <MenuOption
              key={item.id}
              role="option"
              label={item.title}
              description={item.meta}
              selected={item.id === active}
              onClick={() => setActive(item.id)}
            />
          ))}
        </div>
        <div className="lib-split__detail">
          <strong className="ui-title">{record.title}</strong>
          <p className="ui-copy">{record.detail}</p>
          <span className="lib-caption">{record.meta} · updated this week</span>
        </div>
      </div>
    </div>
  );
}

const cards = [
  { title: "Surfaces", meta: "12 specimens" },
  { title: "Charts", meta: "6 specimens" },
  { title: "Controls", meta: "24 specimens" },
  { title: "Motion", meta: "8 specimens" },
];

function CardCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => {
    const node = track.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.75, behavior: "smooth" });
  };
  return (
    <div className="study ui-stack">
      <div className="ui-between">
        <span className="ui-label">Featured modules</span>
        <span className="ui-row">
          <IconButton label="Previous card" onClick={() => scroll(-1)}>
            <ChevronLeft size={15} />
          </IconButton>
          <IconButton label="Next card" onClick={() => scroll(1)}>
            <ChevronRight size={15} />
          </IconButton>
        </span>
      </div>
      <div
        className="lib-carousel"
        ref={track}
        tabIndex={0}
        role="group"
        aria-label="Featured modules"
      >
        {cards.map((card) => (
          <article className="lib-carousel__card" key={card.title}>
            <span className="lib-carousel__swatch" aria-hidden="true" />
            <strong>{card.title}</strong>
            <small>{card.meta}</small>
          </article>
        ))}
      </div>
      <span className="lib-caption">Scroll sideways or use the arrows</span>
    </div>
  );
}

const tags = ["Edge", "Prism", "Hairline", "Tabular", "Tinted", "Calm", "Precise"];

function Marquee() {
  return (
    <div className="study ui-stack">
      <span className="ui-label">Release tags</span>
      <div
        className="lib-marquee"
        tabIndex={0}
        role="group"
        aria-label="Release tags, scrolling strip"
      >
        <div className="lib-marquee__track">
          {[0, 1].map((pass) => (
            <div className="lib-marquee__group" key={pass} aria-hidden={pass === 1}>
              {tags.map((tag) => (
                <span className="lib-key lib-marquee__tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <span className="lib-caption">
        Pauses on hover or focus · static when motion is reduced
      </span>
    </div>
  );
}

const codeLines = [
  "export function Token({ name, value }: TokenProps) {",
  "  return (",
  '    <code className="lib-token">',
  "      --{name}: {value};",
  "    </code>",
  "  );",
  "}",
];

function CodeBlock({ notify }: { notify: Notify }) {
  return (
    <div className="study ui-stack">
      <div className="lib-code">
        <div className="lib-panel-head">
          <FileCode size={13} />
          <span>tokens.tsx</span>
          <span className="lib-code__lang">TSX</span>
          <IconButton
            className="lib-code__copy"
            label="Copy code"
            onClick={() => {
              void navigator.clipboard
                ?.writeText(codeLines.join("\n"))
                .catch(() => undefined);
              notify("Copied");
            }}
          >
            <Copy size={14} />
          </IconButton>
        </div>
        <pre className="lib-code__pre lib-scroll">
          <code>
            {codeLines.map((line, index) => (
              <span className="lib-code__line" key={index}>
                <span className="lib-code__num lib-num" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="lib-code__text">{line}</span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

type DiffLine = { kind: "add" | "remove" | "same" | "shorten"; text: string };

const diffLines: DiffLine[] = [
  { kind: "same", text: "const chart = {" },
  { kind: "remove", text: "  height: 96," },
  { kind: "add", text: "  height: 72," },
  { kind: "add", text: "  baseline: true," },
  { kind: "shorten", text: "… 14 unchanged lines" },
  { kind: "same", text: "  axis: [0, 50, 100]," },
  { kind: "remove", text: '  colour: "#ffffff",' },
  { kind: "add", text: '  colour: "#9cafa8",' },
  { kind: "same", text: "};" },
];

const diffMarks: Record<DiffLine["kind"], string> = {
  add: "+",
  remove: "−",
  same: "",
  shorten: "…",
};

function DiffView() {
  const added = diffLines.filter((line) => line.kind === "add").length;
  const removed = diffLines.filter((line) => line.kind === "remove").length;
  return (
    <div className="study ui-stack">
      <div className="ui-between">
        <span className="ui-label">Chart tokens</span>
        <span className="lib-caption lib-num">
          <b className="lib-diff__plus">+{added}</b>{" "}
          <b className="lib-diff__minus">−{removed}</b>
        </span>
      </div>
      <div className="lib-diff lib-scroll">
        {diffLines.map((line, index) => (
          <span className={`lib-diff__line is-${line.kind}`} key={index}>
            <span className="lib-diff__gutter" aria-hidden="true">
              {diffMarks[line.kind]}
            </span>
            <span className="lib-diff__text">{line.text}</span>
          </span>
        ))}
      </div>
      <span className="lib-caption">
        Shortened context · {added} added, {removed} removed
      </span>
    </div>
  );
}

type JsonValue = string | number | boolean | { [key: string]: JsonValue };

const jsonDocument: JsonValue = {
  name: "rift",
  version: 2,
  stable: true,
  tokens: {
    wash: 2.5,
    radius: 8,
    chart: { palette: "#9cafa8", levels: 4 },
  },
};

function JsonBranch({
  label,
  value,
  depth,
  path,
  open,
  toggle,
}: {
  label: string;
  value: JsonValue;
  depth: number;
  path: string;
  open: string[];
  toggle: (path: string) => void;
}) {
  if (typeof value !== "object") {
    return (
      <div className="lib-json__row" style={{ paddingLeft: depth * 14 }} role="treeitem" aria-level={depth + 1}>
        <span className="lib-json__key">{label}</span>
        <span className="lib-json__value">
          {typeof value === "string" ? `"${value}"` : String(value)}
        </span>
        <span className={`lib-json__type is-${typeof value}`}>
          {typeof value}
        </span>
      </div>
    );
  }
  const entries = Object.entries(value);
  const expanded = open.includes(path);
  return (
    <>
      <div className="lib-json__row" style={{ paddingLeft: depth * 14 }} role="treeitem" aria-level={depth + 1} aria-expanded={expanded}>
        <button
          type="button"
          className="lib-json__toggle"
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${label}`}
          onClick={() => toggle(path)}
        >
          <ChevronRight size={11} className={expanded ? "is-open" : ""} />
        </button>
        <span className="lib-json__key">{label}</span>
        <span className="lib-json__type is-object">{entries.length} keys</span>
      </div>
      {expanded &&
        entries.map(([key, child]) => (
          <JsonBranch
            key={key}
            label={key}
            value={child}
            depth={depth + 1}
            path={`${path}.${key}`}
            open={open}
            toggle={toggle}
          />
        ))}
    </>
  );
}

function JsonTree() {
  const [open, setOpen] = useState<string[]>(["$", "$.tokens"]);
  const toggle = (path: string) =>
    setOpen((current) =>
      current.includes(path)
        ? current.filter((item) => item !== path)
        : [...current, path],
    );
  return (
    <div className="study ui-stack">
      <div className="lib-json lib-scroll" role="tree" aria-label="Response body">
        <JsonBranch
          label="root"
          value={jsonDocument}
          depth={0}
          path="$"
          open={open}
          toggle={toggle}
        />
      </div>
      <span className="lib-caption">
        3 levels · string, number and boolean values
      </span>
    </div>
  );
}

const heatCells = Array.from({ length: 14 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => (week * 3 + day * 5 + week) % 4),
);

const heatDays = ["Mon", "", "Wed", "", "Fri", "", ""];

function ActivityHeatmap() {
  const total = heatCells.flat().reduce((sum, level) => sum + level, 0);
  return (
    <div className="study ui-stack">
      <span className="ui-label">Contribution activity</span>
      <div className="lib-heat">
        <div className="lib-heat__days" aria-hidden="true">
          {heatDays.map((day, index) => (
            <span key={index}>{day}</span>
          ))}
        </div>
        <div
          className="lib-heat__grid"
          role="img"
          aria-label={`Contribution grid for the last 14 weeks, ${total} activity points`}
        >
          {heatCells.map((days, week) => (
            <div className="lib-heat__col" key={week}>
              {days.map((level, day) => (
                <span key={day} className={`lib-heat__cell is-${level}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="lib-heat__legend">
        <span className="lib-caption">Less</span>
        {[0, 1, 2, 3].map((level) => (
          <span key={level} className={`lib-heat__cell is-${level}`} aria-hidden="true" />
        ))}
        <span className="lib-caption">More</span>
      </div>
    </div>
  );
}
