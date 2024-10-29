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
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import SelectFieldComponent from '../forms/SelectField';

export default function UpdateStepTwoPanneDialog(props) {
    const notifyWarning = (message) => toast.warning(message);
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const [ loading, setLoading ] = useState(false);
    const [ Source, setSource ] = useState('');
    const [ Etat, setEtat ] = useState('');
    const [ Origine, setOrigine ] = useState('');
    const handleSourceChange = (event) => {
        setSource(event.target.value);
    }
    const handleEtatChange = (event) => {
        setEtat(event.target.value);
    }
    const handleOrigineChange = (event) => {
        setOrigine(event.target.value);
    }
    const [ confirmation, setconfirmation ] = useState(false);
    const handleConfirmation = (event) => {
        setconfirmation(event.target.checked);
    };

    const handleOnUpdate = async (event) => {
        if(!Source && !Etat && !Origine){
            setconfirmation(false);
            notifyFailed("Un des champs doivent être remplis");
            return;
        }
        
        if (confirmation) {
            try {
                setLoading(true);
                const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/panne/third/${props.code}`, 
                    {
                        source: Source,
                        etat: Etat,
                        origine: Origine,
                        agent: props.agent,
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
                    console.error("Error updating step two panne: No response received");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("Error updating step two panne", error);
                }
            }
            setconfirmation(false);
            setName('');
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
                    <DialogTitle>Modification {props.name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Cette modification sera appliquée directement après la confirmation.
                        </DialogContentText>
                        <SelectFieldComponent
                            label="Source" 
                            initialHelperText="Selectionner une Source"
                            onChange={handleSourceChange}
                            obligatory={true}
                            options={[
                                {name: 'U1', value: 'U1'},
                                {name: 'U2', value: 'U2'},
                                {name: 'EN', value: 'EN'},
                                {name: 'RAS', value: 'RAS'},
                                {name: 'FRS', value: 'FRS'},
                            ]}
                            optionName='name'
                            optionIdentifier='value'
                        />
                        <SelectFieldComponent
                            label="Etat" 
                            initialHelperText="Selectionner une Etat"
                            onChange={handleEtatChange}
                            obligatory={true}
                            options={[
                                {name: 'OK', value: 'OK'},
                                {name: 'NG', value: 'NG'},
                            ]}
                            optionName='name'
                            optionIdentifier='value'
                        />
                        <SelectFieldComponent
                            label="Origine" 
                            initialHelperText="Selectionner une Origine"
                            onChange={handleOrigineChange}
                            obligatory={true}
                            options={[
                                {name: 'Dalle', value: 'Dalle'},
                                {name: 'Dalle/Accepte', value: 'Dalle/Accepte'},
                                {name: 'Autre', value: 'Autre'},
                                {name: 'RAS', value: 'RAS'},
                                {name: 'MPCB', value: 'MPCB'},
                                {name: 'Faut d\'execution', value: 'Faut d\'execution'},
                            ]}
                            optionName='name'
                            optionIdentifier='value'
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
