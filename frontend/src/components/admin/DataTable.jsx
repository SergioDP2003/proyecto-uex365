import { useState } from "react";
import AdminPageLayout from "./AdminPageLayout";

const DataTable = ({
  title,
  columns,
  data,
  loading,
  searchPlaceholder = "Buscar...",
  onRefresh,
  onNew,
  onEdit,
  onDelete,
  newButtonText = "+ Nuevo",
  searchFields = [],
  renderActions,
  emptyMessage = "No hay datos",
  backTo = "/admin/"
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = data.filter(item =>
    searchFields.some(field =>
      String(item[field] || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <AdminPageLayout>
      <main className="admin-main-content">
        <div className="table-container-header">
          <h1 className="admin-title">{title}</h1>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="back-btn" onClick={() => window.location.href = backTo}>Volver al Panel</button>
            {onRefresh && <button className="refresh-btn" onClick={onRefresh}>Actualizar</button>}
            {onNew && <button className="create-btn" onClick={onNew}>{newButtonText}</button>}
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-table-wrapper">
          {loading ? (
            <p className="loading-text">Cargando...</p>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    {columns.map(col => <th key={col.key}>{col.label}</th>)}
                    {(onEdit || onDelete) && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map(item => (
                      <tr key={item.id}>
                        {columns.map(col => (
                          <td key={col.key} className={col.className || ""}>
                            {col.render ? col.render(item[col.key], item) : item[col.key]}
                          </td>
                        ))}
                        {(onEdit || onDelete) && (
                          <td>
                            <div className="actions-container">
                              {onEdit && <button className="action-btn edit" onClick={() => onEdit(item.id)}>Editar</button>}
                              {onDelete && <button className="action-btn delete" onClick={() => onDelete(item.id)}>Eliminar</button>}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} style={{ textAlign: "center" }}>
                        {emptyMessage}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </main>
    </AdminPageLayout>
  );
};

export default DataTable;