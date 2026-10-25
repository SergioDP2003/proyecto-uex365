import { Routes, Route } from "react-router-dom";
import AvailableEvents from "./pages/events/Eventos_Disponibles";
import EventDetail from "./pages/events/Evento_Disponible_Detalles";
import Cart from "./pages/cart/Carrito";
import Roulette from "./pages/roulette/Roulette";
import LoginView from "./pages/auth/LoginView";
import RegisterView from "./pages/auth/RegisterView";
import HomeView from "./pages/HomeView";
import WelcomeView from "./pages/WelcomeView";
import HomeAdmin from "./pages/admin/HomeAdmin";
import "./App.css";
import { Profile } from "./pages/Profile";
import { Ranking } from "./pages/Ranking";
import ExchangeShop from "./pages/exchange/ExchangeShop";
import AdminRoute from "./pages/auth/AdminRoute";
import HistorialBet from "./pages/Historial_Bet";

import AdminEntityListPage from "./pages/admin/AdminEntityListPage";
import AdminEntityFormPage from "./pages/admin/AdminEntityFormPage";
import AdminEntityDeletePage from "./pages/admin/AdminEntityDeletePage";
import AdminEventDetailPage from "./pages/admin/AdminEventDetailPage";
import AdminEventResolvePage from "./pages/admin/AdminEventResolvePage";

const admin = (element) => <AdminRoute>{element}</AdminRoute>;

function App() {
  return (
    <Routes>
      <Route path="/available_events" element={<AvailableEvents />} />
      <Route path="/available_events/:id" element={<EventDetail />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/" element={<WelcomeView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/home" element={<HomeView />} />
      <Route path="/perfil" element={<Profile />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/roulette" element={<Roulette />} />
      <Route path="/exchange_shop" element={<ExchangeShop />} />
      <Route path="/historial_apuestas" element={<HistorialBet />} />

      <Route path="/admin" element={admin(<HomeAdmin />)} />

      <Route path="/admin/users" element={admin(<AdminEntityListPage entityKey="users" />)} />
      <Route path="/admin/users/create" element={admin(<AdminEntityFormPage entityKey="users" mode="create" />)} />
      <Route path="/admin/users/edit/:id" element={admin(<AdminEntityFormPage entityKey="users" mode="edit" />)} />
      <Route path="/admin/users/delete/:id" element={admin(<AdminEntityDeletePage entityKey="users" />)} />

      <Route path="/admin/categories" element={admin(<AdminEntityListPage entityKey="categories" />)} />
      <Route path="/admin/categories/create" element={admin(<AdminEntityFormPage entityKey="categories" mode="create" />)} />
      <Route path="/admin/categories/edit/:id" element={admin(<AdminEntityFormPage entityKey="categories" mode="edit" />)} />
      <Route path="/admin/categories/delete/:id" element={admin(<AdminEntityDeletePage entityKey="categories" />)} />

      <Route path="/admin/transactions" element={admin(<AdminEntityListPage entityKey="transactions" />)} />
      <Route path="/admin/transactions/create" element={admin(<AdminEntityFormPage entityKey="transactions" mode="create" />)} />
      <Route path="/admin/transactions/edit/:id" element={admin(<AdminEntityFormPage entityKey="transactions" mode="edit" />)} />
      <Route path="/admin/transactions/delete/:id" element={admin(<AdminEntityDeletePage entityKey="transactions" />)} />

      <Route path="/admin/events" element={admin(<AdminEntityListPage entityKey="events" />)} />
      <Route path="/admin/events/create" element={admin(<AdminEntityFormPage entityKey="events" mode="create" />)} />
      <Route path="/admin/events/edit/:id" element={admin(<AdminEntityFormPage entityKey="events" mode="edit" />)} />
      <Route path="/admin/events/delete/:id" element={admin(<AdminEntityDeletePage entityKey="events" />)} />
      <Route path="/admin/events/:id/detail" element={admin(<AdminEventDetailPage />)} />
      <Route path="/admin/events/:id/resolve" element={admin(<AdminEventResolvePage />)} />

      <Route path="/admin/events/:id/options/create" element={admin(<AdminEntityFormPage entityKey="options" mode="create" />)} />
      <Route path="/admin/events/:id/options/edit/:option_id" element={admin(<AdminEntityFormPage entityKey="options" mode="edit" />)} />
      <Route path="/admin/events/:id/options/delete/:option_id" element={admin(<AdminEntityDeletePage entityKey="options" />)} />

      <Route path="/admin/exchange_products" element={admin(<AdminEntityListPage entityKey="exchangeProducts" />)} />
      <Route path="/admin/exchange_products/create" element={admin(<AdminEntityFormPage entityKey="exchangeProducts" mode="create" />)} />
      <Route path="/admin/exchange_products/edit/:id" element={admin(<AdminEntityFormPage entityKey="exchangeProducts" mode="edit" />)} />
      <Route path="/admin/exchange_products/delete/:id" element={admin(<AdminEntityDeletePage entityKey="exchangeProducts" />)} />
    </Routes>
  );
}

export default App;
