import AdminListPage from "../../components/admin/AdminListPage";
import { adminEntities } from "../../config/adminEntities";

export default function AdminEntityListPage({ entityKey }) {
  return <AdminListPage config={adminEntities[entityKey]} />;
}
