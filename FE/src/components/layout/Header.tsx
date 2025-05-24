import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "../../config/scriptConfig";
import "./header.css";
import { useAppDispatch } from "../../app/hook";
import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../../features/noti/notiSlice";
import MegaMenuWrapper from "./MegaMenuWrapper";
import { megaMenu as fullMenu, MegaMenuColumn } from "../../data/menuData";
import useNotificationSocket from "../../hook/useNotificationSocket";

export default function Header() {
  console.log("[App render]");
  const { user } = useSelector((state: RootState) => state.auth);
  console.log("🧠 Header user:", user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notifications = [] } = useSelector((state: RootState) => state.noti);
  console.log("🔔 Notifications in Header:", notifications);
  const roles = user?.roleNames || [];
  const filteredMegaMenu = fullMenu.filter((col: MegaMenuColumn) => {
    if (!col.roles) return true;
    return col.roles.some((r: string) => roles.includes(r));
  });

  const isAdmin = () => {
    return (
      user?.roleNames?.includes("ADMIN") ||
      user?.roleNames?.includes("STAFF_ADMIN")
    );
  };
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications(user.id));
    }
  }, [user?.id, dispatch]);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    jobs: false,
    cv: false,
    settings: false,
    privacy: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetSections = () => {
    setOpenSections({
      jobs: false,
      cv: false,
      settings: false,
      privacy: false,
    });
  };

  const handleLogout = async () => {
    await dispatch(logout());
    localStorage.clear();
    navigate("/");
  };
  // const userId = useSelector((state: RootState) => state.auth.user?.id);
  // useNotificationSocket(userId || "");

  return (
    <>
      <nav className="navbar navbar-default navbar-fixed navbar-transparent white bootsnav">
        <div className="container">
          <button
            className="navbar-toggle"
            data-target="#navbar-menu"
            data-toggle="collapse"
            type="button"
            aria-label="Toggle navigation"
            title="Toggle navigation"
          >
            <i className="fa fa-bars" />
          </button>
          {isAdmin() && (
            <div
              id="sidebar-toggle"
              style={{
                display: "inline-block",
                cursor: "pointer",
                paddingRight: "12px",
              }}
              onClick={() => {
                const sidebar = document.getElementById("sidebar");
                sidebar?.classList.toggle("hide");
              }}
            >
              <i
                className="bx bx-menu"
                style={{ fontSize: "24px", color: "#fff" }}
              ></i>
            </div>
          )}

          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <img
                alt=""
                className="logo logo-display"
                src="/assets/img/logo-white.png"
              />

              <img
                alt=""
                className="logo logo-scrolled"
                src="/assets/img/logo-white.png"
              />
            </a>
          </div>

          <div className="collapse navbar-collapse" id="navbar-menu">
            <ul
              className="nav navbar-nav navbar-right"
              data-in="fadeInDown"
              data-out="fadeOutUp"
            >
              {isAdmin() ? ("") : (<MegaMenuWrapper menu={filteredMegaMenu} />)}
              {" "}
              {!user ? (
                <>
                  <li>
                    <a href="/signup">
                      <i className="fa fa-pencil" /> SignUp
                    </a>
                  </li>
                  <li>
                    <a href="/login">
                      <i className="fa fa-sign-in" /> Sign In
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className="dropdown user-noti">
                    <a
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                      href="#"
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <i
                          className="fa fa-bell"
                          style={{ fontSize: 20, color: "#888" }}
                        ></i>
                        {notifications.some((n) => !n.read) && (
                          <span className="notification-badge">
                            {notifications.filter((n) => !n.read).length}
                          </span>
                        )}
                      </div>
                    </a>
                    <ul className="dropdown-menu notification-dropdown">
                      {notifications.length === 0 && (
                        <li>Không có thông báo nào</li>
                      )}
                      {notifications.slice(0, 5).map((noti) => (
                        <li
                          key={noti.id}
                          className={`notification-item ${noti.read ? "read" : "unread"
                            }`}
                        >
                          <a
                            href={noti.redirectUrl}
                            onClick={(e) => {
                              e.preventDefault(); // Ngăn trình duyệt chuyển trang ngay
                              dispatch(markNotificationAsRead(noti.id)).then(
                                () => {
                                  navigate(noti.redirectUrl); // chuyển trang sau khi gọi API xong
                                }
                              );
                            }}
                          >
                            <div className="notification-content">
                              <div className="notification-title">
                                {noti.title}
                              </div>
                              <div className="notification-message">
                                {noti.message}
                              </div>
                              <div className="notification-time">
                                {new Date(noti.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>

                  <li className="dropdown user-menu">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      <img
                        src={user.picture || "/assets/img/can-1.png"}
                        alt="avatar"
                        className="img-circle"
                        style={{
                          width: "30px",
                          height: "30px",
                          objectFit: "cover",
                          marginRight: "5px",
                        }}
                      />
                      <span>{user.username}</span>
                    </a>

                    <ul
                      className="dropdown-menu mega-menu"
                      style={{ minWidth: "280px", right: 0, padding: "15px" }}
                      onMouseLeave={resetSections}
                    >
                      <li className="dropdown-user-info">
                        <div className="user-info-container">
                          <img
                            src={user.picture || "/assets/img/can-1.png"}
                            alt="avatar"
                            className="img-circle"
                          />
                          <div className="user-text">
                            <p className="username">{user.username}</p>
                            <p className="email">{user.email}</p>
                          </div>
                        </div>
                      </li>

                      {isAdmin() ? ("") : (<li className="dropdown-section-wrapper">
                        <div
                          className="dropdown-section-title"
                          onClick={() => toggleSection("jobs")}
                          style={{ cursor: "pointer" }}
                        >
                          <i
                            className="fa fa-briefcase"
                            style={{ marginRight: 6 }}
                          ></i>
                          Job Management
                          <i
                            className={`fa fa-angle-${openSections.jobs ? "up" : "down"
                              }`}
                            style={{ float: "right", marginTop: 4 }}
                          />
                        </div>
                        <ul
                          className={`collapsible ${openSections.jobs ? "open" : ""
                            }`}
                        >
                          <li>
                            <a href="/student/listjobfavorite">
                              <i className="fa fa-bookmark" /> Saved Jobs
                            </a>
                          </li>
                          <li>
                            <a href="/student/applied-jobs-list">
                              <i className="fa fa-paper-plane" /> Applied Jobs
                            </a>
                          </li>
                          <li>
                            <a href="/student/list-interview">
                              <i className="fa fa-lightbulb-o" /> List Interview
                            </a>
                          </li>
                          <li>
                            <a href="/jobs/suggestion-settings">
                              <i className="fa fa-cogs" /> Job Suggestions
                            </a>
                          </li>
                        </ul>
                      </li>)}

                      {/* Job Management */}
                      {/* CV & Cover Letter */}
                      {isAdmin() ? ("") : (<li className="dropdown-section-wrapper">
                        <div
                          className="dropdown-section-title"
                          onClick={() => toggleSection("cv")}
                          style={{ cursor: "pointer" }}
                        >
                          <i
                            className="fa fa-id-card"
                            style={{ marginRight: 6 }}
                          ></i>
                          CV & Cover Letter
                          <i
                            className={`fa fa-angle-${openSections.cv ? "up" : "down"
                              }`}
                            style={{ float: "right", marginTop: 4 }}
                          />
                        </div>
                        <ul
                          className={`collapsible ${openSections.cv ? "open" : ""
                            }`}
                        >
                          <li>
                            <a href="/cv">
                              <i className="fa fa-file-text" /> My CV
                            </a>
                          </li>
                        </ul>
                      </li>)}

                      {/* Settings */}
                      {isAdmin() ? ("") : (<li className="dropdown-section-wrapper">
                        <div
                          className="dropdown-section-title"
                          onClick={() => toggleSection("settings")}
                          style={{ cursor: "pointer" }}
                        >
                          <i
                            className="fa fa-sliders"
                            style={{ marginRight: 6 }}
                          ></i>
                          Settings
                          <i
                            className={`fa fa-angle-${openSections.settings ? "up" : "down"
                              }`}
                            style={{ float: "right", marginTop: 4 }}
                          />
                        </div>
                        <ul
                          className={`collapsible ${openSections.settings ? "open" : ""
                            }`}
                        >
                          <li>
                            <a href="/settings/notifications">
                              <i className="fa fa-bell" /> Email & Notifications
                            </a>
                          </li>
                        </ul>
                      </li>)}



                      {/* Privacy & Security */}
                      <li className="dropdown-section-wrapper">
                        <div
                          className="dropdown-section-title"
                          onClick={() => toggleSection("privacy")}
                          style={{ cursor: "pointer" }}
                        >
                          <i
                            className="fa fa-lock"
                            style={{ marginRight: 6 }}
                          ></i>
                          Privacy & Security
                          <i
                            className={`fa fa-angle-${openSections.privacy ? "up" : "down"
                              }`}
                            style={{ float: "right", marginTop: 4 }}
                          />
                        </div>
                        <ul
                          className={`collapsible ${openSections.privacy ? "open" : ""
                            }`}
                        >
                          {isAdmin() ? ("") : (<li>
                            <a href="/profile">
                              <i className="fa fa-user" /> Personal Info
                            </a>
                          </li>)}

                          <li>
                            <a href="/settings/security">
                              <i className="fa fa-shield" /> Security
                            </a>
                          </li>
                        </ul>
                      </li>
                      {isAdmin() && (
                        <li className="dropdown-section-wrapper">
                          <a href="/admin">
                            <i
                              className="fa fa-dashboard"
                              style={{
                                marginRight: 10,
                                width: 20,
                                textAlign: "center",
                              }}
                            ></i>
                            Admin Dashboard
                          </a>
                        </li>
                      )}

                      {/* Logout */}
                      <li className="text-center mt-2">
                        <a
                          onClick={handleLogout}
                          style={{
                            cursor: "pointer",
                            color: "red",
                            fontWeight: "bold",
                          }}
                        >
                          <i
                            className="fa fa-sign-out"
                            style={{ marginRight: 6 }}
                          ></i>
                          Logout
                        </a>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="clearfix" />
    </>
  );
}
