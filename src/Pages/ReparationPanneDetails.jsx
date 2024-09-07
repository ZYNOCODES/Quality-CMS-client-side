import { useNavigate, useParams } from 'react-router-dom';
import TextFieldComponent from '../components/forms/TextField';
import { useAuthContext } from '../hooks/useAuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';
import './css/TakeInChargePannePageStyle.css';
import UpdateStepTwoPanneDialog from '../components/Dialogs/UpdateStepTwoPanneDialog'
import CreateActionCorrectiveDialog from '../components/Dialogs/CreateActionCorrectiveDialog'
import CreateConsommationPDRDialog from '../components/Dialogs/CreateConsommationPDRDialog'
import UpdateConsommationPDRDialog from '../components/Dialogs/UpdateConsommationPDRDialog'
import UpdateActionCorrectiveDialog from '../components/Dialogs/UpdateActionCorrectiveDialog'
import DeletingDialog from '../components/Dialogs/DeletingDialog'
import ConfirmationDialog from '../components/Dialogs/ConfirmationDialog'
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { TokenDecoder } from "../util/DecodeToken";
import DataTable from '../components/tables/DataTable';

const formatDateTime = (dateString) => {
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
    const seconds = date.getSeconds();
  
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  
    return `${month} ${day}, ${year} at ${hours}:${formattedMinutes}:${formattedSeconds}`;
};
const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
  
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
  
    return `${month} ${day}, ${year}`;
};
const ReparationPanne = () => {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const { code } = useParams();
    const decodedToken = TokenDecoder();
    const { user } = useAuthContext();
    const [ openCreateActionCorrectiveDialog, setopenCreateActionCorrectiveDialog ] = useState(false);
    const [ openCreateConsommationPDRDialog, setopenCreateConsommationPDRDialog ] = useState(false);
    const [ openDeleteActionCorrectiveDialog, setopenDeleteActionCorrectiveDialog ] = useState(false);
    const [ openDeleteConsommationPDRDialog, setopenDeleteConsommationPDRDialog ] = useState(false);
    const [ openUpdatingActionCorrectiveDialog, setopenUpdatingActionCorrectiveDialog ] = useState(false);
    const [ openUpdatingConsommationPDRDialog, setopenUpdatingConsommationPDRDialog ] = useState(false);
    const [ openConfirmationDialog, setopenConfirmationDialog ] = useState(false);
    const [ openConfirmationStepTwoDialog, setopenConfirmationStepTwoDialog ] = useState(false);
    const [submitionLoading, setSubmitionLoading] = useState(false);
    const [currentCode, setCurrentCode] = useState(null);
    const [ red, setRed ] = useState(false);
    const navigate = useNavigate();
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
                    throw new Error("Erreur lors de la récupération des données du panne");
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
    // Function to refetch data
    const handleRefetchDataChange = () => {
        Pannerefetch();
        ActionCorrectiverefetch();
        ConsommationPDRrefetch();
        Piecerefetch();
        Actionrefetch();
    }
    // Redirection function
    const Redirection = (path) => {
        navigate(path);
    }
    const handleopenCreateConsommationPDRDialog = () => {
        setopenCreateConsommationPDRDialog(true);
    }
    const handleopenCreateActionCorectiveDialog = () => {
        setopenCreateActionCorrectiveDialog(true);
    }
    const handleopenDeleteConsommationPDRDialog = (code) => {
        setCurrentCode(code);
        setopenDeleteConsommationPDRDialog(true);
    }
    const handleopenDeleteActionCorectiveDialog = (code) => {
        setCurrentCode(code);
        setopenDeleteActionCorrectiveDialog(true);
    }
    const handleopenUpdatingConsommationPDRDialog = (code) => {
        setCurrentCode(code);
        setopenUpdatingConsommationPDRDialog(true);
    }
    const handleopenUpdatingActionCorectiveDialog = (code) => {
        setCurrentCode(code);
        setopenUpdatingActionCorrectiveDialog(true);
    }
    const handleopenConfirmationDialog = () => {
        setopenConfirmationDialog(true);
    }
    const handleopenConfirmationStepTwoDialog = () => {
        setopenConfirmationStepTwoDialog(true);
    }
    const handleClose = () => {
        setCurrentCode(null);
        setopenCreateConsommationPDRDialog(false);
        setopenCreateActionCorrectiveDialog(false);
        setopenDeleteActionCorrectiveDialog(false);
        setopenDeleteConsommationPDRDialog(false);
        setopenUpdatingActionCorrectiveDialog(false);
        setopenUpdatingConsommationPDRDialog(false);
        setopenConfirmationDialog(false);
        setopenConfirmationStepTwoDialog(false);
    }
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
    const handleClickCloturePanne = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/panne/fourth/${code}`, 
                {
                    agent: decodedToken?.code
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
                Redirection(-1);
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
                console.error("Error closing panne: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error closing panne");
            }
        }
    }
    
    if (isPanneLoading || isActionCorrectiveLoading || isConsommationPDRLoading || 
        isActionLoading || isPieceLoading
    ) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (Panneerror || ActionCorrectiveerror || ConsommationPDRerror || 
        Actionerror || Pieceerror
    ) {
        return (
            <div className="CircularProgress-app">
                <h1>Une erreur s'est produite</h1>
                {/* <h1>{Panneerror ? Panneerror.message : ''}</h1>
                <h1>{Panneerror ? Panneerror.message : ''}</h1>
                <h1>{Workshopserror ? Workshopserror.message : ''}</h1> */}
            </div>
        );
    }
    // TimeCounter component
    const TimeCounter = ({ startTime, limiteTime }) => {
        const [elapsedTime, setElapsedTime] = useState('');
        useEffect(() => {
            if (!startTime) return;
            const calculateTimeDifference = () => {
                const now = new Date();
                const start = new Date(startTime);
                const diffInSeconds = Math.floor((now - start) / 1000);

                const hours = Math.floor(diffInSeconds / 3600);
                const minutes = Math.floor((diffInSeconds % 3600) / 60);
                const seconds = diffInSeconds % 60;

                const formattedHours = hours < 10 ? `0${hours}` : hours;
                const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

                setElapsedTime(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);

                // Check if time exceeds one hour and update `red` state
                if (limiteTime > 0 && diffInSeconds >= limiteTime) {
                    setRed(true);
                }else{
                    setRed(false);
                }   
            };

            calculateTimeDifference();
            const intervalId = setInterval(calculateTimeDifference, 1000);

            return () => clearInterval(intervalId);
        }, [startTime, red]);

        return <div className='time-counter-container'>
            <h1>Durée de réparation</h1>
            <span>{elapsedTime}</span>
        </div>;
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
                            {import.meta.env.VITE_AGENT_TYPE == decodedToken.type &&
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
                            {import.meta.env.VITE_AGENT_TYPE == decodedToken.type &&
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
    return (
        <div className="taken-panne-page-container">
            <div className='taken-panne-navbar-page-content'>
                <div className="taken-panne-navbar-page-container">
                    <div className='taken-panne-icon-container-navbar-page-container' onClick={() => Redirection(-1)}>
                        <ArrowBackIcon className='taken-panne-backIcon-icon-container'/>
                    </div>
                    <h1>Détails du Panne</h1>
                </div>
                <button className="take-in-charge-button" onClick={handleopenConfirmationDialog}>Clôture</button>

            </div>

            <div className="taken-panne-page-details-content">
                {/*Temps */}
                <div className={`taken-panne-page-form-container ${red ? 'red' : 'green'}`}>
                    <TextFieldComponent DefaultValue={formatDateTime(PanneData?.tempInitial)} label='Temps initiale' color={'#fff'} type='text' readOnly />
                    <TimeCounter startTime={PanneData?.tempInitial} limiteTime={PanneData?.typepanneAssociation.duree}/>
                </div>
                {/*Product */}
                <div className="taken-panne-page-header-container">
                    <h1>Produit :</h1>
                    <div className="icon-taken-panne-page-header-container" onClick={() => Redirection(`/produit/${PanneData?.productAssociation?.code}`)}>
                        <VisibilityIcon className='view-icon-taken-panne-page-header-container' />
                        <p>voir</p>
                    </div>
                </div>
                <div className="taken-panne-page-form-container">
                    <TextFieldComponent DefaultValue={PanneData?.productAssociation?.marque} label='Marque' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.productAssociation?.model} label='Modele' color={'#fff'} type='text' readOnly />
                </div>
                {/*Panne */}
                <div className="taken-panne-page-header-container">
                    <h1>Détails :</h1>
                </div>
                <div className="taken-panne-page-form-container">
                    <TextFieldComponent DefaultValue={PanneData?.code} label='Code' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.sn} label='SN' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.fournisseur} label='Fournisseur' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.ligne} label='Ligne' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.typepanneAssociation?.name} label='Panne' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={formatDateTime(PanneData?.dateDeclaration)} label='Date de declaration' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.workshopAssociation?.name} label='Atelier' color={'#fff'} type='text' readOnly />
                </div>
                <div className="taken-panne-page-form-container">
                    <TextFieldComponent DefaultValue={PanneData?.source ? PanneData?.source : 'indéfini'} label='Source' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.etat ? PanneData?.etat : 'indéfini'} label='Etat' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.liberation == true ? 'libérer' : 'Non libérer'} label='Liberation' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.liberation == true ? formatDate(PanneData?.dateLibiration) : 'Non libérer'} label='Date de libiration' color={'#fff'} type='text' readOnly />
                    <button className="take-in-charge-button" onClick={handleopenConfirmationStepTwoDialog}>Modifier</button>
                </div>
                {/*Action corrective et consommation PDR */}
                <div className="Action-PDR-panne-page-header-container">
                    <div className="Action-PDR-panne-page-header-content">
                        <div className='Action-PDR-panne-navbar-page-content'>
                            <div className="Action-PDR-panne-navbar-page-container">
                                <h1>Action corrective</h1>
                            </div>
                            <button className="Action-PDR-panne-navbar-page-content-button" onClick={handleopenCreateActionCorectiveDialog}>Ajouter une action</button>
                        </div>
                        <DataTable rows={5} data={ActionCorrectiveData} columns={columnsAction} download={false} viewColumns={true} filter={true} search={true} />
                    </div>
                    <div className="Action-PDR-panne-page-header-content">
                        <div className='Action-PDR-panne-navbar-page-content'>
                            <div className="Action-PDR-panne-navbar-page-container">
                                <h1>Consommation PDR</h1>
                            </div>
                            <button className="Action-PDR-panne-navbar-page-content-button" onClick={handleopenCreateConsommationPDRDialog}>Ajouter une piece</button>
                        </div>
                        <DataTable rows={5} data={ConsommationPDRData} columns={columnsPDR} download={false} viewColumns={true} filter={true} search={true} />
                    </div>
                </div>
            </div>
            <UpdateStepTwoPanneDialog agent={decodedToken.code} code={code} user={user} open={openConfirmationStepTwoDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} />
            <CreateActionCorrectiveDialog agent={decodedToken.code} code={code} user={user} open={openCreateActionCorrectiveDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} ActionList={ActionsData}/>
            <UpdateActionCorrectiveDialog agent={decodedToken.code} code={currentCode} user={user} open={openUpdatingActionCorrectiveDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} ActionList={ActionsData}/>
            <DeletingDialog name={'d\'une action corrective'} loading={submitionLoading} open={openDeleteActionCorrectiveDialog} handleClose={handleClose} handleOnDelete={handleDeleteActionCorrective}/>
            <CreateConsommationPDRDialog agent={decodedToken.code} code={code} user={user} open={openCreateConsommationPDRDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} PieceList={PiecesData}/>
            <UpdateConsommationPDRDialog agent={decodedToken.code} code={currentCode} user={user} open={openUpdatingConsommationPDRDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} PieceList={PiecesData}/>
            <DeletingDialog name={'d\'une consommation PDR'} loading={submitionLoading} open={openDeleteConsommationPDRDialog} handleClose={handleClose} handleOnDelete={handleDeleteConsommationPDR}/>
            <ConfirmationDialog open={openConfirmationDialog} name={'clôture'} loading={submitionLoading} handleOnConfirm={handleClickCloturePanne} handleClose={handleClose} />
            <ToastContainer />
        </div>
    );
}

export default ReparationPanne;