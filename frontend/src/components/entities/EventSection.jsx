export default function EventSection({ entity: event, onView, onEdit, onDelete }) {
  return (
    <tr>
      <td>{event.id}</td>
      <td className="user-name">{event.name}</td>
      <td>{event.description}</td>
      <td>{event.creation_date}</td>
      <td>{event.closing_date}</td>
      <td>{event.resolution_date}</td>
      <td><span className="state-text">{event.event_category?.name || "Sin categoría"}</span></td>
      <td><span className="state-text">{event.event_state?.name || "Sin estado"}</span></td>
      <td>
        <div className="actions-container">
          <button className="action-btn view" onClick={onView}>Ver</button>
          <button className="action-btn edit" onClick={onEdit}>Editar</button>
          <button className="action-btn delete" onClick={onDelete}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}
