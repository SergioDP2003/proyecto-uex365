export default function TransactionSection({ entity: transaction, onEdit, onDelete }) {
  return (
    <tr>
      <td>{transaction.id}</td>
      <td className="user-name">{transaction.user_username || transaction.user}</td>
      <td>{transaction.date || transaction.created_at}</td>
      <td><strong>{transaction.amount}</strong></td>
      <td>{transaction.description}</td>
      <td>{transaction.transaction_type?.name || transaction.type || "Manual"}</td>
      <td>
        <div className="actions-container">
          <button className="action-btn edit" onClick={onEdit}>Editar</button>
          <button className="action-btn delete" onClick={onDelete}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}
