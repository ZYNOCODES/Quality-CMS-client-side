import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import CreateZoneDialog from '../components/Dialogs/CreateZoneDialog';
import CreateWorkshopDialog from '../components/Dialogs/CreateWorkshopDialog';
import CreateFournisseurDialog from '../components/Dialogs/CreateFournisseurDialog';
import DeletingDialog from '../components/Dialogs/DeletingDialog';
import UpdateZoneDialog from '../components/Dialogs/UpdateZoneDialog';
import UpdateWorkshopDialog from '../components/Dialogs/UpdateWorkshopDialog';
import UpdateFournisseurDialog from '../components/Dialogs/UpdateFournisseurDialog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from '@tanstack/react-query';
import { TokenDecoder } from "../util/DecodeToken";
import TableHeader from '../components/tables/TableHeader';
import axios from 'axios';

const ZonePage = () => {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const { user } = useAuthContext();
    const [openCreateZoneDialog, setOpenCreateZoneDialog] = useState(false);
    const [openCreateWorkshopDialog, setOpenCreateWorkshopDialog] = useState(false);
    const [openCreateFournisseurDialog, setOpenCreateFournisseurDialog] = useState(false);
    const [openUpdateZoneDialog, setOpenUpdateZoneDialog] = useState(false);
    const [openUpdateWorkshopDialog, setOpenUpdateWorkshopDialog] = useState(false);
    const [openUpdateFournisseurDialog, setOpenUpdateFournisseurDialog] = useState(false);
    const [openDeleteZoneDialog, setOpenDeleteZoneDialog] = useState(false);
    const [openDeleteWorkshopDialog, setOpenDeleteWorkshopDialog] = useState(false);
    const [openDeleteFournisseurDialog, setOpenDeleteFournisseurDialog] = useState(false);
    const [currentCode, setCurrentCode] = useState(null);
    const [submitionLoading, setSubmitionLoading] = useState(false);
    const [Zone, setZone] = useState('');
    const decodedToken = TokenDecoder();
    const handleZoneChange = (event) => {
        setZone(event.target.value);
    }

    const handleClickOpenCreateZoneDialog = (code) => {
        setCurrentCode(code);
        setOpenCreateZoneDialog(true);
    };
    const handleClickOpenCreateWorkshopDialog = (code) => {
        setCurrentCode(code);
        setOpenCreateWorkshopDialog(true);
    };
    const handleClickOpenCreateFournisseurDialog = (code) => {
        setCurrentCode(code);
        setOpenCreateFournisseurDialog(true);
    }
    const handleClickOpenUpdateZoneDialog = (code) => {
        setCurrentCode(code);
        setOpenUpdateZoneDialog(true);
    };
    const handleClickOpenUpdateWorkshopDialog = (code) => {
        setCurrentCode(code);
        setOpenUpdateWorkshopDialog(true);
    };
    const handleClickOpenUpdateFournisseurDialog = (code) => {
        setCurrentCode(code);
        setOpenUpdateFournisseurDialog(true);
    }
    const handleClickOpenDeleteZoneDialog = (code) => {
        setCurrentCode(code);
        setOpenDeleteZoneDialog(true);
    };
    const handleClickOpenDeleteWorkshopDialog = (code) => {
        setCurrentCode(code);
        setOpenDeleteWorkshopDialog(true);
    };
    const handleClickOpenDeleteFournisseurDialog = (code) => {
        setCurrentCode(code);
        setOpenDeleteFournisseurDialog(true);
    }
    const handleClose = () => {
        setCurrentCode(null);
        setOpenCreateZoneDialog(false);
        setOpenCreateWorkshopDialog(false);
        setOpenCreateFournisseurDialog(false);
        setOpenUpdateZoneDialog(false);
        setOpenUpdateWorkshopDialog(false);
        setOpenUpdateFournisseurDialog(false);
        setOpenDeleteZoneDialog(false);
        setOpenDeleteWorkshopDialog(false);
        setOpenDeleteFournisseurDialog(false);
    };


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
    // fetching Fournisseur data
    const fetchFournisseurData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/fournisseur`,
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
                throw new Error("Error receiving Fournisseur data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: FournisseurList, error: Fournisseurerror, isLoading: isFournisseurLoading, refetch: Fournisseurrefetch } = useQuery({
        queryKey: ['FournisseurData', user?.token],
        queryFn: fetchFournisseurData,
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
        Fournisseurrefetch();
    }

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
    const handleDeleteFournisseur = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/fournisseur/${currentCode}`, 
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
                console.error("Error deleting fournisseur: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting fournisseur");
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
            label: "Nom",
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
            label: "Nom",
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
    const columnsFournisseur = [
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
            name: "fullname",
            label: "Nom",
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
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleClickOpenUpdateFournisseurDialog(value)}>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleClickOpenDeleteFournisseurDialog(value)}>
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

    if (isZoneLoading || isWorkshopsLoading || isFournisseurLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (Zoneerror || Workshopserror || Fournisseurerror) {
        return (
            <div className="CircularProgress-app">
                <h1>Une erreur s'est produite</h1>
                {/* {Zoneerror &&
                    <h1> {Zoneerror.message} </h1>
                }
                {Workshopserror &&
                    <h1> {Workshopserror.message} </h1>
                } */}
            </div>
        );
    }
    return (
        <div className="pages-container">
            {/* zonnes */}
            <TableHeader name={'Liste des zonnes'} type={decodedToken.type} handleClickOpen={handleClickOpenCreateZoneDialog} />
            <DataTable title={'Liste des zonnes'} data={ZonesData} columns={columnsZone} rows={3} download={true} viewColumns={true} filter={true} search={true}/>
            <CreateZoneDialog open={openCreateZoneDialog} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} zone={decodedToken.zone}/>
            <UpdateZoneDialog  name={'d\'une zone'} code={currentCode} user={user} open={openUpdateZoneDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} />
            <DeletingDialog name={'d\'une zone'} loading={submitionLoading} open={openDeleteZoneDialog} handleClose={handleClose} handleOnDelete={handleDeleteZone}/>
            
            {/* workshops */}
            <TableHeader name={'Liste des ateliers'} type={decodedToken.type} handleClickOpen={handleClickOpenCreateWorkshopDialog} handleZoneChange={handleZoneChange} ZoneList={ZonesData}/>
            <DataTable title={'Liste des ateliers'} data={filteredWorkshopsData} columns={columnsWorkshop} rows={4} download={true} viewColumns={true} filter={true} search={true}/>
            <CreateWorkshopDialog open={openCreateWorkshopDialog} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} zone={decodedToken.zone} ZoneList={ZonesData}/>
            <UpdateWorkshopDialog  name={'d\'un atelier'} code={currentCode} user={user} open={openUpdateWorkshopDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} ZoneList={ZonesData}/>
            <DeletingDialog name={'d\'un atelier'} loading={submitionLoading} open={openDeleteWorkshopDialog} handleClose={handleClose} handleOnDelete={handleDeleteWorkshop}/>
            
            {/* fournisseur */}
            <TableHeader name={'Liste des fournisseurs'} type={decodedToken.type} handleClickOpen={handleClickOpenCreateFournisseurDialog} />
            <DataTable title={'Liste des fournisseurs'} data={FournisseurList} columns={columnsFournisseur} rows={4} download={true} viewColumns={true} filter={true} search={true}/>
            <CreateFournisseurDialog open={openCreateFournisseurDialog} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} />
            <UpdateFournisseurDialog  name={'d\'un fournisseur'} code={currentCode} user={user} open={openUpdateFournisseurDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} />
            <DeletingDialog name={'d\'un fournisseur'} loading={submitionLoading} open={openDeleteFournisseurDialog} handleClose={handleClose} handleOnDelete={handleDeleteFournisseur}/>
            
            <ToastContainer/>
        </div>
    );
}
export default ZonePage;