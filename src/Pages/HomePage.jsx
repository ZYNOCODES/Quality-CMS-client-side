import './css/HomePageStyle.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useQuery } from '@tanstack/react-query';
import DashboardCalendar from '../components/DashboardCalendar';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { convertSecondsToTimeString } from '../util/UseFullFunctions';

const HomePage = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null,
    }); 
    const chartSetting = {
        yAxis: [
          {
            label: '',
          },
        ],
        sx: {
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
          },
        },
    };
    const valueFormatter = (value) => `${value}`;
    
    //count all pannes API
    const CountAllPannes = async () => {
        try{
            let response;
            if(dateRange.startDate != null && dateRange.endDate != null){
                response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/dashboard/count/?start=${dateRange.startDate}&end=${dateRange.endDate}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
            }else{
                response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/dashboard`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
            }
            

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
    const { data: CountAllPannesData, error: CountAllPanneserror, isLoading: isCountAllPannesLoading, refetch: CountAllPannesrefetch } = useQuery({
        queryKey: ['CountAllPannesData', user?.token],
        queryFn: CountAllPannes,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    //count all pannes by month API
    const CountAllPannesMonth = async () => {
        try{
            const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/dashboard/month`,
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
                    throw new Error("Erreur lors de la comptage des pannes by month");
            }
            // Return the data
            return await response.json();
        }catch(error){
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: CountAllPannesMonthData, error: CountAllPannesMontherror, isLoading: isCountAllPannesMonthLoading, refetch: CountAllPannesMonthrefetch } = useQuery({
        queryKey: ['CountAllPannesMonthData', user?.token],
        queryFn: CountAllPannesMonth,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: false, // Optional: prevent refetching on window focus
    });
    //count top 5 Technician corrective
    const CountTop5Technician = async () => {
        try{
            const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/dashboard/top/technician`,
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
                    throw new Error("Erreur lors de la comptage des top technician");
            }
            // Return the data
            return await response.json();
        }catch(error){
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: Top5TechnicianData, error: Top5Technicianerror, isLoading: isTop5TechnicianLoading, refetch: Top5Technicianrefetch } = useQuery({
        queryKey: ['Top5TechnicianData', user?.token],
        queryFn: CountTop5Technician,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: false, // Optional: prevent refetching on window focus
    });
    //count top 4 pannes
    const CountTop4Pannes = async () => {
        try{
            const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/dashboard/top/panne`,
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
                    throw new Error("Erreur lors de la comptage des top pannes");
            }
            // Return the data
            return await response.json();
        }catch(error){
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: Top4PannesData, error: Top4Panneserror, isLoading: isTop4PannesLoading, refetch: Top4Pannesrefetch } = useQuery({
        queryKey: ['Top4PannesData', user?.token],
        queryFn: CountTop4Pannes,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: false, // Optional: prevent refetching on window focus
    });
    //count top 4 action corrective
    const CountTop4Action = async () => {
        try{
            const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/dashboard/top/action`,
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
                    throw new Error("Erreur lors de la comptage des top action");
            }
            // Return the data
            return await response.json();
        }catch(error){
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: Top4ActionData, error: Top4Actionerror, isLoading: isTop4ActionLoading, refetch: Top4Actionrefetch } = useQuery({
        queryKey: ['Top4ActionData', user?.token],
        queryFn: CountTop4Action,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: false, // Optional: prevent refetching on window focus
    });
    //count top 4 consommation PDR
    const CountTop4Consommation = async () => {
        try{
            const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/dashboard/top/consommation`,
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
                    throw new Error("Erreur lors de la comptage des top action");
            }
            // Return the data
            return await response.json();
        }catch(error){
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: Top4ConsommationData, error: Top4Consommationerror, isLoading: isTop4ConsommationLoading, refetch: Top4Consommationrefetch } = useQuery({
        queryKey: ['Top4ConsommationData', user?.token],
        queryFn: CountTop4Consommation,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: false, // Optional: prevent refetching on window focus
    });
    // useEffect to refetch data when the date range changes
    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            CountAllPannesrefetch();
        } else if (dateRange.startDate == null && dateRange.endDate == null) {
            CountAllPannesrefetch();
        }
    }, [dateRange]);

    return (
        <div className="dashboar-container">
            <div className="nav-bar-dashboard-conainer">
                <DashboardCalendar
                    onDateChange={(start, end) =>
                        setDateRange({ startDate: start, endDate: end })
                    }
                    refetch={CountAllPannesrefetch}
                />
            </div>
            <div className="top-bar-dashboard-container">
                <div className="top-bar-dashboard-card">
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
                            <h1>En attente</h1>
                            <p>{CountAllPannesData?.EnAttente}</p>
                        </>
                        )
                    }
                    
                </div>
                <div className="top-bar-dashboard-card">
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
                                <h1>En réparation</h1>
                                <p>{CountAllPannesData?.EnReparation}</p>
                            </>
                        )
                    }
                </div>
                <div className="top-bar-dashboard-card">
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
                                <h1>Réparé non livré</h1>
                                <p>{CountAllPannesData?.NoneDelivredrepare}</p>
                            </>
                        )
                    }
                </div>
                <div className="top-bar-dashboard-card">
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
                                <h1>Réparé  livré</h1>
                                <p>{CountAllPannesData?.Delivredrepare}</p>
                            </>
                        )
                    }
                </div>
            </div>
            <div className="middle-bar-dashboard-container">
                <div className="middle-bar-dashboard-card">
                    {isCountAllPannesMonthLoading ? 
                        <>
                                <div className="CircularProgress-container">
                                    <CircularProgress className='CircularProgress' />
                                </div>  
                        </>
                        :   
                        (CountAllPannesMonthData && CountAllPannesMonthData.length > 0 ? 
                            (
                                <>
                                    <h1>Nombre de panne</h1>
                                    <BarChart
                                        dataset={CountAllPannesMonthData}
                                        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                                        series={[
                                            { dataKey: 'EnAttente', label: 'En attente', valueFormatter },
                                            { dataKey: 'Repare', label: 'Réparé', valueFormatter },
                                            { dataKey: 'EnReparation', label: 'En réparation', valueFormatter },
                                        ]}
                                        {...chartSetting}
                                    />
                                </>
                            ) 
                            : 
                            (
                                <>
                                    <h1>Nombre de panne</h1>
                                    <BarChart
                                        dataset={[]}
                                        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                                        series={[
                                            { dataKey: 'EnAttente', label: 'En attente', valueFormatter },
                                            { dataKey: 'Repare', label: 'Réparé', valueFormatter },
                                            { dataKey: 'EnReparation', label: 'En réparation', valueFormatter },
                                        ]}
                                        {...chartSetting}
                                    />
                                </>
                            )
                        )
                    }
                </div>
                <div className="middle-bar-dashboard-card">
                    {isTop5TechnicianLoading ? 
                        <div className="CircularProgress-container">
                            <CircularProgress className='CircularProgress' />
                        </div>
                    : (Top5Technicianerror || Top5TechnicianData.length <= 0 ? 
                        <h1>Aucune donnée disponible</h1>
                    :   
                        <>
                            <h1>Top technician</h1>
                            {Top5TechnicianData?.map((item, index) => (
                                <div key={index} className="dashboard-view-card-item">
                                    <div className="dashboard-view-card-item-title">
                                        <h2>{`${item.technicianAssociation.fullname ? item.technicianAssociation.fullname : item.technicianAssociation.username}`}</h2>
                                        <p>{`${item.averageRepairTime}`}</p>
                                    </div>
                                    <VisibilityIcon className='dashboard-view-card-item-icon' onClick={() => navigate(`/utilisateur/${item.technicianAssociation.code}`)}/>
                                </div>
                            ))}
                        </>
                    )
                    }
                </div>
            </div>
            <div className="bottom-bar-dashboard-container">
                <div className="bottom-bar-dashboard-card">
                    {isTop4PannesLoading ? 
                        <div className="CircularProgress-container">
                            <CircularProgress className='CircularProgress' />
                        </div>
                    : (Top4Panneserror || Top4PannesData.length <= 0 ? 
                        <h1>Aucune donnée disponible</h1>
                    :   
                        <>
                            <h1>Top pannes</h1>
                            {Top4PannesData?.map((item, index) => (
                                <div key={index} className="dashboard-view-card-item">
                                    <h2>{`${item.typepanneAssociation.name}`}</h2>
                                    <h2>{`${item.count} fois`}</h2>
                                </div>
                            ))}
                        </>
                    )
                    }
                </div>
                <div className="bottom-bar-dashboard-card">
                    {isTop4ActionLoading ? 
                        <div className="CircularProgress-container">
                            <CircularProgress className='CircularProgress' />
                        </div>
                    : (Top4Actionerror || Top4ActionData.length <= 0 ? 
                        <h1>Aucune donnée disponible</h1>
                    :   
                        <>
                            <h1>Top action corrective</h1>
                            {Top4ActionData?.map((item, index) => (
                                <div key={index} className="dashboard-view-card-item">
                                    <h2>{`${item.actionAssociation?.name}`}</h2>
                                    <h2>{`${convertSecondsToTimeString(item.actionAssociation.duree) || ''}`}</h2>
                                    <h2>{`${item.count} fois`}</h2>
                                </div>
                            ))}
                        </>
                    )
                    }
                </div>
                <div className="bottom-bar-dashboard-card">
                    {isTop4ConsommationLoading ? 
                        <div className="CircularProgress-container">
                            <CircularProgress className='CircularProgress' />
                        </div>
                    : (Top4Consommationerror || Top4ConsommationData.length <= 0 ? 
                        <h1>Aucune donnée disponible</h1>
                    :   
                        <>
                            <h1>Top PDR consommé</h1>
                            {Top4ConsommationData?.map((item, index) => (
                                <div key={index} className="dashboard-view-card-item">
                                    <h2>{`${item.pieceAssociation?.name}`}</h2>
                                    <h2>{`${item.count} fois`}</h2>
                                </div>
                            ))}
                        </>
                    )
                    }
                </div>
            </div>
        </div>
    );
}
export default HomePage;