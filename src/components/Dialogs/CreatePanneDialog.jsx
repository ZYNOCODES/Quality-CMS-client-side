import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Box, DialogContent, List } from '@mui/material';
import TextFieldComponent from '../forms/TextField';
import SelectFieldComponent from '../forms/SelectField';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

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
    const [Modele, setModele] = useState('');
    const handleModeleChange = (event) => {
        setModele(event.target.value);
    };
    const [Marque, setMarque] = useState('');
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
    const [fournisseur, setFournisseur] = useState('');
    const handleFournisseurChange = (event) => {
        setFournisseur(event.target.value);
    }
    const [ligne, setLigne] = useState('');
    const handleLigneChange = (event) => {
        setLigne(event.target.value);
    }
    const [panne, setPanne] = useState('');
    const handlePanneChange = (event) => {
        setPanne(event.target.value);
    }
    const [sn, setSN] = useState('');
    const handleSNChange = (event) => {
        setSN(event.target.value);
    }
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
    // empty all fields
    const clearFields = () => {
        setMarque('');
        setModele('');
        setFamily('');
        setAtelier('');
        setLot('');
        setFournisseur('');
        setLigne('');
        setPanne('');
        setSN('');
    }
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
                    panne: panne,
                    ligne: ligne,
                    sn: sn
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
            PaperProps={{
                sx: {
                backgroundColor: '#0080ff',
                },
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
                <Box display="flex" flexDirection="column" alignItems="flex-start" mt={2} sx={{ width: '100%' }}>
                    <TextFieldComponent 
                        type="text" 
                        label="Marque" 
                        initialHelperText="Entrer la marque de votre produite" 
                        onChange={handleMarqueChange}
                        obligatory={true}
                        color='#fff'
                    />
                    <TextFieldComponent 
                        type="text" 
                        label="Modele" 
                        initialHelperText="Entrer le modele de votre produit" 
                        onChange={handleModeleChange}
                        obligatory={true}
                        color='#fff'
                    />
                    <TextFieldComponent 
                        type="text" 
                        label="lot" 
                        initialHelperText="Entrer le lot de votre produit" 
                        onChange={handlelotChange}
                        obligatory={true}
                        color='#fff'
                    />
                    <SelectFieldComponent 
                        label="Famille" 
                        initialHelperText="Selectionner une famille" 
                        onChange={handlefamilyChange}
                        obligatory={true}
                        options={familyList}
                        optionName='name'
                        optionIdentifier='code'
                    />
                    <TextFieldComponent 
                        type="text" 
                        label="fournisseur" 
                        initialHelperText="Entrer le fournisseur de votre produit" 
                        onChange={handleFournisseurChange}
                        obligatory={true}
                        color='#fff'
                    />
                    <TextFieldComponent 
                        type="text" 
                        label="ligne" 
                        initialHelperText="Entrer la ligne de votre produit" 
                        onChange={handleLigneChange}
                        obligatory={true}
                        color='#fff'
                    />
                    <SelectFieldComponent 
                        label="Type de panne" 
                        initialHelperText="Selectionner un type" 
                        onChange={handlePanneChange}
                        obligatory={true}
                        options={PanneTypeList}
                        optionName='name'
                        optionIdentifier='code'
                    />
                    <TextFieldComponent 
                        type="text" 
                        label="sn" 
                        initialHelperText="Entrer le SN de votre produit" 
                        onChange={handleSNChange}
                        obligatory={true}
                        color='#fff'
                    />
                    <SelectFieldComponent 
                        label="Atelier" 
                        initialHelperText="Selectionner un atelier" 
                        onChange={handleAtelierChange}
                        obligatory={true}
                        options={atelierList}
                        optionName='name'
                        optionIdentifier='code'
                    />
                </Box>
                }
            </DialogContent>
            </List>
        </Dialog>
        </React.Fragment>
    );
    }
