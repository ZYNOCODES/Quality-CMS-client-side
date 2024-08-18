import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import LoginPage from './Pages/LoginPage';
import NavAsideBar from './components/NavAsideBar';
import HomePage from './Pages/HomePage';
import ProductPage from './Pages/ProductPage';
import PannePage from './Pages/PannePage';
import PanneENReparationPage from './Pages/PanneENReparationPage';
import PanneArchivePage from './Pages/PanneArchivePage';
import ReparationPanneDetails from './Pages/ReparationPanneDetails';
import PanneDetailsPage from './Pages/PanneDetailsPage';
import ProductDetailsPage from './Pages/ProductDetailsPage';
import ProfilPage from './Pages/ProfilPage';
import TakeInChargePanne from './Pages/TakeInChargePanne';
import ZonePage from './Pages/ZonePage';
import InventairePage from './Pages/InventairePage';
import UsersPage from './Pages/UsersPage';
import UserDetailsPage from './Pages/UserDetailsPage';
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
                <Route path="profile" element={<ProfilPage />} />    
                <Route path="produits" element={<ProductPage />} />
                <Route path="pannes" element={<PannePage />} />
                <Route path="pannes-en-reparation" element={<PanneENReparationPage />} />
                <Route path="archive-pannes" element={<PanneArchivePage />} />
                <Route path="zones" element={<ZonePage />} />
                <Route path="inventaire" element={<InventairePage />} />
                <Route path="utilisateurs" element={<UsersPage />} />
              </>
            }
            {user && import.meta.env.VITE_AGENT_TYPE === decodedToken.type &&
              <>
                <Route index element={<Navigate to="/pannes"/>} />
                <Route path="profile" element={<ProfilPage />} />    
                <Route path="pannes" element={<PannePage />} />
                <Route path="pannes-en-reparation" element={<PanneENReparationPage />} />
                <Route path="archive-pannes" element={<PanneArchivePage />} />
                <Route path="produits" element={<ProductPage />} />
              </>
            }
            {user && import.meta.env.VITE_TECHNICIAN_TYPE === decodedToken.type &&
              <>
                <Route index element={<Navigate to="/pannes"/>} />
                <Route path="profile" element={<ProfilPage />} />    
                <Route path="pannes" element={<PannePage />} />
                <Route path="pannes-en-reparation" element={<PanneENReparationPage />} />
              </>
            }
            
          </Route>

          {user && import.meta.env.VITE_MANAGER_TYPE === decodedToken.type &&
            <>
              <Route path="utilisateur/:code" element={<UserDetailsPage />} />
            </>      
          }

          {user && import.meta.env.VITE_TECHNICIAN_TYPE === decodedToken.type &&
            <>
              <Route path="panne/reparation/:code" element={<ReparationPanneDetails />} />
              <Route path="panne/prendre/:code" element={<TakeInChargePanne />} />
              <Route path="produit/:code" element={<ProductDetailsPage />} />
              <Route path="panne/:code" element={<PanneDetailsPage />} />    
            </>
          }

          {user && (
            import.meta.env.VITE_AGENT_TYPE === decodedToken.type ||
            import.meta.env.VITE_MANAGER_TYPE === decodedToken.type 
          )&&
            <>
              <Route path="panne/:code" element={<PanneDetailsPage />} />    
              <Route path="produit/:code" element={<ProductDetailsPage />} />
            </>      
          }
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
