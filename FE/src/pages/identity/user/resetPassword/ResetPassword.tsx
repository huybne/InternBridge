import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../app/hook";
import { resetPassword } from "../../../../features/auth/authSlice";
import Swal from "sweetalert2";
import "./forgetpassword.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      Swal.fire("Error", "Token is missing in the URL.", "error");
      return;
    }

    if (newPassword !== repeatNewPassword) {
      Swal.fire("Mismatch", "Passwords do not match.", "warning");
      return;
    }

    try {
      const resultAction = await dispatch(
        resetPassword({ token, newPassword })
      );
      if (resetPassword.fulfilled.match(resultAction)) {
        Swal.fire({
          title: "Success",
          text: "Password has been reset successfully. You can now log in.",
          icon: "success",
          confirmButtonText: "OK",
          width: "600px",
          customClass: {
            popup: "swal-wide",
            title: "swal-title-lg",
            htmlContainer: "swal-text-lg",
          },
        }).then(() => navigate("/login"));
      } else {
        Swal.fire({
            title: "Error",
            text: "Token is missing in the URL.",
            icon: "error",
            confirmButtonText: "OK",
            width: "600px",
            customClass: {
              popup: "swal-wide",
              title: "swal-title-lg",
              htmlContainer: "swal-text-lg",
            },
          });
          
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "OK",
        width: "600px",
        customClass: {
          popup: "swal-wide",
          title: "swal-title-lg",
          htmlContainer: "swal-text-lg",
        },
      });
    }
  };

  return (
    <div className="reset-password-page">
      <section
        className="inner-header-title"
        style={{ backgroundImage: "url(assets/img/banner-10.jpg)" }}
      >
        <div className="container" style={{ marginTop: "30px" }}>
          <h1>Reset Password</h1>
        </div>
      </section>

      <section
        className="reset-password-page"
        style={{ paddingTop: "30px", paddingBottom: "40px" }}
      >
        <div className="container white-shadow">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <h3 className="mb-4">Enter your new Password</h3>

              <form onSubmit={handleResetPassword}>
                <label>Enter new password</label>
                <input
                  type="password"
                  className="security-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

                <label>Repeat your new Password</label>
                <input
                  type="password"
                  className="security-input"
                  value={repeatNewPassword}
                  onChange={(e) => setRepeatNewPassword(e.target.value)}
                  required
                />

                <button className="btn-save" type="submit">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
