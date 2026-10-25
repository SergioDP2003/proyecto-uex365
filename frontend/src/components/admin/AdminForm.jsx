import FormField from "./FormField";

export default function AdminForm({ fields, formData, setFormData, onSubmit, onCancel, submitLabel }) {
  const updateField = (name, value) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      {fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          value={formData[field.name]}
          onChange={updateField}
        />
      ))}

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="submit-btn">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
