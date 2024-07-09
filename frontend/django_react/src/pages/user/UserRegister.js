import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import imgregister from './imgregister.png'

function UserRegister() {
  const [formError, setFormError] = useState({});
  const navigate = useNavigate();
  const baseURL = 'http://127.0.0.1:8000';

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setFormError({});
    const formData = new FormData();
    formData.append("first_name", event.target.first_name.value);
    formData.append("email", event.target.email.value);
    formData.append("password", event.target.password.value);
    formData.append("phone_number", event.target.phone_number.value);

    try {
      const res = await axios.post(baseURL + '/api/accounts/register/', formData);
      if (res.status === 201) {
        navigate('/login', {
          state: res.data.Message
        });
        return res;
      }
    } catch (error) {
      if (error.response) {
        console.log("error");
        console.log(error.response.data);
        setFormError(error.response.data);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <section style={{ backgroundColor: "white", minHeight: "100vh" }}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5">
                <div className="row">
                  <div className="col-md-6 order-md-2">
                    <img src={imgregister} alt="Registration Image" className="img-fluid" style={{height: '300px', marginTop: '120px'}} />
                  </div>
                  <div className="col-md-6 order-md-1">
                    <h3 className="mb-5 text-center">Register Now</h3>
                    <form onSubmit={handleRegisterSubmit}>
                      <div className="mb-4">
                        <label className="form-label">Name</label>
                        <input type="text" name='first_name' className="form-control form-control-lg" required placeholder="First Name" />
                      </div>
                      <div className="mb-4">
                        <label className="form-label" htmlFor="typeEmailX-2">Email</label>
                        <input type="email" name='email' className="form-control form-control-lg" required placeholder="Email" />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Mobile Number</label>
                        <input type="text" name='phone_number' className="form-control form-control-lg" required placeholder="Phone Number" />
                      </div>
                      <div className="mb-4">
                        <label className="form-label" htmlFor="typePasswordX-2">Password</label>
                        <input type="password" name='password' className="form-control form-control-lg" required placeholder="Password" />
                      </div>
                      <button type="submit" style={{color:"#00008B"}} className="btn btn-primary btn-lg btn-block">Register Now</button>
                    </form>
                    <ul className='text-danger'>
                      {Object.keys(formError).map((field, index) => (
                        <li key={index}>{field}: {formError[field]}</li>
                      ))}
                    </ul>
                    <hr className="my-4" />
                    <Link to='/login'>Already Have Account? </Link>
                    <Link to='/admincontrol/login'>Admin Login</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserRegister;
