import { useNavigate, useParams } from 'react-router-dom';
import TextFieldComponent from '../components/forms/TextField';
import DataTable from '../components/tables/DataTable';
import { useAuthContext } from '../hooks/useAuthContext';
import './css/ProductDetailsPageStyle.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
  
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${month} ${day}, ${year} at ${hours}:${formattedMinutes}`;
};

const ProductDetails = () => {
    const { code } = useParams();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState('');
    const handleWorkshopChange = (event) => {
        setWorkshop(event.target.value);
    }
    // fetching Product data
    const fetchProductData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_URL_BASE}/product/one/${code}`,
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
                }
            }

            return await response.json();
        } catch (error) {
            throw new Error(error);
        }
    };
    // useQuery hook to fetch data
    const { data: ProductData, error: Producterror, Loading: isProductLoading, refetch: Productrefetch } = useQuery({
        queryKey: ['ProductData', user?.token],
        queryFn: fetchProductData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Pannes data
    const fetchPannesData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_URL_BASE}/panne/byproduct/${code}`,
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
        try{
            const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/workshop/byID/${ProductData.zone}`,
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
            name: "fournisseur",
            label: "Fournisseur",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value}</p>;
                },
            },
        },
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
            name: "ligne",
            label: "Ligne",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value}</p>;
                },
            },
        },
        {
            name: "typepanneAssociation",
            label: "Panne",
            options: {
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value.name}</p>;
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
                    return <p>{formatDate(value)}</p>;
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

    if (isProductLoading || isPanneLoading || isWorkshopsLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (Producterror || Panneerror || Workshopserror) {
        return (
            <div className="CircularProgress-app">
                <h1>Une erreur s'est produite</h1>
                {/* <h1>{Producterror ? Producterror.message : ''}</h1>
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
                <h1>Détails du produit</h1>
            </div>
            <div className="product-details-container">
                <h1>Détails :</h1>
                <div className="product-form-container">
                    <TextFieldComponent DefaultValue={ProductData?.code} label='Code' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={ProductData?.lot} label='Lot' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={ProductData?.marque} label='Marque' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={ProductData?.model} label='Modele' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={ProductData?.familyAssociation?.name} label='Famille' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={ProductData?.zoneAssociation?.name} label='Zone' color={'#fff'} type='text' readOnly />
                </div>
                {PannesData && PannesData.length > 0 && (
                    <>
                        <h1>Les pannes :</h1>
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
                            <DataTable data={filteredPannesData} columns={columns}  download={true} viewColumns={true} filter={true} search={true}/>
                        </div>
                    </>
                )}
            </div>
            
        </div>
    );
}

export default ProductDetails;