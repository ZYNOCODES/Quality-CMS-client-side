import './css/DialogStyle.css';
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
import SelectFieldComponent from '../forms/SelectField';
import { useQuery } from '@tanstack/react-query';

export default function ConfirmaTakeInChargeDialog(props) {
    const notifyFail = (message) => toast.info(message);
    const notifyWarning = (message) => toast.warning(message);
    const [confirmation, setConfirmation] = useState(false);
    const [technician, setTechnician] = useState(null);

    const handleConfirmation = (event) => {
        setConfirmation(event.target.checked);
    };

    const handleTechnicianChange = (event) => {
        setTechnician(event.target.value);
    };

    const handleOnConfirm = () => {
        if (confirmation) {
            if (technician) {
                props.handleOnConfirm(technician);
                setTechnician(null);
                setConfirmation(false);
            } else {
                notifyFail("Vous devez sélectionner un technicien");
            }
        } else {
            notifyWarning("Veuillez confirmer la prise en charge");
        }
    };

    const handleClose = () => {
        setConfirmation(false);
        setTechnician(null);
        props.handleClose();
    };

    

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
            }}
        >
            {!props.loading ? (
                <>
                    <DialogTitle>Confirmation de {props.name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Cette {props.name} sera appliquée directement après la confirmation.
                        </DialogContentText>
                        <SelectFieldComponent
                            label="Technician"
                            initialHelperText="Sélectionner un technicien"
                            onChange={handleTechnicianChange}
                            obligatory={true}
                            options={props.TechnicianList}
                            optionName="fullname"
                            optionIdentifier="code"
                        />
                        <FormControlLabel
                            sx={{ mt: 1 }}
                            control={
                                <Switch checked={confirmation} onChange={handleConfirmation} />
                            }
                            label="Oui, je confirme que je prendrai en charge cette panne"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Annuler</Button>
                        <Button onClick={handleOnConfirm}>Confirmer</Button>
                    </DialogActions>
                </>
            ) : (
                <div className="dialog-loading-container">
                    <DialogContent>
                        <DialogContentText className="dialog-text-loading">
                            Ce processus peut prendre un certain temps en fonction de votre connexion Internet, soyez patient.
                        </DialogContentText>
                    </DialogContent>
                    <CircularProgress className="CircularProgress" />
                </div>
            )}
        </Dialog>
    );
}
