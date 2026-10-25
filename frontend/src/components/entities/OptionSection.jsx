export default function OptionSection({ entity: option, onEdit, onDelete }) {
  return (
    <tr>
      <td>{option.id}</td>
      <td className="user-name">{option.name}</td>
      <td><strong>{option.cuote}</strong></td>
      <td>{option.is_winner ? "✅ Ganadora" : "❌ No Ganadora"}</td>
      <td>
        <div className="actions-container">
          <button className="action-btn edit" onClick={onEdit}>Editar</button>
          <button className="action-btn delete" onClick={onDelete}>Borrar</button>
        </div>
      </td>
    </tr>
  );
}
