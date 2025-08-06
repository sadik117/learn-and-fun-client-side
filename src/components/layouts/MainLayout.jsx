import React from "react";
import Navbar from "../navbar/Navbar";
import { Outlet } from "react-router";
import Footer from "../footer/footer";



const Mainlayout = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className="min-h-[calc(100vh-324px)]">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Mainlayout;
