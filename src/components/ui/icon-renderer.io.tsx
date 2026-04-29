import * as Io from "react-icons/io5";
import type { IconType } from "react-icons";

export function IoIconResolver(name: string): IconType | null {
  const Comp = (Io as unknown as Record<string, unknown>)[name];
  return typeof Comp === "function" ? (Comp as IconType) : null;
}
