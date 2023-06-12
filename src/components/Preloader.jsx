import React from 'react';
import Image from 'next/image';
import logo from '/src/images/logos/logo.png';

const Preloader = () => {
    return (
        <>
            <div id="preloader-active" className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="logo">
          <Image
            className="w-auto h-20 mx-auto"
            src={logo}
            alt="Logo"
          />
          <h1 className="text-sm">Village Information Management System - VIMS</h1>
        </div>
      </div>
    </div>
        </>
    );
};

export default Preloader;