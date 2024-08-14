import { jwtDecode } from "jwt-decode";
export const TokenDecoder = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user) return null;
    const decodedToken = jwtDecode(user?.token.toString());
    return decodedToken;
};