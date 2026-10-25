import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminForm from "./AdminForm";

export default function AdminEntityFormPage({ config, mode }) {
  const params = useParams();
  const navigate = useNavigate();
  const id = params[config.idParam || "id"];
  const isEdit = mode === "edit";
  const [formData, setFormData] = useState(config.getInitialFormData(params));
  const [optionData, setOptionData] = useState({});
  const [loading, setLoading] = useState(isEdit || Boolean(config.loadOptions));

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const loadedOptions = config.loadOptions ? await config.loadOptions(params) : {};
      setOptionData(loadedOptions || {});

      if (isEdit) {
        const entity = await config.services.getById(id, params);
        if (entity) setFormData(config.mapEntityToForm(entity, params));
      }

      setLoading(false);
    };
    loadData();
  }, [id, isEdit, config, params]);

  const fields = useMemo(() => config.getFields(optionData, mode), [config, optionData, mode]);
  const cancelPath = config.getCancelPath ? config.getCancelPath(params) : config.routes.list;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = config.mapFormToPayload(formData, params, mode);
    const result = isEdit
      ? await config.services.update(id, payload, params)
      : await config.services.create(payload, params);

    if (result) {
      if (isEdit && config.updateSuccessMessage) alert(config.updateSuccessMessage);
      navigate(cancelPath);
    } else {
      alert(isEdit ? config.updateErrorMessage : config.createErrorMessage);
    }
  };

  if (loading) {
    return <div className="admin-page"><p className="admin-loading">Cargando...</p></div>;
  }

  return (
    <AdminLayout>
      <h1 className="admin-title">{isEdit ? config.editTitle(id, params) : config.createTitle(params)}</h1>
      <AdminForm
        fields={fields}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate(cancelPath)}
        submitLabel={isEdit ? config.updateButtonLabel : config.createButtonLabelForm}
      />
    </AdminLayout>
  );
}
