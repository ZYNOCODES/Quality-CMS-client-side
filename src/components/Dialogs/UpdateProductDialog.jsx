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

export default function UpdateProductDialog(props) {
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
  const [TailleLot, setTailleLot] = useState('');
  const handleTailleLotChange = (event) => {
      setTailleLot(event.target.value);
  };

  // empty all fields
  const clearFields = () => {
    setModele('');
    setMarque('');
    setFamily('');
    setZone('');
    setLot('');
    setTailleLot('');
  }
  const handleSave = async () => {
    try {
      const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/product/update/${props.code}`, 
        { 
          model: Modele,
          marque: Marque,
          family: family,
          zone: zone,
          lot: lot,
          tailleLot: TailleLot,
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
        console.error("Error updating Product: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating Product");
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
              Modifier un produit
            </Typography>
            <StyledButton autoFocus color="inherit" onClick={handleSave}>
              sauvgarder
            </StyledButton>
          </Toolbar>
        </AppBar>
        <List>
        <DialogContent sx={{ marginTop: '40px' }}> 
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
                DefaultValue={Marque}
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
                DefaultValue={Modele}
            />
            <SelectFieldComponent 
                label="Lot" 
                initialHelperText="Selectionner un lot" 
                onChange={handlelotChange}
                obligatory={true}
                options={props.lotList}
                optionName='name'
                optionIdentifier='code'
            />
            <TextFieldComponent 
                type="text" 
                label="Taille du lot" 
                initialHelperText="Entrer la  taille du lot de votre produit" 
                minLength={0} 
                maxLength={100} 
                onChange={handleTailleLotChange}
                obligatory={true}
                color='#fff'
                DefaultValue={TailleLot}
            />
            <SelectFieldComponent 
                label="Famille" 
                initialHelperText="Selectionner une famille" 
                onChange={handlefamilyChange}
                obligatory={true}
                options={props.familyList}
                optionName='name'
                optionIdentifier='code'
            />
            <SelectFieldComponent 
                label="Zone" 
                initialHelperText="Selectionner une zone" 
                onChange={handlezoneChange}
                obligatory={true}
                options={props.zoneList}
                optionName='name'
                optionIdentifier='code'
            />
          </Box>
        </DialogContent>
        </List>
      </Dialog>
    </React.Fragment>
  );
}
