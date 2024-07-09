import axios from "axios";
import React, { useEffect, useState } from "react";
import userimg from "../../images/user.png";
import { Link } from "react-router-dom";
import AdminHeader from "../../Components/admin/AdminHeader/AdminHeader";


function AdminHome() {
  const baseURL = "http://127.0.0.1:8000";
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = (url) => {
    axios
      .get(url)
      .then((response) => {
        setUsers(response.data.results);
        
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchUsers(`${baseURL}/api/accounts/admin/users/?search=${query}`);
  };

  useEffect(() => {
    fetchUsers(baseURL + "/api/accounts/admin/users/");
  }, []);

  useEffect(() => {
    fetchUsers(`${baseURL}/api/accounts/admin/users/?search=${searchQuery}`);
  }, [searchQuery]);

  return (
    <>
    <AdminHeader/>
      <div className="container">
        <h4 className="my-4 mx-2 ">User List</h4>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          className="form-control"
          onChange={(e) => handleSearch(e.target.value)}
        />
        
        <Link className="btn btn-primary my-3" to='user/create'>Create User</Link>
        <table className="table align-middle mb-0 bg-white table-responsive">
          <thead className="bg-light">
            <tr>
              <th>Name</th>
              <th>Phone</th>
             
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users == "" && <tr><td>No Users Found Your Match</td></tr>}
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        user.User_Profile
                          ? user.User_Profile.profile_pic
                          : userimg
                      }
                      className="rounded-circle"
                      alt=""
                      style={{ width: "45px", height: "45px" }}
                    />
                    <div className="ms-3">
                      <p className="fw-bold mb-1">{user.first_name}</p>
                      <p className="text-muted mb-0">{user.email}</p>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="">
                    {user.phone_number}
                  </span>
                </td>
               

                <td>
                  <Link
                    type="button"
                    className="btn btn-link btn-rounded btn-sm fw-bold"
                    to={`user/update/${user.id}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
    </>
  );
}

export default AdminHome;
