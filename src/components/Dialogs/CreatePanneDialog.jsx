import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Box, DialogContent, List } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { TokenDecoder } from '../../util/DecodeToken';
import { useAuthContext } from '../../hooks/useAuthContext';

const StyledButton = styled(Button)(({ theme }) => ({
  color: '#DA171B',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor:'red',
    color: '#FFF',
  },
  padding: '8px 16px',
  borderRadius: '4px',
  textTransform: 'none',
  width: '20%',
  fontSize: '14px',
  fontWeight: 'bold',
}));

export default function PanneDialog(props) {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);

    const { user } = useAuthContext();
    const decodedToken = TokenDecoder();

    const [Modele, setModele] = useState('');
    const handleModeleChange = (event) => {
        setModele(event.target.value);
    };
    const [Marque, setMarque] = useState('STREAM');
    const handleMarqueChange = (event) => {
        setMarque(event.target.value);
    };
    const [family, setFamily] = useState('');
    const handlefamilyChange = (event) => {
        setFamily(event.target.value);
    };
    const [atelier, setAtelier] = useState('');
    const handleAtelierChange = (event) => {
        setAtelier(event.target.value);
    };
    const [lot, setLot] = useState('');
    const handlelotChange = (event) => {
        setLot(event.target.value);
    };
    const [arrival, setArrival] = useState('');
    const handleArrivalChange = (event) => {
        setArrival(event.target.value);
    };
    const [fournisseur, setFournisseur] = useState('');
    const handleFournisseurChange = (event) => {
        setFournisseur(event.target.value);
    }
    const [ligne, setLigne] = useState('');
    const handleLigneChange = (event) => {
        setLigne(event.target.value);
    }
    const [selectedPannes, setSelectedPannes] = useState([]);
    const handleSelectedPannesChange = (value) => {
        setSelectedPannes([...selectedPannes, value]);
    }
    const handleDeleteSelectedPannes = (code) => {
        setSelectedPannes(selectedPannes.filter((panne) => panne.code !== code));
    }
    const [panne, setPanne] = useState('');
    const handlePanneChange = (event) => {
        const selectedValue = event.target.value;
        setPanne(selectedValue);
    
        // Find the corresponding option based on the selected value
        const selectedOption = PanneTypeList.find(option => option.name == selectedValue);
        
        // Check if the selected option is already in the selectedPannes array
        const isAlreadySelected = selectedOption && selectedPannes.some(panne => panne.code === selectedOption.code);
        if (!isAlreadySelected) {
            handleSelectedPannesChange({
                value: selectedOption.name,
                code: selectedOption.code,
            });
        }
    };
    const [sn, setSN] = useState('');
    const handleSNChange = (event) => {
        setSN(event.target.value);
    }
    const [CopiedText, setCopiedText] = useState('');
    const handleCopiedTextChange = (event) => {
        setCopiedText(event.target.value);
    }

    // fetching products data
    const fetchProductsData = async () => {
        let response;
        if (import.meta.env.VITE_AGENT_TYPE == decodedToken.type) {
            response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/product/${decodedToken.zone}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );
        }

        // Handle the error state
        if (!response.ok) {
            const errorData = await response.json();
            if(errorData.error.statusCode == 404)
                return [];
            else
                throw new Error("Error receiving Products data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: ProductsData, error, isLoading, refetch } = useQuery({
        queryKey: ['productsData', user?.token],
        queryFn: fetchProductsData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });

    const handleSelectedProductChange = (event) => {
        const selectedIndex = event.target.value;
        const selectedProduct = ProductsData[selectedIndex];
        
        setModele(selectedProduct.model);
        setMarque(selectedProduct.marque);
        setFamily(selectedProduct.familyAssociation.code);
        setLot(selectedProduct.lotAssociation.name);
        setArrival(selectedProduct.arrivalAssociation.code);
    }


    const extractAndSetValues = () => {
        //check if the copied text is empty
        if(!CopiedText || CopiedText == '' ) {
            notifyFailed('Veuillez scanner le texte avant de cliquer sur le bouton');
            return;
        }
        // Extract the Modele from character 6 to 11
        const Copiedmodele = CopiedText.substring(5, 11);

        // Extract the Lot from character 14 to 17
        const Copiedlot = CopiedText.substring(13, 17);

        // Extract the SN from character 18 to 22
        const Copiedsn = CopiedText.substring(17, 22);

        // Set the extracted values in the form
        const selectedProduct = ProductsData.filter((item) => item.model === Copiedmodele)[0];
        
        if(selectedProduct){
            setModele(selectedProduct.model);
            setMarque(selectedProduct.marque);
            setFamily(selectedProduct.familyAssociation.code);
            setLot(selectedProduct.lotAssociation.name);
            setArrival(selectedProduct.arrivalAssociation.code);
            setSN(Copiedsn);
        }else{
            setModele(Copiedmodele);
            setLot(Copiedlot);
            setSN(Copiedsn);
        }
    };
    
    // empty all fields
    const clearFields = () => {
        //setMarque('');
        setFournisseur('');
        setModele('');
        setFamily('');
        setAtelier('');
        setLot('');
        setLigne('');
        setPanne('');
        setSN('');
        setArrival('');
        setCopiedText('');
    };
    // Fetch family data
    const fetchfamilyData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/family`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.user?.token}`,
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
        queryKey: ['familyList', props.user?.token],
        queryFn: fetchfamilyData,
        enabled: !!props.user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // Fetch atelier data
    const fetchAtelierData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/workshop/${props.zone}`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.user?.token}`,
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
        queryKey: ['atelierList', props.user?.token],
        queryFn: fetchAtelierData,
        enabled: !!props.user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // Fetch PanneType data
    const fetchPanneTypeData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/pannetype`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.user?.token}`,
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
        queryKey: ['PanneTypeList', props.user?.token],
        queryFn: fetchPanneTypeData,
        enabled: !!props.user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Lot data
    const fetchLotData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/lot`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${props.user?.token}`,
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
        queryKey: ['LotList', props.user?.token],
        queryFn: fetchLotData,
        enabled: !!props.user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Arrival data
    const fetchArrivalData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/arrival`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${props.user?.token}`,
                },
            }
        );

        // Handle the error state
        if (!response.ok) {
            const errorData = await response.json();
            if(errorData.error.statusCode == 404)
                return [];
            else
                throw new Error("Error receiving Arrival data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: ArrivalList, error: Arrivalerror, Loading: isArrivalLoading, refetch: Arrivalrefetch } = useQuery({
        queryKey: ['ArrivalList', props.user?.token],
        queryFn: fetchArrivalData,
        enabled: !!props.user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    //save the panne
    const handleSave = async () => {
        try {
            const response = await axios.post(import.meta.env.VITE_APP_URL_BASE+`/panne/first/${props.agent}`, 
                { 
                    model: Modele,
                    marque: Marque,
                    lot: lot,
                    family: family,
                    workshop: atelier,
                    fournisseur: fournisseur,
                    panne: selectedPannes,
                    ligne: ligne,
                    sn: sn,
                    arrival: arrival,
                }, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${props.user?.token}`,
                    }
                }
            );
            if (response.status === 200) {
                notifySuccess(response.data.message);
                clearFields();
                props.refetchData();
                props.handleClose();
            } else {
                notifyFailed(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                notifyFailed(error.response.data.message);
            } else if (error.request) {
                // Request was made but no response was received
                console.error("Error creating panne: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error creating panne");
            }
        }
    };
    return (
        <React.Fragment>
        <Dialog
            fullScreen
            open={props.open}
            onClose={props.handleClose}
            PaperProps={{
                sx: {
                  backgroundColor: '#0080ff',
                },
            }}
        >
            <AppBar 
                sx={{ 
                    backgroundColor: '#0056ac' 
                }}
            >
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={props.handleClose}
                aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1,  }} variant="h6" component="div" >
                    Ajouter une panne
                </Typography>
                <div 
                    style={{
                        display: 'flex',
                        flexDirection: 'row', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        marginInlineEnd: '10px'
                    }}
                >
                    <DocumentScannerIcon onClick={extractAndSetValues}/>   
                    <input
                        className={`input-text-field-form`}
                        type="text"
                        value={CopiedText}
                        onChange={handleCopiedTextChange}
                        placeholder='Copier le texte ici'
                    />   
                    {CopiedText && CopiedText != '' &&
                            <HighlightOffIcon onClick={clearFields}/>
                    }

                </div>
                <StyledButton autoFocus color="inherit" onClick={handleSave}>
                    sauvgarder
                </StyledButton>
            </Toolbar>
            </AppBar>
            <List>
            <DialogContent sx={{ marginTop: '40px' }}> 
                {(isfamilyLoading || isatelierLoading) ?
                <Box display="flex" flexDirection="column" alignItems="centre" mt={2} sx={{ 
                    width: '100%',
                    height: '80vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: '20px',
                    gap: '20px',
                }}>
                    <CircularProgress 
                    sx={{
                        color: (theme) => (theme.palette.mode === 'light' ? '#fff' : 'fff'),
                        animationDuration: '2000ms',
                    }}
                    />
                    <h1 style={{fontSize: '1.5rem', color: '#fff', fontWeight: '500'}}>
                        Préparation du formulaire
                    </h1>
                </Box>
                : 
                <Box display="flex" flexDirection="column" alignItems="flex-start" mt={2} sx={{ width: '100%', gap: '10px' }}>
                    <div className='input-text-field-container'>
                        <label style={{ color: '#fff'}} className={`input-text-field-label`} >
                            Marque *:
                        </label>
                        <input
                            className={`input-text-field-form`}
                            type='text'
                            value={Marque}
                            onChange={handleMarqueChange}
                            placeholder='Entrer la marque de votre produite'
                        />
                    </div>

                    <div className='input-text-field-container'>
                        <label style={{ color: '#fff'}} className={`input-text-field-label`} >
                            Modele *:
                        </label>
                        <input
                                className={`input-text-field-form`}
                                type='text'
                                value={Modele}
                                onChange={handleModeleChange}
                                placeholder='Entrer le modele de votre produit'
                            />
                        {!Modele &&
                            <select
                                className='input-select-field-form'
                                value={Modele}
                                onChange={handleSelectedProductChange}
                            >
                                <option value="" disabled>{'Selectionner un modele'}</option>
                                {ProductsData?.map((option, index) => (
                                <option key={index} value={index}>
                                    {option.model}
                                </option>
                                ))}
                            </select>
                        }
                    </div>
                    <div className='input-select-field-container'>
                        <label className='input-select-field-label'>
                            Lot *:
                        </label>
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            {!CopiedText && CopiedText == '' ?
                                <select
                                    className='input-select-field-form'
                                    value={lot}
                                    onChange={handlelotChange}
                                >
                                    <option value="" disabled>{'Selectionner un lot'}</option>
                                    {LotList?.map((option, index) => (
                                    <option key={index} value={option.name}>
                                        {option.name}
                                    </option>
                                    ))}
                                </select>
                                :
                                <input
                                    className={`input-text-field-form`}
                                    type='text'
                                    value={lot}
                                    onChange={handlelotChange}
                                    placeholder='Entrer le lot de votre produit'
                                />
                            }
                            <select
                                className='input-select-field-form'
                                value={arrival}
                                onChange={handleArrivalChange}
                            >
                                <option value="" disabled>{'Selectionner un arrivage'}</option>
                                {ArrivalList?.map((option, index) => (
                                <option key={index} value={option.code}>
                                    {option.name}
                                </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='input-text-field-container'>
                        <label style={{ color: '#fff'}} className={`input-text-field-label`} >
                            SN *:
                        </label>
                        <input
                            className={`input-text-field-form`}
                            type='text'
                            value={sn}
                            onChange={handleSNChange}
                            placeholder='Entrer le SN de votre produit'
                        />
                    </div>
                    <div className='input-select-field-container'>
                        <label className='input-select-field-label'>
                            Famille *:
                        </label>
                        <select
                            className='input-select-field-form'
                            value={family}
                            onChange={handlefamilyChange}
                        >
                            <option value="" disabled>{'Selectionner une famille'}</option>
                            {familyList?.map((option, index) => (
                            <option key={index} value={option.code}>
                                {option.name}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div className='input-text-field-container'>
                        <label style={{ color: '#fff'}} className={`input-text-field-label`} >
                            Fournisseur *:
                        </label>
                        <input
                            className={`input-text-field-form`}
                            type='text'
                            value={fournisseur}
                            onChange={handleFournisseurChange}
                            placeholder='Entrer le fournisseur de votre produit'
                        />
                    </div>
                    <div className='input-text-field-container'>
                        <label style={{ color: '#fff'}} className={`input-text-field-label`} >
                            Ligne *:
                        </label>
                        <input
                            className={`input-text-field-form`}
                            type='text'
                            value={ligne}
                            onChange={handleLigneChange}
                            placeholder='Entrer la ligne de votre produit'
                        />
                    </div>
                    <div className='input-select-field-container'>
                        <label className='input-select-field-label'>
                            Type de panne *:
                        </label>
                        <select
                            className='input-select-field-form'
                            value={panne}
                            onChange={handlePanneChange}
                            >
                            <option value="" disabled>{'Selectionner un type de panne'}</option>
                            {PanneTypeList?.map((option, index) => (
                                <option key={option.code} value={option.name}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedPannes.length > 0 &&
                            <div className='panne-types-field-container'>
                                {selectedPannes.map((item, index) => (
                                    <div className='panne-types-field-container-card' key={index}>
                                        <label>
                                            {item.value}
                                        </label>
                                        <HighlightOffIcon 
                                            className='panne-types-field-container-card-icon' 
                                            onClick={()=>handleDeleteSelectedPannes(item.code)}
                                        />
                                    </div>
                                ))}
                            </div>
                    }
                    <div className='input-select-field-container'>
                        <label className='input-select-field-label'>
                            Atelier *:
                        </label>
                        <select
                            className='input-select-field-form'
                            value={atelier}
                            onChange={handleAtelierChange}
                        >
                            <option value="" disabled>{'Selectionner un atelier'}</option>
                            {atelierList?.map((option, index) => (
                            <option key={index} value={option.code}>
                                {option.name}
                            </option>
                            ))}
                        </select>
                    </div>
                </Box>
                }
            </DialogContent>
            </List>
        </Dialog>
        </React.Fragment>
    );
    }
