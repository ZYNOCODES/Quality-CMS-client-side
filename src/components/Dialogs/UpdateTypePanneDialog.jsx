import './css/DialogStyle.css'
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress, TextField } from '@mui/material';
import axios from 'axios';
import SelectFieldComponent from '../forms/SelectField';

export default function UpdateTypePanneDialog(props) {
    const notifyWarning = (message) => toast.warning(message);
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const [ loading, setLoading ] = useState(false);
    const [ Type, setType ] = useState('');
    const handleTypeChange = (event) => {
        setType(event.target.value);
    };
    const [ confirmation, setconfirmation ] = useState(false);
    const handleConfirmation = (event) => {
        setconfirmation(event.target.checked);
    };

    const handleOnCreate = async (event) => {
        if(!Type){
            setconfirmation(false);
            notifyFailed("Le champ type doivent être remplis");
            return;
        }
        if (confirmation) {
            try {
                setLoading(true);
                const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/pannetypeassignment/update/${props.code}`, 
                    {
                        typePanne: Type,
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
                    setLoading(false);
                    props.handleRefetchData();
                    props.handleClose();
                } else {
                    notifyFailed(response.data.message);
                    setLoading(false);
                }
            } catch (error) {
                if (error.response) {
                    notifyFailed(error.response.data.message);
                    setLoading(false);
                } else if (error.request) {
                    // Request was made but no response was received
                    console.error("Error updating type panne: No response received");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("Error updating type panne", error);
                }
            }
            setconfirmation(false);
            setType('');
        }else{
            notifyWarning("Veuillez confirmer la modification");
        }
    };

    const handleClose = () => {
        setconfirmation(false);
        props.handleClose();
    };

    return (
        <Dialog
            open={props.open}
            onClose={false}
            PaperProps={{
                component: 'form',
            }}
        >
            {!loading && 
                <>
                    <DialogTitle>Modification d'un type de panne</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Cette modification sera appliquée directement après la confirmation.
                        </DialogContentText>
                        <SelectFieldComponent
                            label="Type" 
                            initialHelperText="Selectionner un type" 
                            onChange={handleTypeChange}
                            obligatory={true}
                            options={props.TypeList}
                            optionName='name'
                            optionIdentifier='code'
                        />
                        
                        <FormControlLabel
                            sx={{ mt: 1 }}
                            control={
                                <Switch checked={confirmation} onChange={handleConfirmation} />
                            }
                            label="Oui je confirme cette modification"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Annuler</Button>
                        <Button onClick={handleOnCreate}>confirmer</Button>
                    </DialogActions>
                </>
            }
            {loading && (
                <div className="dialog-loading-container">
                    <DialogContent>
                        <DialogContentText className="dialog-text-loading" id="alert-dialog-description">
                        Ce processus peut prendre un certain temps en fonction de votre connexion Internet, soyez patient.                        </DialogContentText>
                    </DialogContent>
                    <CircularProgress className="CircularProgress" />
                </div>
            )}
        </Dialog>
    );
}
