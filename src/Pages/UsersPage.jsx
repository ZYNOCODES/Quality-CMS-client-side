import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import { useNavigate } from 'react-router-dom';
import CreateAgentDialog from '../components/Dialogs/CreateAgentDialog';
import UpdateAgentDialog from '../components/Dialogs/UpdateAgentDialog';
import CreateTechnicianDialog from '../components/Dialogs/CreateTechnicianDialog';
import UpdateTechnicianDialog from '../components/Dialogs/UpdateTechnicianDialog';
import CreateDisplayerDialog from '../components/Dialogs/CreateDisplayerDialog';
import UpdateDisplayerDialog from '../components/Dialogs/UpdateDisplayerDialog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from '@tanstack/react-query';
import { TokenDecoder } from "../util/DecodeToken";
import TableHeader from '../components/tables/TableHeader';
import DeletingDialog from '../components/Dialogs/DeletingDialog';
import axios from 'axios';

const UsersPage = () => {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openDeleteAgentDialog, setOpenDeleteAgentDialog] = useState(false);
    const [openUpdateAgentDialog, setOpenUpdateAgentDialog] = useState(false);
    const [openTechnician, setOpenTechnician] = useState(false);
    const [openDeleteTechnicianDialog, setOpenDeleteTechnicianDialog] = useState(false);
    const [openUpdateTechnicianDialog, setOpenUpdateTechnicianDialog] = useState(false);
    const [openDisplayer, setOpenDisplayer] = useState(false);
    const [openDeleteDisplayerDialog, setOpenDeleteDisplayerDialog] = useState(false);
    const [openUpdateDisplayerDialog, setOpenUpdateDisplayerDialog] = useState(false);
    const [Zone, setZone] = useState('');
    const [currentCode, setCurrentCode] = useState(null);
    const [submitionLoading, setSubmitionLoading] = useState(false);
    const decodedToken = TokenDecoder();
    const handleZoneChange = (event) => {
        setZone(event.target.value);
    }
    // fetching Agents data
    const fetchAgentData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/agent/all`,
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
                throw new Error("Error receiving Users data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: AgentData, 
        error, 
        isLoading, 
        refetch } = useQuery({
        queryKey: ['AgentData', user?.token],
        queryFn: fetchAgentData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Techniciens data
    const fetchTechnicienData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/technician/all`,
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
                throw new Error("Error receiving Techniciens data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: TechnicienData, 
        error: TechnicienDataError, 
        isLoading: TechnicienDataLoading, 
        refetch: TechnicienDataRefetch } = useQuery({
        queryKey: ['TechnicienData', user?.token],
        queryFn: fetchTechnicienData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Displayers data
    const fetchDisplayerData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/displayer/all`,
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
                throw new Error("Error receiving Displayers data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: DisplayerData, 
        error: DisplayerDataError, 
        isLoading: DisplayerDataLoading, 
        refetch: DisplayerDataRefetch } = useQuery({
        queryKey: ['DisplayerData', user?.token],
        queryFn: fetchDisplayerData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Zones data
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
                throw new Error("Error receiving Zones data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: ZoneList, error: Zoneserror, Loading: isZonesLoading, refetch: Zonesrefetch } = useQuery({
        queryKey: ['ZoneList', user?.token],
        queryFn: fetchZonesData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // Filter AgentData by selected zone 
    const filteredAgentData = AgentData?.filter(user => 
        (Zone == '' || user.zone == Zone)
    );
    // Filter TechnicienData by selected zone 
    const filteredTechnicienData = TechnicienData?.filter(user => 
        (Zone == '' || user.zone == Zone)
    );
    // Filter DisplayerData by selected zone 
    const filteredDisplayerData = DisplayerData?.filter(user => 
        (Zone == '' || user.zone == Zone)
    );
    // Function to refetch data
    const handleRefetchDataChange = () => {
        refetch();
        Zonesrefetch();
        TechnicienDataRefetch();
        DisplayerDataRefetch();
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClickOpenTechnician = () => {
        setOpenTechnician(true);
    };
    const handleClickOpenDisplayer = () => {
        setOpenDisplayer(true);
    };
    const handleClose = () => {
        setCurrentCode(null);
        setOpenDeleteAgentDialog(false);
        setOpenUpdateAgentDialog(false);
        setOpenDeleteTechnicianDialog(false);
        setOpenUpdateTechnicianDialog(false);
        setOpenDeleteDisplayerDialog(false);
        setOpenUpdateDisplayerDialog(false);
        setOpen(false);
        setOpenTechnician(false);
        setOpenDisplayer(false);
    };
    const Redirection = (path) => {
        navigate(`${path}`)
    }
    const handleClickOpenDeleteAgentDialog = (code) => {
        setCurrentCode(code);
        setOpenDeleteAgentDialog(true);
    };
    const handleClickOpenUpdateAgentDialog = (code) => {
        setCurrentCode(code);
        setOpenUpdateAgentDialog(true);
    };
    const handleClickOpenDeleteTechnicianDialog = (code) => {
        setCurrentCode(code);
        setOpenDeleteTechnicianDialog(true);
    };
    const handleClickOpenUpdateTechnicianDialog = (code) => {
        setCurrentCode(code);
        setOpenUpdateTechnicianDialog(true);
    };
    const handleClickOpenDeleteDisplayerDialog = (code) => {
        setCurrentCode(code);
        setOpenDeleteDisplayerDialog(true);
    };
    const handleClickOpenUpdateDisplayerDialog = (code) => {
        setCurrentCode(code);
        setOpenUpdateDisplayerDialog(true);
    };
    const handleDeleteAgent = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/agent/${currentCode}`, 
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
                console.error("Error deleting agent: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting agent", error);
            }
        }
    };
    const handleDeleteTechnician = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/technician/${currentCode}`, 
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
                console.error("Error deleting technician: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting technician", error);
            }
        }
    };
    const handleDeleteDisplayer = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/displayer/${currentCode}`, 
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
                console.error("Error deleting displayer: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting displayer", error);
            }
        }
    };
    const AAcolumns = [
        {
            name: "code",
            label: "Code",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <p>
                            {value}
                        </p>
                    )
                }
            }
        },
        {
            label: "Nom complet",
            name: "fullname",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <p>
                            {value}
                        </p>
                    )
                }
            }
        },
        {
            label: "Nom d\'utilisateur",
            name: "username",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <p>
                            {value}
                        </p>
                    )
                }
            }
        },
        {
            name: "phoneNumber",
            label: "Numero de telephone",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <p>
                            {value}
                        </p>
                    )
                }
            }
        },
        {
            name: "zoneAssociation",
            label: "zone",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <p>
                            {value.name}
                        </p>
                    )
                }
            }
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
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => Redirection(`/utilisateur/${value}`) }>
                                        Voir
                                    </button>
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleClickOpenUpdateAgentDialog(value) }>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleClickOpenDeleteAgentDialog(value) }>
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
    const Tcolumns = [
        {
            name: "code",
            label: "Code",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <p>
                            {value}
                        </p>
                    )
                }
            }
        },
        {
            name: "fullname",
            label: "Nom complet",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <p>
                            {value}
                        </p>
                    )
                }
            }
        },
        {
            name: "zoneAssociation",
            label: "zone",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <p>
                            {value.name}
                        </p>
                    )
                }
            }
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
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => Redirection(`/utilisateur/${value}`) }>
                                        Voir
                                    </button>
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleClickOpenUpdateTechnicianDialog(value) }>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleClickOpenDeleteTechnicianDialog(value) }>
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
    const Dcolumns = [
        {
            name: "code",
            label: "Code",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <p>
                            {value}
                        </p>
                    )
                }
            }
        },
        {
            name: "username",
            label: "Nom d\'utilisateur",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <p>
                            {value}
                        </p>
                    )
                }
            }
        },
        {
            name: "zoneAssociation",
            label: "zone",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <p>
                            {value.name}
                        </p>
                    )
                }
            }
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
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleClickOpenUpdateDisplayerDialog(value) }>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleClickOpenDeleteDisplayerDialog(value) }>
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

    if (isLoading || isZonesLoading || TechnicienDataLoading || DisplayerDataLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (error || Zoneserror || TechnicienDataError || DisplayerDataError) {
        return (
            <div className="CircularProgress-app">
                <h1>Une erreur s'est produite</h1>
                {/* <h1>{error.message}</h1> */}
            </div>
        );
    }
    return (
        <div className="pages-container">
            {import.meta.env.VITE_MANAGER_TYPE == decodedToken.type &&
                <>  
                    {/* Agent */}
                    <TableHeader name={'Liste des agents'} type={decodedToken.type} handleClickOpen={handleClickOpen} handleZoneChange={handleZoneChange} ZoneList={ZoneList}/>
                    <DataTable title={'Liste des agents'} rows={5} data={filteredAgentData} columns={AAcolumns}  download={true} viewColumns={true} filter={true} search={true}/>
                    <CreateAgentDialog  open={open} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} ZoneList={ZoneList}/>
                    <UpdateAgentDialog code={currentCode}  open={openUpdateAgentDialog} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} ZoneList={ZoneList}/>
                    <DeletingDialog name={'d\'un agent'} loading={submitionLoading} open={openDeleteAgentDialog} handleClose={handleClose} handleOnDelete={handleDeleteAgent}/>
                    
                    {/* Agent */}
                    <TableHeader name={'Liste des techniciens'} type={decodedToken.type} handleClickOpen={handleClickOpenTechnician}/>
                    <DataTable title={'Liste des techniciens'} rows={5} data={filteredTechnicienData} columns={Tcolumns}  download={true} viewColumns={true} filter={true} search={true}/>
                    <CreateTechnicianDialog  open={openTechnician} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} ZoneList={ZoneList}/>
                    <UpdateTechnicianDialog code={currentCode}  open={openUpdateTechnicianDialog} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} ZoneList={ZoneList}/>
                    <DeletingDialog name={'d\'un technicien'} loading={submitionLoading} open={openDeleteTechnicianDialog} handleClose={handleClose} handleOnDelete={handleDeleteTechnician}/>
                    
                    {/* Displayer */}
                    <TableHeader name={'Liste des displayers'} type={decodedToken.type} handleClickOpen={handleClickOpenDisplayer}/>
                    <DataTable title={'Liste des displayers'} rows={5} data={filteredDisplayerData} columns={Dcolumns}  download={true} viewColumns={true} filter={true} search={true}/>
                    <CreateDisplayerDialog  open={openDisplayer} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} ZoneList={ZoneList}/>
                    <UpdateDisplayerDialog code={currentCode}  open={openUpdateDisplayerDialog} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} ZoneList={ZoneList}/>
                    <DeletingDialog name={'d\'un displayer'} loading={submitionLoading} open={openDeleteDisplayerDialog} handleClose={handleClose} handleOnDelete={handleDeleteDisplayer}/>
                    
                    <ToastContainer/>
                </>
            }
        </div>
    );
}
export default UsersPage;