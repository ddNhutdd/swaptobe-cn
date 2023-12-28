export const Input = ({
  value,
  onChange,
  type,
  placeholder,
  id,
  style,
  refEl,
}) => {
  return (
    <input
      className="inputContainer--default"
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      style={style}
      id={id}
      ref={refEl}
    />
  );
};
