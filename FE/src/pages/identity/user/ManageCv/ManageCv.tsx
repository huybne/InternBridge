import React, { use, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  fetchCvByUserId,
  ManageCv as ManageCvservice,
} from "../../../../services/user/ManageCv/ManageCv";
import { CvDTO } from "../../../../services/user/ManageCv/ManageCv";
import { CvDTOForCreate } from "../../../../services/user/ManageCv/ManageCv";
import { CvDTOForUpdate } from "../../../../services/user/ManageCv/ManageCv";
import { StudentProfileService } from "../../../../services/user/StudentProfile/StudentProfileService";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../app/hook";
import { RootState } from "../../../../app/store";
import { useSelector } from "react-redux";

export default function ManageCv() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  //   const [cvs, setCvs] = useState<CvDTO[] | null>([]);
  const [search, setSearch] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [cvDetail, setCvDetail] = useState<string>("");

  const [cv, setCv] = useState<File | null>(null);

  const cvs = useSelector((state: RootState) => state.cv.cvs);
  const loading = useSelector((state: RootState) => state.cv.loading);
  const dispatch = useAppDispatch();
  const fetchCvs = () => {
    dispatch(fetchCvByUserId(search));
  };

  //   const fetchCvs = async () => {
  //     try {
  //       const service = new ManageCvservice();
  //       const data = await service.getCvByUserId(search);
  //       console.log(data);
  //       setCvs(data);
  //     } catch (error) {
  //       console.error("❌ Lỗi khi lấy danh sách CV:", error);
  //     }
  //   };

  const handleNotifycation = () => {
    Swal.fire({
      text: "Since your application has not been approved, you have to wait.",
      icon: "warning",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!!!",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/studentprofile");
      }
    });
  };
  useEffect(() => {
    const GetProfile = async () => {
      try {
        const service = new StudentProfileService();
        const data = await service.getRequestStudent();
        console.log(data);
        if (data.getStatus() == null || !data.getStatus().includes("approve")) {
          handleNotifycation();
          return;
        }
        fetchCvs();
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách CV:", error);
      }
    };

    // const fetchCvs = async () => {
    //   try {
    //     const service = new ManageCvservice();
    //     const data = await service.getCvByUserId(search);
    //     console.log(data);
    //     setCvs(data);
    //   } catch (error) {
    //     console.error("❌ Lỗi khi lấy danh sách CV:", error);
    //   }
    // };
    
    GetProfile();
    fetchCvs();
    //fetchCvs();
  }, []);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  function getFileNameFromUrl(url: string): string {
    if (!url) return "";
    const parts = url.split("/");
    return parts[parts.length - 1]; // lấy phần cuối cùng sau dấu "/"
  }

  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setCv(file);
    }
  };

  const handleEdit = async (
    cvid: string,
    currentTitle: string,
    url: string
  ) => {
    const { value: newTitle } = await Swal.fire({
      title: "Update CV title",
      input: "text",
      inputValue: currentTitle,
      inputPlaceholder: "Enter new title",
      showCancelButton: true,
      confirmButtonText: "update",
      cancelButtonText: "cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Title cannot be empty!";
        }
      },
    });

    if (newTitle && newTitle !== currentTitle) {
      const service = new ManageCvservice();
      try {
        const dto = new CvDTOForUpdate(cvid, newTitle, url); // Nếu bạn không cần sửa `cvDetail`, để rỗng
        await service.updateCv(dto);
        Swal.fire("✅ Success", "CV title has been updated!", "success");
        // gọi lại API để load danh sách mới nếu cần
        fetchCvs();
      } catch (err) {
        Swal.fire("❌ Failure", "Error updating CV", "error");
      }
    }
  };

  const handleDelete = async (cvid: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This CV will be deleted and cannot be restored!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const service = new ManageCvservice();
      try {
        await service.deleteCv(cvid);
        Swal.fire("Deleted!", "CV was deleted successfully.", "success");
        // Gọi lại danh sách nếu cần:
        fetchCvs();
      } catch (error) {
        Swal.fire("Failure", "Delete CV failed", "error");
      }
    }
  };

  const handleConfirm = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save this CV?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745", // xanh lá cây đậm
      cancelButtonColor: "#d33", // đỏ
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const manage = new ManageCvservice();
        if (cv !== null) {
          const urlcv = await manage.uploadCvFile(cv);
          console.log(urlcv);
          const cvdto = new CvDTOForCreate(title, urlcv);
          const check = await manage.createCv(cvdto);

          if (check) {
            // Nếu bấm Yes
            Swal.fire("Saved!", "Your CV has been saved.", "success");
            window.location.reload();
          } else {
            // Nếu bấm Yes
            Swal.fire("Saved!", "Your CV has been saved error.", "error");
          }
        }
      }
    });
  };

  return (
    <>
      <div className="clearfix"></div>

      <section
        className="inner-header-title"
        style={{ backgroundImage: "url(assets/img/banner-10.jpg)" }}
      >
        <div className="container">
          <h1>Manage Cv</h1>
        </div>
      </section>
      <div className="clearfix"></div>

      <section className="manage-company gray">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="search-filter">
                <div className="col-md-4 col-sm-5">
                  <div className="filter-form">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                        placeholder="Search…"
                      />
                      <span className="input-group-btn">
                        <button
                          type="button"
                          onClick={fetchCvs}
                          className="btn btn-default"
                        >
                          Search
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div style={{ marginBottom: "30px", textAlign: "center" }}>
                <button
                  style={{
                    backgroundColor: "#28a745", // xanh lá cây đậm đẹp
                    color: "white", // chữ màu trắng
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#218838")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#28a745")
                  }
                  onClick={handleOpenPopup}
                >
                  Add New CV +
                </button>

                {/* Popup */}
                {showPopup && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1000,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "10px",
                        width: "400px",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <h3>Create New CV</h3>
                      <form>
                        <div style={{ marginBottom: "10px" }}>
                          <input
                            type="text"
                            onChange={(e) => {
                              setTitle(e.target.value);
                            }}
                            placeholder="CV Title"
                            style={{
                              padding: "8px",
                              width: "90%",
                              borderRadius: "6px",
                              border: "1px solid #ccc",
                            }}
                          />
                        </div>

                        {/* Input Upload File */}
                        <div
                          style={{
                            marginBottom: "10px",
                            position: "relative",
                            display: "inline-block",
                            textAlign: "center",
                          }}
                        >
                          <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileChange}
                            style={{
                              padding: "8px",
                              width: "90%",
                              borderRadius: "6px",
                              border: "1px solid #ccc",
                              backgroundColor: "#fff",
                              cursor: "pointer",
                              marginLeft: "16px",
                            }}
                          />
                        </div>

                        {/* Hiển thị tên file */}
                        {selectedFileName && (
                          <div
                            style={{
                              marginTop: "10px",
                              fontSize: "14px",
                              color: "#555",
                            }}
                          >
                            Selected File: <strong>{selectedFileName}</strong>
                          </div>
                        )}
                        <div style={{ marginTop: "15px" }}>
                          <button
                            type="button"
                            style={{
                              backgroundColor: "#28a745",
                              color: "white",
                              border: "none",
                              padding: "10px 20px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "bold",
                              marginRight: "10px",
                            }}
                            onClick={handleConfirm}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleClosePopup}
                            style={{
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              padding: "10px 20px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>

                      {/* Nút X ở góc */}
                      <button
                        onClick={handleClosePopup}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: "transparent",
                          border: "none",
                          fontSize: "18px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {cvs?.length === 0 || cvs === null ? (
                <p style={{ color: "gray" }}>No CVs match.</p>
              ) : (
                <ul>
                  {cvs?.map((cv) => (
                    <article key={cv.cvId}>
                      <div className="mng-company">
                        <div className="col-md-2 col-sm-2">
                          <div className="mng-company-pic">
                            <img
                              src="https://png.pngtree.com/png-vector/20190721/ourmid/pngtree-cv-icon-for-your-project-png-image_1555553.jpg"
                              className="img-responsive"
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="col-md-3 col-sm-3">
                          <div className="mng-company-name">
                            <h4>
                              {" "}
                              <span className="cmp-tagline">
                                {cv.title + ""}
                              </span>
                            </h4>
                            <span className="cmp-time">
                              {new Date(cv.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-5 col-sm-5">
                          <div className="mng-company-name">
                            <span className="cmp-tagline">
                              {getFileNameFromUrl(cv.cvDetail)}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-2">
                          <div className="mng-company-action">
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleEdit(cv.cvId, cv.title, cv.cvDetail);
                              }}
                              data-toggle="tooltip"
                              title="Edit"
                            >
                              <i className="fa fa-edit"></i>
                            </a>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(cv.cvId);
                              }}
                              data-toggle="tooltip"
                              title="Delete"
                            >
                              <i className="fa fa-trash-o"></i>
                            </a>
                            <a
                              href={cv.cvDetail}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-toggle="tooltip"
                              title="Delete"
                            >
                              <i className="fa fa-eye"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* <div className="row">
						<ul className="pagination">
							<li><a href="#">&laquo;</a></li>
							<li className="active"><a href="#">1</a></li>
							<li><a href="#">2</a></li>
							<li><a href="#">3</a></li> 
							<li><a href="#">4</a></li> 
							<li><a href="#"><i className="fa fa-ellipsis-h"></i></a></li> 
							<li><a href="#">&raquo;</a></li> 
						</ul>
					</div> */}
        </div>
      </section>
    </>
  );
}
