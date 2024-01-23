import { Route, Routes } from 'react-router-dom';
import UserRoutes from './User/index';
import DashRoutes from './Dash';
import SignIn from '../pages/signIn';

const RoutesComponent = () => {
    return (
        <Routes>
            <Route path="/user/*" element={<UserRoutes />} />
            <Route path="/dash/*" element={<DashRoutes />} />
            <Route path="*" element={<SignIn />} />
        </Routes>
    );
}

export default RoutesComponent;