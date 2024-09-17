import { useNavigate, useParams } from 'react-router-dom';
import TextFieldComponent from '../components/forms/TextField';
import { useAuthContext } from '../hooks/useAuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';
import './css/TakeInChargePannePageStyle.css';
import { toast, ToastContainer } from 'react-toastify';
import ConfirmTakeInChargeDialog from '../components/Dialogs/ConfirmTakeInChargeDialog'
import { useState } from 'react';
import axios from 'axios';
import { TokenDecoder } from "../util/DecodeToken";
import { formatDateTime } from '../util/UseFullFunctions';


const TakeInChargePanne = () => {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const { code } = useParams();
    const decodedToken = TokenDecoder();
    const { user } = useAuthContext();
    const [ open, setOpen ] = useState(false);
    const [submitionLoading, setSubmitionLoading] = useState(false);
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
    // fetching Technician data
    const fetchTechnicianData = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_APP_URL_BASE}/technician/zone/${decodedToken.zone}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.error.statusCode === 404) {
                throw new Error(errorData.message);
            } else {
                throw new Error("Erreur lors de la réception des données des techniciens");
            }
        }
        return response.json();
    };
    // useQuery hook to fetch data
    const {
        data: technicianList,
        error: technicianError,
        isLoading: isTechnicianLoading,
        refetch: technicianRefetch,
    } = useQuery({
        queryKey: ['TechnicianList', user?.token],
        queryFn: fetchTechnicianData,
        enabled: !!user?.token,
        refetchOnWindowFocus: true,
    });

    // Redirection function
    const Redirection = (path) => {
        navigate(path);
    }
    const onHandleClicktakeInChargePanne = async (technician) => {
        try {
            setSubmitionLoading(true);
            const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/panne/second/${code}`, 
                {
                    codeT: technician,
                    agent: decodedToken.code,
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
                Redirection(`/panne/reparation/${code}`);
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
                {PanneData?.technician == null &&
                    <button className="take-in-charge-button" onClick={handleOpenConfirmationDialog}>Prendre en charge</button>
                }
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
                    <TextFieldComponent DefaultValue={PanneData?.typepanneAssociation?.name} label='Panne' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={formatDateTime(PanneData?.dateDeclaration)} label='Date de declaration' color={'#fff'} type='text' readOnly />
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
            <ConfirmTakeInChargeDialog TechnicianList={technicianList} open={open} name={'prise en charge'} loading={submitionLoading} handleOnConfirm={onHandleClicktakeInChargePanne} handleClose={handleClose} />
            <ToastContainer />
        </div>
    );
}

export default TakeInChargePanne;