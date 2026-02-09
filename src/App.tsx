import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from './lib/theme';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><div>Home</div></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
