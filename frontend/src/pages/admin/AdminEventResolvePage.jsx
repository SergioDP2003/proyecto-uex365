import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { getEventById, resolveEvent } from "../../services/event_services";

export default function AdminEventResolvePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    getEventById(id).then(setEvent);
  }, [id]);

  const handleToggleOption = (optionId) => {
    setSelectedOptions((previous) =>
      previous.includes(optionId)
        ? previous.filter((selectedId) => selectedId !== optionId)
        : [...previous, optionId]
    );
  };

  const handleSave = async () => {
    if (selectedOptions.length === 0) {
      alert("Selecciona al menos una ganadora");
      return;
    }

    if (!window.confirm("¿Confirmar resultados? Esto pagará las apuestas automáticamente.")) return;

    const response = await resolveEvent(id, selectedOptions);
    if (response) {
      alert("Evento resuelto y premios pagados");
      navigate(`/admin/events/${id}/detail/`);
    }
  };

  if (!event) return <p>Cargando...</p>;

  return (
    <AdminLayout>
      <h1>Resolver: {event.name}</h1>
      <p>Selecciona las opciones que han resultado <b>GANADORAS</b>:</p>

      <div className="options-selection-list">
        {event.options.map((option) => (
          <div
            key={option.id}
            className={`option-item ${selectedOptions.includes(option.id) ? "selected" : ""}`}
            onClick={() => handleToggleOption(option.id)}
          >
            <input type="checkbox" checked={selectedOptions.includes(option.id)} readOnly />
            <span>{option.name}</span>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button className="cancel-btn" onClick={() => navigate(-1)}>Cancelar</button>
        <button className="submit-btn" onClick={handleSave}>Finalizar y Pagar</button>
      </div>
    </AdminLayout>
  );
}
