import "./UserProfile.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axiosPrivate from "../../../api/axiosPrivate";
import Swal from "sweetalert2";
import { RefreshResponse } from "../../../features/auth/authType";
import axios from 'axios';
export default function UserProfile() {
  const navigate = useNavigate(); // Hook to navigate to other pages
  const user = useSelector((state: RootState) => state.auth.user);
  const [role, setrole] = useState<String>("");
  const [id, setid] = useState<String>("");
  useEffect(() => {
    const role = user?.roleNames?.join(", ") || "-";
    const trimmedRole = role.trim();
    const iduser = user?.id || "";
    setid(iduser);

    if (trimmedRole.includes("BUSINESS")) {
      setrole('BUSINESS');
      localStorage.setItem("role", "BUSINESS");
      navigate("/verify-business");
    }
    if (trimmedRole.includes("STUDENT")) {
      setrole('STUDENT');
      localStorage.setItem("role", "STUDENT");
      navigate("/studentverifycation");
    }
    if (trimmedRole.includes("USER")) {
      localStorage.setItem("role", "USER");
      setrole("USER");
    }
    if (trimmedRole.includes("STAFF_ADMIN")) {
      localStorage.setItem("role", "STAFF_ADMIN");
      setrole("STAFF_ADMIN");
      navigate("/");
    }
    if (trimmedRole.includes("ADMIN")) {
      localStorage.setItem("role", "ADMIN");
      setrole("ADMIN");
      navigate("/");
    } else {

    }
  });
  //http://localhost:8088/api/v1/users/{userId}/roles/student
  //verify-business

  const choosebusiness = async () => {
    // Show confirmation popup before making the API call
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to proceed to Business verification?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        // Call the API only if confirmed
        const response = await axiosPrivate.post(`/users/${id}/roles/business`);
        const refreshResponse = await axios.post<RefreshResponse>(
          "http://localhost:8088/api/v1/auth/refresh",
          {},
          { withCredentials: true }
        );
        console.log(refreshResponse);
        const newToken = refreshResponse.data.data.token;
        localStorage.setItem("accessToken", newToken);
        // // Handle response (data containing roles)
        console.log('User roles:', response.data);

        // Navigate to the next page
        navigate("/verify-business");

      } catch (error) {
        // Handle error if the API call fails
        console.error('Error fetching user roles:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while fetching the user roles.',
        });
        throw error; // Propagate the error if needed
      }
    }
  };

  const choosestudent = async () => {
    // Show confirmation popup before making the API call
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to proceed to student verification?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        // Call the API only if confirmed
        const response = await axiosPrivate.post(`/users/${id}/roles/student`);
        const refreshResponse = await axios.post<RefreshResponse>(
          "http://localhost:8088/api/v1/auth/refresh",
          {},
          { withCredentials: true }
        );
        console.log(refreshResponse);
        const newToken = refreshResponse.data.data.token;
        localStorage.setItem("accessToken", newToken);
        // // Handle response (data containing roles)
        console.log('User roles:', response.data);

        // Navigate to the next page
        navigate("/studentverifycation");

      } catch (error) {
        // Handle error if the API call fails
        console.error('Error fetching user roles:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while fetching the user roles.',
        });
        throw error; // Propagate the error if needed
      }
    }
  };




  return (
    <>
      {(true) ? (<div className="user-profile-page">
        {/* Title Banner */}
        <section
          className="inner-header-title"
          style={{ backgroundImage: "url(/assets/img/banner-10.jpg)" }}
        >
          <div className="container">
            <h1>Please select your role</h1>
          </div>
        </section>

        {/* Profile Overview */}
        <section className="detail-desc advance-detail-pr gray-bg">
          <div className="container white-shadow profile-box-centered text-center">
            {user ? (
              <>
                <div className="profile-header">
                  <div className="avatar-wrapper">
                    <img
                      src={user.picture || "/assets/img/can-1.png"}
                      className="avatar-img"
                      alt="Avatar"
                    />
                  </div>
                </div>

                <h4 className="username">{user.username}</h4>
                <span className="designation">{user.email}</span>

                <div>
                  <a onClick={choosebusiness} className="footer-btn grn-btn">Business</a>
                  <a onClick={choosestudent} className="footer-btn blu-btn">Student</a>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <p className="text-danger">Không tìm thấy thông tin người dùng.</p>
                <a href="/login" className="btn btn-primary mt-3">Đăng nhập lại</a>
              </div>
            )}
          </div>
        </section>

        {/* Tabs Section */}
        <section className="full-detail-description full-detail gray-bg">

        </section>
      </div>) : (<div className="user-profile-page">
        {/* Title Banner */}
        <section
          className="inner-header-title"
          style={{ backgroundImage: "url(/assets/img/banner-10.jpg)" }}
        >
          <div className="container">
            <h1>User Profile</h1>
          </div>
        </section>

        {/* Profile Overview */}
        <section className="detail-desc advance-detail-pr gray-bg">
          <div className="container white-shadow profile-box-centered text-center">
            {user ? (
              <>
                <div className="profile-header">
                  <div className="avatar-wrapper">
                    <img
                      src={user.picture || "/assets/img/can-1.png"}
                      className="avatar-img"
                      alt="Avatar"
                    />
                    <a href="#" className="edit-avatar" title="edit">
                      <i className="fa fa-pencil"></i>
                    </a>
                  </div>
                  <span className="badge-active">Active Now</span>
                </div>

                <h4 className="username">{user.username}</h4>
                <span className="designation">{user.email}</span>

                <div className="profile-stats row">
                  <div className="col-md-4">
                    <div className="stat-box">
                      <strong className="stat-number stat-red">85</strong>
                      <div className="stat-label">New Post</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-box">
                      <strong className="stat-number stat-blue">110</strong>
                      <div className="stat-label">Job Applied</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-box">
                      <strong className="stat-number stat-green">120</strong>
                      <div className="stat-label">Invitation</div>
                    </div>
                  </div>
                </div>

                <ul className="detail-footer-social">
                  <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                  <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                  <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                  <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                  <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                </ul>

                <div className="button-group">
                  <a href="#" className="footer-btn grn-btn">Edit Now</a>
                  <a href="#" className="footer-btn blu-btn">Save Draft</a>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <p className="text-danger">Không tìm thấy thông tin người dùng.</p>
                <a href="/login" className="btn btn-primary mt-3">Đăng nhập lại</a>
              </div>
            )}
          </div>
        </section>

        {/* Tabs Section */}
        <section className="full-detail-description full-detail gray-bg">
          <div className="container">
            <div className="deatil-tab-employ tool-tab">
              <ul className="nav simple nav-tabs">
                <li className="active"><a href="#">About</a></li>
                <li><a href="#">Address</a></li>
                <li><a href="#">Matches Job</a></li>
                <li><a href="#">Friends</a></li>
                <li><a href="#">Messages <span className="info-bar">6</span></a></li>
                <li><a href="#">Settings</a></li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane active">
                  <h3>About {user?.username || "User"}</h3>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td><strong>Username</strong></td>
                        <td>{user?.username || "-"}</td>
                      </tr>
                      <tr>
                        <td><strong>Email</strong></td>
                        <td>{user?.email || "-"}</td>
                      </tr>
                      <tr>
                        <td><strong>Role</strong></td>
                        <td>{user?.roleNames?.join(", ") || "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>)



      }

    </>

  );
}