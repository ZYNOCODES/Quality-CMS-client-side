import { useNavigate, useParams } from 'react-router-dom';
import TextFieldComponent from '../components/forms/TextField';
import { useAuthContext } from '../hooks/useAuthContext';
import './css/PanneDetailsPageStyle.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';
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
const PanneDetails = () => {
    const { code } = useParams();
    const { user } = useAuthContext();
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
            <div className="panne-navbar-page-container">
                <div className='panne-icon-container-navbar-page-container' onClick={() => Redirection(-1)}>
                    <ArrowBackIcon className='panne-backIcon-icon-container'/>
                </div>
                <h1>Détails du Panne</h1>
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
                    <TextFieldComponent DefaultValue={PanneData?.productAssociation?.marque} label='Marque' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.productAssociation?.model} label='Modele' color={'#fff'} type='text' readOnly />
                </div>
                {/*Technician */}
                {(PanneData?.technician != null && PanneData?.technicianAssociation) &&
                    <>
                        <div className="panne-page-header-container">
                            <h1>Technicien :</h1>
                            <div className="icon-panne-page-header-container" onClick={() => Redirection(`/utilisateur/${PanneData?.technicianAssociation?.code}`)}>
                                <VisibilityIcon className='view-icon-panne-page-header-container' />
                                <p>voir</p>
                            </div>
                        </div>
                        <div className="panne-page-form-container">
                            <TextFieldComponent DefaultValue={PanneData?.technicianAssociation?.fullname} label='Nom complet' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.technicianAssociation?.phoneNumber} label='Numero de telephone' color={'#fff'} type='text' readOnly />
                        </div>
                    </>
                }
                {/*Panne */}
                <div className="panne-page-header-container">
                    <h1>Détails :</h1>
                </div>
                <div className="panne-page-form-container">
                    <TextFieldComponent DefaultValue={PanneData?.code} label='Code' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.sn} label='SN' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.fournisseur} label='Fournisseur' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.ligne} label='Ligne' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.panne} label='Panne' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={formatDateTime(PanneData?.dateDeclaration)} label='Date de declaration' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.workshopAssociation?.name} label='Atelier' color={'#fff'} type='text' readOnly />
                    {PanneData?.dateReparation != null &&
                        <>
                            <TextFieldComponent DefaultValue={PanneData?.source ? PanneData?.source : 'NON DÉFINI'} label='Source' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.etat ? PanneData?.etat : 'NON DÉFINI'} label='Etat' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.liberation ? 'libérer' : 'Non libérer'} label='Liberation' color={'#fff'} type='text' readOnly />
                            {PanneData?.liberation &&
                                <TextFieldComponent DefaultValue={PanneData?.liberation == true ? formatDate(PanneData?.dateLibiration) : 'Non libérer'} label='Date de libiration' color={'#fff'} type='text' readOnly />
                            }
                        </>    
                    }
                </div>
                {/*Temps */}
                <div className={`taken-panne-page-form-container`}>
                    <TextFieldComponent DefaultValue={formatDateTime(PanneData?.tempInitial)} label='Temps initiale' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={formatDateTime(PanneData?.tempFinal)} label='Temps finale' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.dureeDintervention} label="Durée d'intervention" color={'#fff'} type='text' readOnly />
                </div>
                {/*Action corrective et consommation PDR */}
                {PanneData?.dateReparation != null &&
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
                }
            </div>
            
        </div>
    );
}

export default PanneDetails;