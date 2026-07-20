import "./Button.css";

function Button({
  text,
  icon,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  icon2,
}) {
  return (
    <button
      type={type}
      className={`custom-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <i className={icon}></i>}

      <span>{text}</span>
      {icon2 && <i className={icon2}></i>}
    </button>
  );
}

export default Button;
