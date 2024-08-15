import React, { useEffect, useState } from 'react';
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

export default function ProductDialog(props) {
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
  const [zone, setZone] = useState('');
  const handlezoneChange = (event) => {
    setZone(event.target.value);
  };
  const [lot, setLot] = useState('');
  const handlelotChange = (event) => {
    setLot(event.target.value);
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
        throw new Error(errorData.message);
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
  // Fetch zone data
  const fetchzoneData = async () => {
    const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/zone`,
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
        throw new Error(errorData.message);
      else
        throw new Error("Error receiving Zones data");
    } 
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch zone data
  const { data: zoneList, error: zoneError, isLoading: iszoneLoading, refetch: zoneRefetch } = useQuery({
    queryKey: ['zoneList', props.user?.token],
    queryFn: fetchzoneData,
    enabled: !!props.user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  const handleSave = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_APP_URL_BASE+`/product`, 
        { 
          model: Modele,
          marque: Marque,
          family: family,
          zone: zone,
          lot: lot,
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
        console.error("Error creating Product: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error creating Product");
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
              Ajouter un produit
            </Typography>
            <StyledButton autoFocus color="inherit" onClick={handleSave}>
              sauvgarder
            </StyledButton>
          </Toolbar>
        </AppBar>
        <List>
        <DialogContent sx={{ marginTop: '40px' }}> 
            {(isfamilyLoading || iszoneLoading) ?
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
                    minLength={0} 
                    maxLength={100}
                    onChange={handleMarqueChange}
                    obligatory={true}
                    color='#fff'
                />
                <TextFieldComponent 
                    type="text" 
                    label="Modele" 
                    initialHelperText="Entrer le modele de votre produit" 
                    minLength={0} 
                    maxLength={100} 
                    onChange={handleModeleChange}
                    obligatory={true}
                    color='#fff'
                />
                <TextFieldComponent 
                    type="text" 
                    label="lot" 
                    initialHelperText="Entrer le lot de votre produit" 
                    minLength={0} 
                    maxLength={100}
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
                />
                <SelectFieldComponent 
                    label="Zone" 
                    initialHelperText="Selectionner une zone" 
                    onChange={handlezoneChange}
                    obligatory={true}
                    options={zoneList}
                    optionName='name'
                />
              </Box>
            }
        </DialogContent>
        </List>
      </Dialog>
    </React.Fragment>
  );
}
