import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import imghome2 from './imghome2.png';
import { set_name } from '../../Redux/authentication/authenticationSlice';




function UserHome() {
  const navigate = useNavigate();
  const authentication_user = useSelector(state => state.authentication_user);
 
  const dispatch=useDispatch()

 
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Adjust this value as needed
      width: '100vw', // Adjust this value as needed
    }}>
      <img src={imghome2} alt="Registration Image" className="img-fluid" />
   
     
   
    </div>
  );
}

export default UserHome;