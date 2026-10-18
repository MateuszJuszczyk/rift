import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Bell,
  Bookmark,
  Box,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Compass,
  Copy,
  ExternalLink,
  Eye,
  Fingerprint,
  Focus,
  Headphones,
  Hand,
  Heart,
  Home,
  Layers,
  LayoutGrid,
  Link,
  LoaderCircle,
  Minus,
  Moon,
  MousePointer2,
  PanelLeft,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  Sun,
  Volume2,
  X,
} from "lucide-react";
import {
  ActionButton,
  Button,
  Edge,
  Modal,
  Range,
  Segmented,
  Specimen,
  Toggle,
  IconButton,
} from "./ui";

import { AdditionalStudy, additionalStudies } from "./Studies";

import { ComponentStudy, componentStudies } from "./Components";

type Category = "all" | "controls" | "navigation" | "surfaces" | "feedback";
const categories: { id: Category; label: string }[] = [
  { id: "all", label: "Overview" },
  { id: "controls", label: "Controls" },
  { id: "navigation", label: "Navigation" },
  { id: "surfaces", label: "Surfaces" },
  { id: "feedback", label: "Feedback" },
];
const specimens = [
  { id: "optical", title: "Optical edge", category: "surfaces" },
  { id: "precision", title: "Precision controls", category: "controls" },
  {
    id: "buttons",
    title: "Buttons",
    category: "controls",
  },
  { id: "segments", title: "Segmented controls", category: "controls" },
  {
    id: "header",
    title: "Header navigation",
    category: "navigation",
  },
  { id: "dock", title: "Floating navigation", category: "navigation" },
  { id: "player", title: "Ambient player", category: "surfaces" },
  { id: "inputs", title: "Form controls", category: "controls" },
  {
    id: "selection",
    title: "Selection controls",
    category: "controls",
  },
  {
    id: "disclosure",
    title: "Progressive disclosure",
    category: "navigation",
  },
  { id: "feedback", title: "State & feedback", category: "feedback" },
  {
    id: "dialog",
    title: "Confirmation dialog",
    category: "feedback",
  },
  {
    id: "commit",
    title: "Hold to confirm",
    category: "controls",
  },
  ...additionalStudies,
  ...componentStudies,
] as const;

// Shared columns and row baselines keep the canvas composed even before exploration.
const positions = {
  optical: { x: 60, y: 550, w: 1200 },
  precision: { x: 60, y: 820, w: 340 },
  buttons: { x: 490, y: 820, w: 340 },
  segments: { x: 920, y: 820, w: 340 },
  header: { x: 60, y: 1330, w: 340 },
  dock: { x: 490, y: 1330, w: 340 },
  player: { x: 920, y: 1330, w: 340 },
  inputs: { x: 60, y: 1740, w: 340 },
  selection: { x: 490, y: 1740, w: 340 },
  disclosure: { x: 920, y: 1740, w: 340 },
  feedback: { x: 60, y: 2340, w: 340 },
  dialog: { x: 490, y: 2340, w: 340 },
  commit: { x: 920, y: 2340, w: 340 },
  "compact-tabs": { x: 60, y: 2860, w: 340 },
  "workspace-nav": { x: 490, y: 2860, w: 340 },
  "view-toolbar": { x: 920, y: 2860, w: 340 },
  "property-menu": { x: 60, y: 3420, w: 340 },
  "filter-builder": { x: 490, y: 3420, w: 340 },
  "theme-mixer": { x: 920, y: 3420, w: 340 },
  "inbox-list": { x: 60, y: 3980, w: 340 },
  "activity-thread": { x: 490, y: 3980, w: 340 },
  "batch-actions": { x: 920, y: 3980, w: 340 },
  "multi-select": { x: 60, y: 4540, w: 340 },
  "date-picker": { x: 490, y: 4540, w: 340 },
  "file-upload": { x: 920, y: 4540, w: 340 },
  "action-menu": { x: 60, y: 5140, w: 340 },
  "inline-editor": { x: 490, y: 5140, w: 340 },
  "process-steps": { x: 920, y: 5140, w: 340 },
};

function defaultCamera() {
  const zoom = innerWidth >= 900 ? Math.min(0.95, (innerWidth - 80) / 1320) : 1;
  return {
    x: innerWidth >= 900 ? Math.max(0, (innerWidth - 1320 * zoom) / 2) : 0,
    y: innerWidth >= 900 ? 20 : 0,
    zoom,
  };
}

function readSaved(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem("rift-saved") || "[]");
    return Array.isArray(value)
      ? value.filter((v) => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}

