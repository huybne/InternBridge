import "./admindashboard.css";
import {
  countTotalPendingBusinessRequests,
  countTotalPendingJobsRequests,
  countTotalPendingRequests,
  countTotalPendingStudentRequests,
  fetchUserRegistrationReport,
  fetchUserStats,
} from "../../features/admin/adminSlice";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "../../app/store";
import { useAppDispatch } from "../../app/hook";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { href, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const {
    userStats,
    loading,
    pendingRequestCount,
    pendingStudentCount,
    pendingBusinessCount,
    pendingJobCount,
    userRegistrationReport,
  } = useSelector((state: RootState) => state.admin);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchUserStats());
    dispatch(countTotalPendingRequests());
    dispatch(countTotalPendingStudentRequests());
    dispatch(countTotalPendingBusinessRequests());
    dispatch(countTotalPendingJobsRequests(0));
    dispatch(fetchUserRegistrationReport());
  }, [dispatch]);

  const [chartType, setChartType] = useState<
    "last7Days" | "thisMonth" | "thisYear"
  >("last7Days");

  const chartData = useMemo(() => {
    if (!userRegistrationReport) return [];

    switch (chartType) {
      case "last7Days":
        return userRegistrationReport.last7Days;
      case "thisMonth":
        return userRegistrationReport.thisMonth;
      case "thisYear":
        return userRegistrationReport.thisYear;
      default:
        return [];
    }
  }, [chartType, userRegistrationReport]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Banner */}
      <div className="w-full bg-gray-100 flex justify-center py-6">
        <section
          className="inner-header-title rounded-xl overflow-hidden shadow-lg w-full max-w-6xl bg-cover bg-center"
          style={{
            backgroundImage: "url(/assets/img/banner-10.jpg)",
            height: "350px",
          }}
        >
          <div className="w-full h-full flex flex-col justify-center items-center backdrop-brightness-50 text-white px-6">
            <h1 className="text-5xl font-extrabold">Admin Dashboard</h1>
            <p className="mt-4 text-lg">
              Welcome back, Admin. Here's an overview of the platform.
            </p>
          </div>
        </section>
      </div>

      {/* Nội dung chính trong khung trắng */}
      <div className="white-shadow px-12 py-8">
        {/* Stats */}
        <div className="overview-container">
          <div
            className="overview-box"
            onClick={() => navigate("/admin/users")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa fa-users overview-icon"></i>
            <div>
              <p className="overview-value">
                User total: {userStats?.total ?? "..."}
              </p>
              <p className="over-view-subvalue">
                Active: {userStats?.active ?? "..."} | Inactive:{" "}
                {userStats?.inactive ?? "..."} | Banned:{" "}
                {userStats?.banned ?? "..."}
              </p>
            </div>
          </div>
          <div
            className="overview-box"
            onClick={() => navigate("/admin/pending-jobs")}
            style={{ cursor: "pointer" }}
          >
            {" "}
            <i className="fa fa-briefcase overview-icon"></i>
            <div>
              <p className="overview-value">
                Pending Jobs: {pendingJobCount ?? "..."}
              </p>
            </div>
          </div>
          <div
            className="overview-box"
            onClick={() => navigate("/admin/pending-profiles")}
            style={{ cursor: "pointer" }}
          >
            {" "}
            <i className="fa fa-tasks overview-icon"></i>
            <div>
              <p className="overview-value">
                Pending Profiles: {pendingRequestCount ?? "..."}
              </p>
              <p className="over-view-subvalue">
                Students: {pendingStudentCount ?? "..."} | Businesses:{" "}
                {pendingBusinessCount ?? "..."}
              </p>
            </div>
          </div>
        </div>

        {/* === Quick Actions & User Registrations === */}
        <div className="dashboard-row">
          {/* Quick Actions */}
          {/* <div className="dashboard-card">
            <h3 className="card-title">Quick Actions</h3>
            <button className="quick-btn">View Students</button>
            <button className="quick-btn">View Businesses</button>
            <button className="quick-btn">View Staff Admin</button>
          </div> */}

          {/* Chart Placeholder */}
          <div className="dashboard-card chart-full">
            <h3 className="card-title">User Registrations</h3>
            <div className="chart-tabs">
              <button onClick={() => setChartType("last7Days")}>7 Days</button>
              <button onClick={() => setChartType("thisMonth")}>
                This Month
              </button>
              <button onClick={() => setChartType("thisYear")}>
                This Year
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "thisYear" ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
        {/* === Recent Registrations & Staff Admin Overview === */}
        <div className="dashboard-row">
          {/* Recent Registrations */}
          <div className="dashboard-card">
            
          </div>

          
        </div>
      </div>
    </div>
  );
}
