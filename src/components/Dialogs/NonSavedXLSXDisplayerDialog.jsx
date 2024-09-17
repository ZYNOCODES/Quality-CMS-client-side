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
import DataTable from '../tables/DataTable';

export default function NonSavedXLSXDisplayerDialog(props) {
    const notifyWarning = (message) => toast.warning(message);
    const [confirmation, setconfirmation] = useState(false);
    const handleConfirmation = (event) => {
        setconfirmation(event.target.checked);
    };

    const handleOnConfirm = () => {
        if (!confirmation) {
            notifyWarning("Veuillez confirmer la fermeture de la fenêtre pour continuer");   
            return;         
        }
        props.handleOnConfirm();
        props.handleClose();
        setconfirmation(false);
    };
    const columns = [
        {
            name: "item",
            label: "Nom",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <p>
                            {value.Nom}
                        </p>
                    )
                }
            }
        },
        {
            name: "msg",
            label: "Message",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <p>
                            {value}
                        </p>
                    )
                }
            }
        },
    ];
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
                    <DialogTitle>{props.name}</DialogTitle>
                    <DialogContent>
                        <DataTable 
                            title={props.name} 
                            data={props.products} 
                            columns={columns} 
                            rows={5} 
                            download={true} 
                            viewColumns={false} 
                            filter={false} 
                            search={false}
                        />
                        <DialogContentText id="alert-dialog-description" style={{
                            color: "#ff0000",
                            fontWeight: "bold",
                            marginTop: "10px"
                        }}>
                            Remarque :
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-description" style={{
                            color: "#ff0000",
                        }}>
                            Apres la fermeture de cette fenêtre, les produits non enregistrés seront perdus. Voulez-vous vraiment fermer cette fenêtre ?
                        </DialogContentText>
                        <FormControlLabel
                            sx={{ mt: 1 }}
                            control={
                                <Switch checked={confirmation} onChange={handleConfirmation} />
                            }
                            label="Confirme la fermeture"
                        />
                    </DialogContent>
                    <DialogActions>
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
