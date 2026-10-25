export default function UserSection({ entity: user, onEdit, onDelete }) {
  return (
    <tr>
      <td>{user.id}</td>
      <td className="user-name">{user.username}</td>
      <td>{user.email}</td>
      <td>{user.balance}</td>
      <td>
        <span className={`badge ${user.is_staff ? "is-staff" : "is-user"}`}>
          {user.is_staff ? "Admin" : "Usuario"}
        </span>
      </td>
      <td><span className="state-text">{user.user_state_name || "Sin estado"}</span></td>
      <td>
        <div className="actions-container">
          <button className="action-btn edit" onClick={onEdit}>Editar</button>
          <button className="action-btn delete" onClick={onDelete}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}
