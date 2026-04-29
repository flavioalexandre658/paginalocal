import * as Tb from "react-icons/tb";
import type { IconType } from "react-icons";

export function TbIconResolver(name: string): IconType | null {
  const Comp = (Tb as unknown as Record<string, unknown>)[name];
  return typeof Comp === "function" ? (Comp as IconType) : null;
}
