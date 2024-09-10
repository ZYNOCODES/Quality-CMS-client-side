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
import moment from 'moment';
import ConfirmationDialog from '../components/Dialogs/ConfirmationDialog';
import './css/TakeInChargePannePageStyle.css';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useState } from 'react';

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
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${month} ${day}, ${year} at ${hours}:${formattedMinutes}`;
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
const formatDuration = (mill) => {
    // Handle case where mill is null or undefined
    if (mill === null || mill === undefined) {
        return "Durée non disponible";
    }

    // Create duration object
    const duration = moment.duration(mill);
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    // Build the formatted duration string
    let formattedDuration = '';

    if (days > 0) {
        formattedDuration += `${days} jour${days > 1 ? 's' : ''}, `;
    }
    if (hours > 0) {
        formattedDuration += `${hours} heure${hours > 1 ? 's' : ''}, `;
    }
    if (minutes > 0) {
        formattedDuration += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
    }
    if (seconds > 0 || formattedDuration === '') { // Include seconds if no other units are present
        formattedDuration += `${seconds} seconde${seconds > 1 ? 's' : ''}`;
    }

    return formattedDuration || "0 secondes";
};
const PanneDetails = () => {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const { code } = useParams();
    const { user } = useAuthContext();
    const decodedToken = TokenDecoder();
    const navigate = useNavigate();
    const [submitionLoading, setSubmitionLoading] = useState(false);
    const [ open, setOpen ] = useState(false);

    const handleOpenConfirmationDialog = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

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
    // Redirection function
    const Redirection = (path) => {
        navigate(path);
    }
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
    ]; 
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
                    <button className="take-in-charge-button" onClick={handleOpenConfirmationDialog}>Livre</button>
                }
            </div>
            <div className="panne-page-details-content">
                {/*Product */}
                <div className="panne-page-header-container">
                    <h1>Produit :</h1>
                    <div className="icon-panne-page-header-container" onClick={() => Redirection(`/produit/${PanneData?.productAssociation?.code}`)}>
                        <VisibilityIcon className='view-icon-panne-page-header-container' />
                        <p>voir</p>
                    </div>
                </div>
                <div className="panne-page-form-container">
                    <TextFieldComponent DefaultValue={PanneData?.productAssociation?.marque} label='Marque' color={'#191919'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.productAssociation?.model} label='Modele' color={'#191919'} type='text' readOnly />
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
                            <TextFieldComponent DefaultValue={PanneData?.technicianAssociation?.fullname} label='Nom complet' color={'#191919'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.technicianAssociation?.phoneNumber} label='Numero de telephone' color={'#191919'} type='text' readOnly />
                        </div>
                    </>
                }
                {/*Panne */}
                <div className="panne-page-header-container">
                    <h1>Détails :</h1>
                </div>
                <div className="panne-page-form-container">
                    <TextFieldComponent DefaultValue={PanneData?.code} label='Code' color={'#191919'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.sn} label='SN' color={'#191919'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.fournisseur} label='Fournisseur' color={'#191919'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.ligne} label='Ligne' color={'#191919'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.typepanneAssociation?.name} label='Panne' color={'#191919'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={formatDateTime(PanneData?.dateDeclaration)} label='Date de declaration' color={'#191919'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.workshopAssociation?.name} label='Atelier' color={'#191919'} type='text' readOnly />
                    {PanneData?.dateReparation != null &&
                        <>
                            <TextFieldComponent DefaultValue={PanneData?.source ? PanneData?.source : 'NON DÉFINI'} label='Source' color={'#191919'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.etat ? PanneData?.etat : 'NON DÉFINI'} label='Etat' color={'#191919'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.liberation ? 'libérer' : 'Non libérer'} label='Liberation' color={'#191919'} type='text' readOnly />
                            {PanneData?.liberation &&
                                <TextFieldComponent DefaultValue={PanneData?.liberation == true ? formatDate(PanneData?.dateLibiration) : 'Non libérer'} label='Date de libiration' color={'#191919'} type='text' readOnly />
                            }
                        </>    
                    }
                </div>
                {PanneData?.dateReparation != null &&
                    <>
                        {/*Temps */}
                        <div className={`taken-panne-page-form-container`}>
                            <TextFieldComponent DefaultValue={formatDateTime(PanneData?.tempInitial)} label='Temps initiale' color={'#191919'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={formatDateTime(PanneData?.tempFinal)} label='Temps finale' color={'#191919'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={formatDuration(PanneData?.dureeDintervention)} label="Durée d'intervention" color={'#191919'} type='text' readOnly />
                        </div>
                        {/*Action corrective et consommation PDR */}
                        <div className="Action-PDR-panne-page-header-container">
                            <div className="Action-PDR-panne-page-header-content">
                                <div className='Action-PDR-panne-navbar-page-content'>
                                    <div className="Action-PDR-panne-navbar-page-container">
                                        <h1>Action corrective</h1>
                                    </div>
                                </div>
                                <DataTable rows={5} data={ActionCorrectiveData} columns={columnsAction} download={true} viewColumns={true} filter={true} search={true} />
                            </div>
                            <div className="Action-PDR-panne-page-header-content">
                                <div className='Action-PDR-panne-navbar-page-content'>
                                    <div className="Action-PDR-panne-navbar-page-container">
                                        <h1>Consommation PDR</h1>
                                    </div>
                                </div>
                                <DataTable rows={5} data={ConsommationPDRData} columns={columnsPDR} download={true} viewColumns={true} filter={true} search={true} />
                            </div>
                        </div>
                    </>
                }
            </div>
            <ConfirmationDialog open={open} name={'livraison'} loading={submitionLoading} handleOnConfirm={onHandleClickDelivredPanne} handleClose={handleClose} />
            <ToastContainer/>
        </div>
    );
}

export default PanneDetails;