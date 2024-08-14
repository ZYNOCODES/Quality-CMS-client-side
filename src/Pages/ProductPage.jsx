import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import { useNavigate } from 'react-router-dom';
import CreateTvDialog from '../components/Dialogs/CreateTvDialog';
import { ToastContainer } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { TokenDecoder } from "../util/DecodeToken";

const ProductPage = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const decodedToken = TokenDecoder();
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
            name: "id",
            label: " ",
            options: {
                sort: false,
                filter: false,
                customBodyRender: (value) => {
                    return (
                        <div>
                            <button style={{backgroundColor: '#1988ff'}} onClick={() => Redirection(`/EDIT/${value}`) }>
                                Edit
                            </button>
                            <button style={{backgroundColor: '#1988ff'}} onClick={() => Redirection(`/${value}`) }>
                                Voir
                            </button>
                            <button style={{backgroundColor: '#DA171B'}} onClick={() => alert('delete') }>
                                Supprimer
                            </button>
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
            <DataTable name={"Produits"} data={ProductsData} columns={columns} handleClickOpen={handleClickOpen}/>
            <CreateTvDialog  open={open} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange}/>
            <ToastContainer/>
        </div>
    );
}
export default ProductPage;