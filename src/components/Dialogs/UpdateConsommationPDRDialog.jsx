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

export default function UpdateConsommationPDRDialog(props) {
    const notifyWarning = (message) => toast.warning(message);
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const [ loading, setLoading ] = useState(false);
    const [ Quantity, setQuantity ] = useState('');
    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };
    const [ Piece, setPiece ] = useState('');
    const handlePieceChange = (event) => {
        setPiece(event.target.value);
    };
    const [ confirmation, setconfirmation ] = useState(false);
    const handleConfirmation = (event) => {
        setconfirmation(event.target.checked);
    };

    const handleOnCreate = async (event) => {
        if(!Quantity && !Piece){
            setconfirmation(false);
            notifyFailed("Un des champs doivent être remplis");
            return;
        }
        if (confirmation) {
            try {
                setLoading(true);
                const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/consommation/${props.code}`, 
                    {
                        quantity: Quantity,
                        piece: Piece,
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
                    console.error("Error updating Consommation PDR: No response received");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("Error updating Consommation PDR", error);
                }
            }
            setconfirmation(false);
            setQuantity('');
            setPiece('');
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
                    <DialogTitle>Modification d'une comsommation PDR</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Cette modification sera appliquée directement après la confirmation.
                        </DialogContentText>
                        <SelectFieldComponent
                            label="Piece" 
                            initialHelperText="Selectionner une piece" 
                            onChange={handlePieceChange}
                            obligatory={true}
                            options={props.PieceList}
                            optionName='name'
                            optionIdentifier='code'
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="Quantite"
                            label="Entrez la quantite consome"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={handleQuantityChange}
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
