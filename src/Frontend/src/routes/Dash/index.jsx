import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '../../components/SideBar/SideBar';
import Dash from '../../pages/Dash';
import { ListProducts } from '../../components/Product/ListProducts';
import { DetailProducts } from '../../components/Product/DetailProducts';
import { TitleProvider } from '../../context/TitleContext';
import { NewProduct } from '../../components/Product/NewProducts';


const DashRoutes = () => {
  return (
    <>
      <TitleProvider>
        <SideBar>
          <Routes>
              <Route path="/" element={<ListProducts />} />
              <Route path="/:id" element={<DetailProducts />} />
              <Route path="/product/new" element={<NewProduct />} />
              <Route path="/graphs" element={<Dash />} />
              <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        </SideBar>
      </TitleProvider>
    </>
  );
};

export default DashRoutes;