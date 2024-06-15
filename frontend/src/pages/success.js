import React from "react";
import SUCCESIMAGE from "../assest/success1.gif";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 mt-8">
      <img src={SUCCESIMAGE} width={250} height={250} alt="Success" />
      <p className="text-green-600 font-bold text-xl m-4">
        Payment Successfully
      </p>
      <Link
        to="/order"
        className="p-2 px-3 my-5 border-2 rounded font-semibold border-green-500 hover:bg-green-600"
      >
        See Orders
      </Link>
    </div>
  );
};

export default Success;
