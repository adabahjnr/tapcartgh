import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./lib/auth-context";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import { AdabahWidget } from "./components/adabah/AdabahWidget";
import {
  HomePage,
  HostelsPage,
  HostelDetailPage,
  AuthPage,
  FavoritesPage,
  NewRequestPage,
  MyRequestsPage,
  CommunityPage,
  FeedbackPage,
  AboutPage,
  OwnerLayout,
  OwnerHostelsPage,
  OwnerHostelFormPage,
  AdminLayout,
  AdminIndexPage,
  AdminHostelsPage,
  AdminReviewsPage,
  AdminRequestsPage,
  AdminCommunityPage,
  AdminFeedbackPage,
  AdminOwnersPage,
  AdminUsersPage,
  AdminAppearancePage,
  AdminWaitlistPage,
  WaitlistGate,
  ProfilePage,
  NotFoundPage,
} from "./pages";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Toaster richColors position="top-center" />
        <AdabahWidget />
        <WaitlistGate>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hostels" element={<HostelsPage />} />
            <Route path="/hostels/:id" element={<HostelDetailPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/auth" element={<AuthPage />} />

            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><MyRequestsPage /></ProtectedRoute>} />
            <Route path="/requests/new" element={<ProtectedRoute><NewRequestPage /></ProtectedRoute>} />

            <Route path="/owner" element={<OwnerLayout />}>
              <Route index element={<OwnerHostelsPage />} />
              <Route path="new" element={<OwnerHostelFormPage />} />
              <Route path=":id/edit" element={<OwnerHostelFormPage />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminIndexPage />} />
              <Route path="owners" element={<AdminOwnersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="hostels" element={<AdminHostelsPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="requests" element={<AdminRequestsPage />} />
              <Route path="community" element={<AdminCommunityPage />} />
              <Route path="feedback" element={<AdminFeedbackPage />} />
              <Route path="appearance" element={<AdminAppearancePage />} />
              <Route path="waitlist" element={<AdminWaitlistPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </WaitlistGate>
      </AuthProvider>
    </BrowserRouter>
  );
}
