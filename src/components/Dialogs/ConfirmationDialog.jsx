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

export default function ConfirmationDialog(props) {
    const notifyWarning = (message) => toast.warning(message);
    const [confirmation, setconfirmation] = useState(false);

    const handleConfirmation = (event) => {
        setconfirmation(event.target.checked);
    };
    const handleOnConfirm = (event) => {
        if (confirmation) {
            props.handleOnConfirm();
            setconfirmation(false);
        }else{
            notifyWarning("Veuillez confirmer la prise en charge");
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
            {!props.loading && 
                <>
                    <DialogTitle>Confirmation de {props.name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Cette prise en charge sera appliquée directement après la confirmation.
                        </DialogContentText>
                        <FormControlLabel
                            sx={{ mt: 1 }}
                            control={
                                <Switch checked={confirmation} onChange={handleConfirmation} />
                            }
                            label="Oui je confirme que je prendrai en charge cette panne"
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
