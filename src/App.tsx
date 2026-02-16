import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from './lib/theme';
import { AuthProvider } from './hooks/AuthContext';
import { Login } from './pages/Login';
import { ManagerHome } from './pages/ManagerHome';
import { ContractorHome } from './pages/ContractorHome';
import { AdminEntry } from './pages/AdminEntry';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Header } from './components/Header';
import { AppLayout } from './components/AppLayout';
import { PersonaRedirect } from './components/PersonaRedirect';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminEntry />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <PersonaRedirect />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ManagerHome />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contractor"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ContractorHome />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AdminDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
