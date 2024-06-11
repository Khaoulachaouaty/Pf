import { Navigate } from 'react-router-dom';
import { Account_service } from '../services/account_service';

const AuthGuard = ({ children }) => {

    if (!Account_service.isLogged()) {
        return <Navigate to="/login" />;
    }
    return children;
}

export default AuthGuard;