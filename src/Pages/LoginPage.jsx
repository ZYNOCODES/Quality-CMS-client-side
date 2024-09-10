import TextFieldComponent from '../components/forms/TextField';
import COVER_IMG from '../assets/Logo.png';
import { useState } from 'react';
import './css/LoginStyle.css';
import { useAuthContext } from "../hooks/useAuthContext";

const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const [error, setError] = useState("");

    //handle identifier text change
    const handleidentifierChange = (event) => {
        setIdentifier(event.target.value);
    };
    //handle password text change
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    //handle login submit
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
          const reponse = await fetch(import.meta.env.VITE_APP_URL_BASE+"/auth/signin", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ 
                identifier: identifier, password: password
            }),
          });
    
          const json = await reponse.json();
    
          if (!reponse.ok) {
            setError(json.message);
            setLoading(false);
          }
          if (reponse.ok) {
            //save the user in local storage
            localStorage.setItem("user", JSON.stringify(json));
            //apdate the auth context
            dispatch({ type: "LOGIN", payload: json }); 
            setLoading(false);       
          }
        }catch (error) {
          console.log(error);
        }
    }
    return (
        <div className="login-container">
            <div className="login-form-container">
                <div className="login-image-container">
                    <img src={COVER_IMG} alt="cover" />
                </div>
                <TextFieldComponent 
                    type="text" 
                    label="identifier" 
                    initialHelperText="Enter your identifier" 
                    minLength={4} 
                    maxLength={15} 
                    onChange={handleidentifierChange}
                    obligatory={true}
                    color='#333'
                />
                <TextFieldComponent 
                    type="password" 
                    label="Password" 
                    initialHelperText="Enter your password" 
                    minLength={8} 
                    maxLength={20} 
                    onChange={handlePasswordChange}
                    obligatory={true}
                    color='#333'
                />
                <span className="login-helper-text">{error}</span>
                <button
                  className='login-button'
                  onClick={handleLoginSubmit}
                >Login</button>
            </div>
        </div>
    );
}
export default LoginPage;