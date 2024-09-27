import "./header.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes

const Header = ({ isAuth }) => {
  return (
    <header>
      <div className="logo">E-Learning</div>

      <div className="link">
        <Link to="/" aria-label="Go to Home">Home</Link>
        <Link to="/courses" aria-label="View Courses">Courses</Link>
        <Link to="/about" aria-label="Learn About Us">About</Link>
        {isAuth ? (
          <Link to="/account" aria-label="View Account">Account</Link>
        ) : (
          <Link to="/login" aria-label="Login to Your Account">Login</Link>
        )}
      </div>
    </header>
  );
};

// PropTypes validation
Header.propTypes = {
  isAuth: PropTypes.bool.isRequired, // Validate isAuth as a boolean
};

export default Header;
