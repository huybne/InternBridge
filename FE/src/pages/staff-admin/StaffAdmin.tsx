import "./staffadmin.css";
import {
  searchUserByEmail,
  fetchAllStaffAdmin,
  assignStaffAdminRole,
  removeUserRole,
} from "../../features/admin/adminSlice";
import { useEffect, useMemo, useState, useRef } from "react";
import { RootState } from "../../app/store";
import { useAppDispatch } from "../../app/hook";
import { useSelector } from "react-redux";
import { debounce } from "lodash";

export default function StaffAdmin() {
  const dispatch = useAppDispatch();
  const [searchEmail, setSearchEmail] = useState("");
  interface User {
    userId: string;
    username: string;
    email: string;
    roleNames?: string[];
  }

  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [loadingTable, setLoadingTable] = useState(false);
  const pageSize = 10;
  const searchRef = useRef<HTMLInputElement>(null);

  const scrollPositionRef = useRef(0);
  const tableRef = useRef(null);

  // Lấy dữ liệu từ Redux
  const { staffAdmins, total } = useSelector((state: RootState) => state.admin);
  const totalPages = Math.ceil(total / pageSize);

  const saveScrollPosition = () => {
    scrollPositionRef.current = window.scrollY;
  };

  const restoreScrollPosition = () => {
    window.scrollTo(0, scrollPositionRef.current);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingTable(true);
      await dispatch(fetchAllStaffAdmin({ page, size: pageSize }));
      setLoadingTable(false);
      restoreScrollPosition();
    };
    saveScrollPosition();
    fetchData();
  }, [dispatch, page, pageSize]);

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((email: string) => {
        if (email.trim()) {
          saveScrollPosition();
          dispatch(searchUserByEmail(email.trim())).then((res: any) => {
            if (res.payload) {
              setSearchResults(res.payload);
              restoreScrollPosition();
            }
          });
        } else {
          setSearchResults([]);
          restoreScrollPosition();
        }
      }, 300),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(searchEmail);
  }, [searchEmail]);

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
            <h1 className="text-5xl font-extrabold">View Staff Admins</h1>
          </div>
        </section>
      </div>

      {/* Table of staff admins */}
      <div className="white-shadow px-12 py-8">
        <h2 className="text-2xl font-bold mb-4">List of Staff Admins</h2>
        <div className="relative mb-4" ref={searchRef}>
          {" "}
          <input
            type="text"
            placeholder="🔍 Enter email to search..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="search-input-email w-full"
          />
          {searchResults.length > 0 && (
            <ul className="search-dropdown no-bullet">
              {searchResults.map((user, idx) => (
                <li
                  key={idx}
                  className="search-dropdown-item"
                  onClick={() => {
                    setSearchEmail(user.email);
                    setSearchResults([]);
                  }}
                >
                  <div className="search-row with-action">
                    <span className="col-name">{user.username}</span>
                    <span className="col-email">{user.email}</span>
                    <span className="col-roles">
                      {user.roleNames?.join(", ")}
                    </span>
                    <button
                      className="assign-btn"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        dispatch(assignStaffAdminRole(user.userId)).then(() => {
                          setSearchResults([]);
                        });
                      }}
                    >
                      Assign
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="overflow-x-auto" ref={tableRef}>
          <div className="relative table-wrapper">
            {/* Spinner chỉ khi fetch bảng */}
            {loadingTable && (
              <div className="spinner-overlay">
                <div className="spinner inline-block" />
              </div>
            )}
            <table className="min-w-full border border-gray-300 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2"></th>
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Provider</th>
                  <th className="border px-4 py-2">Created At</th>
                  <th className="border px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffAdmins?.length ? (
                  staffAdmins.map((admin, index) => (
                    <tr key={admin.userId}>
                      <td className="border px-4 py-2">
                        {page * pageSize + index + 1}
                      </td>
                      <td className="border px-4 py-2">{admin.username}</td>
                      <td className="border px-4 py-2">{admin.email}</td>
                      <td className="border px-4 py-2 capitalize">
                        {admin.status}
                      </td>
                      <td className="border px-4 py-2">{admin.provider}</td>
                      <td className="border px-4 py-2">
                        {admin.createdAt
                          ? new Date(admin.createdAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          className="remove-btn"
                          onClick={() => {
                            dispatch(
                              removeUserRole({
                                userId: admin.userId,
                                roleName: "STAFF_ADMIN",
                              })
                            )
                              .unwrap()
                              .then(() => {
                                dispatch(
                                  fetchAllStaffAdmin({ page, size: pageSize })
                                );
                              });
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      No staff admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* pagination here */}
          <div className="pagination-container">
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
                    className={`pagination-button ${
                      i === page ? "active" : ""
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
                  <span key={i} className="pagination-ellipsis">
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

            <div className="flex items-center gap-2 mt-4 justify-center">
              <span className="pagination-info">
                You are on page {page + 1} of {totalPages}
              </span>
              <input
                type="number"
                min={1}
                max={totalPages}
                placeholder="Go to page..."
                className="pagination-input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = parseInt(
                      (e.target as HTMLInputElement).value,
                      10
                    );
                    if (!isNaN(value) && value >= 1 && value <= totalPages) {
                      setPage(value - 1);
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
