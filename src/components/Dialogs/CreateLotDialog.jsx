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

export default function LotDialog(props) {
  const notifyFailed = (message) => toast.info(message);
  const notifySuccess = (message) => toast.success(message);
  const [Name, setName] = useState('');
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  // empty all fields
  const clearFields = () => {
      setName('');
  }
  const handleSave = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_APP_URL_BASE+`/lot/create`, 
        { 
          name: Name,
        }, 
        {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${props.user?.token}`,
          }
        }
      );
      if (response.status === 200) {
        props.handleClose();
        notifySuccess(response.data.message);
        clearFields();
        props.refetchData();
      } else {
        notifyFailed(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        notifyFailed(error.response.data.message);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error creating lot: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error creating lot");
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
            backgroundColor: '#ff0000',
          },
        }}
      >
        <AppBar 
          sx={{
            backgroundColor: '#191919',
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
              Ajouter un lot
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
                label="Name" 
                initialHelperText="Entrer le nom du lot" 
                onChange={handleNameChange}
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
