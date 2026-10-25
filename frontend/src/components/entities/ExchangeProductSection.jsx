export default function ExchangeProductSection({ entity: product, onEdit, onDelete }) {
  return (
    <tr>
      <td>{product.id}</td>
      <td className="user-name">{product.name}</td>
      <td>{product.description}</td>
      <td><strong>{product.price}</strong></td>
      <td>
        <span className={`badge ${product.is_active ? "is-staff" : "is-user"}`}>
          {product.is_active ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td>
        <div className="actions-container">
          <button className="action-btn edit" onClick={onEdit}>Editar</button>
          <button className="action-btn delete" onClick={onDelete}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}
