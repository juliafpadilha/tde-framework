import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Lista from './pages/Lista';
import Contato from './pages/Contato';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Upload from './pages/Upload';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="sobre" element={<Sobre />} />
            <Route path="lista" element={<Lista />} />
            <Route path="upload" element={<Upload />} />
            <Route path="contato" element={<Contato />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
