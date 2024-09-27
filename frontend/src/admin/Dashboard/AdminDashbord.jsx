import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import "./dashboard.css";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  // Check user role and navigate if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // State for statistics
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLectures: 0,
    totalUsers: 0,
  });

  // Fetch statistics from API
  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setStats(data.stats);
    } catch (error) {
      console.log(error);
    }
  }

  // Use effect to fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="main-content">
        <div className="box">
          <p>Total Courses</p>
          <p>{stats.totalCourses}</p>
        </div>
        <div className="box">
          <p>Total Lectures</p>
          <p>{stats.totalLectures}</p>
        </div>
        <div className="box">
          <p>Total Users</p>
          <p>{stats.totalUsers}</p>
        </div>
      </div>
    </Layout>
  );
};

// Define the expected prop types
AdminDashboard.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired, // Validate that role is a string and required
  }).isRequired, // user is required
};

export default AdminDashboard;
