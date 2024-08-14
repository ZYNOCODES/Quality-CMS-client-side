import './style.css';
import LOGO_IMG from '../../assets/LogoBomareCompany.png';
import { IoMenu } from "react-icons/io5";
import { AiFillProduct } from "react-icons/ai";
import { GiExitDoor } from "react-icons/gi";
import { FaSitemap } from "react-icons/fa";
import { IoTimer } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import CategoryIcon from '@mui/icons-material/Category';
import { TokenDecoder } from "../../util/DecodeToken";

const AsideBar = () => {
    const [active, setActive] = useState(false);
    const { logout } = useLogout();
    const location = useLocation();
    const decodedToken = TokenDecoder();
    //handle active class
    const handleActive = () => {
        setActive(!active);
    }
    //handle logout
    const submitLogout = () => {
        logout();
    }

    return (
        <div className={`AsideBar-container ${active ? 'active' : ''}`}>
            <div className="AsideBar-top">
                <div className="AsideBar-logo">
                    <img src={LOGO_IMG} alt="logo" />
                </div>
                <IoMenu onClick={handleActive} id='menu-btn'/>
            </div>
            <NavLink to='/profil' className={`AsideBar-item ${
                    location.pathname === "/profil" ? "aside-item-active" : ""}`}>
                <div className="AsideBar-user">
                        <div>
                            <FaUserCircle className='user-img'/>
                        </div>
                    <div className="user-infos">
                        <p className='user-name'>Utilisateur</p>
                        <p>Role</p>
                    </div>
                </div>
            </NavLink>
            <ul>
                {import.meta.env.VITE_MANAGER_TYPE === decodedToken.type &&
                    <li>
                        <NavLink to='/' className={`AsideBar-item ${
                        location.pathname === "/" ? "aside-item-active" : ""}`}>
                            <AiFillProduct className='AsideBar-icon'/>
                            <span className='side-item'>Dashboard</span>
                        </NavLink>
                        <span className="tooltip">Dashboard</span>
                    </li>
                }
                {(import.meta.env.VITE_TECHNICIAN_TYPE == decodedToken.type || 
                import.meta.env.VITE_AGENT_TYPE == decodedToken.type) &&
                    <li>
                        <NavLink to='/pannes' className={`AsideBar-item ${
                        location.pathname === "/pannes" ? "aside-item-active" : ""}`}>
                            <IoTimer className='AsideBar-icon'/>
                            <span className='side-item'>Panne</span>
                        </NavLink>
                        <span className="tooltip">Panne</span>
                    </li>
                }
                {(import.meta.env.VITE_MANAGER_TYPE === decodedToken.type || 
                import.meta.env.VITE_AGENT_TYPE === decodedToken.type) &&
                    <li>
                        <NavLink to='/produits' className={`AsideBar-item ${
                        location.pathname === "/produits" ? "aside-item-active" : ""}`}>
                            <FaSitemap className='AsideBar-icon'/>
                            <span className='side-item'>Produit</span>
                        </NavLink>
                        <span className="tooltip">Produit</span>
                    </li>
                }
                {import.meta.env.VITE_MANAGER_TYPE == decodedToken.type &&
                    <li>
                        <NavLink to='/zones' className={`AsideBar-item ${
                        location.pathname === "/zones" ? "aside-item-active" : ""}`}>
                            <CategoryIcon className='AsideBar-icon'/>
                            <span className='side-item'>Zone</span>
                        </NavLink>
                        <span className="tooltip">Zone</span>
                    </li>
                }
                {import.meta.env.VITE_MANAGER_TYPE == decodedToken.type &&
                    <li>
                        <NavLink to='/inventaire' className={`AsideBar-item ${
                        location.pathname === "/inventaire" ? "aside-item-active" : ""}`}>
                            <IoTimer className='AsideBar-icon'/>
                            <span className='side-item'>Inventaire</span>
                        </NavLink>
                        <span className="tooltip">Inventaire</span>
                    </li>
                }
                <li>
                    <NavLink to='/' className="AsideBar-item" onClick={submitLogout}>
                        <GiExitDoor className='AsideBar-icon'/>
                        <span className='side-item'>Déconnecter</span>
                    </NavLink>
                    <span className="tooltip">Déconnecter</span>
                </li>
            </ul>
        </div>
    );
}
export default AsideBar;