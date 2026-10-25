export default function FormField({ field, value, onChange }) {
  const commonProps = {
    id: field.name,
    name: field.name,
    required: field.required,
    value: value ?? "",
    onChange: (event) => onChange(field.name, event.target.value),
    placeholder: field.placeholder || ""
  };

  if (field.type === "textarea") {
    return (
      <div className="form-group">
        <label htmlFor={field.name}>{field.label}</label>
        <textarea rows={field.rows || 4} {...commonProps} />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="form-group">
        <label htmlFor={field.name}>{field.label}</label>
        <select {...commonProps}>
          {field.placeholder && <option value="">{field.placeholder}</option>}
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div className="form-group checkbox-group">
        <label className="admin-checkbox-label">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(field.name, event.target.checked)}
          />
          {field.label}
        </label>
      </div>
    );
  }

  return (
    <div className="form-group">
      <label htmlFor={field.name}>{field.label}</label>
      <input type={field.type || "text"} step={field.step} {...commonProps} />
    </div>
  );
}
