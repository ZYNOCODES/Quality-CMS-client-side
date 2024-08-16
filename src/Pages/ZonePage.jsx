import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import CreateZoneDialog from '../components/Dialogs/CreateZoneDialog';
import CreateWorkshopDialog from '../components/Dialogs/CreateWorkshopDialog';
import DeletingDialog from '../components/Dialogs/DeletingDialog';
import UpdateZoneDialog from '../components/Dialogs/UpdateZoneDialog';
import UpdateWorkshopDialog from '../components/Dialogs/UpdateWorkshopDialog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from '@tanstack/react-query';
import { TokenDecoder } from "../util/DecodeToken";
import TableHeader from '../components/tables/TableHeader';
import axios from 'axios';

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

const ZonePage = () => {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const { user } = useAuthContext();
    const [openCreateZoneDialog, setOpenCreateZoneDialog] = useState(false);
    const [openCreateWorkshopDialog, setOpenCreateWorkshopDialog] = useState(false);
    const [openUpdateZoneDialog, setOpenUpdateZoneDialog] = useState(false);
    const [openUpdateWorkshopDialog, setOpenUpdateWorkshopDialog] = useState(false);
    const [openDeleteZoneDialog, setOpenDeleteZoneDialog] = useState(false);
    const [openDeleteWorkshopDialog, setOpenDeleteWorkshopDialog] = useState(false);
    const [currentCode, setCurrentCode] = useState(null);
    const [submitionLoading, setSubmitionLoading] = useState(false);
    const [Zone, setZone] = useState('');
    const decodedToken = TokenDecoder();
    const handleZoneChange = (event) => {
        setZone(event.target.value);
    }
    // fetching Zonnes data
    const fetchZonesData = async () => {
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
    };
    // useQuery hook to fetch data
    const { data: ZonesData, error: Zoneerror, isLoading: isZoneLoading, refetch: Zonerefetch } = useQuery({
        queryKey: ['ZonesData', user?.token],
        queryFn: fetchZonesData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Workshops data
    const fetchWorkshopsData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/workshop`,
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
    const { data: workshopList, error: Workshopserror, isLoading: isWorkshopsLoading, refetch: Workshopsrefetch } = useQuery({
        queryKey: ['WorkshopsData', user?.token],
        queryFn: fetchWorkshopsData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // Filter WorkshopsData by selected workshop
    const filteredWorkshopsData = workshopList?.filter(workshop => 
        Zone == '' || workshop.zone == Zone
    );
    // Function to refetch data
    const handleRefetchDataChange = () => {
        Zonerefetch();
        Workshopsrefetch();
    }
    const handleClickOpenCreateZoneDialog = (code) => {
        setCurrentCode(code);
        setOpenCreateZoneDialog(true);
    };
    const handleClickOpenCreateWorkshopDialog = (code) => {
        setCurrentCode(code);
        setOpenCreateWorkshopDialog(true);
    };
    const handleClickOpenUpdateZoneDialog = (code) => {
        setCurrentCode(code);
        setOpenUpdateZoneDialog(true);
    };
    const handleClickOpenUpdateWorkshopDialog = (code) => {
        setCurrentCode(code);
        setOpenUpdateWorkshopDialog(true);
    };
    const handleClickOpenDeleteZoneDialog = (code) => {
        setCurrentCode(code);
        setOpenDeleteZoneDialog(true);
    };
    const handleClickOpenDeleteWorkshopDialog = (code) => {
        setCurrentCode(code);
        setOpenDeleteWorkshopDialog(true);
    };
    const handleClose = () => {
        setCurrentCode(null);
        setOpenCreateZoneDialog(false);
        setOpenCreateWorkshopDialog(false);
        setOpenUpdateZoneDialog(false);
        setOpenUpdateWorkshopDialog(false);
        setOpenDeleteZoneDialog(false);
        setOpenDeleteWorkshopDialog(false);
    };
    const handleDeleteZone = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/zone/${currentCode}`, 
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
                console.error("Error deleting zone: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting zone");
            }
        }
    };
    const handleDeleteWorkshop = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/workshop/${currentCode}`, 
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
                console.error("Error deleting workshop: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting workshop");
            }
        }
    };
    const columnsZone = [
        {
            name: "code",
            label: "Code",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value}</p>;
                },
            },
        },
        {
            name: "name",
            label: "Name",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value}</p>;
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
                            {import.meta.env.VITE_MANAGER_TYPE == decodedToken.type &&
                                <>
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleClickOpenUpdateZoneDialog(value)}>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleClickOpenDeleteZoneDialog(value)}>
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
    const columnsWorkshop = [
        {
            name: "code",
            label: "Code",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value}</p>;
                },
            },
        },
        {
            name: "name",
            label: "Name",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value}</p>;
                },
            },
        },
        {
            name: "zoneAssociation",
            label: "Zone",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value.name}</p>;
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
                            {import.meta.env.VITE_MANAGER_TYPE == decodedToken.type &&
                                <>
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleClickOpenUpdateWorkshopDialog(value)}>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleClickOpenDeleteWorkshopDialog(value)}>
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

    if (isZoneLoading || isWorkshopsLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (Zoneerror || Workshopserror) {
        return (
            <div className="CircularProgress-app">
                <h1>Une erreur s'est produite</h1>
                {Zoneerror &&
                    <h1> {Zoneerror.message} </h1>
                }
                {Workshopserror &&
                    <h1> {Workshopserror.message} </h1>
                }
            </div>
        );
    }
    return (
        <div className="pages-container">
            <TableHeader name={'Liste des zonnes'} type={decodedToken.type} handleClickOpen={handleClickOpenCreateZoneDialog} />
            <DataTable data={ZonesData} columns={columnsZone}/>
            <CreateZoneDialog open={openCreateZoneDialog} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} zone={decodedToken.zone}/>
            <UpdateZoneDialog  name={'d\'une zone'} code={currentCode} user={user} open={openUpdateZoneDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} />
            <DeletingDialog name={'d\'une zone'} loading={submitionLoading} open={openDeleteZoneDialog} handleClose={handleClose} handleOnDelete={handleDeleteZone}/>
            <TableHeader name={'Liste des ateliers'} type={decodedToken.type} handleClickOpen={handleClickOpenCreateWorkshopDialog} handleZoneChange={handleZoneChange} ZoneList={ZonesData}/>
            <DataTable data={filteredWorkshopsData} columns={columnsWorkshop}/>
            <CreateWorkshopDialog open={openCreateWorkshopDialog} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} zone={decodedToken.zone} ZoneList={ZonesData}/>
            <UpdateWorkshopDialog  name={'d\'un atelier'} code={currentCode} user={user} open={openUpdateWorkshopDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} ZoneList={ZonesData}/>
            <DeletingDialog name={'d\'un atelier'} loading={submitionLoading} open={openDeleteWorkshopDialog} handleClose={handleClose} handleOnDelete={handleDeleteWorkshop}/>
            <ToastContainer/>
        </div>
    );
}
export default ZonePage;