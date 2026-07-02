function AuthInput({ label, type, name, value, onChange, disabled }) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(name, event.target.value)}
      />
    </label>
  );
}

export default AuthInput;
