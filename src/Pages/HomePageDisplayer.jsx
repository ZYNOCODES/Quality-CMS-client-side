import './css/HomePageDisplayerStyle.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';
import { TokenDecoder } from '../util/DecodeToken';
import LOGO_IMG from '../assets/LogoBomareCompany.png';
import { NavLink } from "react-router-dom";
import { GiExitDoor } from "react-icons/gi";
import { useLogout } from '../hooks/useLogout';

const HomePage = () => {
    const { user } = useAuthContext();
    const decodedToken = TokenDecoder();
    const { logout } = useLogout();
    //handle logout
    const submitLogout = () => {
        logout();
    }

    //count all pannes API
    const CountAllPannes = async () => {
        try{
            const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/dashboard/byzone/${decodedToken.zone}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );
            

            // Handle the error state
            if (!response.ok) {
                const errorData = await response.json();
                if(errorData.error.statusCode == 404)
                    return [];
                else
                    throw new Error("Erreur lors de la comptage des pannes");
            }
            // Return the data
            return await response.json();
        }catch(error){
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: CountAllPannesData, 
        error: CountAllPanneserror, 
        isLoading: isCountAllPannesLoading, 
        refetch: CountAllPannesrefetch } = useQuery({
        queryKey: ['CountAllPannesData', user?.token],
        queryFn: CountAllPannes,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });

    //count all pannes API
    const CountAllPannesByDay = async () => {
        try{
            const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/dashboard/count/today/${decodedToken.zone}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );
            
            // Handle the error state
            if (!response.ok) {
                const errorData = await response.json();
                if(errorData.error.statusCode == 404)
                    return [];
                else
                    throw new Error("Erreur lors de la comptage des pannes");
            }
            // Return the data
            return await response.json();
        }catch(error){
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: CountAllPannesByDayByDay, 
        error: CountAllPannesByDayerror, 
        isLoading: isCountAllPannesByDayLoading, 
        refetch: CountAllPannesByDayrefetch } = useQuery({
        queryKey: ['CountAllPannesByDay', user?.token],
        queryFn: CountAllPannesByDay,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });

    return (
        <div className="dashboard-displayer-container">
            <NavLink to='/' className="dashboard-displayer-container-logout" onClick={submitLogout}>
                <GiExitDoor className='dashboard-displayer-container-logout-icon'/>
            </NavLink>
            <div className="dashboard-displayer-container-card-content">
                <div className='logo-container'>
                    <img className='logo' src={LOGO_IMG} alt="Stream logo" />
                </div>
                <h2 className='title'>Qualité système de réparation</h2>
                <div className="dashboard-displayer-container-card-content">
                    <h1>journalier</h1>
                    <div className="top-bar-dashboard-displayer-container">
                        <div className="top-bar-dashboard-displayer-card">
                            {isCountAllPannesByDayLoading ? 
                                <>
                                    <div className="CircularProgress-container">
                                        <CircularProgress className='CircularProgress' />
                                    </div>
                                </>
                            :   (CountAllPannesByDayerror ? 
                                    <>
                                        <h1>Aucune donnée disponible</h1>
                                    </>
                                :
                                <>
                                    <h1>En attente de réparation</h1>
                                    <p>{CountAllPannesByDayByDay?.EnAttente}</p>
                                </>
                                )
                            }
                            
                        </div>
                        <div className="top-bar-dashboard-displayer-card">
                            {isCountAllPannesByDayLoading ? 
                                <>
                                    <div className="CircularProgress-container">
                                        <CircularProgress className='CircularProgress' />
                                    </div>
                                </>
                            :   (CountAllPannesByDayerror ? 
                                    <>
                                        <h1>Aucune donnée disponible</h1>
                                    </>
                                :
                                    <>
                                        <h1>En cours de réparation</h1>
                                        <p>{CountAllPannesByDayByDay?.EnReparation}</p>
                                    </>
                                )
                            }
                        </div>
                        <div className="top-bar-dashboard-displayer-card">
                            {isCountAllPannesByDayLoading ? 
                                <>
                                    <div className="CircularProgress-container">
                                        <CircularProgress className='CircularProgress' />
                                    </div>
                                </>
                            :   (CountAllPannesByDayerror ? 
                                    <>
                                        <h1>Aucune donnée disponible</h1>
                                    </>
                                :
                                    <>
                                        <h1>Réparé non restitué</h1>
                                        <p>{CountAllPannesByDayByDay?.NoneDelivredrepare}</p>
                                    </>
                                )
                            }
                        </div>
                        <div className="top-bar-dashboard-displayer-card">
                            {isCountAllPannesByDayLoading ? 
                                <>
                                    <div className="CircularProgress-container">
                                        <CircularProgress className='CircularProgress' />
                                    </div>
                                </>
                            :   (CountAllPannesByDayerror ? 
                                    <>
                                        <h1>Aucune donnée disponible</h1>
                                    </>
                                :
                                    <>
                                        <h1>Réparé  restitué</h1>
                                        <p>{CountAllPannesByDayByDay?.Delivredrepare}</p>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="dashboard-displayer-container-card-content">
                <div className="top-bar-dashboard-displayer-container">
                    <div className="top-bar-dashboard-displayer-card-total">
                        {isCountAllPannesLoading ? 
                            <>
                                <div className="CircularProgress-container">
                                    <CircularProgress className='CircularProgress' />
                                </div>
                            </>
                        :   (CountAllPanneserror ? 
                                <>
                                    <h1>Aucune donnée disponible</h1>
                                </>
                            :
                            <>
                                <h1>En attente de réparation</h1>
                                <p>{CountAllPannesData?.EnAttente}</p>
                            </>
                            )
                        }
                        
                    </div>
                    <div className="top-bar-dashboard-displayer-card-total">
                        {isCountAllPannesLoading ? 
                            <>
                                <div className="CircularProgress-container">
                                    <CircularProgress className='CircularProgress' />
                                </div>
                            </>
                        :   (CountAllPanneserror ? 
                                <>
                                    <h1>Aucune donnée disponible</h1>
                                </>
                            :
                                <>
                                    <h1>En cours de réparation</h1>
                                    <p>{CountAllPannesData?.EnReparation}</p>
                                </>
                            )
                        }
                    </div>
                    <div className="top-bar-dashboard-displayer-card-total">
                        {isCountAllPannesLoading ? 
                            <>
                                <div className="CircularProgress-container">
                                    <CircularProgress className='CircularProgress' />
                                </div>
                            </>
                        :   (CountAllPanneserror ? 
                                <>
                                    <h1>Aucune donnée disponible</h1>
                                </>
                            :
                                <>
                                    <h1>Réparé non restitué</h1>
                                    <p>{CountAllPannesData?.NoneDelivredrepare}</p>
                                </>
                            )
                        }
                    </div>
                    <div className="top-bar-dashboard-displayer-card-total">
                        {isCountAllPannesLoading ? 
                            <>
                                <div className="CircularProgress-container">
                                    <CircularProgress className='CircularProgress' />
                                </div>
                            </>
                        :   (CountAllPanneserror ? 
                                <>
                                    <h1>Aucune donnée disponible</h1>
                                </>
                            :
                                <>
                                    <h1>Réparé  restitué</h1>
                                    <p>{CountAllPannesData?.Delivredrepare}</p>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
            
        </div>
    );
}
export default HomePage;