import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";
import bg from "../assets/poly-bg.jpg";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!e.target.checkValidity())
      return e.target.classList.add("was-validated");

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/users");
    } catch (e) {
      setError(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout image={bg}>
      <div className="mb-4">
        <div className="text-muted mb-1">Start your journey</div>
        <h4 className="fw-semibold">Sign In to The App</h4>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form className="needs-validation" noValidate onSubmit={submit}>
        <div className="mb-3">
          <div className="input-group">
            <input
              className="form-control"
              placeholder="E-mail"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <span className="input-group-text bg-white">
              <i className="bi bi-envelope text-muted" />
            </span>
            <div className="invalid-feedback">
              {!form.email
                ? "Email can't be empty"
                : "Email address must end with .com"}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Password"
              type={show ? "text" : "password"}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <span
              className="input-group-text bg-white"
              role="button"
              onClick={() => setShow((v) => !v)}
            >
              <i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`} />
            </span>
            <div className="invalid-feedback">{"Name can't be empty"}</div>
          </div>
        </div>

        <div className="form-check mb-4">
          <input className="form-check-input" type="checkbox" id="remember" />
          <label className="form-check-label" htmlFor="remember">
            Remember me
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Sign In
        </button>
      </form>
    </AuthLayout>
  );
}
