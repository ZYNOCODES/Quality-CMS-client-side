import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import { useNavigate } from 'react-router-dom';
import CreateUserDialog from '../components/Dialogs/CreateUserDialog';
import UpdateUserDialog from '../components/Dialogs/UpdateUserDialog';
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
    const [openDeleteUserDialog, setOpenDeleteUserDialog] = useState(false);
    const [openUpdateUserDialog, setOpenUpdateUserDialog] = useState(false);
    const [Zone, setZone] = useState('');
    const [currentCode, setCurrentCode] = useState(null);
    const [submitionLoading, setSubmitionLoading] = useState(false);
    const decodedToken = TokenDecoder();
    const handleZoneChange = (event) => {
        setZone(event.target.value);
    }
    // fetching Users data
    const fetchUsersData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/users`,
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
    const { data: UsersData, error, isLoading, refetch } = useQuery({
        queryKey: ['UsersData', user?.token],
        queryFn: fetchUsersData,
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
    // Filter usersData by selected zone or familly
    const filteredUsersData = UsersData?.filter(user => 
        (Zone == '' || user.zone == Zone)
    );
    // Function to refetch data
    const handleRefetchDataChange = () => {
        refetch();
        Zonesrefetch();
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setCurrentCode(null);
        setOpenDeleteUserDialog(false);
        setOpenUpdateUserDialog(false);
        setOpen(false);
    };
    const Redirection = (path) => {
        navigate(`${path}`)
    }
    const handleClickOpenDeleteUserDialog = (code) => {
        setCurrentCode(code);
        setOpenDeleteUserDialog(true);
    };
    const handleClickOpenUpdateUserDialog = (code) => {
        setCurrentCode(code);
        setOpenUpdateUserDialog(true);
    };
    const handleDeleteUser = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/users/${currentCode}`, 
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
                console.error("Error deleting User: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting User", error);
            }
        }
    };
    const columns = [
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
            label: "fullname",
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
            name: "type",
            label: "Role",
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
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleClickOpenUpdateUserDialog(value) }>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleClickOpenDeleteUserDialog(value) }>
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

    if (isLoading || isZonesLoading) {
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
                <h1>Une erreur s'est produite</h1>
                <h1>{error.message}</h1>
            </div>
        );
    }
    return (
        <div className="pages-container">
            {import.meta.env.VITE_MANAGER_TYPE == decodedToken.type &&
                <>
                    <TableHeader name={'Liste des utilisateurs'} type={decodedToken.type} handleClickOpen={handleClickOpen} handleZoneChange={handleZoneChange} ZoneList={ZoneList}/>
                    <DataTable data={filteredUsersData} columns={columns} />
                    <CreateUserDialog  open={open} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} ZoneList={ZoneList}/>
                    <UpdateUserDialog code={currentCode}  open={openUpdateUserDialog} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} ZoneList={ZoneList}/>
                    <DeletingDialog name={'d\'un utilisateur'} loading={submitionLoading} open={openDeleteUserDialog} handleClose={handleClose} handleOnDelete={handleDeleteUser}/>
                    <ToastContainer/>
                </>
            }
        </div>
    );
}
export default UsersPage;