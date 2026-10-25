import Header from "../layout/Header";
import Footer from "../layout/Footer";
import "../../styles/Admin.css";

export default function AdminLayout({ children, contentClassName = "admin-main-content" }) {
  return (
    <div className="admin-page">
      <Header />
      <main className={contentClassName}>{children}</main>
      <Footer />
    </div>
  );
}
