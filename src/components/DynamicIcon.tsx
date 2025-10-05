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

export type IconName = keyof typeof ICONS;

interface DynamicIconProps {
  iconName: IconName;
  className?: string;
  size?: number;
}

export function DynamicIcon({ iconName, className, size }: DynamicIconProps) {
  const IconComponent = ICONS[iconName];

  if (!IconComponent) {
    return <Box className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}
