import React from "react";

export const Input = React.forwardRef(
  (
    { value, onChange, type, placeholder, id, style, onFocus, disabled },
    ref
  ) => {
    return (
      <input
        className="inputContainer--default"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        type={type}
        placeholder={placeholder}
        style={style}
        id={id}
        ref={ref}
        disabled={disabled}
      />
    );
  }
);
