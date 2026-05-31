import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  AdminAnalyticsPage,
  AdminIndexPage,
  AdminLayout,
  AdminNotificationsPage,
  AdminSettingsPage,
  AdminStoresPage,
  AdminUsersPage,
  AuthPage,
  ContactPage,
  ExamplesPage,
  FeaturesPage,
  FaqPage,
  HomePage,
  HowItWorksPage,
  DashboardAnalyticsPage,
  DashboardIndexPage,
  DashboardLayout,
  DashboardOrdersPage,
  DashboardProductsPage,
  DashboardSettingsPage,
  DashboardStorePage,
  NotFoundPage,
  PublicStorePage,
} from "./pages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/examples" element={<ExamplesPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardIndexPage />} />
          <Route path="store" element={<DashboardStorePage />} />
          <Route path="products" element={<DashboardProductsPage />} />
          <Route path="orders" element={<DashboardOrdersPage />} />
          <Route path="analytics" element={<DashboardAnalyticsPage />} />
          <Route path="settings" element={<DashboardSettingsPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminIndexPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="stores" element={<AdminStoresPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="/s/:username" element={<PublicStorePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
