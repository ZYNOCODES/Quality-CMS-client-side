import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { TokenDecoder } from "../util/DecodeToken";
import TableHeader from '../components/tables/TableHeader';
import { formatDateTime } from '../util/UseFullFunctions';

const EnReparationPanne = () => {
    const { user } = useAuthContext();
    const decodedToken = TokenDecoder();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState('');
    const [Zone, setZone] = useState('');
    const [PanneType, setPanneType] = useState('');
    const handleWorkshopChange = (event) => {
        setWorkshop(event.target.value);
    }
    const handleZoneChange = (event) => {
        setZone(event.target.value);
    }
    const handlePanneTypeChange = (event) => {
        setPanneType(event.target.value);
    }
    // fetching Pannes data
    const fetchPannesData = async () => {
        try {
            let response;
            if (import.meta.env.VITE_AGENT_TYPE == decodedToken.type) {
                response = await fetch(
                    `${import.meta.env.VITE_APP_URL_BASE}/panne/linked/byagent/${decodedToken.code}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
            } else if (import.meta.env.VITE_MANAGER_TYPE == decodedToken.type) {
                response = await fetch(
                    `${import.meta.env.VITE_APP_URL_BASE}/panne/linked`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
            }

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error && errorData.error.statusCode === 404) {
                    return [];
                } else {
                    throw new Error("Erreur lors de la récupération des données des pannes");
                }
            }

            return await response.json();
        } catch (error) {
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
    // fetching type de panne data
    const fetchTypePanneData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/pannetype`,
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
                throw new Error("Error receiving type de panne data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: TypePanneData, error: TypePanneerror, Loading: isTypePanneLoading, refetch: TypePannerefetch } = useQuery({
        queryKey: ['TypePanneData', user?.token],
        queryFn: fetchTypePanneData,
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
        (PanneType == '' || panne.panne == PanneType) 
    );
    const Redirection = (path) => {
        navigate(`${path}`)
    }

    const columns = [
        {
            name: "technicianAssociation",
            label: "Technicien",
            options: {
                filter: true,
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
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return value?.model;
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
            name: "productAssociation",
            label: "Arrivage",
            options: {
                display: true,
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return value?.arrivalAssociation?.name ? value?.arrivalAssociation?.name : 'N/A';
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
            name: "typePannesNames",
            label: "Type de panne",
            options: {
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
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDateTime(value)}</p>;
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
            name: "isPaused",
            label: "mode pause",
            options: {
                display: true,
                filter: true,
                sort: false,
                customFilterListOptions: { render: v => `${v ? 'Oui' : 'Non'}` },
                customBodyRender: (value) => {
                    return <p style={{
                        color: value ? 'red' : 'green',
                        fontWeight: 'bold'
                    }}>
                        {value ? 'Oui' : 'Non'}
                    </p>;
                },
            },
        },
        {
            name: "code",
            label: " ",
            options: {
                sort: false,
                filter: false,
                customBodyRender: (value) => {
                    return (
                        <div>
                            <button 
                                style={{backgroundColor: '#1988ff'}} 
                                onClick={() => {
                                    if (import.meta.env.VITE_AGENT_TYPE == decodedToken.type) 
                                        Redirection(`/panne/reparation/${value}`);
                                    else
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
                {/* <h1>{error ? error.message : ''}</h1>
                <h1>{Workshopserror ? Workshopserror.message : ''}</h1>
                <h1>{Zoneserror ? Zoneserror.message : ''}</h1> */}
            </div>
        );
    }
    return (
        <div className="pages-container">
            <TableHeader name={'Liste des pannes en reparation'} type={decodedToken.type} handleWorkshopChange={handleWorkshopChange} workshopList={filteredWorkshopsData} handleZoneChange={handleZoneChange} ZoneList={ZonesData} handlePanneTypeChange={handlePanneTypeChange} PanneTypeList={TypePanneData}/>
            <DataTable title={'Liste des pannes en reparation'} data={filteredPannesData} columns={columns} download={true} viewColumns={true} filter={true} search={true}/>
            <ToastContainer/>
        </div>
    );
}
export default EnReparationPanne;