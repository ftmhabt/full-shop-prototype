"use client";

import Select, { Props as SelectProps } from "react-select";

export function ShadcnSelect<T>(props: SelectProps<T>) {
  return (
    <Select
      {...props}
      theme={(theme) => ({
        ...theme,
        borderRadius: 8,
        colors: {
          ...theme.colors,
          primary: "var(--primary)",
          primary25: "color-mix(in oklch, var(--primary) 5%, transparent)", // hover state
          neutral0: "var(--background)", // menu bg
          neutral20: "var(--border)", // control border
          neutral30: "var(--border)", // hover border
          neutral80: "var(--foreground)", // text color
        },
      })}
      styles={{
        control: (base, state) => ({
          ...base,
          borderRadius: "0.5rem",
          borderColor: state.isFocused
            ? "color-mix(in oklch, var(--primary) 5%, transparent)"
            : "var(--border)",
          boxShadow: state.isFocused
            ? `color-mix(in oklch, var(--primary) 5%, transparent)`
            : "none",
          "&:hover": {
            borderColor: "color-mix(in oklch, var(--primary) 5%, transparent)",
          },
          backgroundColor: "var(--background)",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "var(--background)", // ✅ menu container bg
          borderRadius: "0.75rem",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // optional shadow
        }),
        menuList: (base) => ({
          ...base,
          backgroundColor: "var(--background)", // ✅ menu list bg
          padding: 0,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "color-mix(in oklch, var(--primary) 5%, transparent)"
            : state.isFocused
            ? "color-mix(in oklch, var(--primary) 5%, transparent)"
            : "var(--background)",
          color: state.isSelected
            ? "color-mix(in oklch, var(--foreground) 60%, transparent)"
            : "var(--foreground)",
        }),
      }}
    />
  );
}
