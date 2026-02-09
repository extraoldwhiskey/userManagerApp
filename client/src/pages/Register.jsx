import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";
import bg from "../assets/poly-bg.jpg";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!e.target.checkValidity())
      return e.target.classList.add("was-validated");
    try {
      await api.post("/auth/register", form);
      setMsg("Registration successful. Please check your email.");
      setError("");
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout image={bg}>
      <div className="mb-4">
        <h4 className="fw-semibold">Sign Up to The App</h4>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="needs-validation" noValidate onSubmit={submit}>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Name"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="invalid-feedback">{"Name can't be empty"}</div>
        </div>
        <div className="mb-3">
          <div className="input-group">
            <input
              className="form-control"
              placeholder="E-mail"
              type="email"
              pattern=".+\.com$"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <span
              className="input-group-text bg-white"
              role="button"
              onClick={() => setShow((v) => !v)}
            >
              <i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`} />
            </span>
            <div className="invalid-feedback">{"Insert password"}</div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
      </form>

      <div className="mt-3 text-center">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </AuthLayout>
  );
}
