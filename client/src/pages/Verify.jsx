import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Verifying...");
  const [timer, setTimer] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const startRedirect = (message, path) => {
      setStatus(message);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate(path);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    if (!token) {
      startRedirect(
        "The token is invalid or has expired. Redirecting to login...",
        "/login",
      );
      return;
    }

    fetch(`/auth/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Email verified successfully") {
          startRedirect("Email verified! Redirecting to users...", "/users");
        } else {
          startRedirect(
            "The token is invalid or has expired. Redirecting to login...",
            "/login",
          );
        }
      })
      .catch(() => {
        startRedirect(
          "The token is invalid or has expired. Redirecting to login...",
          "/login",
        );
      });
  }, []);

  return (
    <div className="p-4 text-center">
      <h2>{status}</h2>
      {status.includes("Redirecting") && <p>{timer} seconds</p>}
    </div>
  );
}
