import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import { useNavigate } from 'react-router-dom';
import CreatePanneDialog from '../components/Dialogs/CreatePanneDialog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from '@tanstack/react-query';
import { TokenDecoder } from "../util/DecodeToken";
import TableHeader from '../components/tables/TableHeader';
import DeletingDialog from '../components/Dialogs/DeletingDialog';
import axios from 'axios';
import { formatDateTime } from '../util/UseFullFunctions';


const PannePage = () => {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const { user } = useAuthContext();
    const decodedToken = TokenDecoder();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openDeletePanneDialog, setOpenDeletePanneDialog] = useState(false);
    const [currentCode, setCurrentCode] = useState(null);
    const [submitionLoading, setSubmitionLoading] = useState(false);
    const [workshop, setWorkshop] = useState('');
    const [Zone, setZone] = useState('');
    const [PanneType, setPanneType] = useState('');
    const handleWorkshopChange = (event) => {
        setWorkshop(event.target.value);
    }
    const handleZoneChange = (event) => {
        setZone(event.target.value);
    }
    const handlePanneTypeChange = (event) => {
        setPanneType(event.target.value);
    }
    // fetching Pannes data
    const fetchPannesData = async () => {
        try{
            let response;
            if (import.meta.env.VITE_MANAGER_TYPE == decodedToken.type) {
                response = await fetch(
                    `${import.meta.env.VITE_APP_URL_BASE}/panne`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
            } else {
                response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/panne/byagent/${decodedToken.code}`,
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
    // fetching type de panne data
    const fetchTypePanneData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/pannetype`,
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
                throw new Error("Error receiving type de panne data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: TypePanneData, error: TypePanneerror, Loading: isTypePanneLoading, refetch: TypePannerefetch } = useQuery({
        queryKey: ['TypePanneData', user?.token],
        queryFn: fetchTypePanneData,
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
    ) || [];
    // Filter PannesData by selected workshop
    const filteredPannesData = PannesData?.filter(panne => 
        (workshop == '' || panne.workshop == workshop) &&
        (PanneType == '' || panne.panne == PanneType) 
    ) || [];
    // Function to refetch data
    const handleRefetchDataChange = () => {
        refetch();
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setCurrentCode(null);
        setOpenDeletePanneDialog(false);
        setOpen(false);
    };
    const handleClickOpenDeletePanneDialog = (code) => {
        setCurrentCode(code);
        setOpenDeletePanneDialog(true);
    };
    const handleDeletePanne = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/panne/${currentCode}/${decodedToken.code}`, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    }
                }
            );
            if (response.status === 200) {
                notifySuccess(response.data.message);
                handleRefetchDataChange();
                setSubmitionLoading(false);
                handleClose();
            } else {
                notifyFailed(response.data.message);
                setSubmitionLoading(false);
            }
        } catch (error) {
            if (error.response) {
                notifyFailed(error.response.data.message);
                setSubmitionLoading(false);
            } else if (error.request) {
                // Request was made but no response was received
                console.error("Error deleting product: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting product");
            }
        }
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
            name: "dateDeclaration",
            label: "Date de declaration",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDateTime(value)}</p>;
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
                                    if (import.meta.env.VITE_AGENT_TYPE == decodedToken.type) 
                                        Redirection(`/panne/prendre/${value}`);
                                    else
                                        Redirection(`/panne/${value}`);
                                    
                                }}
                            >
                                Voir
                            </button>
                            {import.meta.env.VITE_AGENT_TYPE == decodedToken.type &&
                                <>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleClickOpenDeletePanneDialog(value) }>
                                        Supprimer
                                    </button>
                                </>
                            }
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
            <TableHeader name={'Liste des pannes'} type={decodedToken.type} handleClickOpen={handleClickOpen} handleWorkshopChange={handleWorkshopChange} workshopList={filteredWorkshopsData} handleZoneChange={handleZoneChange} ZoneList={ZonesData} handlePanneTypeChange={handlePanneTypeChange} PanneTypeList={TypePanneData}/>
            <DataTable title={'Liste des pannes'} data={filteredPannesData} columns={columns} download={true} viewColumns={true} filter={true} search={true} />
            {import.meta.env.VITE_AGENT_TYPE == decodedToken.type &&
                <>
                    <CreatePanneDialog agent={decodedToken.code} open={open} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} zone={decodedToken.zone}/>    
                    <DeletingDialog name={'d\'une panne'} loading={submitionLoading} open={openDeletePanneDialog} handleClose={handleClose} handleOnDelete={handleDeletePanne}/>
                </>
            }
            <ToastContainer/>
        </div>
    );
}
export default PannePage;