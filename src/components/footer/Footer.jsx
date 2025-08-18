import React from "react";
import { MdDeveloperBoard } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="footer footer-horizontal footer-center bg-gradient-to-r from-purple-500 to-blue-500 text-primary-content p-10">
      <aside>
       <img src="https://i.ibb.co.com/Q7PVt9Sd/gettyimages-1470968033-2048x2048.jpg" alt="footer image" className="h-30 w-30 rounded-lg" />
        <p className="font-bold">
          Learn and Earn
          <br />
          Providing reliable process..
        </p>
        <p className="text-white">Copyright © {new Date().getFullYear()} - Learn and Fun. All rights reserved.</p>
      </aside>
      <nav>
        <div className="-mt-12">
          <div className="text-start ml-4 md:ml-0 md:text-center text-sm text-white">
        <MdDeveloperBoard className="inline -mt-0.5"></MdDeveloperBoard> Developed by Sadik Sourov.
      </div>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
