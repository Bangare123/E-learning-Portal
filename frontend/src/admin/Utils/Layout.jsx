import PropTypes from "prop-types"; // Import PropTypes
import Sidebar from "./Sidebar";
import "./common.css";

const Layout = ({ children }) => {
  return (
    <div className="dashboard-admin">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
};

// Define the expected prop types
Layout.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children is a required node
};

export default Layout;
