import TextFieldComponent from '../components/forms/TextField';
import { useAuthContext } from '../hooks/useAuthContext';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';
import { TokenDecoder } from "../util/DecodeToken";
import './css/ProfilPageStyle.css'

const ProfilPage = () => {
    const { user } = useAuthContext();
    const decodedToken = TokenDecoder();
    // fetching User data
    const fetchUserData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_URL_BASE}/users/${decodedToken.code}`,
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


    if (isUserLoading) {
        return (
          <div className="CircularProgress-app">
            <div className="CircularProgress-container">
              <CircularProgress className='CircularProgress' />
            </div>  
            <h1>Préparation des composants de la page...</h1>
          </div>
        );
    }
    if (Usererror) {
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
        <div className="pages-container">
            <div className="profil-details-container">
                <h1>Détails :</h1>
                <div className="profil-form-container">
                    <TextFieldComponent DefaultValue={UserData?.username} label="Nom d'utilisateur" color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={UserData?.fullname ? UserData?.fullname : 'indéfini'} label='Nom complet' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={UserData?.phoneNumber} label='Numero de telephone' color={'#fff'} type='text' readOnly />
                    <TextFieldComponent DefaultValue={UserData?.zoneAssociation?.name} label='Zone' color={'#fff'} type='text' readOnly />
                </div>
            </div>
            
        </div>
    );
}

export default ProfilPage;