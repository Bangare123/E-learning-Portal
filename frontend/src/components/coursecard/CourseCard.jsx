import "./courseCard.css";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from "../../context/CourseContext";
import PropTypes from "prop-types"; // Import PropTypes
import { useState } from "react"; // Import useState for loading state

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();
  
  // State to handle loading
  const [loading, setLoading] = useState(false);

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setLoading(true); // Set loading state to true
      try {
        const { data } = await axios.delete(`${server}/api/course/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchCourses();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete course");
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  return (
    <div className="course-card">
      <img src={`${server}/${course.image}`} alt={course.title} className="course-image" />
      <h3>{course.title}</h3>
      <p>Instructor: {course.createdBy}</p>
      <p>Duration: {course.duration} weeks</p>
      <p>Price: ₹{course.price}</p>

      {isAuth ? (
        <>
          {user && user.role !== "admin" ? (
            <>
              {user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="common-btn"
                >
                  Get Started
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate(`/course/study/${course._id}`)}
              className="common-btn"
            >
              Study
            </button>
          )}
        </>
      ) : (
        <button onClick={() => navigate("/login")} className="common-btn">
          Get Started
        </button>
      )}

      <br />

      {user && user.role === "admin" && (
        <button
          onClick={() => deleteHandler(course._id)}
          className="common-btn delete-btn" // Use a specific class for deletion
          disabled={loading} // Disable button while loading
          aria-label={`Delete course ${course.title}`} // Add aria-label for accessibility
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      )}
    </div>
  );
};

// PropTypes validation
CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    createdBy: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default CourseCard;
