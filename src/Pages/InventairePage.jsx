import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import CreateActionDialog from '../components/Dialogs/CreateActionDialog';
import CreatePieceDialog from '../components/Dialogs/CreatePieceDialog';
import CreatePanneTypeDialog from '../components/Dialogs/CreatePanneTypeDialog';
import DeletingDialog from '../components/Dialogs/DeletingDialog';
import UpdateActionDialog from '../components/Dialogs/UpdateActionDialog';
import UpdatePieceDialog from '../components/Dialogs/UpdatePieceDialog';
import UpdatePanneTypeDialog from '../components/Dialogs/UpdatePanneTypeDialog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from '@tanstack/react-query';
import { TokenDecoder } from "../util/DecodeToken";
import TableHeader from '../components/tables/TableHeader';
import axios from 'axios';
import { convertSecondsToTimeString } from '../util/UseFullFunctions';

const ActionPage = () => {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const { user } = useAuthContext();
    const [openCreateActionDialog, setOpenCreateActionDialog] = useState(false);
    const [openCreatePieceDialog, setOpenCreatePieceDialog] = useState(false);
    const [openUpdateActionDialog, setOpenUpdateActionDialog] = useState(false);
    const [openUpdatePieceDialog, setOpenUpdatePieceDialog] = useState(false);
    const [openDeleteActionDialog, setOpenDeleteActionDialog] = useState(false);
    const [openDeletePieceDialog, setOpenDeletePieceDialog] = useState(false);
    const [openCreatePanneTypeDialog, setOpenCreatePanneTypeDialog] = useState(false);
    const [openUpdatePanneTypeDialog, setOpenUpdatePanneTypeDialog] = useState(false);
    const [openDeletePanneTypeDialog, setOpenDeletePanneTypeDialog] = useState(false);
    const [currentCode, setCurrentCode] = useState(null);
    const [submitionLoading, setSubmitionLoading] = useState(false);
    const decodedToken = TokenDecoder();

    // fetching Zonnes data
    const fetchActionsData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/action`,
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
                throw new Error("Error receiving actions data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: ActionsData, error: Actionerror, isLoading: isActionLoading, refetch: Actionrefetch } = useQuery({
        queryKey: ['ActionsData', user?.token],
        queryFn: fetchActionsData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Pieces data
    const fetchPiecesData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/piece`,
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
                throw new Error("Error receiving pieces data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: PieceList, error: Pieceserror, isLoading: isPiecesLoading, refetch: Piecesrefetch } = useQuery({
        queryKey: ['PiecesData', user?.token],
        queryFn: fetchPiecesData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching PanneType data
    const fetchPanneTypeData = async () => {
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
                throw new Error("Error receiving panne types data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: PanneTypeData, error: PanneTypeerror, isLoading: isPanneTypeLoading, refetch: PanneTyperefetch } = useQuery({
        queryKey: ['PanneTypeData', user?.token],
        queryFn: fetchPanneTypeData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });

    // Function to refetch data
    const handleRefetchDataChange = () => {
        Actionrefetch();
        Piecesrefetch();
        PanneTyperefetch();
    }
    const handleClickOpenCreateActionDialog = (code) => {
        setCurrentCode(code);
        setOpenCreateActionDialog(true);
    };
    const handleClickOpenCreatePieceDialog = (code) => {
        setCurrentCode(code);
        setOpenCreatePieceDialog(true);
    };
    const handleClickOpenCreatePanneTypeDialog = (code) => {
        setCurrentCode(code);
        setOpenCreatePanneTypeDialog(true);
    };
    const handleClickOpenUpdateActionDialog = (code) => {
        setCurrentCode(code);
        setOpenUpdateActionDialog(true);
    };
    const handleClickOpenUpdatePieceDialog = (code) => {
        setCurrentCode(code);
        setOpenUpdatePieceDialog(true);
    };
    const handleClickOpenUpdatePanneTypeDialog = (code) => {
        setCurrentCode(code);
        setOpenUpdatePanneTypeDialog(true);
    };
    const handleClickOpenDeleteActionDialog = (code) => {
        setCurrentCode(code);
        setOpenDeleteActionDialog(true);
    };
    const handleClickOpenDeletePieceDialog = (code) => {
        setCurrentCode(code);
        setOpenDeletePieceDialog(true);
    };
    const handleClickOpenDeletePanneTypeDialog = (code) => {
        setCurrentCode(code);
        setOpenDeletePanneTypeDialog(true);
    };
    const handleClose = () => {
        setCurrentCode(null);
        setOpenCreateActionDialog(false);
        setOpenCreatePieceDialog(false);
        setOpenUpdateActionDialog(false);
        setOpenUpdatePieceDialog(false);
        setOpenDeleteActionDialog(false);
        setOpenDeletePieceDialog(false);
        setOpenCreatePanneTypeDialog(false);
        setOpenUpdatePanneTypeDialog(false);
        setOpenDeletePanneTypeDialog(false);
    };
    const handleDeleteAction = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/action/${currentCode}`, 
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
                console.error("Error deleting action: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting action");
            }
        }
    };
    const handleDeletePiece = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/piece/${currentCode}`, 
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
                console.error("Error deleting piece: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting piece");
            }
        }
    };
    const handleDeletePanneType = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/pannetype/${currentCode}`, 
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
                console.error("Error deleting panne type: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting panne type");
            }
        }
    };
    const columnsAction = [
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
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleClickOpenUpdateActionDialog(value)}>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleClickOpenDeleteActionDialog(value)}>
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
    const columnsPiece = [
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
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleClickOpenUpdatePieceDialog(value)}>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleClickOpenDeletePieceDialog(value)}>
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
    const columnsPanneType = [
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
            name: "duree",
            label: "Durée",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{convertSecondsToTimeString(Number(value))}</p>;
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
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleClickOpenUpdatePanneTypeDialog(value)}>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleClickOpenDeletePanneTypeDialog(value)}>
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
    if (isActionLoading || isPiecesLoading || isPanneTypeLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (Actionerror || Pieceserror || PanneTypeerror) {
        return (
            <div className="CircularProgress-app">
                <h1>Une erreur s'est produite</h1>
                {/* {Actionerror &&
                    <h1> {Actionerror.message} </h1>
                }
                {Pieceserror &&
                    <h1> {Pieceserror.message} </h1>
                } */}
            </div>
        );
    }
    return (
        <div className="pages-container">
            {/* Type panne */}
            <TableHeader name={'Liste des types de panne'} type={decodedToken.type} handleClickOpen={handleClickOpenCreatePanneTypeDialog} />
            <DataTable title={'Liste des types de panne'} data={PanneTypeData} columns={columnsPanneType} rows={5} download={true} viewColumns={true} filter={true} search={true}/>
            <CreatePanneTypeDialog open={openCreatePanneTypeDialog} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} />
            <UpdatePanneTypeDialog  name={'d\'un type de panne'} code={currentCode} user={user} open={openUpdatePanneTypeDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} />
            <DeletingDialog name={'d\'un type de panne'} loading={submitionLoading} open={openDeletePanneTypeDialog} handleClose={handleClose} handleOnDelete={handleDeletePanneType}/>
            {/* Action */}
            <TableHeader name={'Liste des actions'} type={decodedToken.type} handleClickOpen={handleClickOpenCreateActionDialog} />
            <DataTable title={'Liste des actions'} data={ActionsData} columns={columnsAction} rows={5} download={true} viewColumns={true} filter={true} search={true}/>
            <CreateActionDialog open={openCreateActionDialog} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} />
            <UpdateActionDialog  name={'d\'une action'} code={currentCode} user={user} open={openUpdateActionDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} />
            <DeletingDialog name={'d\'une action'} loading={submitionLoading} open={openDeleteActionDialog} handleClose={handleClose} handleOnDelete={handleDeleteAction}/>
            {/* Piece */}
            <TableHeader name={'Liste des pieces'} type={decodedToken.type} handleClickOpen={handleClickOpenCreatePieceDialog} />
            <DataTable title={'Liste des pieces'} data={PieceList} columns={columnsPiece} rows={5} download={true} viewColumns={true} filter={true} search={true}/>
            <CreatePieceDialog open={openCreatePieceDialog} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange} />
            <UpdatePieceDialog  name={'d\'un piece'} code={currentCode} user={user} open={openUpdatePieceDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} />
            <DeletingDialog name={'d\'un piece'} loading={submitionLoading} open={openDeletePieceDialog} handleClose={handleClose} handleOnDelete={handleDeletePiece}/>
            <ToastContainer/>
        </div>
    );
}

export default ActionPage;