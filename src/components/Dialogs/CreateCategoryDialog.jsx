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
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const StyledButton = styled(Button)(({ theme }) => ({
  color: '#DA171B',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor:'#383838',
    color: '#FFF',
  },
  padding: '8px 16px',
  borderRadius: '4px',
  textTransform: 'none',
}));

export default function Categorydialog(props) {
  const notifyFailed = (message) => toast.info(message);
  const notifySuccess = (message) => toast.success(message);
  const [Nom, setNom] = useState('');
  const handleNomChange = (event) => {
    setNom(event.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_URL_BASE+`/categorie/create`, 
        { 
          Nom: Nom,
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
        props.handleClose();
      } else {
        notifyFailed(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        notifyFailed(error.response.data.message);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error creating Category: No response received", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error creating Category:", error.message);
      }
    }
    props.refetchData();
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={props.open}
        onClose={props.handleClose}
        PaperProps={{
          sx: {
            backgroundColor: '#DA171B',
          },
        }}
      >
        <AppBar  color='error' >
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
                Ajouter une categorie
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
                      label="Nom" 
                      initialHelperText="Entrer le nom du categorie" 
                      minLength={0} 
                      maxLength={15}
                      onChange={handleNomChange}
                      obligatory={true}
                      color='#fff'
                  />
            </Box>
          </DialogContent>
        </List>
      </Dialog>
    </React.Fragment>
  );
}
