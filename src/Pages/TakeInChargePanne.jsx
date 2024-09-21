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
import ConfirmationDialog from '../components/Dialogs/ConfirmationDialog';
import SelectFieldComponent from '../components/forms/SelectField';
import DataTable from '../components/tables/DataTable';
import CreateTypePanneDialog from '../components/Dialogs/CreateTypePanneDialog'
import UpdateTypePanneDialog from '../components/Dialogs/UpdateTypePanneDialog';
import DeletingDialog from '../components/Dialogs/DeletingDialog';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const TakeInChargePanne = () => {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const { code } = useParams();
    const decodedToken = TokenDecoder();
    const { user } = useAuthContext();
    const [submitionLoading, setSubmitionLoading] = useState(false);
    const navigate = useNavigate();

    const [ open, setOpen ] = useState(false);
    const handleOpenConfirmationDialog = () => {
        setOpen(true);
    }
    
    const [ openUpdate, setOpenUpdate ] = useState(false);
    const handleOpenConfirmationUpdateDialog = () => {
        setOpenUpdate(true);
    }

    const [isUpdate, setIsUpdate] = useState(false);
    const handleISUpdate = () => {
        setIsUpdate(true);
    }
    const handleISCancel = () => {
        setIsUpdate(false);
    }

    // Redirection function
    const Redirection = (path) => {
        navigate(path);
    }
    const [currentCode, setCurrentCode] = useState(null);
    const [ openCreateTypePanneDialog, setopenCreateTypePanneDialog ] = useState(false);
    const handleopenCreateActionCorectiveDialog = () => {
        setopenCreateTypePanneDialog(true);
    }

    const [ openDeleteTypePanneDialog, setopenDeleteTypePanneDialog ] = useState(false);
    const handleopenDeletePanneTypeDialog = (code) => {
        setCurrentCode(code);
        setopenDeleteTypePanneDialog(true);
    }

    const [ openUpdatingTypePanneDialog, setopenUpdatingTypePanneDialog ] = useState(false);
    const handleopenUpdatingPanneTypeDialog = (code) => {
        setCurrentCode(code);
        setopenUpdatingTypePanneDialog(true);
    }

    const handleClose = () => {
        setCurrentCode(null);
        setOpen(false);
        setOpenUpdate(false);
        setopenCreateTypePanneDialog(false);
        setopenDeleteTypePanneDialog(false);
        setopenUpdatingTypePanneDialog(false);
    }

    const columnsTypePanne = [
        {
            name: "typepanneAssociation",
            label: "Type",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value?.name}</p>;
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
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleopenUpdatingPanneTypeDialog(value)}>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleopenDeletePanneTypeDialog(value)}>
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


        //-----------------------------------API------------------------------------------
    
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
    // fetching PanneTypeAssignment data
    const fetchPanneTypeAssignmentData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_URL_BASE}/pannetypeassignment/${code}`,
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
                    throw new Error("Erreur lors de la récupération des données des PanneTypeAssignments");
                }
            }

            return await response.json();
        } catch (error) {
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: PanneTypeAssignmentData, error: PanneTypeAssignmenterror, Loading: isPanneTypeAssignmentLoading, refetch: PanneTypeAssignmentrefetch } = useQuery({
        queryKey: ['PanneTypeAssignmentData', user?.token],
        queryFn: fetchPanneTypeAssignmentData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // Fetch family data
    const fetchfamilyData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/family`,
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
            throw new Error("Error receiving Families data");
        } 
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch family data
    const { data: familyList, error: familyError, isLoading: isfamilyLoading, refetch: familyRefetch } = useQuery({
        queryKey: ['familyList', user?.token],
        queryFn: fetchfamilyData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // Fetch atelier data
    const fetchAtelierData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/workshop/${decodedToken.zone}`,
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
            throw new Error("Error receiving ateliers data");
        } 
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch atelier data
    const { data: atelierList, error: atelierError, isLoading: isatelierLoading, refetch: atelierRefetch } = useQuery({
        queryKey: ['atelierList', user?.token],
        queryFn: fetchAtelierData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // Fetch PanneType data
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
            throw new Error("Error receiving PanneTypes data");
        } 
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch PanneType data
    const { data: PanneTypeList, error: PanneTypeError, isLoading: isPanneTypeLoading, refetch: PanneTypeRefetch } = useQuery({
        queryKey: ['PanneTypeList', user?.token],
        queryFn: fetchPanneTypeData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
     // fetching Lot data
     const fetchLotData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/lot`,
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
                throw new Error("Error receiving lot data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: LotList, error: Loterror, Loading: isLotLoading, refetch: Lotrefetch } = useQuery({
        queryKey: ['LotList', user?.token],
        queryFn: fetchLotData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
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
                console.error("Error updating panne take in charge: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error updating panne take in charge", error);
            }
        }
    }

    // Form fields
    const [fournisseur, setFournisseur] = useState('');
    const handleFournisseurChange = (e) => {
        setFournisseur(e.target.value);
    }
    const [ligne, setLigne] = useState('');
    const handleLigneChange = (e) => {
        setLigne(e.target.value);
    }
    const [selectedTypepanne, setSelectedTypepanne] = useState('');
    const handleSelectedTypepanneChange = (e) => {
        setSelectedTypepanne(e.target.value);
    }
    const [selectedWorkshop, setSelectedWorkshop] = useState('');
    const handleSelectedWorkshopChange = (e) => {
        setSelectedWorkshop(e.target.value);
    }
    const [marque, setMarque] = useState('');
    const handleMarqueChange = (e) => {
        setMarque(e.target.value);
    }
    const [model, setModel] = useState('');
    const handleModelChange = (e) => {
        setModel(e.target.value);
    }
    const [sn, setSn] = useState('');
    const handleSnChange = (e) => {
        setSn(e.target.value);
    }
    const [selectedLot, setSelectedLot] = useState('');
    const handleSelectedLotChange = (e) => {
        setSelectedLot(e.target.value);
    }
    const [selectedFamily, setSelectedFamily] = useState('');
    const handleSelectedFamilyChange = (e) => {
        setSelectedFamily(e.target.value);
    }

    const clearForm = () => {
        setFournisseur('');
        setLigne('');
        setSelectedTypepanne('');
        setSelectedWorkshop('');
        setMarque('');
        setModel('');
        setSn('');
        setSelectedLot('');
        setSelectedFamily('');
    }
    
    const onHandleClickUpdatePanne = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/panne/update/${code}`, 
                {
                    agent: decodedToken.code,
                    fournisseur: fournisseur,
                    ligne: ligne,
                    typepanne: selectedTypepanne,
                    workshop: selectedWorkshop,
                    marque: marque,
                    model: model,
                    sn: sn,
                    lot: selectedLot,
                    family: selectedFamily,
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
                handleISCancel();
                handleClose();
                clearForm();
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
                console.error("Error updating panne details: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error updating panne details", error);
            }
        }
    }

    const handleDeletePanneType = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/pannetypeassignment/${currentCode}/${decodedToken?.code}`, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    }
                }
            );
            if (response.status === 200) {
                notifySuccess(response.data.message);
                PanneTypeAssignmentrefetch();
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
                console.error("Error deleting type panne: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting type panne");
            }
        }
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
                    <>  
                        {isUpdate &&
                            <>
                                <button className="cancel-button" onClick={handleISCancel}>Annuler</button>
                                <button className="take-in-charge-button" onClick={handleOpenConfirmationUpdateDialog}>Modifie</button>
                            </>
                        }
                        {!isUpdate && 
                            <>
                                <button className="update-button" onClick={handleISUpdate}>Modifie</button>
                                <button className="take-in-charge-button" onClick={handleOpenConfirmationDialog}>Prendre en charge</button>
                            </>    
                        }
                    </>
                }
            </div>

            <div className="taken-panne-page-details-content">
                {/*Panne */}
                <div className="taken-panne-page-header-container">
                    <h1>Détails :</h1>
                </div>
                <div className="taken-panne-page-form-container">
                    {!isUpdate ?
                        <>
                            <TextFieldComponent DefaultValue={PanneData?.code} label='Code' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={formatDateTime(PanneData?.dateDeclaration)} label='Date de declaration' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.fournisseur} label='Fournisseur' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.ligne} label='Ligne' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.workshopAssociation?.name} label='Atelier' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.productAssociation.marque} label='Marque' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.productAssociation.model} label='Modele' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.productAssociation.sn} label='SN' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.productAssociation.lotAssociation?.name} label='Lot' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={PanneData?.productAssociation.familyAssociation?.name} label='Famille' color={'#fff'} type='text' readOnly />
                        </>
                        :
                        <>
                            <TextFieldComponent DefaultValue={PanneData?.code} label='Code' color={'#fff'} type='text' readOnly/>
                            <TextFieldComponent DefaultValue={formatDateTime(PanneData?.dateDeclaration)} label='Date de declaration' color={'#fff'} type='text' readOnly />
                            <TextFieldComponent DefaultValue={fournisseur} label='Fournisseur' color={'#fff'} type='text' 
                                onChange={handleFournisseurChange}
                            />
                            <TextFieldComponent DefaultValue={ligne} label='Ligne' color={'#fff'} type='text' 
                                onChange={handleLigneChange}
                            />
                            <SelectFieldComponent
                                label="Atelier" 
                                initialHelperText="Selectionner un atelier" 
                                onChange={handleSelectedWorkshopChange}
                                obligatory={false}
                                options={atelierList}
                                optionName='name'
                                optionIdentifier='code'
                            />
                            <TextFieldComponent DefaultValue={marque} label='Marque' color={'#fff'} type='text' 
                                onChange={handleMarqueChange}
                            />
                            <TextFieldComponent DefaultValue={model} label='Modele' color={'#fff'} type='text' 
                                onChange={handleModelChange}
                            />
                            <TextFieldComponent DefaultValue={sn} label='SN' color={'#fff'} type='text' 
                                onChange={handleSnChange}
                            />
                            <SelectFieldComponent
                                label="Lot" 
                                initialHelperText="Selectionner un lot" 
                                onChange={handleSelectedLotChange}
                                obligatory={false}
                                options={LotList}
                                optionName='name'
                                optionIdentifier='code'
                            />
                            <SelectFieldComponent
                                label="Famille" 
                                initialHelperText="Selectionner une famille" 
                                onChange={handleSelectedFamilyChange}
                                obligatory={false}
                                options={familyList}
                                optionName='name'
                                optionIdentifier='code'
                            />
                            
                        </>
                    }
                </div>
                {/* Panne types */}
                <div className="taken-panne-page-header-container">
                    <h1>Types de panne :</h1>
                    {isUpdate &&
                        <div className="icon-taken-panne-page-header-container" onClick={handleopenCreateActionCorectiveDialog}>
                            <AddCircleOutlineIcon className='view-icon-taken-panne-page-header-container' />
                        </div>
                    }
                </div>
                <div className="taken-panne-page-dataTable-container">
                    <DataTable rows={5} data={PanneTypeAssignmentData} columns={columnsTypePanne} download={false} viewColumns={true} filter={true} search={false} />
                </div>
            </div>
            <ConfirmTakeInChargeDialog 
                TechnicianList={technicianList} 
                open={open} 
                name={'prise en charge'} 
                loading={submitionLoading} 
                handleOnConfirm={onHandleClicktakeInChargePanne} 
                handleClose={handleClose} 
            />
            <ConfirmationDialog
                open={openUpdate} 
                name={'modification'} 
                loading={submitionLoading} 
                handleOnConfirm={onHandleClickUpdatePanne} 
                handleClose={handleClose} 
            />
            <CreateTypePanneDialog agent={decodedToken.code} code={code} user={user} open={openCreateTypePanneDialog} handleClose={handleClose} handleRefetchData={PanneTypeAssignmentrefetch} TypeList={PanneTypeList}/>
            <UpdateTypePanneDialog agent={decodedToken.code} code={currentCode} user={user} open={openUpdatingTypePanneDialog} handleClose={handleClose} handleRefetchData={PanneTypeAssignmentrefetch} TypeList={PanneTypeList}/>
            <DeletingDialog name={'d\'un type de panne'} loading={submitionLoading} open={openDeleteTypePanneDialog} handleClose={handleClose} handleOnDelete={handleDeletePanneType}/>
                                
            <ToastContainer />
        </div>
    );
}

export default TakeInChargePanne;