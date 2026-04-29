import * as Fa from "react-icons/fa";
import type { IconType } from "react-icons";

export function FaIconResolver(name: string): IconType | null {
  const Comp = (Fa as unknown as Record<string, unknown>)[name];
  return typeof Comp === "function" ? (Comp as IconType) : null;
}
