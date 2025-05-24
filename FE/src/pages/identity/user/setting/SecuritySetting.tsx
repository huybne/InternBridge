import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./securitysetting.css";
import { AppDispatch, RootState } from "../../../../app/store";
import { changePassword } from "../../../../features/auth/authSlice";

export default function SecuritySettings() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match");
      return;
    }
  
    try {
      const resultAction = await dispatch(
        changePassword({
          oldPassword: currentPassword,
          newPassword: newPassword,
        })
      );
  
      if (changePassword.fulfilled.match(resultAction)) {
        alert("Password changed successfully");
        localStorage.setItem("accessToken", resultAction.payload.newAccessToken);
      } else {
        alert("Failed to change password: " + resultAction.payload);
      }
    } catch (error) {
      alert("Unexpected error");
    }
  };
  
  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      console.log("Deleting account...");
    }
  };

  return (
    <div className="security-settings-page">
      {/* Title Header giống UserProfile */}
      <section
        className="inner-header-title"
        style={{ backgroundImage: "url(/assets/img/banner-10.jpg)" }}
      >
        <div className="container">
          <h1>Security Settings</h1>
        </div>
      </section>

      {/* Main Section */}
      <section
        className="security-settings-page"
        style={{ paddingTop: "30px", paddingBottom: "40px" }}
      >
        <div className="container white-shadow">
          {user ? (
            <>
              {/* Change Password */}
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <h3 className="mb-4">Change Password</h3>
                  <form onSubmit={handleChangePassword}>
                    <label>Current Password</label>
                    <input
                      type="password"
                      className="security-input"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />

                    <label>New Password</label>
                    <input
                      type="password"
                      className="security-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />

                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      className="security-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />

                    <button className="btn-save">Save Changes</button>
                  </form>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="row mt-5">
                <div className="col-md-12 col-sm-12">
                  <h3 className="text-danger">Danger Zone</h3>
                  <p>
                    Deleting your account is permanent and cannot be undone.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="btn btn-danger"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-danger">User information not found.</p>
              <a href="/login" className="btn btn-primary mt-3">
                Login Again
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
