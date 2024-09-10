import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Box, DialogContent, FormControlLabel, List, Switch } from '@mui/material';
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

export default function UpdateUserDialog(props) {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const [FullName, setFullName] = useState('');
    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
    };
    const [UserName, setUserName] = useState('');
    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    };
    const [zone, setZone] = useState('');
    const handlezoneChange = (event) => {
        setZone(event.target.value);
    };
    const [Password, setPassword] = useState('');
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const [Phone, setPhone] = useState('');
    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };

    // empty all fields
    const clearFields = () => {
        setFullName('');
        setUserName('');
        setZone('');
        setPassword('');
        setPhone('');
    }
    const handleSave = async () => {
        try {
            const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/agent/${props.code}`, 
            { 
                fullname: FullName,
                username: UserName,
                password: Password,
                phone: Phone,
                zone: zone,
            }, 
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${props.user?.token}`,
                }
            }
            );
            if (response.status === 200) {
                props.refetchData();
                props.handleClose();
                notifySuccess(response.data.message);
                clearFields();
            } else {
                notifyFailed(response.data.message);
            }
        } catch (error) {
            if (error.response) {
            notifyFailed(error.response.data.message);
            } else if (error.request) {
            // Request was made but no response was received
            console.error("Error updating user: No response received");
            } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error updating user");
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
                Modifier un agent
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
                        label="Nom complet" 
                        initialHelperText="Entrez le nom complet de votre utilisateur" 
                        minLength={0} 
                        maxLength={100} 
                        onChange={handleFullNameChange}
                        obligatory={true}
                        color='#fff'
                    />
                    <TextFieldComponent 
                        type="text" 
                        label="Nom d'utilisateur" 
                        initialHelperText="Entrez le nom d'utilisateur" 
                        minLength={0} 
                        maxLength={100}
                        onChange={handleUserNameChange}
                        obligatory={true}
                        color='#fff'
                    />
                    <TextFieldComponent 
                        type="text" 
                        label="Numero de telephone" 
                        initialHelperText="Entrez le numero de telephone d'utilisateur" 
                        minLength={0} 
                        maxLength={100}
                        onChange={handlePhoneChange}
                        obligatory={true}
                        color='#fff'
                    />
                    <TextFieldComponent 
                        type="password" 
                        label="Mot de passe" 
                        initialHelperText="Entrez le mot de passe de votre d'utilisateur" 
                        minLength={0} 
                        maxLength={100}
                        onChange={handlePasswordChange}
                        obligatory={true}
                        color='#fff'
                    />
                    <SelectFieldComponent 
                        label="Zone" 
                        initialHelperText="Selectionner une zone" 
                        onChange={handlezoneChange}
                        obligatory={true}
                        options={props.ZoneList}
                        optionName='name'
                        optionIdentifier= 'code'
                    />

                </Box>
            </DialogContent>
            </List>
        </Dialog>
        </React.Fragment>
    );
}
