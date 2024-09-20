import { useNavigate, useParams } from 'react-router-dom';
import TextFieldComponent from '../components/forms/TextField';
import { useAuthContext } from '../hooks/useAuthContext';
import './css/PanneDetailsPageStyle.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import { TokenDecoder } from '../util/DecodeToken';
import ConfirmationDialog from '../components/Dialogs/ConfirmationDialog';
import './css/TakeInChargePannePageStyle.css';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { formatDateTime, formatDate, formatDuration } from '../util/UseFullFunctions';
import UpdateActionCorrectiveDialog from '../components/Dialogs/UpdateActionCorrectiveDialog';
import DeletingDialog from '../components/Dialogs/DeletingDialog';
import UpdateConsommationPDRDialog from '../components/Dialogs/UpdateConsommationPDRDialog';
import CreateActionCorrectiveDialog from '../components/Dialogs/CreateActionCorrectiveDialog'
import CreateConsommationPDRDialog from '../components/Dialogs/CreateConsommationPDRDialog'
import moment from 'moment';

const PanneDetails = () => {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const { code } = useParams();
    const { user } = useAuthContext();
    const decodedToken = TokenDecoder();
    const navigate = useNavigate();
    const [submitionLoading, setSubmitionLoading] = useState(false);
    const [currentCode, setCurrentCode] = useState(null);

    const [ open, setOpen ] = useState(false);
    const handleOpenConfirmationDialog = () => {
        setOpen(true);
    }

    const [ openUpdate, setOpenUpdate ] = useState(false);
    const handleOpenConfirmationUpdateDialog = () => {
        setOpenUpdate(true);
    }

    const [isUpdate, setIsUpdate] = useState(false);
    const [openReOpening, setopenReOpening] = useState(false);
    const handleopenReOpening = () => {
        setopenReOpening(true);
    }

    
    const [ openCreateConsommationPDRDialog, setopenCreateConsommationPDRDialog ] = useState(false);
    const handleopenCreateConsommationPDRDialog = () => {
        setopenCreateConsommationPDRDialog(true);
    }
    const [ openCreateActionCorrectiveDialog, setopenCreateActionCorrectiveDialog ] = useState(false);
    const handleopenCreateActionCorectiveDialog = () => {
        setopenCreateActionCorrectiveDialog(true);
    }

    const [ openDeleteConsommationPDRDialog, setopenDeleteConsommationPDRDialog ] = useState(false);
    const handleopenDeleteConsommationPDRDialog = (code) => {
        setCurrentCode(code);
        setopenDeleteConsommationPDRDialog(true);
    }

    const [ openDeleteActionCorrectiveDialog, setopenDeleteActionCorrectiveDialog ] = useState(false);
    const handleopenDeleteActionCorectiveDialog = (code) => {
        setCurrentCode(code);
        setopenDeleteActionCorrectiveDialog(true);
    }

    const [ openUpdatingConsommationPDRDialog, setopenUpdatingConsommationPDRDialog ] = useState(false);
    const handleopenUpdatingConsommationPDRDialog = (code) => {
        setCurrentCode(code);
        setopenUpdatingConsommationPDRDialog(true);
    }

    const [ openUpdatingActionCorrectiveDialog, setopenUpdatingActionCorrectiveDialog ] = useState(false);
    const handleopenUpdatingActionCorectiveDialog = (code) => {
        setCurrentCode(code);
        setopenUpdatingActionCorrectiveDialog(true);
    }

    const handleClose = () => {
        setCurrentCode(null);
        setOpen(false);
        setOpenUpdate(false);
        setopenReOpening(false);
        setopenCreateActionCorrectiveDialog(false);
        setopenCreateConsommationPDRDialog(false);
        setopenDeleteActionCorrectiveDialog(false);
        setopenDeleteConsommationPDRDialog(false);
        setopenUpdatingActionCorrectiveDialog(false);
        setopenUpdatingConsommationPDRDialog(false);
    }

    // Redirection function
    const Redirection = (path) => {
        navigate(path);
    }

    // TimeCounter component
    const TimeCounter = ({ startTime }) => {
        const [elapsedTime, setElapsedTime] = useState('');
        useEffect(() => {
            if (!startTime) return;
    
            const calculateTimeDifference = () => {
                const now = moment().utc(1);
                const start = moment.utc(startTime);
                const diffInSeconds = now.diff(start, 'seconds');
                const duration = moment.duration(diffInSeconds, 'seconds');
                const formattedHours = String(duration.hours()).padStart(2, '0');
                const formattedMinutes = String(duration.minutes()).padStart(2, '0');
                const formattedSeconds = String(duration.seconds()).padStart(2, '0');
                
                setElapsedTime(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
            };
    
            calculateTimeDifference();
            const intervalId = setInterval(calculateTimeDifference, 1000);
    
            return () => clearInterval(intervalId);
        }, [startTime]);
    
        return (
            <div className='time-counter-container'>
                <h1>Durée de réparation</h1>
                <span>{elapsedTime}</span>
            </div>
        );
    };

    const columnsAction = [
        {
            name: "actionAssociation",
            label: "Action",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value?.name}</p>;
                },
            },
        },
        {
            name: "mesure",
            label: "Mesure",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value}</p>;
                },
            },
        },
        {
            name: "resultat",
            label: "Resultat",
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
                            {import.meta.env.VITE_AGENT_TYPE == decodedToken.type && isUpdate &&
                                <>
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleopenUpdatingActionCorectiveDialog(value)}>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleopenDeleteActionCorectiveDialog(value)}>
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
    const columnsPDR = [
        {
            name: "pieceAssociation",
            label: "Piece",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value?.name}</p>;
                },
            },
        },
        {
            name: "quantity",
            label: "Quantite",
            options: {
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
                            {import.meta.env.VITE_AGENT_TYPE == decodedToken.type && isUpdate &&
                                <>
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleopenUpdatingConsommationPDRDialog(value)}>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleopenDeleteConsommationPDRDialog(value)}>
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

    // fetching Panne data
    const fetchPanneData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_URL_BASE}/panne/one/${code}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error && errorData.error.statusCode === 404) {
                    return [];
                } else {
                }
            }

            return await response.json();
        } catch (error) {
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: PanneData, error: Panneerror, Loading: isPanneLoading, refetch: Pannerefetch } = useQuery({
        queryKey: ['PanneData', user?.token],
        queryFn: fetchPanneData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching ActionCorrective data
    const fetchActionCorrectiveData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_URL_BASE}/actioncorrective/${code}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error && errorData.error.statusCode === 404) {
                    return [];
                } else {
                    throw new Error("Erreur lors de la récupération des données des ActionCorrectives");
                }
            }

            return await response.json();
        } catch (error) {
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: ActionCorrectiveData, error: ActionCorrectiveerror, Loading: isActionCorrectiveLoading, refetch: ActionCorrectiverefetch } = useQuery({
        queryKey: ['ActionCorrectiveData', user?.token],
        queryFn: fetchActionCorrectiveData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching ConsommationPDRs data
    const fetchConsommationPDRData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_URL_BASE}/consommation/${code}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error && errorData.error.statusCode === 404) {
                    return [];
                } else {
                    throw new Error("Erreur lors de la récupération des données des consommation PDR");
                }
            }

            return await response.json();
        } catch (error) {
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: ConsommationPDRData, error: ConsommationPDRerror, Loading: isConsommationPDRLoading, refetch: ConsommationPDRrefetch } = useQuery({
        queryKey: ['ConsommationPDRData', user?.token],
        queryFn: fetchConsommationPDRData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Piece data
    const fetchPieceData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_URL_BASE}/piece`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error && errorData.error.statusCode === 404) {
                    return [];
                } else {
                    throw new Error("Erreur lors de la récupération des données des pieces");
                }
            }

            return await response.json();
        } catch (error) {
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: PiecesData, error: Pieceerror, Loading: isPieceLoading, refetch: Piecerefetch } = useQuery({
        queryKey: ['PiecesData', user?.token],
        queryFn: fetchPieceData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Action data
    const fetchActionData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_URL_BASE}/action`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error && errorData.error.statusCode === 404) {
                    return [];
                } else {
                    throw new Error("Erreur lors de la récupération des données des actions");
                }
            }

            return await response.json();
        } catch (error) {
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: ActionsData, error: Actionerror, Loading: isActionLoading, refetch: Actionrefetch } = useQuery({
        queryKey: ['ActionsData', user?.token],
        queryFn: fetchActionData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    //re-fetch data
    const handleRefetchDataChange = () => {
        ActionCorrectiverefetch();
        ConsommationPDRrefetch();
    }
    //delivred panne
    const onHandleClickDelivredPanne = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/panne/delivred/${code}`, 
                {
                    agent: decodedToken.code
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    }
                }
            );
            if (response.status === 200) {
                notifySuccess(response.data.message);
                setSubmitionLoading(false);
                handleClose();
                //rediraction
                Redirection(`/archive-pannes`);
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
                console.error("Error updating product: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error updating product", error);
            }
        }
    }
    //update panne reouverture initial date
    const handleUpdatePanneReouvertureTempInitial = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/panne/reopen/${code}`, 
                {
                    agent: decodedToken.code
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    }
                }
            );
            if (response.status === 200) {
                Pannerefetch();
                notifySuccess(response.data.message);
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
                console.error("Error updating panne reouverture init time: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error updating panne reouverture init time", error);
            }
        }
    };
    //update panne reouverture final date
    const handleUpdatePanneReouvertureTempFinal = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/panne/reclose/${code}`, 
                {
                    agent: decodedToken.code
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    }
                }
            );
            if (response.status === 200) {
                Pannerefetch();
                notifySuccess(response.data.message);
                setSubmitionLoading(false);
                setIsUpdate(false);
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
                console.error("Error updating panne reouverture final time: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error updating panne reouverture final time", error);
            }
        }
    };
    //delete action corrective
    const handleDeleteActionCorrective = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/actioncorrective/${currentCode}/${decodedToken?.code}`, 
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
                console.error("Error deleting Action corrective: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting Action corrective");
            }
        }
    };
    //delete consommation PDR
    const handleDeleteConsommationPDR = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/consommation/${currentCode}/${decodedToken?.code}`, 
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
                console.error("Error deleting Consommation PDR: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting Consommation PDR");
            }
        }
    };

    useEffect(() => {
        if (PanneData?.livraison) {
            setIsUpdate(false);
        }
        if(PanneData?.reouverture) {
            setIsUpdate(true);
        }else{
            setIsUpdate(false);
        }
    }, [PanneData, PanneData?.reouvertureTempInitial, PanneData?.reouvertureTempFinal]);


    if (isPanneLoading || isActionCorrectiveLoading || isConsommationPDRLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (Panneerror || ActionCorrectiveerror || ConsommationPDRerror) {
        return (
            <div className="CircularProgress-app">
                <h1>Une erreur s'est produite</h1>
                {/* <h1>{Panneerror ? Panneerror.message : ''}</h1>
                <h1>{Panneerror ? Panneerror.message : ''}</h1>
                <h1>{Workshopserror ? Workshopserror.message : ''}</h1> */}
            </div>
        );
    }

    return (
        <div className="panne-page-container">
            <div className="panne-navbar-page-content">
                <div className="panne-navbar-page-container">
                    <div className='panne-icon-container-navbar-page-container' onClick={() => Redirection(-1)}>
                        <ArrowBackIcon className='panne-backIcon-icon-container'/>
                    </div>
                    <h1>Détails du Panne</h1>
                </div>
                {!PanneData?.livraison && PanneData?.dateReparation && import.meta.env.VITE_AGENT_TYPE == decodedToken.type &&
                    <>
                        {isUpdate && PanneData?.reouverture &&
                            <>
                                <button className="take-in-charge-button" onClick={handleOpenConfirmationUpdateDialog}>Fermer la modification</button>
                            </>
                        }
                        {!isUpdate && !PanneData?.reouverture &&
                            <>
                                <button className="update-button" onClick={handleopenReOpening}>Re-Ouvrire</button>
                                <button className="take-in-charge-button" onClick={handleOpenConfirmationDialog}>Restitue</button>
                            </>    
                        }
                    </>
                }
            </div>
            <div className="panne-page-details-content">
                {isUpdate && PanneData?.reouverture && import.meta.env.VITE_AGENT_TYPE == decodedToken.type &&
                    <>
                        {/*Temps */}
                        <div className={`taken-panne-page-form-container green`}>
                            <TextFieldComponent DefaultValue={formatDateTime(PanneData?.reouvertureTempInitial)} label='Date de réouverture' color={'#fff'} type='text' readOnly />
                            <TimeCounter startTime={PanneData?.reouvertureTempInitial}/>
                        </div>
                    </>
                }
                {/*Product */}
                <div className="panne-page-header-container">
                    <h1>Produit :</h1>
                    <div className="icon-panne-page-header-container" onClick={() => Redirection(`/produit/${PanneData?.productAssociation?.code}`)}>
                        <VisibilityIcon className='view-icon-panne-page-header-container' />
                        <p>voir</p>
                    </div>
                </div>
                <div className="panne-page-form-container">
                    <TextFieldComponent DefaultValue={PanneData?.productAssociation?.marque} label='Marque' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.productAssociation?.model} label='Modele' color={'#fff'} type='text' readOnly />
                </div>
                {/*Technician */}
                {(PanneData?.technician != null && PanneData?.technicianAssociation) &&
                    <>
                        <div className="panne-page-header-container">
                            <h1>Technicien :</h1>
                            {import.meta.env.VITE_MANAGER_TYPE === decodedToken.type &&
                                <div className="icon-panne-page-header-container" onClick={() => Redirection(`/utilisateur/${PanneData?.technicianAssociation?.code}`)}>
                                    <VisibilityIcon className='view-icon-panne-page-header-container' />
                                    <p>voir</p>
                                </div>
                            }
                        </div>
                        <div className="panne-page-form-container">
                            <TextFieldComponent DefaultValue={PanneData?.technicianAssociation?.fullname} label='Nom complet' color={'#fff'} type='text' readOnly />
                        </div>
                    </>
                }
                {/*Technician */}
                {(PanneData?.agent != null && PanneData?.agentAssociation) &&
                    <>
                        <div className="panne-page-header-container">
                            <h1>Agent de saisie :</h1>
                            {import.meta.env.VITE_MANAGER_TYPE === decodedToken.type &&
                                <div className="icon-panne-page-header-container" onClick={() => Redirection(`/utilisateur/${PanneData?.agentAssociation?.code}`)}>
                                    <VisibilityIcon className='view-icon-panne-page-header-container' />
                                    <p>voir</p>
                                </div>
                            }
                        </div>
                        <div className="panne-page-form-container">
                            <TextFieldComponent DefaultValue={PanneData?.agentAssociation?.fullname} label='Nom complet' color={'#fff'} type='text' readOnly />
                        </div>
                    </>
                }
                {/*Panne */}
                <div className="panne-page-header-container">
                    <h1>Détails :</h1>
                </div>
                <div className="panne-page-form-container">
                    <TextFieldComponent DefaultValue={PanneData?.code} label='Code' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.fournisseur} label='Fournisseur' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.ligne} label='Ligne' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.typepanneAssociation?.name} label='Panne' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={formatDateTime(PanneData?.dateDeclaration)} label='Date de declaration' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.workshopAssociation?.name} label='Atelier' color={'#fff'} type='text' readOnly />
                    {PanneData?.dateReparation != null &&
                        <>
                            <TextFieldComponent DefaultValue={PanneData?.source ? PanneData?.source : 'NON DÉFINI'} label='Source' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.etat ? PanneData?.etat : 'NON DÉFINI'} label='Etat' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.livraison ? 'libérer' : 'Non libérer'} label='Liberation' color={'#fff'} type='text' readOnly />
                            {PanneData?.livraison &&
                                <TextFieldComponent DefaultValue={PanneData?.livraison == true ? formatDateTime(PanneData?.DateLivraison) : 'Non libérer'} label='Date de libiration' color={'#fff'} type='text' readOnly />
                            }
                        </>    
                    }
                </div>
                {PanneData?.dateReparation != null &&
                    <>
                        {/*Temps */}
                        <div className={`taken-panne-page-form-container`}>
                            <TextFieldComponent DefaultValue={formatDateTime(PanneData?.tempInitial)} label='Temps initiale' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={formatDateTime(PanneData?.tempFinal)} label='Temps finale' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={formatDuration(PanneData?.dureeDintervention)} label="Durée d'intervention" color={'#fff'} type='text' readOnly />
                        </div>
                        {/*Action corrective et consommation PDR */}
                        <div className="Action-PDR-panne-page-header-container">
                            <div className="Action-PDR-panne-page-header-content">
                                <div className='Action-PDR-panne-navbar-page-content'>
                                    <div className="Action-PDR-panne-navbar-page-container">
                                        <h1>Action corrective</h1>
                                    </div>
                                    {isUpdate && PanneData?.reouverture && import.meta.env.VITE_AGENT_TYPE == decodedToken.type &&
                                        <button className="Action-PDR-panne-navbar-page-content-button" onClick={handleopenCreateActionCorectiveDialog}>Ajouter une action</button>
                                    }
                                </div>
                                <DataTable rows={5} data={ActionCorrectiveData} columns={columnsAction} download={false} viewColumns={true} filter={true} search={true} />
                            </div>
                            <div className="Action-PDR-panne-page-header-content">
                                <div className='Action-PDR-panne-navbar-page-content'>
                                    <div className="Action-PDR-panne-navbar-page-container">
                                        <h1>Consommation PDR</h1>
                                    </div>
                                    {isUpdate && PanneData?.reouverture && import.meta.env.VITE_AGENT_TYPE == decodedToken.type &&
                                        <button className="Action-PDR-panne-navbar-page-content-button" onClick={handleopenCreateConsommationPDRDialog}>Ajouter une piece</button>
                                    }
                                </div>
                                <DataTable rows={5} data={ConsommationPDRData} columns={columnsPDR} download={false} viewColumns={true} filter={true} search={true} />
                            </div>
                        </div>
                        {isUpdate && PanneData?.reouverture && import.meta.env.VITE_AGENT_TYPE == decodedToken.type &&
                            <>
                                <CreateActionCorrectiveDialog agent={decodedToken.code} code={code} user={user} open={openCreateActionCorrectiveDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} ActionList={ActionsData}/>
                                <UpdateActionCorrectiveDialog agent={decodedToken.code} code={currentCode} user={user} open={openUpdatingActionCorrectiveDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} ActionList={ActionsData}/>
                                <DeletingDialog name={'d\'une action corrective'} loading={submitionLoading} open={openDeleteActionCorrectiveDialog} handleClose={handleClose} handleOnDelete={handleDeleteActionCorrective}/>
                                
                                <CreateConsommationPDRDialog agent={decodedToken.code} code={code} user={user} open={openCreateConsommationPDRDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} PieceList={PiecesData}/>
                                <UpdateConsommationPDRDialog agent={decodedToken.code} code={currentCode} user={user} open={openUpdatingConsommationPDRDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} PieceList={PiecesData}/>
                                <DeletingDialog name={'d\'une consommation PDR'} loading={submitionLoading} open={openDeleteConsommationPDRDialog} handleClose={handleClose} handleOnDelete={handleDeleteConsommationPDR}/>
                            </>
                        }
                        
                    </>
                }
            </div>
            <ConfirmationDialog open={open} name={'restitution'} loading={submitionLoading} handleOnConfirm={onHandleClickDelivredPanne} handleClose={handleClose} />
            <ConfirmationDialog open={openReOpening} name={'réouverture'} loading={submitionLoading} handleOnConfirm={handleUpdatePanneReouvertureTempInitial} handleClose={handleClose} />
            <ConfirmationDialog open={openUpdate} name={'modification'} loading={submitionLoading} handleOnConfirm={handleUpdatePanneReouvertureTempFinal} handleClose={handleClose} />
            
            <ToastContainer/>
        </div>
    );
}

export default PanneDetails;