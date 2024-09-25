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
import NonSavedXLSXDisplayerDialog from './NonSavedXLSXDisplayerDialog';
import ConfirmationUploadExcelDialog from './ConfirmationUploadExcelDialog';

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

export default function ArrivalDialog(props) {
  const notifyFailed = (message) => toast.info(message);
  const notifySuccess = (message) => toast.success(message);
  const notifyWarning = (message) => toast.warning(message);

  const [Name, setName] = useState('');
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [nonSavedProducts, setNonSavedProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [ProductDisplayerDialog, setProductDisplayerDialog] = useState(false);
  const handleClickOpenProductDisplayer = (products) => {
    if (products.length === 0) return;
    setNonSavedProducts(products);
    setProductDisplayerDialog(true);
  };
  const handleCloseProductDisplayer = () => {
    setProductDisplayerDialog(false);
    setNonSavedProducts([]);
  };

  // empty all fields
  const clearFields = () => {
      setName('');
  }
  const handleSave = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_APP_URL_BASE+`/arrival/create`, 
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
        console.error("Error creating arrival: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error creating arrival");
      }
    }
  };

  const onUploadXLSXFile = async (formData) => {
    try {
      setSubmitionLoading(true);
      const response = await axios.post(import.meta.env.VITE_APP_URL_BASE+`/xlsx/upload/arrival`, 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${props.user?.token}`,
          }
        }
      );
      if (response.status === 200) {
        if(!response.data.success){
          notifyWarning(response.data.message);
          props.refetchData();
          props.handleClose();
          handleClose();
          setSubmitionLoading(false);
          handleClickOpenProductDisplayer(response.data.errorData);
        }else{
          notifySuccess(response.data.message);
          props.refetchData();
          props.handleClose();
          handleClose();
          setSubmitionLoading(false);
        }
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
        console.error("Error importing arrivals: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error importing arrivals", error);
      }
    }
  }
  const onConfirmCloseProductDisplayer = () => {
    handleCloseProductDisplayer();
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
              Ajouter un lot
            </Typography>
            <div 
              className='dialog-buttons-container'
            >
              <button 
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#fff",
                  color: "#DA171B",
                  fontWeight: "600",
                  fontSize: "12px",
                  letterSpacing: "1px",
                  cursor: "pointer"
                }}
                onClick={handleClickOpen}
              >
                Importer un fichier Excel
              </button>
              <button 
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#DA171B",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "12px",
                  letterSpacing: "1px",
                  cursor: "pointer",
                }}
                onClick={handleSave}
              >
                Sauvgarder
              </button>
            </div>
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
                DefaultValue={Name}
            />
          </Box>
        </DialogContent>
        </List>
      </Dialog>
      <ConfirmationUploadExcelDialog
        open={open} 
        handleClose={handleClose} 
        handleOnConfirm={onUploadXLSXFile}
        name="d'insertion des arrivages à partir d'un fichier Excel"
        loading={submitionLoading}
      />
      <NonSavedXLSXDisplayerDialog
        open={ProductDisplayerDialog} 
        handleClose={handleCloseProductDisplayer} 
        handleOnConfirm={onConfirmCloseProductDisplayer}
        name="Les arrivages non sauvegardés"
        loading={submitionLoading}
        products={nonSavedProducts}
      />
    </React.Fragment>
  );
}