function readTheme(): "dark" | "light" {
  try {
    return localStorage.getItem("rift-theme") === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(readTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#080809" : "#f4f3f1");
    try {
      localStorage.setItem("rift-theme", theme);
    } catch {
      /* Storage can be unavailable. */
    }
  }, [theme]);
  const [category, setCategory] = useState<Category>("all");
  const [saved, setSaved] = useState<string[]>(readSaved);
  const [savedOnly, setSavedOnly] = useState(false);
  const [inspector, setInspector] = useState(false);
  const [command, setCommand] = useState(false);
  const [query, setQuery] = useState("");
  const [tool, setTool] = useState<"select" | "hand">("select");
  const [camera, setCamera] = useState(defaultCamera);
  const viewport = useRef<HTMLElement>(null);
  const cameraRef = useRef(camera);
  cameraRef.current = camera;
  const panStart = useRef<{
    x: number;
    y: number;
    cx: number;
    cy: number;
  } | null>(null);
  const fitCanvas = () => setCamera(defaultCamera());
  const changeZoom = (delta: number) => {
    const current = cameraRef.current;
    const zoom = Math.max(0.4, Math.min(1.6, current.zoom + delta));
    const x = innerWidth / 2;
    const y = innerHeight / 2;
    setCamera({
      x: x - ((x - current.x) / current.zoom) * zoom,
      y: y - ((y - current.y) / current.zoom) * zoom,
      zoom,
    });
  };
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      if (innerWidth < 900) return;
      event.preventDefault();
      const current = cameraRef.current;
      if (event.ctrlKey || event.metaKey) {
        const zoom = Math.max(
          0.4,
          Math.min(1.6, current.zoom - event.deltaY * 0.003),
        );
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left,
          y = event.clientY - rect.top;
        setCamera({
          x: x - ((x - current.x) / current.zoom) * zoom,
          y: y - ((y - current.y) / current.zoom) * zoom,
          zoom,
        });
      } else
        setCamera({
          ...current,
          x: current.x - event.deltaX,
          y: current.y - event.deltaY,
        });
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, []);
  useEffect(() => {
    let frame = 0;
    const resize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setCamera(defaultCamera()));
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);
  const [about, setAbout] = useState(false);
  const [toast, setToast] = useState("");
  const [material, setMaterial] = useState("Muted Prism");
  const [edge, setEdge] = useState(70);
  const [frost, setFrost] = useState(45);
  const [accent, setAccent] = useState("silver");
  const [motion, setMotion] = useState(true);
  const motionRef = useRef(motion);
  motionRef.current = motion;
  const [resetKey, setResetKey] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const notify = (message: string) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(""), 4500);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    try {
      localStorage.setItem("rift-saved", JSON.stringify(saved));
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
  }, [saved]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommand((v) => !v);
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);
  const pickCategory = (next: Category) => {
    setCategory(next);
    setSavedOnly(false);
    if (innerWidth >= 900) setCamera(defaultCamera());
    else window.scrollTo({ top: 0, behavior: "instant" });
  };
  const toggleSave = (id: string) =>
    setSaved((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id],
    );
  const reset = () => {
    setMaterial("Muted Prism");
    setEdge(70);
    setFrost(45);
    setAccent("silver");
    setMotion(true);
    setResetKey((value) => value + 1);
    setCategory("all");
    setSavedOnly(false);
    setTool("select");
    setCamera(defaultCamera());
    notify("Canvas reset.");
  };
  const download = () => {
    const data = {
      name: "RIFT material preset",
      material,
      version: 1,
      edge,
      frost,
      accent,
      motion,
      theme,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rift-material.json";
    link.click();
    URL.revokeObjectURL(url);
    notify("Preset exported.");
  };
  const visible = specimens.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      (!savedOnly || saved.includes(item.id)),
  );
  const searchResults = specimens.filter((item) =>
    `${item.title} ${item.category}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const chooseResult = (id: string) => {
    setCategory("all");
    setSavedOnly(false);
    setCommand(false);
    setQuery("");
    requestAnimationFrame(() => {
      const item = document.getElementById(id);
      if (innerWidth >= 900) {
        const position = positions[id as keyof typeof positions];
        if (position)
          setCamera({
            x: innerWidth / 2 - (position.x + position.w / 2) * 0.95,
            y: innerHeight / 2 - (position.y + 170) * 0.95,
            zoom: 0.95,
          });
      } else
        item?.scrollIntoView({
          behavior:
            motionRef.current &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "smooth"
              : "instant",
          block: "center",
        });
      if (item) {
        item.tabIndex = -1;
        item.focus({ preventScroll: true });
      }
      item?.classList.add("highlight-specimen");
      setTimeout(() => item?.classList.remove("highlight-specimen"), 1800);
    });
  };
  useEffect(() => {
    const visitHash = () => {
      const id = location.hash.slice(1);
      if (specimens.some((item) => item.id === id)) chooseResult(id);
    };
    visitHash();
    window.addEventListener("hashchange", visitHash);
    return () => window.removeEventListener("hashchange", visitHash);
  }, []);
  const style = {
    "--edge-strength": edge / 100,
    "--frost": `${frost / 3}px`,
    "--accent":
      accent === "silver"
        ? theme === "light"
          ? "#45404d"
          : "#dedbd5"
        : accent === "lilac"
          ? theme === "light"
            ? "#77628e"
            : "#c3b2eb"
          : theme === "light"
            ? "#65705c"
            : "#d5d8c5",
    "--accent-rgb":
      accent === "silver"
        ? theme === "light"
          ? "69,64,77"
          : "222,219,213"
        : accent === "lilac"
          ? theme === "light"
            ? "119,98,142"
            : "195,178,235"
          : theme === "light"
            ? "101,112,92"
            : "213,216,197",
  } as CSSProperties;
  return (
    <div
      className={`app finish-${material.toLowerCase().replaceAll(" ", "-")} ${!motion ? "motion-off" : ""}`}
      style={style}
    >
      <a className="skip-link" href="#canvas">
        Skip to components
      </a>
      <header className="canvas-chrome">
        <button
          className="canvas-wordmark"
          onClick={() => {
            pickCategory("all");
            fitCanvas();
          }}
          aria-label="RIFT canvas home"
        >
          <span className="brand-symbol">
            <i />
            <i />
            <i />
          </span>
          <strong>rift</strong>
          <span>React components</span>
        </button>
        <nav className="canvas-filters" aria-label="Canvas layers">
          {categories.map(({ id, label }) => (
            <button
              key={id}
              aria-pressed={category === id && !savedOnly}
              className={category === id && !savedOnly ? "active" : ""}
              onClick={() => pickCategory(id)}
            >
              {id === "all" ? "Everything" : label}
            </button>
          ))}
        </nav>
        <div className="canvas-header-actions ui-row">
          <IconButton
            label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            aria-pressed={theme === "light"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </IconButton>
          <button
            className="canvas-info icon-button"
            aria-label="About RIFT"
            onClick={() => setAbout(true)}
          >
            <CircleHelp size={17} />
          </button>
        </div>
      </header>
      <main
        id="canvas"
        ref={viewport}
        onFocusCapture={(event) => {
          if (
            innerWidth < 900 ||
            !(event.target as Element).matches(":focus-visible")
          )
            return;
          const target = (event.target as Element).closest<HTMLElement>(
            ".specimen",
          );
          if (!target) return;
          const rect = target.getBoundingClientRect();
          const container = event.currentTarget;
          const scrollX = container.scrollLeft,
            scrollY = container.scrollTop;
          container.scrollTo({ top: 0, left: 0, behavior: "instant" });
          if (
            rect.top < 100 ||
            rect.bottom > innerHeight - 95 ||
            rect.left < 20 ||
            rect.right > innerWidth - 20
          ) {
            const current = cameraRef.current;
            setCamera({
              ...current,
              x:
                current.x +
                innerWidth / 2 -
                (rect.left + rect.width / 2) -
                scrollX,
              y:
                current.y +
                innerHeight / 2 -
                (rect.top + Math.min(rect.height, innerHeight - 220) / 2) -
                scrollY,
            });
          }
        }}
        className={`canvas-view tool-${tool}`}
        style={
          {
            "--grid-x": `${camera.x}px`,
            "--grid-y": `${camera.y}px`,
            "--grid-step": `${32 * camera.zoom}px`,
          } as CSSProperties
        }
        onPointerDown={(event) => {
          if (innerWidth < 900 || event.button !== 0) return;
          if (
            tool === "hand" ||
            event.target === event.currentTarget ||
            (event.target as Element).classList.contains("component-grid")
          ) {
            event.currentTarget.setPointerCapture(event.pointerId);
            panStart.current = {
              x: event.clientX,
              y: event.clientY,
              cx: camera.x,
              cy: camera.y,
            };
            event.preventDefault();
          }
        }}
        onPointerMove={(event) => {
          if (panStart.current) {
            const start = panStart.current;
            setCamera({
              ...cameraRef.current,
              x: start.cx + event.clientX - start.x,
              y: start.cy + event.clientY - start.y,
            });
          }
        }}
        onPointerUp={() => {
          panStart.current = null;
        }}
        onPointerCancel={() => {
          panStart.current = null;
        }}
      >
        <h1 className="sr-only">RIFT — React component library</h1>
        <div
          key={resetKey}
          className={`component-grid freeform-board ${category !== "all" || savedOnly ? "filtered-grid" : ""}`}
          style={
            {
              "--camera-x": `${camera.x}px`,
              "--camera-y": `${camera.y}px`,
              "--camera-zoom": camera.zoom,
              "--board-height": `${category !== "all" || savedOnly ? 150 + Math.ceil(visible.length / 3) * 570 : 5800}px`,
            } as CSSProperties
          }
        >
          <div className="canvas-note hero-note">
            <img
              className="hero-sculpture"
              src="/images/muted-prism-hero.webp"
              alt=""
              width="2172"
              height="724"
              fetchPriority="high"
              decoding="async"
            />
            <p>
              React
              <br />
              <span>components.</span>
            </p>
            <small>
              Muted Prism surfaces. Shared styles. Built with React and
              TypeScript.
            </small>
          </div>
          {visible.map((item, visibleIndex) => (
            <Specimen
              key={item.id}
              id={item.id}
              title={item.title}
              zoom={camera.zoom}
              style={
                {
                  "--node-x": `${category !== "all" || savedOnly ? 60 + (visibleIndex % 3) * 430 : positions[item.id].x}px`,
                  "--node-y": `${category !== "all" || savedOnly ? 150 + Math.floor(visibleIndex / 3) * 570 : positions[item.id].y}px`,
                  "--node-width": `${category !== "all" || savedOnly ? 340 : positions[item.id].w}px`,
                } as CSSProperties
              }
              className={`specimen-${item.id}`}
              saved={saved.includes(item.id)}
              onSave={() => toggleSave(item.id)}
            >
              {componentStudies.some((study) => study.id === item.id) ? (
                <ComponentStudy id={item.id} />
              ) : additionalStudies.some((study) => study.id === item.id) ? (
                <AdditionalStudy id={item.id} notify={notify} />
              ) : item.id === "optical" ? (
                <Optical material={material} onMaterialChange={setMaterial} />
              ) : item.id === "precision" ? (
                <Precision />
              ) : item.id === "buttons" ? (
                <Buttons notify={notify} />
              ) : item.id === "segments" ? (
                <Segments />
              ) : item.id === "dock" ? (
                <Dock />
              ) : item.id === "player" ? (
                <Player />
              ) : item.id === "inputs" ? (
                <Inputs notify={notify} />
              ) : item.id === "header" ? (
                <HeaderDemo notify={notify} />
              ) : item.id === "selection" ? (
                <Selection />
              ) : item.id === "disclosure" ? (
                <Disclosure />
              ) : item.id === "feedback" ? (
                <Feedback notify={notify} />
              ) : item.id === "commit" ? (
                <Commit notify={notify} />
              ) : (
                <DialogDemo
                  notify={notify}
                  onApply={() => {
                    setMaterial("Obsidian");
                    setEdge(70);
                    setFrost(45);
                    setAccent("silver");
                  }}
                />
              )}
            </Specimen>
          ))}
        </div>
        {!visible.length && (
          <div className="empty-state">
            <Bookmark size={26} />
            <h2>No saved components</h2>
            <p>Use the bookmark beside a component to save it.</p>
            <Button onClick={() => pickCategory("all")}>
              Back to everything <ArrowRight size={14} />
            </Button>
          </div>
        )}
      </main>
      <div className="canvas-caption">
        <span>{visible.length} interactive components</span>
        <span>Drag a grip to rearrange · Scroll to explore</span>
      </div>
      <Edge className="canvas-tools">
        <div className="tool-selection">
          <button
            className={tool === "select" ? "active" : ""}
            onClick={() => setTool("select")}
            aria-label="Interact with components"
            aria-pressed={tool === "select"}
          >
            <MousePointer2 size={17} />
          </button>
          <button
            className={`desktop-canvas-tool ${tool === "hand" ? "active" : ""}`}
            onClick={() => setTool("hand")}
            aria-label="Pan canvas"
            aria-pressed={tool === "hand"}
          >
            <Hand size={17} />
          </button>
        </div>
        <span className="tool-separator desktop-canvas-tool" />
        <button
          className="desktop-canvas-tool"
          aria-label="Zoom out"
          onClick={() => changeZoom(-0.1)}
          disabled={camera.zoom <= 0.4}
        >
          <Minus size={15} />
        </button>
        <button
          className="canvas-zoom desktop-canvas-tool"
          aria-label="Reset canvas view"
          onClick={fitCanvas}
        >
          {Math.round(camera.zoom * 100)}%
        </button>
        <button
          className="desktop-canvas-tool"
          aria-label="Zoom in"
          onClick={() => changeZoom(0.1)}
          disabled={camera.zoom >= 1.6}
        >
          <Plus size={15} />
        </button>
        <span className="tool-separator" />
        <button aria-label="Find a component" onClick={() => setCommand(true)}>
          <Search size={17} />
        </button>
        <button
          aria-label="Show saved components"
          aria-pressed={savedOnly}
          className={savedOnly ? "active" : ""}
          onClick={() => {
            const next = !savedOnly;
            setSavedOnly(next);
            setCategory("all");
            fitCanvas();
          }}
        >
          <Bookmark size={16} />
          {saved.length > 0 && <i className="saved-dot" />}
        </button>
        <button
          aria-label="Tune the material"
          onClick={() => setInspector(true)}
        >
          <Settings2 size={17} />
        </button>
        <span className="tool-separator" />
        <button aria-label="Reset all components and canvas" onClick={reset}>
          <RotateCcw size={16} />
        </button>
      </Edge>
      <Modal
        open={inspector}
        onClose={() => setInspector(false)}
        title="Material studio"
        className="inspector-modal"
      >
        <p className="modal-description">
          Adjust the shared surface material.
          <br />
          Settings apply to the canvas.
        </p>
        <div className="inspector-preview">
          <Edge className="inspector-edge">
            <Fingerprint size={44} />
            <span>Edge preview</span>
          </Edge>
        </div>
        <Range label="Edge illumination" value={edge} onChange={setEdge} />
        <Range label="Surface frost" value={frost} onChange={setFrost} />
        <div className="inspector-color">
          <span>Color temperature</span>
          <div className="color-options">
            {[
              { id: "silver", name: "Silver", color: "#dedbd5" },
              { id: "lilac", name: "Dusk", color: "#c3b2eb" },
              { id: "stone", name: "Stone", color: "#d5d8c5" },
            ].map((color) => (
              <button
                key={color.id}
                aria-label={color.name}
                aria-pressed={accent === color.id}
                className={accent === color.id ? "selected" : ""}
                style={{ "--swatch": color.color } as CSSProperties}
                onClick={() => setAccent(color.id)}
              >
                <span />
                {color.name}
              </button>
            ))}
          </div>
        </div>
        <Toggle
          label="Expressive motion"
          description="System reduced-motion preferences always apply."
          checked={motion}
          onChange={setMotion}
        />
        <div className="modal-actions">
          <Button onClick={reset} icon={<RotateCcw size={14} />}>
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={download}
            icon={<ArrowDownToLine size={14} />}
          >
            Export preset
          </Button>
        </div>
      </Modal>
      <Modal
        open={command}
        onClose={() => {
          setCommand(false);
          setQuery("");
        }}
        title="Find a component"
        className="command-modal"
      >
        <div className="command-search">
          <Search size={18} />
          <input
            aria-label="Search components"
            placeholder="Search components…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="command-results">
          {searchResults.map((item) => (
            <button key={item.id} onClick={() => chooseResult(item.id)}>
              <span>
                <Box size={16} />
                {item.title}
              </span>
              <small>{item.category}</small>
              <ArrowUpRight size={14} />
            </button>
          ))}
          {!searchResults.length && (
            <p className="no-results">
              No matching components. Try “edge” or “controls”.
            </p>
          )}
        </div>
        <div className="command-footer">
          <span>
            <kbd>tab</kbd> to move
          </span>
          <span>
            <kbd>esc</kbd> to close
          </span>
        </div>
      </Modal>
      <Modal open={about} onClose={() => setAbout(false)} title="About RIFT">
        <div className="about-mark">
          <span className="brand-symbol">
            <i />
            <i />
            <i />
          </span>
        </div>
        <p className="about-lead">RIFT — React components</p>
        <p className="modal-description">
          A React component library with shared styles, Muted Prism surfaces and
          keyboard interactions. Explore the components on this canvas.
        </p>
        <p className="modal-description">
          Use the keyboard or pointer, bookmark components and adjust the
          material. Bookmarks stay in this browser.
        </p>
        <div className="credits">
          <span>Interface & interaction</span>
          <strong>RIFT component library</strong>
          <span>Interface icons</span>
          <a href="https://lucide.dev" target="_blank" rel="noreferrer">
            Lucide · ISC <ExternalLink size={11} />
          </a>
        </div>
      </Modal>
      <div
        className={`toast ${toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        <span className="toast-icon">
          <Check size={14} />
        </span>
        <span>{toast}</span>
        <button
          className="icon-button"
          aria-label="Dismiss notification"
          onClick={() => setToast("")}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function Optical({
  material,
  onMaterialChange,
}: {
  material: string;
  onMaterialChange: (value: string) => void;
}) {
  const [illuminated, setIlluminated] = useState(false);
  return (
    <div
      className={`surface-study material-${material.toLowerCase().replaceAll(" ", "-")} ${illuminated ? "illuminated" : ""}`}
    >
      <div className="surface-ui-label">Component finish</div>
      <div
        className="material-picker"
        role="group"
        aria-label="Optical material"
      >
        {["Muted Prism", "Obsidian", "Smoke", "Frost"].map((name, index) => (
          <button
            key={name}
            onClick={() => onMaterialChange(name)}
            aria-pressed={material === name}
            className={`ui-rim ${material === name ? "active" : ""}`}
          >
            <span className={`finish-dot finish-${index}`} />
            {name}
          </button>
        ))}
      </div>
      <Edge className="surface-control">
        <button
          aria-pressed={illuminated}
          onClick={() => setIlluminated(!illuminated)}
        >
          <Sun size={17} strokeWidth={1.4} />
          <span>Edge illumination</span>
          <span className="surface-control-state">
            {illuminated ? "On" : "Off"}
          </span>
        </button>
      </Edge>
      <div className="specimen-readout">
        <span>{material}</span>
        <span>Applied to all components</span>
      </div>
    </div>
  );
}

function Precision() {
  const [brightness, setBrightness] = useState(68);
  const [volume, setVolume] = useState(42);
  const [focus, setFocus] = useState(true);
  const [ambient, setAmbient] = useState(false);
  return (
    <div className={`precision-content ${ambient ? "ambient-light-on" : ""}`}>
      <Range
        label="Luminance"
        value={brightness}
        onChange={setBrightness}
        icon={<Sun size={14} />}
      />
      <Range
        label="Resonance"
        value={volume}
        onChange={setVolume}
        icon={<Volume2 size={14} />}
      />
      <div className="control-divider" />
      <Toggle label="Focus mode" checked={focus} onChange={setFocus} />
      <Toggle label="Edge lighting" checked={ambient} onChange={setAmbient} />
      <div
        className={`precision-status ${focus ? "focused" : ""}`}
        aria-live="polite"
      >
        <span />
        {focus ? "Focus enabled" : "Focus disabled"}
        <div
          className="signal-preview"
          aria-hidden="true"
          style={{ opacity: 0.25 + (brightness / 100) * 0.75 }}
        >
          {Array.from({ length: 16 }, (_, index) => (
            <i
              key={index}
              className={index < (volume / 100) * 16 ? "lit" : ""}
              style={{ height: `${5 + (index % 5) * 2}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Buttons({ notify }: { notify: (text: string) => void }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText("RIFT — React components");
      setCopied(true);
      notify("Copied to clipboard.");
      timeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      notify("Clipboard access unavailable in this browser.");
    }
  };
  return (
    <div className="button-examples">
      <div className="button-line">
        <ActionButton notify={notify} />
        <button
          className={`round-button ui-rim heart-button ${liked ? "liked" : ""}`}
          onClick={() => setLiked(!liked)}
          aria-label={liked ? "Unlike" : "Like"}
          aria-pressed={liked}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="button-line">
        <Button
          onClick={copy}
          icon={copied ? <Check size={15} /> : <Copy size={15} />}
        >
          {copied ? "Copied" : "Copy text"}
        </Button>
        <button
          className="round-button arrow-button ui-rim"
          aria-label="Show a detail"
          onClick={() => notify("Secondary action activated.")}
        >
          <ArrowUpRight size={18} />
        </button>
      </div>
      <div className="button-line button-minor-actions">
        <Button
          variant="danger"
          onClick={() => {
            setLiked(false);
            setCount(1);
            notify("Selection cleared.");
          }}
        >
          Clear choices
        </Button>
        <Button disabled>Unavailable</Button>
      </div>
      <div className="button-divider" />
      <div className="button-line">
        <div className="stepper" role="group" aria-label="Quantity">
          <button
            disabled={count === 0}
            onClick={() => setCount(Math.max(0, count - 1))}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <output aria-live="polite">
            {count.toString().padStart(2, "0")}
          </output>
          <button
            disabled={count === 9}
            onClick={() => setCount(Math.min(9, count + 1))}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
        <Button
          variant="ghost"
          onClick={() => notify("Secondary action activated.")}
          icon={<ArrowRight size={13} />}
        >
          Secondary action
        </Button>
      </div>
    </div>
  );
}

function Segments() {
  const [view, setView] = useState("grid");
  const [density, setDensity] = useState("relaxed");
  return (
    <div className="segments-demo">
      <Segmented
        options={[
          {
            value: "grid",
            label: (
              <>
                <LayoutGrid size={14} />
                Canvas
              </>
            ),
          },
          {
            value: "list",
            label: (
              <>
                <PanelLeft size={14} />
                List
              </>
            ),
          },
          {
            value: "focus",
            label: (
              <>
                <Focus size={14} />
                Focus
              </>
            ),
          },
        ]}
        value={view}
        onChange={setView}
        label="Preview arrangement"
      />
      <div
        className={`layout-preview layout-${view} density-${density}`}
        aria-label={`${view} layout preview`}
      >
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="segments-bottom">
        <span>Spacing</span>
        <Segmented
          options={[
            { value: "compact", label: "Compact" },
            { value: "relaxed", label: "Relaxed" },
          ]}
          value={density}
          onChange={setDensity}
          label="Preview spacing"
        />
      </div>
      <div className="specimen-readout" aria-live="polite">
        <span>
          {view === "grid" ? "Grid" : view === "list" ? "List" : "Focus"}
        </span>
        <span>{density === "compact" ? "4" : "8"} px spacing</span>
      </div>
    </div>
  );
}

function Dock() {
  const [active, setActive] = useState("Home");
  const [notification, setNotification] = useState(true);
  const actions = [
    { label: "Home", icon: Home },
    { label: "Explore", icon: Compass },
    { label: "Library", icon: Layers },
    { label: "Activity", icon: AudioLines },
  ];
  return (
    <div className="dock-stage">
      <div className="dock-context" aria-live="polite">
        <span>
          {active === "Home"
            ? "Home"
            : active === "Explore"
              ? "Explore"
              : active === "Library"
                ? "Library"
                : "Activity"}
        </span>
      </div>
      <Edge className="floating-dock">
        <nav aria-label="Floating dock">
          {actions.map(({ label, icon: Icon }) => (
            <button
              className={`ui-rim ${active === label ? "active" : ""}`}
              key={label}
              onClick={() => setActive(label)}
              aria-label={label}
              aria-current={active === label ? "page" : undefined}
            >
              <Icon size={19} />
              <span className="dock-tooltip">{label}</span>
              <i />
            </button>
          ))}
          <span className="dock-separator" />
          <button
            onClick={() => setNotification(!notification)}
            aria-label={
              notification ? "Mute notifications" : "Enable notifications"
            }
            aria-pressed={notification}
          >
            <Bell size={18} />
            {notification && <b className="notification-dot" />}
            <span className="dock-tooltip">
              {notification ? "Notifications on" : "Notifications off"}
            </span>
          </button>
        </nav>
      </Edge>
      <span className="dock-caption">Select a destination</span>
    </div>
  );
}

function Player() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(27);
  const [track, setTrack] = useState(0);
  const [liked, setLiked] = useState(false);
  const tracks = [
    { name: "Stillness", artist: "RIFT Radio · Ambient 001" },
    { name: "Intervals", artist: "RIFT Radio · Ambient 002" },
    { name: "Soft focus", artist: "RIFT Radio · Ambient 003" },
  ];
  useEffect(() => {
    if (!playing) return;
    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(0.028, context.currentTime + 1.5);
    gain.connect(context.destination);
    const frequencies = [
      [130.81, 196, 261.63],
      [146.83, 220, 293.66],
      [110, 164.81, 220],
    ][track];
    const oscillators = frequencies.map((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index * 2;
      oscillator.connect(gain);
      oscillator.start();
      return oscillator;
    });
    const tick = setInterval(
      () => setProgress((value) => (value >= 100 ? 0 : value + 0.4)),
      1000,
    );
    return () => {
      clearInterval(tick);
      const end = context.currentTime;
      gain.gain.cancelScheduledValues(end);
      gain.gain.setTargetAtTime(0, end, 0.015);
      oscillators.forEach((voice) => voice.stop(end + 0.08));
      setTimeout(() => {
        void context.close();
      }, 100);
    };
  }, [playing, track]);
  const next = () => {
    setTrack((value) => (value + 1) % tracks.length);
    setProgress(0);
  };
  return (
    <div className="player">
      <div className="player-top">
        <div className={`album-art ${playing ? "playing" : ""}`}>
          <div />
          <div />
          <div />
          <span>
            <AudioLines size={19} />
          </span>
        </div>
        <div className="track-info">
          <span className="eyebrow">RIFT / AMBIENT</span>
          <h3>{tracks[track].name}</h3>
          <p>{tracks[track].artist}</p>
        </div>
        <button
          className={`icon-button ${liked ? "is-saved" : ""}`}
          aria-label={liked ? "Unsave track" : "Save track"}
          aria-pressed={liked}
          onClick={() => setLiked(!liked)}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>
      <div
        className={`waveform ${playing ? "is-playing" : ""}`}
        aria-hidden="true"
      >
        {Array.from({ length: 55 }, (_, i) => (
          <i
            key={i}
            className={i / 55 <= progress / 100 ? "played" : ""}
            style={
              {
                height: `${Math.max(4, 12 + Math.sin(i * 0.67) * Math.sin(i * 0.23) * 35 + Math.cos(i * 1.2) * 8)}px`,
                "--delay": `${(i % 7) * -0.16}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <label className="sr-only" htmlFor="track-progress">
        Track progress
      </label>
      <input
        id="track-progress"
        className="track-progress"
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={(e) => setProgress(Number(e.target.value))}
        style={{ "--fill": `${progress}%` } as CSSProperties}
      />
      <div className="player-bottom">
        <span className="track-time">
          {Math.floor((progress * 2.4) / 60)}:
          {String(Math.floor((progress * 2.4) % 60)).padStart(2, "0")}{" "}
          <small>/ 4:00</small>
        </span>
        <div>
          <button
            className="icon-button"
            aria-label="Previous track"
            onClick={() => {
              setTrack((value) => (value + 2) % 3);
              setProgress(0);
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="player-play ui-rim"
            aria-label={playing ? "Pause ambient audio" : "Play ambient audio"}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
          </button>
          <button
            className="icon-button"
            aria-label="Next track"
            onClick={next}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <Headphones size={15} />
      </div>
    </div>
  );
}

function Inputs({ notify }: { notify: (message: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("Designer");
  const [name, setName] = useState("Morgan");
  return (
    <form
      className="input-demo"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setError("Enter a valid email address.");
          return;
        }
        setError("");
        notify("Form validated. No data was sent.");
      }}
    >
      <label htmlFor="demo-name">Name</label>
      <div className="input-shell ui-rim">
        <span className="input-avatar">
          {name.trim().slice(0, 1).toUpperCase() || "—"}
        </span>
        <input
          id="demo-name"
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="off"
        />
        {name.trim() && <Check size={14} />}
      </div>
      <div className="form-two">
        <div>
          <label htmlFor="demo-role">Role</label>
          <div className="select-shell ui-rim">
            <select
              id="demo-role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option>Designer</option>
              <option>Engineer</option>
              <option>Other</option>
            </select>
            <ChevronDown size={13} />
          </div>
        </div>
        <div>
          <label htmlFor="demo-team">Workspace</label>
          <div className="select-shell ui-rim">
            <select id="demo-team" defaultValue="Personal">
              <option>Personal</option>
              <option>Studio</option>
              <option>Team</option>
            </select>
            <ChevronDown size={13} />
          </div>
        </div>
      </div>
      <label htmlFor="demo-email">
        Email address <span>Local validation</span>
      </label>
      <div className={`input-shell ui-rim ${error ? "has-error" : ""}`}>
        <span className="at-symbol">@</span>
        <input
          type="email"
          id="demo-email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          aria-invalid={!!error}
          aria-describedby={error ? "email-error" : undefined}
        />
      </div>
      {error && (
        <p className="field-error" id="email-error" role="alert">
          {error}
        </p>
      )}
      <label htmlFor="demo-note" className="note-label">
        Message
      </label>
      <div className="textarea-shell ui-rim">
        <textarea
          id="demo-note"
          rows={2}
          placeholder="Add a message…"
          aria-label="Message"
        />
      </div>
      <Button type="submit" className="input-submit">
        Validate form <ArrowUpRight size={14} />
      </Button>
    </form>
  );
}

function HeaderDemo({ notify }: { notify: (message: string) => void }) {
  const [tab, setTab] = useState("Index");
  const [menu, setMenu] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menu) return;
    const outside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenu(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuTrigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [menu]);
  return (
    <div className="header-demo" ref={headerRef}>
      <div className="demo-navbar">
        <span className="demo-brand">
          <span className="tiny-brand" />
          rift
        </span>
        <nav aria-label="Header specimen navigation">
          {["Index", "Studio", "Notes"].map((name) => (
            <button
              key={name}
              className={`ui-rim ${tab === name ? "active" : ""}`}
              aria-current={tab === name ? "page" : undefined}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          ))}
        </nav>
        <button
          ref={menuTrigger}
          className="mini-profile"
          aria-label="Open workspace menu"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          M
        </button>
        {menu && (
          <div className="dropdown-menu">
            <span>Personal workspace</span>
            <button
              onClick={() => {
                setMenu(false);
                navigator.clipboard
                  .writeText(location.href.split("#")[0] + "#header")
                  .then(() => notify("Component link copied."))
                  .catch(() =>
                    notify(
                      "Clipboard is unavailable. Use the address bar to share this canvas.",
                    ),
                  );
              }}
            >
              <Link size={14} />
              Share workspace
            </button>
            <button
              onClick={() => {
                setMenu(false);
                setTab("Notes");
              }}
            >
              <Eye size={14} />
              Open Notes
            </button>
          </div>
        )}
      </div>
      <div className="header-caption" aria-live="polite">
        <span className="header-page">{tab}</span>
        <span>
          {tab === "Index"
            ? "Collection overview"
            : tab === "Studio"
              ? "Studio workspace"
              : "Saved notes"}
        </span>
      </div>
    </div>
  );
}

function Selection() {
  const [tags, setTags] = useState(["Interface", "Motion"]);
  const [choice, setChoice] = useState("Balanced");
  const [check, setCheck] = useState(true);
  return (
    <div className="selection-demo">
      <div className="mini-label">CATEGORIES</div>
      <div className="choice-chips">
        {["Interface", "Motion", "Objects", "Code"].map((tag) => (
          <button
            key={tag}
            aria-pressed={tags.includes(tag)}
            className={`ui-rim ${tags.includes(tag) ? "selected" : ""}`}
            onClick={() =>
              setTags((value) =>
                value.includes(tag)
                  ? value.filter((item) => item !== tag)
                  : [...value, tag],
              )
            }
          >
            {tags.includes(tag) ? <Check size={12} /> : <Plus size={12} />}{" "}
            {tag}
          </button>
        ))}
      </div>
      <div className="control-divider" />
      <fieldset className="radio-group">
        <legend>Motion intensity</legend>
        {["Quiet", "Balanced", "Expressive"].map((name) => (
          <label key={name}>
            <input
              type="radio"
              name="character"
              checked={choice === name}
              onChange={() => setChoice(name)}
            />
            <span className="custom-radio" />
            <span>{name}</span>
            {name === "Balanced" && <small>Default</small>}
          </label>
        ))}
      </fieldset>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={check}
          onChange={(event) => setCheck(event.target.checked)}
        />
        <span>
          <Check size={11} />
        </span>
        Enable transitions
      </label>
      <p className="selection-summary" aria-live="polite">
        {tags.length} interests · {choice.toLowerCase()} motion.
      </p>
    </div>
  );
}

function Disclosure() {
  const [open, setOpen] = useState<number | null>(0);
  const [page, setPage] = useState(1);
  const questions = [
    {
      title: "Material",
      body: "A recessed surface with two edge highlights. The reflection follows the pointer; the center stays dark.",
    },
    {
      title: "Motion",
      body: "Position and opacity transitions use a shared timing curve. Reduced motion removes animation while preserving every control.",
    },
    {
      title: "Responsive layout",
      body: "Three aligned columns on desktop, two on tablet, and a single scrolling column on mobile.",
    },
  ];
  return (
    <div className="disclosure-demo">
      <div className="accordion">
        {questions.map((question, index) => (
          <div className={open === index ? "open" : ""} key={question.title}>
            <h3>
              <button
                id={`accordion-button-${index}`}
                aria-expanded={open === index}
                aria-controls={`accordion-panel-${index}`}
                onClick={() => {
                  setOpen(open === index ? null : index);
                  setPage(index + 1);
                }}
              >
                {question.title}
                <Plus size={14} />
              </button>
            </h3>
            <div
              id={`accordion-panel-${index}`}
              role="region"
              aria-labelledby={`accordion-button-${index}`}
              className="accordion-panel"
              aria-hidden={open !== index}
              inert={open !== index}
            >
              <div>
                <p>{question.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <span>Chapter {page} of 3</span>
        <div>
          <button
            className="icon-button"
            disabled={page === 1}
            aria-label="Previous chapter"
            onClick={() => {
              const previous = Math.max(1, page - 1);
              setPage(previous);
              setOpen(previous - 1);
            }}
          >
            <ChevronLeft size={16} />
          </button>
          {[1, 2, 3].map((value) => (
            <button
              className={`ui-rim ${page === value ? "active" : ""}`}
              aria-label={`Chapter ${value}`}
              aria-current={page === value ? "page" : undefined}
              onClick={() => {
                setPage(value);
                setOpen(value - 1);
              }}
              key={value}
            >
              {value}
            </button>
          ))}
          <button
            className="icon-button"
            disabled={page === 3}
            aria-label="Next chapter"
            onClick={() => {
              const next = Math.min(3, page + 1);
              setPage(next);
              setOpen(next - 1);
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Feedback({ notify }: { notify: (message: string) => void }) {
  const [state, setState] = useState("Ready");
  return (
    <div className="feedback-demo">
      <Segmented
        label="Feedback preview state"
        value={state}
        onChange={setState}
        options={["Ready", "Loading", "Done"].map((value) => ({
          value,
          label: value,
        }))}
      />
      <div
        className={`feedback-preview state-${state.toLowerCase()}`}
        aria-busy={state === "Loading"}
        aria-live="polite"
      >
        {state === "Loading" ? (
          <div className="skeleton-content" aria-label="Loading preview">
            <div />
            <span />
            <span />
          </div>
        ) : (
          <>
            <div className="feedback-asset">
              {state === "Done" ? (
                <Edge className="state-emblem emblem-done">
                  <Check size={31} strokeWidth={1.4} />
                </Edge>
              ) : (
                <Edge className="state-emblem emblem-ready">
                  <ArrowUpRight size={31} strokeWidth={1.2} />
                </Edge>
              )}
            </div>
            <h3>{state === "Done" ? "Changes saved" : "No pending changes"}</h3>
            <p>
              {state === "Done"
                ? "All changes are up to date."
                : "Choose a state to preview the response."}
            </p>
          </>
        )}
      </div>
      <div className="status-chips">
        <span className={state === "Ready" ? "status-current" : ""}>
          <i /> Ready
        </span>
        <span className={state === "Loading" ? "status-current" : ""}>
          <LoaderCircle
            size={10}
            className={state === "Loading" ? "spin" : ""}
          />{" "}
          Processing
        </span>
        <span className={state === "Done" ? "status-current" : ""}>
          <Check size={10} /> Saved
        </span>
      </div>
      <button
        className="notification-preview"
        onClick={() => notify("Changes saved.")}
      >
        <span>
          <Check size={13} />
        </span>
        <div>
          Changes saved<small>Preview notification</small>
        </div>
        <ChevronRight size={13} />
      </button>
    </div>
  );
}

function DialogDemo({
  notify,
  onApply,
}: {
  notify: (message: string) => void;
  onApply: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  return (
    <div className="dialog-demo">
      <div className="dialog-visual">
        <Edge className="dialog-visual-edge">
          <ShieldCheck size={30} strokeWidth={1.1} />
        </Edge>
        <span className="dialog-halo" />
      </div>
      <h3>Confirm an action</h3>
      <p>Review the preset before applying it.</p>
      <Button
        onClick={() => {
          setConfirmed(false);
          setOpen(true);
        }}
      >
        Open dialog <ArrowUpRight size={14} />
      </Button>
      <div className="tooltip-example">
        <span>Confirmation behavior</span>
        <button
          className="icon-button tooltip-target"
          onMouseEnter={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setTooltip(false);
          }}
          onFocus={() => setTooltip(true)}
          onBlur={() => setTooltip(false)}
          onClick={() => setTooltip(true)}
          aria-label="About this dialog"
          aria-describedby={tooltip ? "dialog-tip" : undefined}
        >
          <CircleHelp size={14} />
          {tooltip && (
            <span id="dialog-tip" className="custom-tooltip" role="tooltip">
              Escape closes the dialog without applying changes.
            </span>
          )}
        </button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Material preset">
        <div className="confirm-image">
          <Edge
            className={`state-emblem modal-emblem ${confirmed ? "emblem-done" : ""}`}
          >
            {confirmed ? (
              <Check size={40} strokeWidth={1.3} />
            ) : (
              <ShieldCheck size={40} strokeWidth={1.1} />
            )}
          </Edge>
        </div>
        <p className="confirm-title">
          {confirmed ? "Preset applied." : "Apply Obsidian?"}
        </p>
        <p className="modal-description centered">
          {confirmed
            ? "Edge illumination is 70%. Surface frost is 45%."
            : "This sets edge illumination to 70% and surface frost to 45%."}
        </p>
        <div className="modal-actions">
          {confirmed ? (
            <Button variant="primary" onClick={() => setOpen(false)}>
              Back to the canvas <ArrowRight size={14} />
            </Button>
          ) : (
            <>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={() => {
                  onApply();
                  setConfirmed(true);
                  notify("Obsidian preset applied.");
                }}
              >
                Apply preset <Check size={14} />
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

function Commit({ notify }: { notify: (message: string) => void }) {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [holding, setHolding] = useState(false);
  const frame = useRef<number>(0);
  const finished = useRef(false);
  const start = useRef<number>(0);
  const held = useRef(false);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const begin = () => {
    if (held.current || finished.current) return;
    held.current = true;
    start.current = performance.now();
    setHolding(true);
    const advance = (now: number) => {
      const value = Math.min(100, (now - start.current) / 11);
      setProgress(value);
      if (value >= 100) {
        finished.current = true;
        held.current = false;
        setHolding(false);
        setComplete(true);
        notify("Action confirmed.");
      } else if (held.current) frame.current = requestAnimationFrame(advance);
    };
    frame.current = requestAnimationFrame(advance);
  };
  const release = () => {
    held.current = false;
    setHolding(false);
    cancelAnimationFrame(frame.current);
    if (!finished.current) setProgress(0);
  };
  const reset = () => {
    release();
    finished.current = false;
    setComplete(false);
    setProgress(0);
  };
  return (
    <div className="commit-demo">
      <div
        className={`commit-orbit ${holding ? "holding" : ""} ${complete ? "complete" : ""}`}
      >
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="41" />
          <circle
            className="commit-progress"
            cx="50"
            cy="50"
            r="41"
            strokeDasharray="257.61"
            strokeDashoffset={257.61 * (1 - progress / 100)}
          />
        </svg>
        <span>
          {complete ? (
            <Check size={26} strokeWidth={1.4} />
          ) : (
            <strong className="hold-readout">
              {Math.round(progress)}
              <small>%</small>
            </strong>
          )}
        </span>
      </div>
      <div className="commit-copy" aria-live="polite">
        <h3>
          {complete ? "Confirmed" : holding ? "Keep holding" : "Press and hold"}
        </h3>
        <p>
          {complete
            ? "Release to finish. Reset to try again."
            : "Hold for 1.1 seconds. Release early to cancel."}
        </p>
      </div>
      <Edge className="hold-edge">
        <button
          className="hold-button"
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            begin();
          }}
          onPointerUp={release}
          onPointerCancel={release}
          onLostPointerCapture={release}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              begin();
            }
            if (event.key === "Escape") release();
          }}
          onKeyUp={(event) => {
            if (event.key === " " || event.key === "Enter") release();
          }}
          onBlur={release}
          disabled={complete}
          aria-label={
            complete ? "Action committed" : "Hold for one second to commit"
          }
        >
          <span className="hold-fill" style={{ width: `${progress}%` }} />
          {complete ? <Check size={14} /> : <Fingerprint size={15} />}
          <span>{complete ? "Confirmed" : "Hold to commit"}</span>
          <small>{complete ? "✓" : "1.1s"}</small>
        </button>
      </Edge>
      <button
        className="commit-reset"
        disabled={!complete && progress === 0}
        onClick={reset}
      >
        <RotateCcw size={10} /> Reset
      </button>
    </div>
  );
}
