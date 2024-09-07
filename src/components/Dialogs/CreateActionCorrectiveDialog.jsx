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

export default function ActionCorrectiveDialog(props) {
    const notifyWarning = (message) => toast.warning(message);
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const [ loading, setLoading ] = useState(false);
    const [ Mesure, setMesure ] = useState('');
    const handleMesureChange = (event) => {
        setMesure(event.target.value);
    };
    const [ Resultat, setResultat ] = useState('');
    const handleResultatChange = (event) => {
        setResultat(event.target.value);
    };
    const [ Action, setAction ] = useState('');
    const handleActionChange = (event) => {
        setAction(event.target.value);
    };
    const [ confirmation, setconfirmation ] = useState(false);
    const handleConfirmation = (event) => {
        setconfirmation(event.target.checked);
    };

    const handleOnCreate = async (event) => {
        if(!Action){
            setconfirmation(false);
            notifyFailed("Un des champs doivent être remplis");
            return;
        }
        if (confirmation) {
            try {
                setLoading(true);
                const response = await axios.post(import.meta.env.VITE_APP_URL_BASE+`/actioncorrective/${props.code}`, 
                    {
                        mesure: Mesure,
                        resultat: Resultat,
                        action: Action,
                        agent: props.agent
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
                    console.error("Error creating action corrective: No response received");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("Error creating action corrective", error);
                }
            }
            setconfirmation(false);
            setMesure('');
            setResultat('');
            setAction('');
        }else{
            notifyWarning("Veuillez confirmer la creation");
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
                    <DialogTitle>Creation d'une action corrective</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Cette creation sera appliquée directement après la confirmation.
                        </DialogContentText>
                        <SelectFieldComponent
                            label="Action" 
                            initialHelperText="Selectionner une Action" 
                            onChange={handleActionChange}
                            obligatory={true}
                            options={props.ActionList}
                            optionName='name'
                            optionIdentifier='code'
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="Mesure"
                            label="Entrez une mesure"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={handleMesureChange}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="Resultat"
                            label="Entrez une resultat"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={handleResultatChange}
                        />
                        <FormControlLabel
                            sx={{ mt: 1 }}
                            control={
                                <Switch checked={confirmation} onChange={handleConfirmation} />
                            }
                            label="Oui je confirme cette creation"
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
