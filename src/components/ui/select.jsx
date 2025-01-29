import React from "react"

export function Select({ options, value, onChange, placeholder, className, ...props }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`select ${className}`} {...props}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

