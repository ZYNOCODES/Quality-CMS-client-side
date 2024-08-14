import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import LoginPage from './Pages/LoginPage';
import NavAsideBar from './components/NavAsideBar';
import HomePage from './Pages/HomePage';
import ProductPage from './Pages/ProductPage';
import PannePage from './Pages/PannePage';
import { TokenDecoder } from "./util/DecodeToken";

function App() {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();

  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={user ? <NavAsideBar /> : <LoginPage />} >
            {user && import.meta.env.VITE_MANAGER_TYPE === decodedToken.type &&
              <>
                <Route index element={<HomePage />} />
                <Route path="profil" element={<HomePage />} />
                <Route path="produits" element={<ProductPage />} />
                <Route path="zones" element={<HomePage />} />
                <Route path="inventaire" element={<HomePage />} />
              </>
            }
            {user && import.meta.env.VITE_AGENT_TYPE === decodedToken.type &&
              <>
                <Route index element={<Navigate to="/pannes"/>} />
                <Route path="pannes" element={<PannePage />} />
                <Route path="produits" element={<ProductPage />} />
              </>
            }
            {user && import.meta.env.VITE_TECHNICIAN_TYPE === decodedToken.type &&
              <>
                <Route index element={<Navigate to="/pannes"/>} />
                <Route path="pannes" element={<PannePage />} />
              </>
            }
            
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
