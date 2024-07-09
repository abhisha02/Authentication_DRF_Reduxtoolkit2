import axios from 'axios';
import jwt_decode from "jwt-decode";
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { set_Authentication } from '../../Redux/authentication/authenticationSlice';
import imgadmin from './imgadmin.jpg'





function AdminLogin() {
  const [formError, setFormError] = useState([])
  const baseURL='http://127.0.0.1:8000'

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLoginSubmit = async(event) => {
    event.preventDefault();
    setFormError([]);
    const formData = new FormData();
    formData.append("email", event.target.email.value);
    formData.append("password", event.target.password.value);
    try {
      const res = await axios.post(baseURL + '/api/accounts/login/', formData);
      // Check if res is defined before accessing its properties
      if (res && res.status === 200) {
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        dispatch(
          set_Authentication({
            name: jwt_decode(res.data.access).first_name,
            isAuthenticated: true,
            isAdmin: res.data.isAdmin,
          })
        );
        navigate('/admincontrol');
        return res;
      }
    } catch (error) {
      console.log(error);
      // Log the error response to understand what went wrong
      if (error.response) {
        console.error(error.response);
        if (error.response.status === 401) {
          setFormError(error.response.data);
        }
      } else {
        console.error("An unexpected error occurred:", error.message);
      }
    }
  };



  return (
    <section >
    <div className="container py-5">
      <div className="row d-flex align-items-center justify-content-center">
        <div className="col-md-8 col-lg-7 col-xl-6">
        
        
  
          <img src={imgadmin}
            className="img-fluid" alt="Phone "/>
        </div>
        <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
          <form method='POST' onSubmit={handleLoginSubmit}>
            {/* <!-- Email input --> */}
            <div className=" mb-4">
              <input type="email" name='email' id="form1Example13" className="form-control form-control-lg" />
              <label className="form-label" htmlFor="form1Example13">Email address</label>
            </div>
  
            {/* <!-- Password input --> */}
            <div className=" mb-4">
              <input type="password" name='password' id="form1Example23" className="form-control form-control-lg" />
              <label className="form-label" htmlFor="form1Example23">Password</label>
            </div>
  
          
  
            {/* <!-- Submit button --> */}
            <button type="submit" className="btn btn-primary btn-lg btn-block">Sign in</button>
  
            <ul className='text-danger'>
               {formError['detail'] && <li>
               {formError['detail']}
                </li>}
              </ul>
            
          </form>
        </div>
      </div>
    </div>
  </section>
  )
}

export default AdminLogin