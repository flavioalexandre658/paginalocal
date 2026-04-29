import * as Hi from "react-icons/hi2";
import type { IconType } from "react-icons";

export function HiIconResolver(name: string): IconType | null {
  const Comp = (Hi as unknown as Record<string, unknown>)[name];
  return typeof Comp === "function" ? (Comp as IconType) : null;
}
