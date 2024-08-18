import { useNavigate, useParams } from 'react-router-dom';
import TextFieldComponent from '../components/forms/TextField';
import { useAuthContext } from '../hooks/useAuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';
import './css/TakeInChargePannePageStyle.css';
import ConfirmationDialog from '../components/Dialogs/ConfirmationDialog'
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

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

const TakeInChargePanne = () => {
    const { code } = useParams();
    const { user } = useAuthContext();
    const [ open, setOpen ] = useState(false);
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
    // Redirection function
    const Redirection = (path) => {
        navigate(path);
    }
    const takeInChargePanne = () => {
        alert('Take in charge')
    }
    const handleOpenConfirmationDialog = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    if (isPanneLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (Panneerror) {
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
        <div className="taken-panne-page-container">
            <div className='taken-panne-navbar-page-content'>
                <div className="taken-panne-navbar-page-container">
                    <div className='taken-panne-icon-container-navbar-page-container' onClick={() => Redirection(-1)}>
                        <ArrowBackIcon className='taken-panne-backIcon-icon-container'/>
                    </div>
                    <h1>Détails du Panne</h1>
                </div>
                <button className="take-in-charge-button" onClick={handleOpenConfirmationDialog}>Prendre en charge</button>
            </div>

            <div className="taken-panne-page-details-content">
                {/*Panne */}
                <div className="taken-panne-page-header-container">
                    <h1>Détails :</h1>
                </div>
                <div className="taken-panne-page-form-container">
                    <TextFieldComponent DefaultValue={PanneData?.code} label='Code' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.sn} label='SN' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.fournisseur} label='Fournisseur' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.ligne} label='Ligne' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.panne} label='Panne' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={formatDate(PanneData?.dateDeclaration)} label='Date de declaration' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={PanneData?.workshopAssociation?.name} label='Atelier' color={'#fff'} type='text' readOnly />
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
            </div>
            <ConfirmationDialog open={open} name={'prise en charge'} loading={false} handleOnConfirm={takeInChargePanne} handleClose={handleClose} />
            <ToastContainer />
        </div>
    );
}

export default TakeInChargePanne;