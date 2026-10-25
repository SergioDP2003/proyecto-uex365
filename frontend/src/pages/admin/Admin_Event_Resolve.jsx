import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, resolveEvent } from "../../services/event_services";

export default function ResolveEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    getEventById(id).then(setEvent);
  }, [id]);

  const handleToggleOption = (optionId) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(i => i !== optionId) 
        : [...prev, optionId]
    );
  };

  const handleSave = async () => {
    if (selectedOptions.length === 0) return alert("Selecciona al menos una ganadora");
    
    const confirm = window.confirm("¿Confirmar resultados? Esto pagará las apuestas automáticamente.");
    if (confirm) {
      const success = await resolveEvent(id, selectedOptions);
      if (success) {
        alert("Evento resuelto y premios pagados");
        navigate(`/admin/events/${id}/detail/`);
      }
    }
  };

  if (!event) return <p>Cargando...</p>;

  return (
    <div className="admin-page">
      <main className="admin-main-content">
        <h1>Resolver: {event.name}</h1>
        <p>Selecciona las opciones que han resultado <b>GANADORAS</b>:</p>
        
        <div className="options-selection-list">
          {event.options.map(opt => (
            <div 
              key={opt.id} 
              className={`option-item ${selectedOptions.includes(opt.id) ? 'selected' : ''}`}
              onClick={() => handleToggleOption(opt.id)}
            >
              <input 
                type="checkbox" 
                checked={selectedOptions.includes(opt.id)} 
                readOnly 
              />
              <span>{opt.name}</span>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button className="cancel-btn" onClick={() => navigate(-1)}>Cancelar</button>
          <button className="submit-btn" onClick={handleSave}>Finalizar y Pagar</button>
        </div>
      </main>
    </div>
  );
}