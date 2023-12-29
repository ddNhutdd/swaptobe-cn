const getButtonClasses = (type) => {
  switch (type) {
    case "outline":
      return "buttonContainer--primary";

    case "transparent":
      return "buttonContainer--transparent";

    default:
      return "buttonContainer--primary";
  }
};

/**
 *
 * @param {type}: primary, outline,
 * @returns
 */
export const Button = ({
  onClick,
  id,
  style,
  children,
  name,
  type = "primary",
}) => {
  let typeClassesDefault = getButtonClasses(type);

  return (
    <button
      id={id}
      className={typeClassesDefault}
      style={style}
      onClick={onClick}
      name={name}
    >
      {children}
    </button>
  );
};
