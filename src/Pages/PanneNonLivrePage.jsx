import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { TokenDecoder } from "../util/DecodeToken";
import TableHeader from '../components/tables/TableHeader';
import moment from 'moment';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
  
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${month} ${day}, ${year} at ${hours}:${formattedMinutes}`;
};
const formatDuration = (mill) => {
    // Handle case where mill is null or undefined
    if (mill === null || mill === undefined) {
        return "Durée non disponible";
    }

    // Create duration object
    const duration = moment.duration(mill);
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    // Build the formatted duration string
    let formattedDuration = '';

    if (days > 0) {
        formattedDuration += `${days} jour${days > 1 ? 's' : ''}, `;
    }
    if (hours > 0) {
        formattedDuration += `${hours} heure${hours > 1 ? 's' : ''}, `;
    }
    if (minutes > 0) {
        formattedDuration += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
    }
    if (seconds > 0 || formattedDuration === '') { // Include seconds if no other units are present
        formattedDuration += `${seconds} seconde${seconds > 1 ? 's' : ''}`;
    }

    return formattedDuration || "0 secondes";
};
const ArchivePanne = () => {
    const { user } = useAuthContext();
    const decodedToken = TokenDecoder();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [workshop, setWorkshop] = useState('');
    const [Zone, setZone] = useState('');
    const handleWorkshopChange = (event) => {
        setWorkshop(event.target.value);
    }
    const handleZoneChange = (event) => {
        setZone(event.target.value);
    }
    // fetching Pannes data
    const fetchPannesData = async () => {
        try{
            let response;
            if (import.meta.env.VITE_MANAGER_TYPE == decodedToken.type) {
                response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/panne/nonedelivred`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
            } else if (import.meta.env.VITE_AGENT_TYPE == decodedToken.type){
                response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/panne/nonedelivred/${decodedToken.zone}`,
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
                    throw new Error("Erreur lors de la récupération des données des pannes");
            }
            // Return the data
            return await response.json();
        }catch(error){
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: PannesData, error, isLoading, refetch } = useQuery({
        queryKey: ['PannesData', user?.token],
        queryFn: fetchPannesData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Workshops data
    const fetchWorkshopsData = async () => {
        try{
            let response;
            if (import.meta.env.VITE_MANAGER_TYPE == decodedToken.type) {
                response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/workshop`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
            } else {
                response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/workshop/${decodedToken.zone}`,
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
                    throw new Error("Erreur lors de la récupération des données des ateliers");
            }
            // Return the data
            return await response.json();
        }catch(error){
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: workshopList, error: Workshopserror, Loading: isWorkshopsLoading, refetch: Workshopsrefetch } = useQuery({
        queryKey: ['WorkshopsData', user?.token],
        queryFn: fetchWorkshopsData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Zonnes data
    const fetchZonesData = async () => {
        if (import.meta.env.VITE_MANAGER_TYPE == decodedToken.type) {
            const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/zone`,
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
                    throw new Error("Error receiving Zonnes data");
            }
            // Return the data
            return await response.json();
        }
        return [];
    };
    // useQuery hook to fetch data
    const { data: ZonesData, error: Zoneserror, Loading: isZonesLoading, refetch: Zonesrefetch } = useQuery({
        queryKey: ['ZonesData', user?.token],
        queryFn: fetchZonesData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // Filter WorkshopsData by selected workshop
    const filteredWorkshopsData = workshopList?.filter(workshop => 
        Zone == '' || workshop.zone == Zone
    );
    // Filter PannesData by selected workshop
    const filteredPannesData = PannesData?.filter(panne => 
        workshop == '' || panne.workshop == workshop
    );
    // Function to refetch data
    const handleRefetchDataChange = () => {
        refetch();
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const Redirection = (path) => {
        navigate(`${path}`)
    }

    const columns = [
        {
            name: "workshopAssociation",
            label: "Workshop",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value?.name}</p>;
                },
            },
        },
        {
            name: "dateReparation",
            label: "Date de reparation",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDate(value)}</p>;
                },
            },
        },
        {
            name: "tempInitial",
            label: "Temp initial",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDate(value)}</p>;
                },
            },
        },
        {
            name: "tempFinal",
            label: "Temp finale",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDate(value)}</p>;
                },
            },
        },
        {
            name: "dureeDintervention",
            label: "Duree d'intervention",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDuration(value)}</p>;
                },
            },
        },
        {
            name: "code",
            label: " ",
            options: {
                sort: false,
                filter: false,
                customBodyRender: (value) => {
                    return (
                        <div>
                            <button 
                                style={{backgroundColor: '#1988ff'}} 
                                onClick={() => {
                                    Redirection(`/panne/${value}`);
                                }}
                            >
                                Voir
                            </button>
                        </div>
                    )
                }
            }
        },
    ]; 

    if (isLoading || isWorkshopsLoading || isZonesLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (error || Workshopserror || Zoneserror) {
        return (
            <div className="CircularProgress-app">
                <h1>Une erreur s'est produite</h1>
                {/* <h1>{error.message}</h1> */}
            </div>
        );
    }
    return (
        <div className="pages-container">
            <TableHeader name={'L\'archive des pannes'} type={decodedToken.type} handleWorkshopChange={handleWorkshopChange} workshopList={filteredWorkshopsData} handleZoneChange={handleZoneChange} ZoneList={ZonesData}/>
            <DataTable data={filteredPannesData} columns={columns}  download={true} viewColumns={true} filter={true} search={true}/>
            <ToastContainer/>
        </div>
    );
}
export default ArchivePanne;