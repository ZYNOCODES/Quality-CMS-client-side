import './style.css';
import LOGO_IMG from '../../assets/LogoBomareCompany.png';
import { IoMenu } from "react-icons/io5";
import { GiExitDoor } from "react-icons/gi";
import { useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { TokenDecoder } from "../../util/DecodeToken";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import DnsIcon from '@mui/icons-material/Dns';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';

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
            <NavLink to='/profile' className={`AsideBar-item ${
                    location.pathname === "/profile" ? "aside-item-active" : ""}`}>
                <div className="AsideBar-user">
                        <div>
                            <FaUserCircle className='user-img'/>
                        </div>
                    <div className="user-infos">
                        <p className='user-name'>Profile</p>
                        <p className='user-subname'>{decodedToken.type}</p>
                    </div>
                </div>
            </NavLink>
            <ul>
                {import.meta.env.VITE_MANAGER_TYPE === decodedToken.type &&
                    <li>
                        <NavLink to='/' className={`AsideBar-item ${
                        location.pathname === "/" ? "aside-item-active" : ""}`}>
                            <SpaceDashboardIcon className='AsideBar-icon'/>
                            <span className='side-item'>Dashboard</span>
                        </NavLink>
                    </li>
                }
                {(import.meta.env.VITE_MANAGER_TYPE == decodedToken.type || 
                import.meta.env.VITE_AGENT_TYPE == decodedToken.type) &&
                    <>
                        <li>
                            <NavLink to='/pannes' className={`AsideBar-item ${
                            location.pathname === "/pannes" ? "aside-item-active" : ""}`}>
                                <DnsIcon className='AsideBar-icon'/>
                                <span className='side-item'>Panne</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/pannes-en-reparation' className={`AsideBar-item ${
                            location.pathname === "/pannes-en-reparation" ? "aside-item-active" : ""}`}>
                                <AutoModeIcon className='AsideBar-icon'/>
                                <span className='side-item'>Reparation</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/non-restitue-pannes' className={`AsideBar-item ${
                            location.pathname === "/non-restitue-pannes" ? "aside-item-active" : ""}`}>
                                <AssignmentReturnIcon className='AsideBar-icon'/>
                                <span className='side-item'>Non restitué</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/archive-pannes' className={`AsideBar-item ${
                            location.pathname === "/archive-pannes" ? "aside-item-active" : ""}`}>
                                <Inventory2Icon className='AsideBar-icon'/>
                                <span className='side-item'>Restitué</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/produits' className={`AsideBar-item ${
                            location.pathname === "/produits" ? "aside-item-active" : ""}`}>
                                <CategoryIcon className='AsideBar-icon'/>
                                <span className='side-item'>Produit</span>
                            </NavLink>
                        </li>
                    </>
                }
                {import.meta.env.VITE_MANAGER_TYPE == decodedToken.type &&
                    <>
                        <li>
                            <NavLink to='/zones' className={`AsideBar-item ${
                            location.pathname === "/zones" ? "aside-item-active" : ""}`}>
                                <HomeWorkIcon className='AsideBar-icon'/>
                                <span className='side-item'>Zone</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/inventaire' className={`AsideBar-item ${
                            location.pathname === "/inventaire" ? "aside-item-active" : ""}`}>
                                <PrecisionManufacturingIcon className='AsideBar-icon'/>
                                <span className='side-item'>Inventaire</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/utilisateurs' className={`AsideBar-item ${
                            location.pathname === "/utilisateurs" ? "aside-item-active" : ""}`}>
                                <SupervisedUserCircleIcon className='AsideBar-icon'/>
                                <span className='side-item'>Utilisateurs</span>
                            </NavLink>
                        </li>
                    </>
                }
                <li>
                    <NavLink to='/' className="AsideBar-item" onClick={submitLogout}>
                        <GiExitDoor className='AsideBar-icon'/>
                        <span className='side-item'>Déconnecter</span>
                    </NavLink>
                    {/* <span className="tooltip">Déconnecter</span> */}
                </li>
            </ul>
        </div>
    );
}
export default AsideBar;