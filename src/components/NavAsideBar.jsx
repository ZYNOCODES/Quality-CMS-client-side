// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import AsideBar from './Bars/AsideBar';

const Layout = () => {
  return (
    <div className="layout">
      <AsideBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
