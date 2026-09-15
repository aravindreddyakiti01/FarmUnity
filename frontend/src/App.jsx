import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { TranslationProvider } from './hooks/useTranslation';
import { Layout } from './components/layout/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { CreateListingPage } from './pages/farmer/CreateListingPage';
import { FarmerNegotiationPage } from './pages/farmer/FarmerNegotiationPage';

import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { CreateRequirementPage } from './pages/buyer/CreateRequirementPage';
import { BatchPresentationPage } from './pages/buyer/BatchPresentationPage';
import { DeliveryConfirmationPage } from './pages/buyer/DeliveryConfirmationPage';

import { CoordinatorDashboard } from './pages/coordinator/CoordinatorDashboard';
import { VerificationPage } from './pages/coordinator/VerificationPage';
import { BatchFormationPage } from './pages/coordinator/BatchFormationPage';
import { PickupPage } from './pages/coordinator/PickupPage';
import { MillingPage } from './pages/coordinator/MillingPage';

import { FarmerOpportunitiesPage } from './pages/farmer/FarmerOpportunitiesPage';
import { FarmerOrdersPage } from './pages/farmer/FarmerOrdersPage';
import { AgreementPage } from './pages/shared/AgreementPage';
import { CommitmentLedgerPage } from './pages/shared/CommitmentLedgerPage';
import { SettlementDashboard } from './pages/shared/SettlementDashboard';
import { AuditLogPage } from './pages/shared/AuditLogPage';
import { NotFoundPage } from './pages/shared/NotFoundPage';
import { TechMethodsPage } from './pages/shared/TechMethodsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TranslationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />

              {/* Farmer Routes */}
              <Route
                path="farmer"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farmer/listings"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farmer/listings/new"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <CreateListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farmer/opportunities"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <FarmerOpportunitiesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farmer/orders"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <FarmerOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farmer/payments"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <FarmerOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farmer/negotiate/:agreementId"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <FarmerNegotiationPage />
                  </ProtectedRoute>
                }
              />

              {/* Buyer Routes */}
              <Route
                path="buyer"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="buyer/requirements"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="buyer/cooperatives"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="buyer/orders"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="buyer/requirements/new"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <CreateRequirementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="buyer/batches/:batchId"
                element={
                  <ProtectedRoute allowedRoles={['BUYER', 'COORDINATOR']}>
                    <BatchPresentationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="buyer/delivery/:agreementId"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <DeliveryConfirmationPage />
                  </ProtectedRoute>
                }
              />

              {/* Coordinator Routes */}
              <Route
                path="coordinator"
                element={
                  <ProtectedRoute allowedRoles={['COORDINATOR']}>
                    <CoordinatorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="coordinator/batches"
                element={
                  <ProtectedRoute allowedRoles={['COORDINATOR']}>
                    <CoordinatorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="coordinator/exceptions"
                element={
                  <ProtectedRoute allowedRoles={['COORDINATOR']}>
                    <CoordinatorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="coordinator/verify"
                element={
                  <ProtectedRoute allowedRoles={['COORDINATOR']}>
                    <VerificationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="coordinator/batches/form"
                element={
                  <ProtectedRoute allowedRoles={['COORDINATOR']}>
                    <BatchFormationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="coordinator/pickup/:batchId"
                element={
                  <ProtectedRoute allowedRoles={['COORDINATOR']}>
                    <PickupPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="coordinator/milling"
                element={
                  <ProtectedRoute allowedRoles={['COORDINATOR']}>
                    <MillingPage />
                  </ProtectedRoute>
                }
              />

              {/* Shared Protected / Public-Readable Modules */}
              <Route path="agreements/:id" element={<AgreementPage />} />
              <Route path="commitments/:id" element={<CommitmentLedgerPage />} />
              <Route path="settlements/:agreementId" element={<SettlementDashboard />} />
              <Route path="audit/:agreementId" element={<AuditLogPage />} />
              <Route path="methods" element={<TechMethodsPage />} />

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </TranslationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
