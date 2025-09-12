"use client";

import {
  Bell,
  Box,
  Cable,
  Camera,
  Home,
  Key,
  Lock,
  Shield,
  ShoppingCart,
  Siren,
  User,
  Wifi,
} from "lucide-react";

// Only 12 icons
export const ICONS = {
  Siren,
  Camera,
  Cable,
  Lock,
  Shield,
  Box,
  User,
  ShoppingCart,
  Home,
  Key,
  Bell,
  Wifi,
} as const;

type IconName = keyof typeof ICONS;

export default function IconPicker({
  value,
  onChange,
}: {
  value: IconName;
  onChange: (v: IconName) => void;
}) {
  const iconNames = Object.keys(ICONS) as IconName[];

  return (
    <div className="grid grid-cols-6 gap-2 p-2 border rounded max-h-64 overflow-auto">
      {iconNames.map((name) => {
        const Icon = ICONS[name];
        return (
          <button
            key={name}
            className={`p-2 border rounded ${
              value === name ? "bg-primary/20" : ""
            }`}
            onClick={() => onChange(name)}
            title={name}
          >
            <Icon className="h-6 w-6" />
          </button>
        );
      })}
    </div>
  );
}
