export const Input = ({
  value,
  onChange,
  type,
  placeholder,
  id,
  style,
  refEl,
  onFocus,
  disabled,
}) => {
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
      ref={refEl}
      disabled={disabled}
    />
  );
};
