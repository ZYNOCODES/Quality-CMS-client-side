import { useNavigate, useParams } from 'react-router-dom';
import TextFieldComponent from '../components/forms/TextField';
import DataTable from '../components/tables/DataTable';
import { useAuthContext } from '../hooks/useAuthContext';
import './css/ProductDetailsPageStyle.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';
import { TokenDecoder } from "../util/DecodeToken";
import { formatDateTime, formatDuration } from '../util/UseFullFunctions';

const UserDetails = () => {
    const { code } = useParams();
    const { user } = useAuthContext();
    const decodedToken = TokenDecoder();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState('');
    const handleWorkshopChange = (event) => {
        setWorkshop(event.target.value);
    }
    // fetching User data
    const fetchUserData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_URL_BASE}/users/${code}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error && errorData.error.statusCode === 404) {
                    return [];
                } else {
                    throw new Error("Erreur lors de la récupération des données de l'utilisateur");
                }
            }

            return await response.json();
        } catch (error) {
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: UserData, error: Usererror, Loading: isUserLoading, refetch: Userrefetch } = useQuery({
        queryKey: ['UserData', user?.token],
        queryFn: fetchUserData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Pannes data
    const fetchPannesData = async () => {
        if(code.startsWith('T')){
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_APP_URL_BASE}/panne/technician/archive/${code}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
    
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
        }else{
            return [];
        }
    };
    // useQuery hook to fetch data
    const { data: PannesData, error: Panneerror, Loading: isPanneLoading, refetch: Pannerefetch } = useQuery({
        queryKey: ['PannesData', user?.token],
        queryFn: fetchPannesData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Workshops data
    const fetchWorkshopsData = async () => {
        if(code.startsWith('T')){
            try{
                const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/workshop/byID/${UserData.zone}`,
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
                        throw new Error("Erreur lors de la récupération des données des ateliers");
                }
                // Return the data
                return await response.json();
            }catch(error){
                throw new Error(error);
            }
        }else{
            return [];
        }
    };
    // useQuery hook to fetch data
    const { data: workshopList, error: Workshopserror, Loading: isWorkshopsLoading, refetch: Workshopsrefetch } = useQuery({
        queryKey: ['WorkshopsData', user?.token],
        queryFn: fetchWorkshopsData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // Filter PannesData by selected workshop
    const filteredPannesData = PannesData?.filter(panne => 
        workshop == '' || panne.workshop == workshop
    );
    // Redirection function
    const Redirection = (path) => {
        navigate(path);
    }

    const columns = [
        {
            name: "workshopAssociation",
            label: "Workshop",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value?.name}</p>;
                },
            },
        },
        {
            name: "dateReparation",
            label: "Date de reparation",
            options: {
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
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDateTime(value)}</p>;
                },
            },
        },
        {
            name: "tempFinal",
            label: "Temp finale",
            options: {
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
                filter: true,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{formatDuration(value)}</p>;
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

    if (isUserLoading || isPanneLoading || isWorkshopsLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (Usererror || Panneerror || Workshopserror) {
        return (
            <div className="CircularProgress-app">
                <h1>Une erreur s'est produite</h1>
                {/* <h1>{Usererror ? Usererror.message : ''}</h1>
                <h1>{Panneerror ? Panneerror.message : ''}</h1>
                <h1>{Workshopserror ? Workshopserror.message : ''}</h1> */}
            </div>
        );
    }
    return (
        <div className="page-container">
            <div className="navbar-page-container">
                <div className='icon-container-navbar-page-container' onClick={() => Redirection(-1)}>
                    <ArrowBackIcon className='backIcon-icon-container'/>
                </div>
                <h1>Détails d'utilisateur</h1>
            </div>
            <div className="product-details-container">
                <h1>Détails :</h1>
                <div className="product-form-container">
                    <TextFieldComponent DefaultValue={UserData?.code} label='Code' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={UserData?.fullname} label='Nom complet' color={'#fff'} type='text' readOnly />
                    {UserData?.phoneNumber &&
                        <TextFieldComponent DefaultValue={UserData?.phoneNumber} label='Numero de telephone' color={'#fff'} type='text' readOnly />
                    }                    
                    <TextFieldComponent DefaultValue={UserData?.zoneAssociation?.name} label='Zone' color={'#fff'} type='text' readOnly />
                </div>
                {PannesData && PannesData.length > 0 && (
                    <>
                        <h1>L'archive des pannes :</h1>
                        <div className="panne-details-container">
                            <div className='panne-details-container-select-field-container'>
                                <select
                                    className='panne-details-container-select-field'
                                    onChange={handleWorkshopChange}
                                    placeholder="Sélectionnez un atelier"
                                >
                                    <option value={''}>Sélectionnez un atelier</option>
                                    {workshopList?.map((option, index) => (
                                        <option key={index} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>      
                            <DataTable data={filteredPannesData} columns={columns}  download={false} viewColumns={true} filter={true} search={true}/>
                        </div>
                    </>
                )}
            </div>
            
        </div>
    );
}

export default UserDetails;