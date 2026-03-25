"use client";

import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  tokens: DesignTokens;
}

export function SectionPattern({ tokens }: Props) {
  switch (tokens.style) {
    case "industrial":
      return (
        <>
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%22.85%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22/%3E%3C/svg%3E')]" />
        </>
      );

    case "elegant":
      return (
        <>
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-[0.08]"
            style={{ backgroundColor: tokens.palette.accent }}
          />
        </>
      );

    case "warm":
      return (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.015]"
          preserveAspectRatio="none"
        >
          <circle cx="20%" cy="30%" r="200" fill="white" />
          <circle cx="80%" cy="70%" r="150" fill="white" />
          <circle cx="60%" cy="20%" r="100" fill="white" />
        </svg>
      );

    case "bold":
      return (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)",
          }}
        />
      );

    default:
      return null;
  }
}
