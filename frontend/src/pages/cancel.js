import React from "react";
import SUCCESIMAGE from "../assest/cancel.gif";
import { Link } from "react-router-dom";

const cancel = () => {
  return (
    <div className="bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 mt-8">
      <img src={SUCCESIMAGE} width={250} height={250} alt="Cancess" />
      <p className="text-red-600 font-bold text-xl m-4">Payment Successfully</p>
      <Link
        to="/cart"
        className="p-2 px-3 my-5 border-2 rounded font-semibold border-red-500 hover:bg-red-600"
      >
        See Orders
      </Link>
    </div>
  );
};

export default cancel;
