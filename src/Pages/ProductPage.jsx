import { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from '@mui/material';
import DataTable from '../components/tables/DataTable';
import { useNavigate } from 'react-router-dom';
import CreateProductDialog from '../components/Dialogs/CreateProductDialog';
import CreateFamilyDialog from '../components/Dialogs/CreateFamilyDialog';
import UpdateFamilyDialog from '../components/Dialogs/UpdateFamilyDialog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from '@tanstack/react-query';
import { TokenDecoder } from "../util/DecodeToken";
import TableHeader from '../components/tables/TableHeader';
import DeletingDialog from '../components/Dialogs/DeletingDialog';
import axios from 'axios';

const ProductPage = () => {
    const notifyFailed = (message) => toast.info(message);
    const notifySuccess = (message) => toast.success(message);
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openCreateFamilyDialog, setOpenCreateFamilyDialog] = useState(false);
    const [openDeleteProductDialog, setOpenDeleteProductDialog] = useState(false);
    const [openDeleteFamilyDialog, setOpenDeleteFamilyDialog] = useState(false);
    const [openUpdateFamilyDialog, setOpenUpdateFamilyDialog] = useState(false);
    const [Family, setFamily] = useState('');
    const [Zone, setZone] = useState('');
    const [currentCode, setCurrentCode] = useState(null);
    const [submitionLoading, setSubmitionLoading] = useState(false);
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
    const { data: ZoneList, error: Zoneserror, Loading: isZonesLoading, refetch: Zonesrefetch } = useQuery({
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
    const { data: FamilyList, error: Familyerror, Loading: isFamilyLoading, refetch: Familyrefetch } = useQuery({
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
        Zonesrefetch();
        Familyrefetch();
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setCurrentCode(null);
        setOpenDeleteProductDialog(false);
        setOpenUpdateFamilyDialog(false);
        setOpenDeleteFamilyDialog(false);
        setOpenCreateFamilyDialog(false);
        setOpen(false);
    };
    const Redirection = (path) => {
        navigate(`${path}`)
    }
    const handleClickOpenDeleteProductDialog = (code) => {
        setCurrentCode(code);
        setOpenDeleteProductDialog(true);
    };
    const handleDeleteProduct = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/product/${currentCode}`, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    }
                }
            );
            if (response.status === 200) {
                notifySuccess(response.data.message);
                handleRefetchDataChange();
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
                console.error("Error deleting product: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting product", error);
            }
        }
    };
    const handleClickOpenCreateFamilyDialog = () => {
        setOpenCreateFamilyDialog(true);
    };
    const handleClickOpenUpdateFamilyDialog = (code) => {
        setCurrentCode(code);
        setOpenUpdateFamilyDialog(true);
    };
    const handleClickOpenDeleteFamilyDialog = (code) => {
        setCurrentCode(code);
        setOpenDeleteFamilyDialog(true);
    };
    const handleDeleteFamily = async () => {
        try {
            setSubmitionLoading(true);
            const response = await axios.delete(import.meta.env.VITE_APP_URL_BASE+`/family/${currentCode}`, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    }
                }
            );
            if (response.status === 200) {
                notifySuccess(response.data.message);
                handleRefetchDataChange();
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
                console.error("Error deleting family: No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error deleting family");
            }
        }
    };
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
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleClickOpenDeleteProductDialog(value) }>
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
    const columnsFamily = [
        {
            name: "code",
            label: "Code",
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
            name: "name",
            label: "Nom",
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
            name: "code",
            label: " ",
            options: {
                sort: false,
                filter: false,
                customBodyRender: (value) => {
                    return (
                        <div>
                            {import.meta.env.VITE_MANAGER_TYPE == decodedToken.type &&
                                <>
                                    <button style={{backgroundColor: '#1988ff'}} onClick={() => handleClickOpenUpdateFamilyDialog(value) }>
                                        Edit
                                    </button>
                                    <button style={{backgroundColor: '#DA171B'}} onClick={() => handleClickOpenDeleteFamilyDialog(value) }>
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
    if (isLoading || isZonesLoading || isFamilyLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (error || Zoneserror || Familyerror) {
        return (
            <div className="CircularProgress-app">
                <h1>Une erreur s'est produite</h1>
                {/* <h1>{error.message}</h1> */}
            </div>
        );
    }
    return (
        <div className="pages-container">
            {import.meta.env.VITE_MANAGER_TYPE == decodedToken.type &&
                <>
                    <TableHeader name={'Liste des familles'} type={decodedToken.type} handleClickOpen={handleClickOpenCreateFamilyDialog}/>
                    <DataTable data={FamilyList} columns={columnsFamily} rows={3}  download={true} viewColumns={true} filter={true} search={true}/>
                </>
            }
            <TableHeader name={'Liste des produits'} type={decodedToken.type} handleClickOpen={handleClickOpen} handleFamilyChange={handleFamilyChange} FamilyList={FamilyList} handleZoneChange={handleZoneChange} ZoneList={ZoneList}/>
            <DataTable data={filteredProductsData} columns={columns} rows={
                import.meta.env.VITE_MANAGER_TYPE == decodedToken.type ? 4 : 11
                }  download={true} viewColumns={true} filter={true} search={true}/>
            {import.meta.env.VITE_MANAGER_TYPE == decodedToken.type &&
                <>
                    <CreateProductDialog  open={open} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange}/>
                    <DeletingDialog name={'d\'un produit'} loading={submitionLoading} open={openDeleteProductDialog} handleClose={handleClose} handleOnDelete={handleDeleteProduct}/>
                    <CreateFamilyDialog  open={openCreateFamilyDialog} handleClose={handleClose} user={user} refetchData={handleRefetchDataChange}/>
                    <UpdateFamilyDialog  name={'d\'une famille'} code={currentCode} user={user} open={openUpdateFamilyDialog} handleClose={handleClose} handleRefetchData={handleRefetchDataChange} />
                    <DeletingDialog name={'d\'un famille'} loading={submitionLoading} open={openDeleteFamilyDialog} handleClose={handleClose} handleOnDelete={handleDeleteFamily}/>

                </>
            }
            <ToastContainer/>
        </div>
    );
}
export default ProductPage;