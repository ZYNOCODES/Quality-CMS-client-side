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
import QuantityPickerComponent from '../forms/QuantityPicker';

export default function UpdateActionDialog(props) {
    const notifyWarning = (message) => toast.warning(message);
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const [ loading, setLoading ] = useState(false);
    const [ Name, setName ] = useState('');
    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const [ confirmation, setconfirmation ] = useState(false);
    const handleConfirmation = (event) => {
        setconfirmation(event.target.checked);
    };
    const [Duree, setDuree] = useState('');
    const handleDureeChange = (event) => {
        setDuree(event.target.value);
    };
    const [DureeType, setDureeType] = useState('');
    const handleDureeTypeChange = (event) => {
        setDureeType(event.target.value);
    };

    const handleDureeConvertorToMillSecondes = () => {
        const duration = parseFloat(Duree);
        if(!isNaN(duration) && Number(duration) >= 0){
            let milliseconds;
            if (DureeType == 'min') {
                milliseconds = duration * 60; // Convert minutes to milliseconds
            } else if (DureeType == 'h') {
                milliseconds = duration * 60 * 60; // Convert hours to milliseconds
            } else {
                notifyFailed('Type de durée non pris en charge (min ou h)');
                return 400;
            }
            return milliseconds;
        }else{
            return null;
        }
    };
    // empty all fields
    const clearFields = () => {
        setconfirmation(false);
        setName('');
        setDuree('');
        setDureeType('');
    }

    const handleOnUpdate = async (event) => {
        let duree = handleDureeConvertorToMillSecondes();
        if(!Name && duree == null){
            setconfirmation(false);
            notifyFailed("Un des champs doivent être remplis");
            return;
        }
        if(duree == 400){
            return;
        }
        if (confirmation) {
            try {
                setLoading(true);
                const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/action/${props.code}`, 
                    {
                        name: Name,
                        duree: duree != null ? duree.toString() : '',
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
                    console.error("Error updating action: No response received");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("Error updating action", error);
                }
            }
            clearFields();
        }else{
            notifyWarning("Veuillez confirmer la modification");
        }
    };

    const handleClose = () => {
        clearFields();
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
                    <DialogTitle>Modification {props.name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Cette modification sera appliquée directement après la confirmation.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="Nom"
                            label="Entrez le nom du action"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={handleNameChange}
                        />
                        <QuantityPickerComponent
                            label="Durée"
                            onChange={handleDureeChange}
                            duree={Duree}
                            typeChange={handleDureeTypeChange}
                            type={DureeType}
                            color='#fff'
                            min={0}
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
                        <Button onClick={handleOnUpdate}>confirmer</Button>
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
