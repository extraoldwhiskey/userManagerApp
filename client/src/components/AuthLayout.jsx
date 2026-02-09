import bgImage from "../assets/poly-bg.jpg";
import { Link } from "react-router-dom";

export default function AuthLayout({ children }) {
  return (
    <div className="container-fluid vh-100 vw-100 px-0 m-0">
      <div className="row g-0 w-100 vh-100">
        <div className="col-12 col-md-6 d-flex flex-column">
          <div className="p-4 fw-bold fs-4 text-primary">THE APP</div>
          <div className="flex-grow-1 d-flex align-items-center justify-content-center w-100">
            <div className="w-100" style={{ maxWidth: 360, minHeight: 420 }}>{children}</div>
          </div>
          <div className="p-4 d-flex flex-column flex-sm-row justify-content-between">
            <span className="mb-2 mb-sm-0">
              Don’t have an account?{" "}
              <Link to="/register" className="link-primary">Sign Up</Link>
            </span>
            <Link to="/login" className="link-primary">Forgot password?</Link>
          </div>
        </div>
        <div
          className="col-md-6 d-none d-md-block flex-grow-1 p-0"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
    </div>
  );
}
