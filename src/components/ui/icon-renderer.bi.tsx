import * as Bi from "react-icons/bi";
import type { IconType } from "react-icons";

export function BiIconResolver(name: string): IconType | null {
  const Comp = (Bi as unknown as Record<string, unknown>)[name];
  return typeof Comp === "function" ? (Comp as IconType) : null;
}
