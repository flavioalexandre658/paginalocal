import * as Md from "react-icons/md";
import type { IconType } from "react-icons";

export function MdIconResolver(name: string): IconType | null {
  const Comp = (Md as unknown as Record<string, unknown>)[name];
  return typeof Comp === "function" ? (Comp as IconType) : null;
}
