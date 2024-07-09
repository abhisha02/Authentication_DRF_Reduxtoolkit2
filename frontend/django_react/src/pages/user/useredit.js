import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userimg from '../../images/user.png';
import { set_Authentication } from "../../Redux/authentication/authenticationSlice"; 
import { useDispatch, useSelector } from 'react-redux';

function UserEdit() {
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user);
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');

  const fetchUserData = async () => {
    try {
      const res = await axios.get(baseURL + '/api/accounts/user/details/', {
        headers: {
          'authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setUserDetails(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [userUpdateDetails, setUserUpdateDetails] = useState({
    first_name: '',
    email: '',
    phone_number: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserUpdateDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let form_data = new FormData();
    if (userUpdateDetails.first_name) {
      form_data.append('first_name', userUpdateDetails.first_name);
    }
    if (userUpdateDetails.email) {
      form_data.append('email', userUpdateDetails.email);
    }
    if (userUpdateDetails.phone_number) {
      form_data.append('phone_number', userUpdateDetails.phone_number);
    }
    
    let url = baseURL + '/api/accounts/user/details/edit';
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data',
        'authorization': `Bearer ${token}`,
      }
    })
      .then(res => {
        dispatch(
          set_Authentication({
            name: '',
            isAuthenticated: false
          })
        );
      })
      .catch(err => console.log(err));
  };

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [authentication_user]);

  return (
    <section className="" style={{ backgroundColor: '#eee' }}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-12 col-xl-4">
            <div className="card" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center">
                <div className="mt-3 mb-4">
                  <img src={userDetails ? userDetails.profile_pic ? userDetails.profile_pic : userimg : userimg} className="rounded-circle img-fluid" style={{ width: '100px' }} alt='img' />
                </div>
           
             
                <form onSubmit={handleSubmit}>
                  <input type="text" name="first_name" placeholder={userDetails?.first_name || "First Name"} value={userUpdateDetails.first_name} onChange={handleChange} className='form-control my-2' />
                  <input type="email" name="email" placeholder={userDetails?.email || "Email"} value={userUpdateDetails.email} onChange={handleChange} className='form-control my-2' />
                  <input type="tel" name="phone_number" placeholder={userDetails?.phone_number || "Phone Number"} value={userUpdateDetails.phone_number} onChange={handleChange} className='form-control my-2' />
                  <button type="submit" className="btn btn-primary btn-rounded btn-lg">
                    Update Details
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserEdit;
