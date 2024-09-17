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
import { CircularProgress } from '@mui/material';
import UploadField from '../buttons/UploadField';

export default function ConfirmationDialog(props) {
    const notifyWarning = (message) => toast.warning(message);

    const [file, setFile] = useState('');
    const [confirmation, setconfirmation] = useState(false);
    const handleConfirmation = (event) => {
        setconfirmation(event.target.checked);
    };

    const handleOnConfirm = () => {
        if(!file) {
            notifyWarning("Veuillez joindre le fichier");
            return;
        }
        if (!confirmation) {
            notifyWarning("Veuillez confirmer l'insertion");   
            return;         
        }
        const formData = new FormData();
        formData.append('excel', file);
        props.handleOnConfirm(formData);
        setconfirmation(false);
        setFile('');
    };
    const handleClose = () => {
        setconfirmation(false);
        setFile('');
        props.handleClose();
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
        }
    };
    return (
        <Dialog
            open={props.open}
            onClose={false}
            PaperProps={{
                component: 'form',
            }}
        >
            {!props.loading && 
                <>
                    <DialogTitle>Confirmation {props.name}</DialogTitle>
                    <DialogContent>
                        <UploadField onChange={handleFileChange} fileName={file.name}/> 
                        <FormControlLabel
                            sx={{ mt: 1 }}
                            control={
                                <Switch checked={confirmation} onChange={handleConfirmation} />
                            }
                            label="Oui je confirme"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Annuler</Button>
                        <Button onClick={handleOnConfirm}>confirmer</Button>
                    </DialogActions>
                </>
            }
            {props.loading && (
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
