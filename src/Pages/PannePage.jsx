import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import { useNavigate } from 'react-router-dom';
import CreateTvDialog from '../components/Dialogs/CreateTvDialog';
import { ToastContainer } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { TokenDecoder } from "../util/DecodeToken";

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

const PannePage = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const decodedToken = TokenDecoder();
    // fetching Pannes data
    const fetchPannesData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/panne/byzone/${decodedToken.zone}`,
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
                throw new Error("Error receiving Pannes data");
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
            name: "sn",
            label: "SN",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value}</p>;
                },
            },
        },
        {
            name: "technician",
            label: "Technician",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value || 'Non assosier'}</p>; // Show 'N/A' if technician is null
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
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDate(value)}</p>;
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
            name: "id",
            label: " ",
            options: {
                sort: false,
                filter: false,
                customBodyRender: (value) => {
                    return (
                        <div>
                            <button style={{backgroundColor: '#1988ff'}} onClick={() => Redirection(`/EDIT/${value}`) }>
                                Edit
                            </button>
                            <button style={{backgroundColor: '#1988ff'}} onClick={() => Redirection(`/${value}`) }>
                                Voir
                            </button>
                            <button style={{backgroundColor: '#DA171B'}} onClick={() => alert('delete') }>
                                Supprimer
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
            <DataTable name={"Pannes"} data={PannesData} columns={columns} handleClickOpen={handleClickOpen}/>
            <CreateTvDialog  open={open} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange}/>
            <ToastContainer/>
        </div>
    );
}
export default PannePage;