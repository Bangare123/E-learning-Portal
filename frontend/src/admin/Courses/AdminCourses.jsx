import { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import "./admincourses.css";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import PropTypes from "prop-types"; // Import PropTypes

const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
];

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();

  // **1. Initialize all Hooks at the top unconditionally**
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { courses, fetchCourses } = CourseData();

  // **2. Use useEffect for conditional navigation**
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // **3. Handle Image Change**
  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    if (file) { // Ensure a file is selected
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setImagePrev(reader.result);
        setImage(file);
      };
    }
  };

  // **4. Handle Form Submission**
  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("file", image);

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      setBtnLoading(false);
      await fetchCourses();
      // Reset form fields
      setImage("");
      setTitle("");
      setDescription("");
      setDuration("");
      setImagePrev("");
      setCreatedBy("");
      setPrice("");
      setCategory("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      setBtnLoading(false);
    }
  };

  // **5. Handle Conditional Rendering of "Add Course" Form**
  // Ensure that the "Add Course" form is only accessible to admins

  return (
    <Layout>
      <div className="admin-courses">
        <div className="left">
          <h1>All Courses</h1>
          <div className="dashboard-content">
            {courses && courses.length > 0 ? (
              courses.map((e) => {
                return <CourseCard key={e._id} course={e} />;
              })
            ) : (
              <p>No Courses Yet</p>
            )}
          </div>
        </div>

        <div className="right">
          {user && user.role === "admin" && (
            <div className="add-course">
              <div className="course-form">
                <h2>Add Course</h2>
                <form onSubmit={submitHandler}>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />

                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />

                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                  />

                  <label htmlFor="createdBy">Created By</label>
                  <input
                    type="text"
                    id="createdBy"
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    required
                  />

                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option value={cat} key={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="duration">Duration (weeks)</label>
                  <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    min="1"
                  />

                  <label htmlFor="image">Course Image</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={changeImageHandler}
                    required
                  />

                  {imagePrev && (
                    <img src={imagePrev} alt="Course Preview" width={300} />
                  )}

                  <button
                    type="submit"
                    disabled={btnLoading}
                    className="common-btn"
                  >
                    {btnLoading ? "Please Wait..." : "Add Course"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

// **6. Add PropTypes Validation**
AdminCourses.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
    subscription: PropTypes.arrayOf(PropTypes.string).isRequired,
    // Add other user properties if needed
  }).isRequired,
};

export default AdminCourses;
