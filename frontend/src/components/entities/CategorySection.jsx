export default function CategorySection({ entity: category, onEdit, onDelete }) {
  return (
    <tr>
      <td>{category.id}</td>
      <td className="user-name">{category.name}</td>
      <td>
        <div className="actions-container">
          <button className="action-btn edit" onClick={onEdit}>Editar</button>
          <button className="action-btn delete" onClick={onDelete}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}
