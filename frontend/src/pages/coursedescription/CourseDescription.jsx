import { useEffect, useState } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";
import PropTypes from "prop-types"; // Import PropTypes

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(true); // State to track course loading

  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        await fetchCourse(params.id);
      } catch (error) {
        console.error("Error fetching course:", error); // Log the error
        toast.error("Failed to load course data."); // Notify the user
      } finally {
        setCourseLoading(false);
      }
    };

    fetchCourseData();
  }, [params.id, fetchCourse]); // Include params.id in the dependency array

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const {
        data: { order },
      } = await axios.post(
        `${server}/api/course/checkout/${params.id}`,
        {},
        {
          headers: {
            token,
          },
        }
      );

      const options = {
        key: "rzp_test_yOMeMyaj2wlvTt", // Enter the Key ID generated from the Dashboard
        amount: order.id, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "E-learning", // your business name
        description: "Learn with us",
        order_id: order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1

        handler: async function (response) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          try {
            const { data } = await axios.post(
              `${server}/api/verification/${params.id}`,
              {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
              },
              {
                headers: {
                  token,
                },
              }
            );

            await fetchUser();
            await fetchCourses();
            await fetchMyCourse();
            toast.success(data.message);
            navigate(`/payment-success/${razorpay_payment_id}`);
          } catch (error) {
            toast.error(error.response.data.message);
          } finally {
            setLoading(false); // Ensure loading is stopped after the process
          }
        },
        theme: {
          color: "#8a4baf",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error", error);
      toast.error("Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      {loading || courseLoading ? (
        <Loading />
      ) : (
        <>
          {course ? (
            <div className="course-description">
              <div className="course-header">
                <img
                  src={`${server}/${course.image}`}
                  alt=""
                  className="course-image"
                />
                <div className="course-info">
                  <h2>{course.title}</h2>
                  <p>Instructor: {course.createdBy}</p>
                  <p>Duration: {course.duration} weeks</p>
                </div>
              </div>

              <p>{course.description}</p>

              <p>Let us get started with the course at ₹{course.price}</p>

              {user && user.subscription?.includes(course._id) ? ( // Optional chaining for subscription check
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button onClick={checkoutHandler} className="common-btn">
                  Buy Now
                </button>
              )}
            </div>
          ) : (
            <p>Course not found.</p> // Feedback if the course doesn't exist
          )}
        </>
      )}
    </>
  );
};

// PropTypes validation
CourseDescription.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    subscription: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default CourseDescription;
