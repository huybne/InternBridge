import React, { useEffect, useState } from "react";
import "./listprofile.css";
import {
  fetchStudentRequestsByStatus,
  fetchBusinessRequestsByStatus,
  fetchStudentRequestById,
  fetchBusinessRequestById,
  updateStudentRequestStatus,
  updateBusinessRequestStatus,
} from "../../../features/admin/requestSlice";
import { useAppDispatch } from "../../../app/hook";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import Modal from "../../Modal";

export default function ListRequests() {
  const [tab, setTab] = useState<"student" | "business">("student");
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [pendingRejectRequestId, setPendingRejectRequestId] = useState<
    string | null
  >(null);
  const [keyword, setKeyword] = useState("");

  const { selectedStudentRequest, selectedBusinessRequest } = useSelector(
    (state: RootState) => state.request
  );

  const pageSize = 10;

  const dispatch = useAppDispatch();
  const { studentRequests, businessRequests, loading } = useSelector(
    (state: RootState) => state.request
  );
  const handleRowClick = (id: string) => {
    console.log("Opening modal for ID:", id);
    setIsModalOpen(true);
    setSelectedRequestId(id);
    if (tab === "student") {
      dispatch(fetchStudentRequestById(id));
    } else {
      dispatch(fetchBusinessRequestById(id));
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequestId(null);
  };
  const totalItems =
    tab === "student"
      ? studentRequests?.totalItems ?? 0
      : businessRequests?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  useEffect(() => {
  if (tab === "student") {
    dispatch(
      fetchStudentRequestsByStatus({
        status,
        page,
        limit: pageSize,
        keyword, // ✅ Thêm vào đây
      })
    );
  } else {
    dispatch(
      fetchBusinessRequestsByStatus({
        status,
        page,
        limit: pageSize,
        keyword, // ✅ Thêm vào đây
      })
    );
  }
}, [tab, status, page, pageSize, keyword, dispatch]);

  const handleUpdateStatus = async (
    requestId: string,
    newStatus: "approve" | "reject",
    reason?: string
  ) => {
    try {
      const payload = {
        id: requestId,
        status: newStatus,
        reason: reason || "",
      };

      if (tab === "student") {
        await dispatch(updateStudentRequestStatus(payload)).unwrap();
        dispatch(
          fetchStudentRequestsByStatus({ status, page, limit: pageSize })
        );
      } else {
        await dispatch(updateBusinessRequestStatus(payload)).unwrap();
        dispatch(
          fetchBusinessRequestsByStatus({ status, page, limit: pageSize })
        );
      }

      setIsReasonModalOpen(false); // đóng modal nếu là reject
    } catch (error) {
      console.error("Update status failed:", error);
      alert("Failed to update status: " + error);
    }
  };

  useEffect(() => {
    if (tab === "student") {
      dispatch(
        fetchStudentRequestsByStatus({
          status,
          page,
          limit: pageSize,
        })
      );
    } else {
      dispatch(
        fetchBusinessRequestsByStatus({
          status,
          page,
          limit: pageSize,
        })
      );
    }
  }, [tab, status, page, pageSize, dispatch]);

  // Hàm hiển thị chi tiết request
  const renderRequestDetails = () => {
    const request =
      tab === "student" ? selectedStudentRequest : selectedBusinessRequest;
    if (!request || loading) return <p className="text-center">Loading...</p>;

    const requestData = request.request || {};
    const profileData = request.studentProfiles || {};

    const {
      fullName,
      major,
      dateOfBirth,
      address,
      university,
      avatarUrl,
      academicYearStart,
      academicYearEnd,
      phoneNumber,
      status: profileStatus,
      approved,
    } = profileData;

    const { sendTime, status: requestStatus, reason } = requestData;
    const formattedStart = academicYearStart
      ? new Date(academicYearStart).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "N/A";
    const formattedEnd = academicYearEnd
      ? new Date(academicYearEnd).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "N/A";
    const academicYearRange = `${formattedStart} - ${formattedEnd}`;

    return (
      <div className="modal-details">
        {avatarUrl && (
          <div className="avatar-container">
            <img src={avatarUrl} alt="Avatar" className="avatar-image" />
          </div>
        )}
        {requestStatus === "pending" && (
          <div className="modal-action-buttons">
            <button
              className="modal-btn-approve"
              onClick={() => {
                if (selectedRequestId) {
                  handleUpdateStatus(selectedRequestId, "approve");
                }
              }}
            >
              Approve
            </button>
            <button
              className="modal-btn-reject"
              onClick={() => {
                if (selectedRequestId) {
                  setPendingRejectRequestId(selectedRequestId);
                  setRejectReason("");
                  setIsReasonModalOpen(true);
                }
              }}
            >
              Reject
            </button>
          </div>
        )}
        <div className="details-list">
          <div className="details-section">
            <h3 className="section-title">Personal Information</h3>

            <div className="list-item">
              <strong>Full Name:</strong> {fullName || "N/A"}
            </div>
            <div className="list-item">
              <strong>Date of Birth:</strong>{" "}
              {dateOfBirth
                ? new Date(dateOfBirth).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </div>
            <div className="list-item">
              <strong>Address:</strong> {address || "N/A"}
            </div>
            <div className="list-item">
              <strong>Phone Number:</strong> {phoneNumber || "N/A"}
            </div>
          </div>
          <div className="details-section">
            <h3 className="section-title">Academic Information</h3>
            <div className="list-item">
              <strong>Major:</strong> {major || "N/A"}
            </div>
            <div className="list-item">
              <strong>University:</strong> {university || "N/A"}
            </div>
            <div className="list-item">
              <strong>Academic Year:</strong> {academicYearRange}
            </div>
          </div>
          <div className="details-section">
            <h3 className="section-title">Request Information</h3>
            <div className="list-item">
              <strong>Status:</strong> {requestStatus || profileStatus || "N/A"}
            </div>
            <div className="list-item">
              <strong>Approved:</strong>{" "}
              {typeof approved === "boolean"
                ? approved
                  ? "Yes"
                  : "No"
                : "N/A"}
            </div>
            <div className="list-item">
              <strong>Send Time:</strong>{" "}
              {sendTime
                ? new Date(sendTime).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "N/A"}
            </div>
            <div className="list-item">
              <strong>Reason:</strong> {reason || "N/A"}
            </div>
          </div>
        </div>
      </div>
    );
  };
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
            <h1 className="text-5xl font-extrabold">Manage Requests</h1>
          </div>
        </section>
      </div>

      {/* Main content */}
      <div className="white-shadow px-12 py-8">
        {/* Search + Filter */}
        <div
          className="search-container"
          style={{ margin: "20px auto", textAlign: "center" }}
        >
          <div
            className="search-box"
            style={{
              display: "flex",
              width: "600px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              backgroundColor: "#f7f7f7",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Search..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(0); // Gõ enter thì reset page và trigger search
                }
              }}
              style={{
                border: "none",
                outline: "none",
                width: "50%",
                padding: "5px 10px",
                fontSize: "16px",
              }}
            />

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0); // Reset về trang đầu tiên khi đổi status
              }}
              style={{
                border: "none",
                outline: "none",
                width: "35%",
                padding: "5px 10px",
                fontSize: "16px",
                backgroundColor: "#bbbcbf",
              }}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approve">Approved</option>
              <option value="reject">Rejected</option>
            </select>
            <button
              style={{
                padding: "5px 10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => setPage(0)}
            >
              Search
            </button>
          </div>
        </div>

        {/* Toggle Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setTab("student");
              setPage(0);
            }}
            className={`toggle-button ${
              tab === "student" ? "toggle-active" : "toggle-inactive"
            }`}
          >
            Student Requests
          </button>
          <button
            onClick={() => {
              setTab("business");
              setPage(0);
            }}
            className={`toggle-button ${
              tab === "business" ? "toggle-active" : "toggle-inactive"
            }`}
          >
            Business Requests
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative">
          {loading && (
            <div className="spinner-overlay">
              <div className="spinner" />
            </div>
          )}
          <table className="min-w-full border border-gray-200 text-left stylish-table">
            <thead className="table-header">
              <tr>
                <th className="border px-4 py-3">Avatar</th>
                <th className="border px-4 py-3">
                  {tab === "student" ? "Student Name" : "Company Name"}
                </th>
                <th className="border px-4 py-3">
                  {tab === "student" ? "University" : "Industry"}
                </th>
                <th className="border px-4 py-3">Send Time</th>
                <th className="border px-4 py-3">Status</th>
                <th className="border px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(tab === "student"
                ? studentRequests?.items
                : businessRequests?.items
              )?.map((item, index) => {
                const avatar = tab === "student" ? item.avatar : item.logoUrl;
                const name =
                  tab === "student" ? item.studentName : item.companyName;
                const subInfo = tab === "student" ? item.uni : item.industry;
                const sendTime =
                  tab === "student"
                    ? item.requestStudents.sendTime
                    : item.request.sendTime;
                const status =
                  tab === "student"
                    ? item.requestStudents.status
                    : item.request.status;

                return (
                  <tr
                    key={index}
                    onClick={() =>
                      tab === "student"
                        ? handleRowClick(item.requestStudents.requestId)
                        : handleRowClick(item.request.requestId)
                    }
                    className="hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-center align-middle">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          borderRadius: "50%",
                          backgroundColor: "#f3f4f6",
                        }}
                      >
                        {avatar ? (
                          <img
                            src={avatar}
                            alt="avatar"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <i className="fas fa-user text-gray-400 text-md" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">{name}</td>
                    <td className="px-4 py-3 text-gray-700 text-sm">
                      {subInfo}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">
                      {new Date(sendTime).toLocaleTimeString()}{" "}
                      {new Date(sendTime).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm capitalize">
                      {status}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          className="action-button approve-button"
                          title="Approve"
                          onClick={(e) => {
                            e.stopPropagation();
                            const requestId =
                              tab === "student"
                                ? item.requestStudents.requestId
                                : item.request.requestId;
                            handleUpdateStatus(requestId, "approve"); // Gọi trực tiếp
                          }}
                        >
                          <i className="fas fa-check" />
                        </button>

                        <button
                          className="action-button reject-button"
                          title="Reject"
                          onClick={(e) => {
                            e.stopPropagation();
                            const requestId =
                              tab === "student"
                                ? item.requestStudents.requestId
                                : item.request.requestId;
                            setPendingRejectRequestId(requestId);
                            setRejectReason("");
                            setIsReasonModalOpen(true); // Mở modal lý do
                          }}
                        >
                          <i className="fas fa-times" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Padding rows to fix layout */}
              {Array.from({
                length:
                  pageSize -
                  (tab === "student"
                    ? studentRequests?.items.length || 0
                    : businessRequests?.items.length || 0),
              }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td colSpan={6} className="h-[70px]"></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination-container mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="pagination-button"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              if (i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1) {
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`pagination-number ${
                      i === page ? "pagination-active" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              } else if (
                (i === page - 2 && i > 1) ||
                (i === page + 2 && i < totalPages - 2)
              ) {
                return (
                  <span key={i} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={page >= totalPages - 1}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Request Details"
        width="1000px"
      >
        {loading ? (
          <div className="text-center">
            {loading ? (
              <div className="spinner-overlay">
                <div className="spinner" />
              </div>
            ) : (
              renderRequestDetails()
            )}
          </div>
        ) : (
          renderRequestDetails()
        )}
      </Modal>
      <Modal
        isOpen={isReasonModalOpen}
        onClose={() => {
          setIsReasonModalOpen(false);
          setRejectReason("");
          setPendingRejectRequestId(null);
        }}
        title="Reject Request"
        width="600px"
      >
        <div className="reject-modal-container">
          <label className="block font-medium text-sm">
            Please enter a reason for rejection:
          </label>
          <textarea
            className="reject-modal-textarea"
            rows={5}
            placeholder="E.g. Missing documents, invalid identity..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="reject-modal-buttons">
            <button
              className="reject-btn-confirm"
              onClick={() => {
                if (!rejectReason.trim()) {
                  alert("Please provide a reason before rejecting.");
                  return;
                }
                if (pendingRejectRequestId) {
                  handleUpdateStatus(
                    pendingRejectRequestId,
                    "reject",
                    rejectReason
                  );
                }
              }}
            >
              Confirm Reject
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
