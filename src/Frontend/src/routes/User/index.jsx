import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from '../../pages/signIn';
import ForgotPassword from '../../pages/forgotPassword';
import SignUp from '../../pages/signUp';

const UserRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="*" element={<SignIn />} />
      </Routes>
    </>
  );
};

export default UserRoutes;