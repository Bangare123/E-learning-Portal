import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";
import PropTypes from "prop-types"; // Import PropTypes

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState({});
  const [mycourse, setMyCourse] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  async function fetchCourses() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${server}/api/course/all`);
      setCourses(data.courses);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch courses. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCourse(id) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${server}/api/course/${id}`);
      setCourse(data.course);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch course details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchMyCourse() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${server}/api/mycourse`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setMyCourse(data.courses);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch your courses. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchMyCourse();
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        fetchCourses,
        fetchCourse,
        course,
        mycourse,
        fetchMyCourse,
        loading, // Provide loading state
        error, // Provide error state
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

CourseContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const CourseData = () => useContext(CourseContext);
