import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import "./coursesstudy.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import toast from "react-hot-toast"; // Import toast for notifications

const CourseStudy = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { fetchCourse, course } = CourseData();
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const checkAccess = () => {
      if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
        navigate("/"); // Navigate if user doesn't have access
      }
    };

    checkAccess(); // Check access when the component mounts

    const loadCourse = async () => {
      try {
        await fetchCourse(params.id);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course data."); // Notify user on error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    loadCourse(); // Fetch the course
  }, [params.id, user, fetchCourse, navigate]); // Dependencies include user and fetchCourse

  if (loading) {
    return <div>Loading...</div>; // Loading feedback
  }

  return (
    <>
      {course && (
        <div className="course-study-page">
          <img src={`${server}/${course.image}`} alt="" width={350} />
          <h2>{course.title}</h2>
          <h4>{course.description}</h4>
          <h5>by - {course.createdBy}</h5>
          <h5>Duration - {course.duration} weeks</h5>
          <Link to={`/lectures/${course._id}`}>
            <h2>Lectures</h2>
          </Link>
        </div>
      )}
    </>
  );
};

// Define prop types
CourseStudy.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    subscription: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default CourseStudy;
