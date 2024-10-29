import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { TokenDecoder } from "../util/DecodeToken";
import TableHeader from '../components/tables/TableHeader';
import { formatDateTime, formatDuration } from '../util/UseFullFunctions';
import './css/TakeInChargePannePageStyle.css';
import { toast, ToastContainer } from 'react-toastify';
import ConfirmationDialog from '../components/Dialogs/ConfirmationDialog';
import axios from 'axios';
import BasicDateRangePicker from '../components/forms/DateRangePicker';
import moment from "moment/moment";

const ArchivePanne = () => {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);

    const { user } = useAuthContext();
    const decodedToken = TokenDecoder();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState('');
    const [Zone, setZone] = useState('');
    const handleWorkshopChange = (event) => {
        setWorkshop(event.target.value);
    }
    const handleZoneChange = (event) => {
        setZone(event.target.value);
    }

    const [submitionLoading, setSubmitionLoading] = useState(false);
    
    const [ openConfirmation, setOpenConfirmation ] = useState(false);
    const handleOpenConfirmationDialog = () => {
        setOpenConfirmation(true);
    }
    const handleClose = () => {
        setOpenConfirmation(false);
    };

    const Redirection = (path) => {
        navigate(`${path}`)
    }

    const [openDatePickers, setOpenDatePickers] = useState(false);
    const handleOpenDatePickers = () => {
        setOpenDatePickers(true);
    }
    const [DateRange, setDateRange] = useState({
        startDate: null,
        endDate: null,
    });
    const handleDateRangeChange = (dateRange) => {
        setDateRange(dateRange);
    }
    const [DateReparationRange, setDateReparationRange] = useState({
        startDate: null,
        endDate: null,
    });
    const handleDateReparationRangeChange = (DateReparationRange) => {
        setDateReparationRange(DateReparationRange);
    }
    const handleCloseDatePickers = () => {
        setOpenDatePickers(false);
        setDateRange({
            startDate: null,
            endDate: null,
        });
        setDateReparationRange({
            startDate: null,
            endDate: null,
        });
    }
    

    // fetching Pannes data
    const fetchPannesData = async () => {
        try{
            let response;
            if (import.meta.env.VITE_MANAGER_TYPE == decodedToken.type) {
                response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/panne/nonedelivred`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
            } else if (import.meta.env.VITE_AGENT_TYPE == decodedToken.type){
                response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/panne/nonedelivred/${decodedToken.code}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
            }
            

            // Handle the error state
            if (!response.ok) {
                const errorData = await response.json();
                if(errorData.error.statusCode == 404)
                    return [];
                else
                    throw new Error("Erreur lors de la récupération des données des pannes");
            }
            // Return the data
            return await response.json();
        }catch(error){
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: PannesData, error, isLoading, refetch } = useQuery({
        queryKey: ['PannesData', user?.token],
        queryFn: fetchPannesData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Workshops data
    const fetchWorkshopsData = async () => {
        try{
            let response;
            if (import.meta.env.VITE_MANAGER_TYPE == decodedToken.type) {
                response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/workshop`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
            } else {
                response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/workshop/${decodedToken.zone}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
            }
            

            // Handle the error state
            if (!response.ok) {
                const errorData = await response.json();
                if(errorData.error.statusCode == 404)
                    return [];
                else
                    throw new Error("Erreur lors de la récupération des données des ateliers");
            }
            // Return the data
            return await response.json();
        }catch(error){
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: workshopList, error: Workshopserror, Loading: isWorkshopsLoading, refetch: Workshopsrefetch } = useQuery({
        queryKey: ['WorkshopsData', user?.token],
        queryFn: fetchWorkshopsData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Zonnes data
    const fetchZonesData = async () => {
        if (import.meta.env.VITE_MANAGER_TYPE == decodedToken.type) {
            const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/zone`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );
    
            // Handle the error state
            if (!response.ok) {
                const errorData = await response.json();
                if(errorData.error.statusCode == 404)
                    return [];
                else
                    throw new Error("Error receiving Zonnes data");
            }
            // Return the data
            return await response.json();
        }
        return [];
    };
    // useQuery hook to fetch data
    const { data: ZonesData, error: Zoneserror, Loading: isZonesLoading, refetch: Zonesrefetch } = useQuery({
        queryKey: ['ZonesData', user?.token],
        queryFn: fetchZonesData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // Filter WorkshopsData by selected workshop
    const filteredWorkshopsData = workshopList?.filter(workshop => 
        Zone == '' || workshop.zone == Zone
    );
    // Filter PannesData by selected workshop
    const filteredPannesData = PannesData?.filter(panne => 
        (workshop == '' || panne.workshop == workshop) &&
        (!DateRange.startDate || !DateRange.endDate || 
            (moment(DateRange.startDate).startOf('day').isSameOrBefore(moment(panne.dateDeclaration).startOf('day')) && 
             moment(DateRange.endDate).startOf('day').isSameOrAfter(moment(panne.dateDeclaration).startOf('day')))) &&
             (!DateReparationRange.startDate || !DateReparationRange.endDate || 
                (moment(DateReparationRange.startDate).startOf('day').isSameOrBefore(moment(panne.dateReparation).startOf('day')) && 
                 moment(DateReparationRange.endDate).startOf('day').isSameOrAfter(moment(panne.dateReparation).startOf('day'))))
    );

    const columns = [
        {
            name: "productAssociation",
            label: "Marque",
            options: {
                display: false,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value?.marque}</p>;
                },
            },
        },
        {
            name: "productAssociation",
            label: "Famille",
            options: {
                display: false,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value?.familyAssociation?.name}</p>;
                },
            },
        },
        {
            name: "fournisseurAssociation",
            label: "Fournisseur",
            options: {
                display: false,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return value?.fullname;
                },
            },
        },
        {
            name: "productAssociation",
            label: "Modele",
            options: {
                display: true,
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return value?.model;
                },
            },
        },
        {
            name: "sn",
            label: "SN",
            options: {
                display: true,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value}</p>;
                },
            },
        },
        {
            name: "productAssociation",
            label: "Lot",
            options: {
                display: true,
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return value?.lotAssociation?.name;
                },
            },
        },
        {
            name: "arrivalAssociation",
            label: "Arrivage",
            options: {
                display: true,
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return value?.name ? value?.name : 'N/A';
                },
            },
        },
        {
            name: "technicianAssociation",
            label: "Technician",
            options: {
                display: true,
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return value?.fullname;
                },
            },
        },
        {
            name: "typePannesNames",
            label: "Pannes",
            options: {
                display: true,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <div>
                        {
                            value?.map((type, index) => {
                                return <p key={index}>{type}</p>
                            })
                        }
                    </div>;
                },
            },
        },
        {
            name: "dateDeclaration",
            label: "Date de declaration",
            options: {
                display: true,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDateTime(value)}</p>;
                },
            },
        },
        {
            name: "ligne",
            label: "Ligne",
            options: {
                display: false,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value}</p>;
                },
            },
        },
        {
            name: "dateReparation",
            label: "Date de reparation",
            options: {
                display: false,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDateTime(value)}</p>;
                },
            },
        },
        {
            name: "correctiveActionNames",
            label: "Action",
            options: {
                display: false,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <div>
                        {
                            value?.map((action, index) => {
                                return <p key={index}>{action}</p>
                            })
                        }
                    </div>;
                },
            },
        },
        {
            name: "consommationNames",
            label: "PDR Consome",
            options: {
                display: false,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <div>
                        {
                            value?.map((pdr, index) => {
                                return <p key={index}>{pdr}</p>
                            })
                        }
                    </div>;
                },
            },
        },
        {
            name: "source",
            label: "Source",
            options: {
                display: false,
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return value || '';
                },
            },
        },
        {
            name: "etat",
            label: "Etat",
            options: {
                display: false,
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return value || '';
                },
            },
        },
        {
            name: "origine",
            label: "Origine",
            options: {
                display: false,
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return value || '';
                },
            },
        },
        {
            name: "livraison",
            label: "Liberation",
            options: {
                display: false,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value ? 'Oui' : 'Non'}</p>;
                },
            },
        },
        {
            name: "DateLivraison",
            label: "Date de livraison",
            options: {
                display: false,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDateTime(value)}</p>;
                },
            },
        },
        {
            name: "tempInitial",
            label: "Temp initial",
            options: {
                display: false,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDateTime(value) || 'g'}</p>;
                },
            },
        },
        {
            name: "tempFinal",
            label: "Temp finale",
            options: {
                display: false,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDateTime(value)}</p>;
                },
            },
        },
        {
            name: "dureeDintervention",
            label: "Duree d'intervention",
            options: {
                display: false,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDuration(value)}</p>;
                },
            },
        },
        {
            name: "workshopAssociation",
            label: "Atelier",
            options: {
                display: true,
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value.name}</p>;
                },
            },
        },
        {
            name: "code",
            label: " ",
            options: {
                display: true,
                sort: false,
                filter: false,
                customBodyRender: (value) => {
                    return (
                        <div>
                            <button 
                                style={{backgroundColor: '#1988ff'}} 
                                onClick={() => {
                                    Redirection(`/panne/${value}`);
                                }}
                            >
                                Voir
                            </button>
                        </div>
                    )
                }
            }
        },
    ]; 
    const [selectedIDs, setSelectedIDs] = useState([]);
    const getSelectedPanneIDs = (selectedRows) => {
        console.log(selectedRows);
        setSelectedIDs(selectedRows);
    }
    const MakeMultiplePannesDelivred = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/panne/many/delivred`, 
                {
                    agent: decodedToken.code,
                    panneCODEs: selectedIDs
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    }
                }
            );
            if (response.status === 200) {
                refetch();
                notifySuccess(response.data.message);
                setSubmitionLoading(false);
                handleClose();
            } else {
                notifyFailed(response.data.message);
                setSubmitionLoading(false);
            }
        } catch (error) {
            if (error.response) {
                notifyFailed(error.response.data.message);
                setSubmitionLoading(false);
            } else if (error.request) {
                // Request was made but no response was received
                console.error("Error updating panne restitution: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error updating panne restitution", error);
            }
        }
        setSelectedIDs([]);
    }

    if (isLoading || isWorkshopsLoading || isZonesLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (error || Workshopserror || Zoneserror) {
        return (
            <div className="CircularProgress-app">
                <h1>Une erreur s'est produite</h1>
                {/* <h1>{error.message}</h1> */}
            </div>
        );
    }
    return (
        <div className="pages-container">
            <TableHeader name={'Liste des pannes non restituées'} type={decodedToken.type} handleWorkshopChange={handleWorkshopChange} workshopList={filteredWorkshopsData} handleZoneChange={handleZoneChange} ZoneList={ZonesData} handleOpenConfirmationDialog={handleOpenConfirmationDialog} handleOpenDatePickers={handleOpenDatePickers} handleCloseDatePickers={handleCloseDatePickers} openDatePickers={openDatePickers}/>
            {openDatePickers &&
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}>
                    <div
                        style={{
                            flex: 1,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'gray',
                            gap: '10px',
                        }}
                    >
                        <BasicDateRangePicker onChange={handleDateRangeChange} />
                        <p>Date de declaration</p>
                    </div>
                    <div
                        style={{
                            flex: 1,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'gray',
                            gap: '10px',
                        }}
                    >
                        <BasicDateRangePicker onChange={handleDateReparationRangeChange} />
                        <p>Date de reparation</p>
                    </div>
                </div>
            }
            <DataTable title={'Liste des pannes non restituées'} data={filteredPannesData} selectable={import.meta.env.VITE_AGENT_TYPE == decodedToken.type ? true : false} getSelectedPanneIDs={getSelectedPanneIDs} columns={columns}  download={true} viewColumns={true} filter={true} search={true}/>
            <ConfirmationDialog open={openConfirmation} name={'restitution'} loading={submitionLoading} handleOnConfirm={MakeMultiplePannesDelivred} handleClose={handleClose} />
            <ToastContainer/>
        </div>
    );
}
export default ArchivePanne;