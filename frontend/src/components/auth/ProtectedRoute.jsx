

// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const ProtectedRoute = ({children, user}) => {

//   console.log(user);
//   // const { user } = useSelector((state) => state.auth);
//   if(user){
//     return <Navigate to={"/"} />
//   }
//   return children ? children : <Outlet />
// }

// export default ProtectedRoute;




import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = ({children, user, redirect="/login"}) => {
  
    if(!user){
      return <Navigate to={redirect} />
    }
    return children ? children : <Outlet /> ;
}

export default ProtectRoute;

