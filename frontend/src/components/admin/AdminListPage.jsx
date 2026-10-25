import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminPageHeader from "./AdminPageHeader";

export default function AdminListPage({ config }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const EntitySection = config.SectionComponent;

  const loadItems = async () => {
    setLoading(true);
    const data = await config.services.getAll();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = items.filter((item) => config.matchesSearch(item, searchTerm));

  return (
    <AdminLayout>
      <AdminPageHeader
        title={config.listTitle}
        actions={
          <>
            <button className="back-btn" onClick={() => navigate("/admin/")}>Volver al Panel</button>
            <button className="refresh-btn" onClick={loadItems}>Actualizar</button>
            <button className="create-btn" onClick={() => navigate(config.routes.create)}>{config.createButtonLabel}</button>
          </>
        }
      />

      <div className="search-bar">
        <input
          type="text"
          placeholder={config.searchPlaceholder}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="admin-table-wrapper">
        {loading ? (
          <p className="loading-text">{config.loadingText}</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {config.columns.map((column) => <th key={column}>{column}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <EntitySection
                  key={item.id}
                  entity={item}
                  onView={config.routes.detail ? () => navigate(config.routes.detail(item.id)) : undefined}
                  onEdit={() => navigate(config.routes.edit(item.id))}
                  onDelete={() => navigate(config.routes.delete(item.id))}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
