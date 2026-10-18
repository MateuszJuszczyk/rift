import type { ReactNode } from "react";
import { ControlStudy, controlStudies } from "./controls";
import { DataStudy, dataStudies } from "./data";
import { FeedbackStudy, feedbackStudies } from "./feedback";
import { NavigationStudy, navigationStudies } from "./navigation";

export type LibraryNotify = (message: string) => void;

type Renderer = (props: { id: string; notify: LibraryNotify }) => ReactNode;

/** Every specimen the library adds to the canvas, in render order. */
export const libraryStudies = [
  ...controlStudies,
  ...navigationStudies,
  ...dataStudies,
  ...feedbackStudies,
];

const registry: Record<string, Renderer> = {};

function register(
  studies: readonly { id: string }[],
  render: Renderer,
): void {
  for (const study of studies) registry[study.id] = render;
}

register(controlStudies, ControlStudy);
register(navigationStudies, NavigationStudy);
register(dataStudies, DataStudy);
register(feedbackStudies, FeedbackStudy);

export function LibraryStudy({
  id,
  notify,
}: {
  id: string;
  notify: LibraryNotify;
}) {
  const Render = registry[id];
  return Render ? <Render id={id} notify={notify} /> : null;
}
