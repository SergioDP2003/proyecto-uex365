import AdminDeletePage from "../../components/admin/AdminDeletePage";
import { adminEntities } from "../../config/adminEntities";

export default function AdminEntityDeletePage({ entityKey }) {
  return <AdminDeletePage config={adminEntities[entityKey]} />;
}
