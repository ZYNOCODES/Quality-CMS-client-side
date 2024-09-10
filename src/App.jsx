import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import LoginPage from './Pages/LoginPage';
import NavAsideBar from './components/NavAsideBar';
import HomePage from './Pages/HomePage';
import HomePageDisplayer from './Pages/HomePageDisplayer';
import ProductPage from './Pages/ProductPage';
import PannePage from './Pages/PannePage';
import PanneENReparationPage from './Pages/PanneENReparationPage';
import PanneNonLivrePage from './Pages/PanneNonLivrePage';
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
  
  const role = decodedToken?.type;
  const isManager = import.meta.env.VITE_MANAGER_TYPE === role;
  const isAgent = import.meta.env.VITE_AGENT_TYPE === role;
  const isDisplayer = import.meta.env.VITE_DISPLAYER_TYPE === role;

  return (
    <BrowserRouter>
      <main>
        <Routes>
          {user && (isManager || isAgent) && (
            <>
              <Route path="/" element={<NavAsideBar />}>
                {isManager && (
                  <>
                    <Route index element={<HomePage />} />
                    <Route path="profile" element={<ProfilPage />} />
                    <Route path="produits" element={<ProductPage />} />
                    <Route path="pannes" element={<PannePage />} />
                    <Route path="pannes-en-reparation" element={<PanneENReparationPage />} />
                    <Route path="non-livre-pannes" element={<PanneNonLivrePage />} />
                    <Route path="archive-pannes" element={<PanneArchivePage />} />
                    <Route path="zones" element={<ZonePage />} />
                    <Route path="inventaire" element={<InventairePage />} />
                    <Route path="utilisateurs" element={<UsersPage />} />
                  </>
                )}

                {isAgent && (
                  <>
                    <Route index element={<Navigate to="/pannes" />} />
                    <Route path="profile" element={<ProfilPage />} />
                    <Route path="pannes" element={<PannePage />} />
                    <Route path="pannes-en-reparation" element={<PanneENReparationPage />} />
                    <Route path="non-livre-pannes" element={<PanneNonLivrePage />} />
                    <Route path="archive-pannes" element={<PanneArchivePage />} />
                    <Route path="produits" element={<ProductPage />} />
                  </>
                )}
              </Route>
              {isManager &&
                <>
                  <Route path="utilisateur/:code" element={<UserDetailsPage />} />
                </>      
              }
    
              {isAgent &&
                <>
                  <Route path="panne/reparation/:code" element={<ReparationPanneDetails />} />
                  <Route path="panne/prendre/:code" element={<TakeInChargePanne />} />  
                </>
              }
  
          
              <Route path="panne/:code" element={<PanneDetailsPage />} />
              <Route path="produit/:code" element={<ProductDetailsPage />} />
            </>
          )}

          {user && isDisplayer && 
            <Route path="/" element={<HomePageDisplayer />} />
          }

          <Route path="/" element={<LoginPage />} />

          {/* Fallback route for unauthorized access */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
