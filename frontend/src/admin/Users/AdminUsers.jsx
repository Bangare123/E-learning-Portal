import { useEffect, useState } from "react";
import "./users.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import toast from "react-hot-toast";
import PropTypes from "prop-types"; // Import PropTypes

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();

  // Check user role and navigate if not superadmin
  useEffect(() => {
    if (user && user.mainrole !== "superadmin") {
      navigate("/");
    }
  }, [user, navigate]);

  const [users, setUsers] = useState([]);

  // Fetch users from API
  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  }

  // Use effect to fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user role
  const updateRole = async (id) => {
    if (confirm("Are you sure you want to update this user role?")) {
      try {
        const { data } = await axios.put(
          `${server}/api/user/${id}`,
          {},
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        toast.success(data.message);
        fetchUsers();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <Layout>
      <div className="users">
        <h1>All Users</h1>
        <table border={"1"}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Update Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((e, i) => (
              <tr key={e._id}>
                <td>{i + 1}</td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.role}</td>
                <td>
                  <button
                    onClick={() => updateRole(e._id)}
                    className="common-btn"
                  >
                    Update Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

// Define the expected prop types
AdminUsers.propTypes = {
  user: PropTypes.shape({
    mainrole: PropTypes.string.isRequired, // Validate that mainrole is a string and required
  }).isRequired, // user is required
};

export default AdminUsers;
