import React from "react"

export function Checkbox({ id, checked, onChange, className, ...props }) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={`checkbox ${className}`}
      {...props}
    />
  )
}

