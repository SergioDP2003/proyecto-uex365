import Header from "./Header";
import Footer from "./Footer";
import "../../styles/Admin.css";

const AdminPageLayout = ({ children }) => (
  <div className="admin-page">
    <Header />
    {children}
    <Footer />
  </div>
);

export default AdminPageLayout;