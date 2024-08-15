import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import { useNavigate } from 'react-router-dom';
import CreateProductDialog from '../components/Dialogs/CreateProductDialog';
import { ToastContainer } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { TokenDecoder } from "../util/DecodeToken";
import TableHeader from '../components/tables/TableHeader';

const ProductPage = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [Family, setFamily] = useState('');
    const [Zone, setZone] = useState('');
    const decodedToken = TokenDecoder();
    const handleFamilyChange = (event) => {
        setFamily(event.target.value);
    }
    const handleZoneChange = (event) => {
        setZone(event.target.value);
    }
    // fetching products data
    const fetchProductsData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/product/${decodedToken.zone}`,
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
                throw new Error("Error receiving Products data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: ProductsData, error, isLoading, refetch } = useQuery({
        queryKey: ['productsData', user?.token],
        queryFn: fetchProductsData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Zones data
    const fetchZonesData = async () => {
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
                throw new Error("Error receiving Zones data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: ZoneList, Zoneserror, isZonesLoading, Zonesrefetch } = useQuery({
        queryKey: ['ZoneList', user?.token],
        queryFn: fetchZonesData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // fetching Family data
    const fetchFamilyData = async () => {
        const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/family`,
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
                throw new Error("Error receiving Family data");
        }
        // Return the data
        return await response.json();
    };
    // useQuery hook to fetch data
    const { data: FamilyList, Familyerror, isFamilyLoading, Familyrefetch } = useQuery({
        queryKey: ['FamilyList', user?.token],
        queryFn: fetchFamilyData,
        enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
        refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
    });
    // Filter ProductsData by selected zone or familly
    const filteredProductsData = ProductsData?.filter(product => 
        (Zone == '' || product.zone == Zone) &&
        (Family == '' || product.family == Family)
    );
    // Function to refetch data
    const handleRefetchDataChange = () => {
        refetch();
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const Redirection = (path) => {
        navigate(`${path}`)
    }

    const columns = [
        {
            name: "model",
            label: "Modele",
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
        {
            name: "marque",
            label: "Marque",
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
        {
            name: "lot",
            label: "Lot",
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
        {
            name: "familyAssociation",
            label: "Family",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value?.name}</p>;
                },
            }
        },
        {
            name: "zoneAssociation",
            label: "Zone",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return <p>{value?.name}</p>;
                },
            }
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
                            <button style={{backgroundColor: '#1988ff'}} onClick={() => Redirection(`/produit/${value}`) }>
                                Voir
                            </button>
                            {import.meta.env.VITE_MANAGER_TYPE == decodedToken.type &&
                                <>
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => Redirection(`/EDIT/${value}`) }>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => alert('delete') }>
                                        Supprimer
                                    </button>
                                </>
                            }
                        </div>
                    )
                }
            }
        },
    ]; 

    if (isLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (error) {
        return (
            <div className="CircularProgress-app">
                <h1>Une erreur s'est produite: {error.message}</h1>
            </div>
        );
    }
    return (
        <div className="pages-container">
            <TableHeader name={'Liste des produits'} type={decodedToken.type} handleClickOpen={handleClickOpen} handleFamilyChange={handleFamilyChange} FamilyList={FamilyList} handleZoneChange={handleZoneChange} ZoneList={ZoneList}/>
            <DataTable data={filteredProductsData} columns={columns} />
            <CreateProductDialog  open={open} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange}/>
            <ToastContainer/>
        </div>
    );
}
export default ProductPage;