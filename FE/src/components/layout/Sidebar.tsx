// src/components/layout/Sidebar.tsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";




const menuItems = [
  { title: "Dashboard", icon: "fa fa-tachometer-alt", path: "/admin" },
  // { title: 'Users', icon: 'fa fa-users', path: '/admin/users' },
  // { title: 'Settings', icon: 'fa fa-cogs', path: '/admin/settings' },
  {
    title: "Categories",
    icon: "fa fa-th-large",
    path: "/admin/categories",
  },
  {
    title: "Student accounts",
    icon: "fa fa-user-graduate",
    path: "/admin/students-account",
  },
  {
    title: "Business accounts",
    icon: "fa fa-briefcase",
    path: "/admin/business-account",
  },
  {
    title: "Staff admins",
    icon: "fa fa-user-tie",
    path: "/admin/staff-admins",
  },
  {
    title: "Pending Profiles",
    icon: "fa fa-user-clock",
    path: "/admin/pending-profiles",
  },
  {
    title: "Pending Jobs",
    icon: "fa fa-clipboard-list",
    path: "/admin/pending-jobs",
  },

  { title: "Users", icon: "fas fa-user-friends", path: "/admin/users" },
  {
    title: "Banned accounts",
    icon: "fa fa-user-slash",
    path: "/admin/banned-account",
  },
];


const menuItemsStaff = [
  { title: "Dashboard", icon: "fa fa-tachometer-alt", path: "/admin" },
  // { title: 'Users', icon: 'fa fa-users', path: '/admin/users' },
  // { title: 'Settings', icon: 'fa fa-cogs', path: '/admin/settings' },
  {
    title: "Pending Profiles",
    icon: "fa fa-user-clock",
    path: "/admin/pending-profiles",
  },
  {
    title: "Pending Jobs",
    icon: "fa fa-clipboard-list",
    path: "/admin/pending-jobs",
  },
];



export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);

  const isAdmin = () => {
    return (
      user?.roleNames?.includes("ADMIN")
    );
  };

  const isStaffAdmin = () => {
    return (
      user?.roleNames?.includes("STAFF_ADMIN")
    )
  }
  return (
    <div
      className={`custom-sidebar ${collapsed ? "collapsed" : ""}`}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <div className="sidebar-header"></div>
      <ul className="sidebar-menu">
        {isAdmin() ? (<>{menuItems.map((item, idx) => (
          <li key={idx}>
            <NavLink to={item.path} className="menu-link">
              <i className={item.icon}></i>
              {!collapsed && <span className="menu-title">{item.title}</span>}
            </NavLink>
          </li>
        ))}
        </>) : ("")}

        {isStaffAdmin() ? (<>
          {menuItemsStaff.map((item, idx) => (
            <li key={idx}>
              <NavLink to={item.path} className="menu-link">
                <i className={item.icon}></i>
                {!collapsed && <span className="menu-title">{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </>) : ("")}

      </ul>
    </div>
  );
}
