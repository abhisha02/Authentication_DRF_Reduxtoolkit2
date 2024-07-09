import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import userimg from "../../images/user.png";

function AdminUpdateUser() {
  const baseURL = "http://127.0.0.1:8000";
  const { id } = useParams();
  const [formError, setFormError] = useState([]);
  const [userData, setUserData] = useState({
    first_name: '',
    phone_number: '',
    email: '',
    is_active: true
  });

  useEffect(() => {
    axios.get(baseURL+`/api/accounts/admin/users/${id}/`)
      .then(response => {
        setUserData(response.data); 
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
        navigate('/admincontrol');
      });
  }, [id]); 
  
  const handleInputChange = event => {
    const { name, value, type, checked } = event.target;
    
    setUserData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    
    if (confirmDelete) {
      axios.delete(baseURL+`/api/accounts/admin/users/delete/${id}/`)
        .then(response => {
          navigate('/admincontrol');
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
  };

  const handleBlockUnblock = () => {
    const action = userData.is_active ? 'block' : 'unblock';
    const confirmAction = window.confirm(`Are you sure you want to ${action} this user?`);

    if (confirmAction) {
      const updatedUserData = { ...userData, is_active: !userData.is_active };

      axios.put(baseURL + `/api/accounts/admin/users/update/${id}/`, updatedUserData)
        .then(response => {
          setUserData(updatedUserData);
        })
        .catch(error => {
          console.error(`Error ${action}ing user:`, error);
        });
    }
  };

  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();

    axios.put(baseURL+`/api/accounts/admin/users/update/${id}/`, userData)
      .then(response => {
        navigate('/admincontrol');
      })
      .catch(error => {
        setFormError(error.response.data);
        console.error('Error updating user:', error);
      });
  };

  return (
    <section>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-2-strong" style={{borderRadius: '1rem'}}>
              <div className="card-body p-5">
                <img src={userData.User_Profile ? userData.User_Profile.profile_pic : userimg} className="rounded-circle" alt="" style={{ width: "80px", height: "80px" }} />
                <h3 className="mb-5 text-center">Update {userData.first_name}</h3>
                <form onSubmit={handleSubmit} method='POST'>
                  <div className="mb-4">
                    <input type="text" name='first_name' value={userData.first_name} className="form-control form-control-lg" required onChange={handleInputChange}/>
                    <label className="form-label" >Name</label>
                  </div>
                  <div className="mb-4">
                    <input type="email" id="typeEmailX-2" name='email' value={userData.email} className="form-control form-control-lg"  required onChange={handleInputChange}/>
                    <label className="form-label" htmlFor="typeEmailX-2">Email</label>
                  </div>
                  <div className="mb-4">
                    <input type="text" className="form-control form-control-lg" value={userData.phone_number}  name='phone_number' required onChange={handleInputChange}/>
                    <label className="form-label" >Mobile Number</label>
                  </div>
                  
                  <button className="btn btn-primary btn-lg btn-block" type="submit">Update Now</button>
                </form>
                
                <button className="btn btn-warning btn-lg btn-block my-2" type="button" onClick={handleBlockUnblock}>
                  {userData.is_active ? 'Block User' : 'Unblock User'}
                </button>
                <hr className="my-4"/>
                <ul className='text-danger'>
                  {Object.keys(formError).map((key) => (
                    formError[key].map((message, index) => (
                      <li key={`${key}_${index}`}>{message}</li>
                    ))
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminUpdateUser;
