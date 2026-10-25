export default function AdminPageHeader({ title, actions }) {
  return (
    <div className="table-container-header">
      <h1 className="admin-title">{title}</h1>
      {actions && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {actions}
        </div>
      )}
    </div>
  );
}
