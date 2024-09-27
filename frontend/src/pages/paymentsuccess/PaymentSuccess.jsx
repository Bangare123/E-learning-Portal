import PropTypes from "prop-types"; // Import PropTypes
import "./paymentsuccess.css";
import { Link, useParams } from "react-router-dom";

const PaymentSuccess = ({ user }) => {
  const params = useParams();

  return (
    <div className="payment-success-page">
      {user ? (
        <div className="success-message">
          <h2>Payment Successful</h2>
          <p>Your course subscription has been activated</p>
          <p>Reference no - {params.id}</p>
          <Link to={`/${user._id}/dashboard`} className="common-btn">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="error-message">
          <h2>Error: User not found</h2>
          <p>Please log in to view your payment status.</p>
          <Link to="/login" className="common-btn">
            Go to Login
          </Link>
        </div>
      )}
    </div>
  );
};

// Define prop types for the PaymentSuccess component
PaymentSuccess.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    subscription: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default PaymentSuccess;
