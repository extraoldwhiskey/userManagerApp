import { useState, useRef, useEffect } from "react";
import api from "../services/api";

export default function Header({ user }) {
  const [show, setShow] = useState(false), [msg, setMsg] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const o = e => ref.current && !ref.current.contains(e.target) && setShow(false);
    document.addEventListener("mousedown", o);
    return () => document.removeEventListener("mousedown", o);
  }, []);

  const logout = () => (localStorage.removeItem("token"), window.location.href="/login");
  const resend = async () => {
    try { await api.post("/auth/resend-verify",{email:user.email}); setMsg("Verification email sent"); }
    catch { setMsg("Error sending email"); }
    setTimeout(()=>setMsg(""),3000);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <span className="navbar-brand">User Manager</span>
      <div className="ms-auto d-flex align-items-center">
        {user ? (
          <div className="position-relative" ref={ref}>
            <i className={`bi fs-3 cursor-pointer ${user.status==="active"?"bi-person-check text-success":"bi-person-exclamation text-warning"}`}
               onClick={()=>setShow(p=>!p)}></i>
            {show && <div className="position-absolute bg-white border shadow p-3" style={{right:0,top:"120%",minWidth:220,zIndex:1000}}>
              {["username","email"].map(f=><p key={f}><strong>{f[0].toUpperCase()+f.slice(1)}:</strong> {user[f]}</p>)}
              <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
              <p><strong>Status:</strong> {user.status==="active"?<>Active <i className="bi bi-check-circle-fill text-success"/></>:<>
                Unverified <button className="btn btn-sm btn-primary mx-0" onClick={resend}>Get Verified</button></>}</p>
              {msg && <div className="mt-2 text-success">{msg}</div>}
            </div>}
          </div>
        ) : <span className="text-light me-3">Data loading...</span>}
        <button className="btn btn-danger btn-sm ms-3" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}