import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import { useNavigate } from 'react-router-dom';
import CreatePanneDialog from '../components/Dialogs/CreatePanneDialog';
import { ToastContainer } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { TokenDecoder } from "../util/DecodeToken";
import TableHeader from '../components/tables/TableHeader';

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

const ArchivePanne = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [workshop, setWorkshop] = useState('');
    const decodedToken = TokenDecoder();
    const handleWorkshopChange = (event) => {
        setWorkshop(event.target.value);
    }
    // fetching Pannes data
    const fetchPannesData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/panne/archive/${decodedToken.zone}`,
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
                throw new Error("Error receiving archive data");
        }
        // Return the data
        return await response.json();
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
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/workshop/${decodedToken.zone}`,
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
                throw new Error("Error receiving Workshops data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: workshopList, Workshopserror, isWorkshopsLoading, Workshopsrefetch } = useQuery({
        queryKey: ['WorkshopsData', user?.token],
        queryFn: fetchWorkshopsData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
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
            name: "technician",
            label: "Technician",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value || 'Non assosier'}</p>; // Show 'N/A' if technician is null
                },
            },
        },
        {
            name: "fournisseur",
            label: "Fournisseur",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value}</p>;
                },
            },
        },
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
            name: "ligne",
            label: "Ligne",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value}</p>;
                },
            },
        },
        {
            name: "panne",
            label: "Panne",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value}</p>;
                },
            },
        },
        {
            name: "dateDeclaration",
            label: "Date de declaration",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDate(value)}</p>;
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
                                    if (import.meta.env.VITE_TECHNICIAN_TYPE == decodedToken.type) 
                                        Redirection(`/panne/reparation/${value}`);
                                    else
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

    if (isLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (error) {
        return (
            <div className="CircularProgress-app">
                <h1>Une erreur s'est produite: {error.message}</h1>
            </div>
        );
    }
    return (
        <div className="pages-container">
            <TableHeader name={'L\'archive des pannes'} type={decodedToken.type} handleClickOpen={handleClickOpen} handleWorkshopChange={handleWorkshopChange} workshopList={workshopList}/>
            <DataTable data={filteredPannesData} columns={columns}/>
            <CreatePanneDialog open={open} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} zone={decodedToken.zone}/>
            <ToastContainer/>
        </div>
    );
}
export default ArchivePanne;