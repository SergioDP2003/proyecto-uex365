import AdminEntityForm from "../../components/admin/AdminEntityFormPage";
import { adminEntities } from "../../config/adminEntities";

export default function AdminEntityFormPage({ entityKey, mode }) {
  return <AdminEntityForm config={adminEntities[entityKey]} mode={mode} />;
}
