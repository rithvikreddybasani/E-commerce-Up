// import React, { useEffect, useState } from "react";
// import SummaryApi from "../common";
// import { toast } from "react-toastify";
// import moment from "moment";
// import { MdModeEdit } from "react-icons/md";
// import ChangeUserRole from "../components/ChangeUserRole";

// const Profile = () => {
//   const [allUser, setAllUsers] = useState([]);
//   const [openUpdateRole, setOpenUpdateRole] = useState(false);
//   const [updateUserDetails, setUpdateUserDetails] = useState({
//     email: "",
//     name: "",
//     role: "",
//     _id: "",
//   });

//   const fetchAllUsers = async () => {
//     const fetchData = await fetch(SummaryApi.allUser.url, {
//       method: SummaryApi.allUser.method,
//       credentials: "include",
//     });

//     const dataResponse = await fetchData.json();

//     if (dataResponse.success) {
//       setAllUsers(dataResponse.data);
//     }

//     if (dataResponse.error) {
//       toast.error(dataResponse.message);
//     }
//   };

//   useEffect(() => {
//     fetchAllUsers();
//   }, []);

//   return (
//     <div className="bg-white pb-4">
//       <table className="w-full userTable">
//         <thead>
//           <tr className="bg-black text-white">
//             <th>Sr.</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Created Date</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody className="">
//           {allUser.map((el, index) => {
//             return (
//               <tr>
//                 <td>{index + 1}</td>
//                 <td>{el?.name}</td>
//                 <td>{el?.email}</td>
//                 <td>{el?.role}</td>
//                 <td>{moment(el?.createdAt).format("LL")}</td>
//                 <td>
//                   <button
//                     className="bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white"
//                     onClick={() => {
//                       setUpdateUserDetails(el);
//                       setOpenUpdateRole(true);
//                     }}
//                   >
//                     <MdModeEdit />
//                   </button>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       {openUpdateRole && (
//         <ChangeUserRole
//           onClose={() => setOpenUpdateRole(false)}
//           name={updateUserDetails.name}
//           email={updateUserDetails.email}
//           role={updateUserDetails.role}
//           userId={updateUserDetails._id}
//           callFunc={fetchAllUsers}
//         />
//       )}
//     </div>
//   );
// };

// export default Profile;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaRegCircleUser } from "react-icons/fa6";
import { setUserDetails } from "../store/userSlice";
import uploadImage from "../helpers/uploadImage";
import SummaryApi from "../common";

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profilePic: user?.profilePic || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadImageCloudinary = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        profilePic: uploadImageCloudinary.url,
      }));
      toast.success("Profile picture updated successfully");
    } else {
      toast.error("Failed to upload image");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch(setUserDetails(formData));
    // toast.success("Profile updated successfully");
    const updateUserDetails = async () => {
      const fetchResponse = await fetch(SummaryApi.updateUser.url, {
        method: SummaryApi.updateUser.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
        }),
      });

      const responseData = await fetchResponse.json();

      if (responseData.success) {
        toast.success(responseData.message);
      }

      toast.success(responseData.message);
    };
    updateUserDetails();
    setUserDetails(formData);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <div className="text-center mb-4">
          {formData.profilePic ? (
            <img
              src={formData.profilePic}
              className="w-20 h-20 rounded-full mx-auto"
              alt={formData.name}
            />
          ) : (
            <FaRegCircleUser className="text-5xl mx-auto" />
          )}
          <h2 className="text-xl font-semibold">{formData.name}</h2>
          <p className="text-sm">{formData.email}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Upload Profile Picture
            </label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
