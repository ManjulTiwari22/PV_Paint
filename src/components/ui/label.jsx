import React from "react"

export function Label({ children, htmlFor, className, ...props }) {
  return (
    <label htmlFor={htmlFor} className={`label ${className}`} {...props}>
      {children}
    </label>
  )
}

