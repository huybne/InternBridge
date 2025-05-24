import React, { useEffect, useState } from 'react';
import { getListPublicJob } from '../../../service/business/jobpostings/JobPostingsService';
import JobApplicationForm from '../apply-jobs/JobApplicationForm';
import { getAllCategoriesPublic } from '../../../service/business/categories/CategoryService';
import './ListJobPublic.css';
import Select from 'react-select';
import Loading from '../../../common/Loading';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const styles = {
  selectMultiple: {
    height: '150px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    backgroundColor: '#fff',
    fontSize: '14px',
    color: '#495057',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.075)',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  },
};

// @RequestParam(defaultValue = "") String searchkeyword,
//             @RequestParam(defaultValue = "") String location,
//             @RequestParam(defaultValue = "") String company_name,
//             @RequestParam(defaultValue = "-1") int isurgen,
//             @RequestParam(required = false) int [] categoryid,
//             @RequestParam(required = false) boolean sortByexpirationDate

export default function ListJobPublic() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [jobs, setJobs] = React.useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [listcategory, setlistcategory] = useState([]);
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  //sang
  const [searchKeyword, setSearchKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isUrgent, setIsUrgent] = useState(-1);
  const [sortByExpirationDate, setSortByExpirationDate] = useState(false);

  const getDynamicHeight = () => {
    const baseHeight = 40; // Chiều cao cơ bản (khi không có lựa chọn)
    const itemHeight = 30; // Chiều cao mỗi thẻ đã chọn
    const maxHeight = 150; // Giới hạn tối đa
    const minHeight = 40; // Giới hạn tối thiểu
    const calculatedHeight =
      baseHeight + selectedCategories.length * itemHeight;

    return Math.min(Math.max(calculatedHeight, minHeight), maxHeight) + 'px';
  };

  const handleChange = (e) => {
    // e.target.selectedOptions là HTMLCollection, chuyển thành mảng value
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedCategories(values);
    console.log(selectedCategories);
  };

  useEffect(() => {
    const offset = (page - 1) * limit;
    fetchCategories();
    fetchPublicJob(offset);
  }, [page]);

  const options = listcategory.map((category) => ({
    value: category.categoryId,
    label: category.name,
  }));

  const fetchCategories = async () => {
    const response = await getAllCategoriesPublic();
    setlistcategory(response.data);
  };

  const fetchPublicJob = async (offset: number) => {
    try {
      setLoading(true);
      const response = await getListPublicJob(
        offset,
        limit,
        searchKeyword,
        location,
        companyName,
        isUrgent,
        sortByExpirationDate,
        selectedCategories,
      );
      console.log('Response:', response.data);
      setJobs(response.data.data);
      setTotalPage(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error(
        (error as any).response?.data?.message || 'Something went wrong',
      );
    }
  };

  const buttonSearch = async () => {
    console.log(selectedCategories);
    try {
      const response = await getListPublicJob(
        0,
        limit,
        searchKeyword,
        location,
        companyName,
        isUrgent,
        sortByExpirationDate,
        selectedCategories,
      );
      console.log('Response:', response.data);
      setJobs(response.data.data);
      setTotalPage(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error(
        (error as any).response?.data?.message || 'Something went wrong',
      );
    }
  };

  const isExpired = (expirationDate: any) => {
    const now = new Date();
    const expiration = new Date(expirationDate);
    return expiration < now;
  };

  // console.log("Jobs:", jobs);
  // console.log("Total Page:", totalPage);

  const handleCheckboxChange = () => {
    setSortByExpirationDate(!sortByExpirationDate);
  };

  const clearFilter = () => {
    // console.log(selectedCategories);
    setSearchKeyword('');
    setLocation('');
    setCompanyName('');
    setIsUrgent(-1);
    setSelectedCategories([]);
    setSortByExpirationDate(false);
    setPage(1);
    fetchPublicJob(0);
    window.location.reload();
  };

  const handleClickFavorite = () => {
    if (!user) {
      navigate('/login');
    } else {
      alert('Saved!');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div>
        <div className="clearfix" />
        {/* Title Header Start */}
        <section
          className="inner-header-title"
          style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}
        >
          <div className="container">
            <h1>All Jobs</h1>
          </div>
        </section>
        <div className="clearfix" />

        <section className="brows-job-category">
          <div className="container">
            {/* Company Searrch Filter Start */}
            <div className="row extra-mrg">
              <div className="wrap-search-filter">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    buttonSearch();
                  }}
                >
                  <div className="col-md-4 col-sm-4">
                    <label>Keyword:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Keyword: Name, Tag"
                      value={searchKeyword}
                      onChange={(e) => {
                        setSearchKeyword(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <label>Location:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Location: City, State, Zip"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <label>Company Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Company Name: City, State, Zip"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <label style={{ marginRight: '5px' }}>
                      UrgentRecruitment{' '}
                    </label>
                    <select
                      className="form-control"
                      value={isUrgent}
                      onChange={(e) => {
                        const num = parseInt(e.target.value);
                        setIsUrgent(num);
                      }}
                    >
                      <option value={-1}>All</option>
                      <option value={1}>UrgentRecruitment</option>
                      <option value={0}>Not UrgentRecruitment</option>
                    </select>
                  </div>

                  <div className="col-md-4 col-sm-4">
                    <label style={{ marginRight: '5px' }}>Category </label>
                    <Select
                      isMulti
                      options={options}
                      value={selectedCategories}
                      onChange={setSelectedCategories}
                      placeholder="Choose category..."
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          height: getDynamicHeight(), // Chiều cao động
                          minHeight: '50px', // Đảm bảo chiều cao tối thiểu
                          borderRadius: '0px',
                          border: '1px solid #ced4da',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.075)',
                          transition:
                            'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                          overflowY: 'auto', // Cho phép cuộn dọc khi vượt quá chiều cao
                          display: 'flex', // Đảm bảo layout đúng
                          flexWrap: 'wrap', // Cho phép thẻ xuống dòng
                          alignContent: 'flex-start', // Đẩy nội dung lên trên
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor: '#007bff',
                          color: '#fff',
                          borderRadius: '4px',
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: '#fff',
                        }),
                        multiValueRemove: (provided) => ({
                          ...provided,
                          color: '#fff',
                          ':hover': {
                            backgroundColor: '#0056b3',
                            color: '#fff',
                          },
                        }),
                        menu: (provided) => ({
                          ...provided,
                          maxHeight: '400px', // Giới hạn chiều cao dropdown
                          // overflowY: 'auto',
                        }),
                      }}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4">
                    <label style={{ marginRight: '5px' }}>
                      Sort By expiration
                    </label>
                    <input
                      checked={sortByExpirationDate}
                      onChange={handleCheckboxChange}
                      style={{ marginTop: '10px' }}
                      type="checkbox"
                      id="sort-expiration"
                      className="custom-checkbox"
                    />
                    <label htmlFor="sort-expiration"></label>
                  </div>
                  <div className="col-md-12 col-sm-12">
                    <div
                      className="col-md-2 col-sm-2"
                      style={{ justifyContent: 'left', padding: '0px' }}
                    >
                      <button
                        onClick={buttonSearch}
                        type="submit" // Đổi từ type="button" thành type="submit"
                        className="btn btn-primary"
                      >
                        Filter
                      </button>
                    </div>
                    <div className="col-md-3 col-sm-3">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ backgroundColor: 'red' }}
                        onClick={clearFilter}
                      >
                        Clear filter
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {/* Company Searrch Filter End */}

            <div className="item-click">
              <article>
                {jobs && jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div
                      className="brows-job-list row"
                      key={job.jobId}
                      style={{
                        padding: '15px 0',
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      {/* Ảnh công ty */}
                      <div className="col-md-1 col-sm-2 small-padding">
                        <div className="brows-job-company-img">
                          <a href={`/detail-job/${job.jobId}`}>
                            <img
                              src={
                                job.avatarUrl ||
                                '/assets/img/default-company.jpg'
                              }
                              className="img-responsive"
                              alt={job.companyName}
                            />
                          </a>
                        </div>
                      </div>

                      {/* Thông tin job */}
                      <div className="col-md-6 col-sm-5">
                        <div className="brows-job-position">
                          <a href={`/detail-job/${job.jobId}`}>
                            <h3 className="job-title">{job.title}</h3>
                          </a>

                          <p>
                            <span style={{ fontWeight: 'bold' }}>
                              {job.companyName}
                            </span>
                            <span
                              className="brows-job-sallery"
                              style={{ marginLeft: '15px' }}
                            >
                              <i className="fa fa-money" /> {job.salary}
                            </span>
                            {job.urgentRecruitment && (
                              <span
                                className="job-type cl-danger bg-trans-danger"
                                style={{ marginLeft: '15px' }}
                              >
                                Urgent
                              </span>
                            )}
                            <span
                              style={{
                                marginLeft: '25px',
                                color: '#666',
                                fontStyle: 'italic',
                              }}
                            >
                              Expiration:{' '}
                              {new Date(job.expirationDate).toLocaleDateString(
                                'vi-VN',
                              )}
                            </span>
                          </p>

                          {/* Hiển thị các category */}
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px',
                              marginTop: '8px',
                            }}
                          >
                            {job.categoryNames?.map((cat, idx) => (
                              <span
                                key={idx}
                                style={{
                                  backgroundColor: '#e9ecef',
                                  color: '#333',
                                  fontSize: '12px',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                }}
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Địa điểm */}
                      <div className="col-md-3 col-sm-3">
                        <div className="brows-job-location">
                          <p>
                            <i className="fa fa-map-marker" /> {job.location}
                          </p>
                        </div>
                      </div>

                      {/* Nút Apply và Save */}

                      <div className="col-md-2 col-sm-2">
                        <div
                          className="brows-job-link"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          {isExpired(job.expirationDate) ? (
                            <span
                              style={{
                                padding: '10px 15px',
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                flex: 1,
                              }}
                            >
                              Expired
                            </span>
                          ) : (
                            <>
                              <button
                                className="btn"
                                style={{
                                  backgroundColor: '#f8f9fa',
                                  color: '#000',
                                  border: '1px solid #ccc',
                                  padding: '10px 15px',
                                  borderRadius: '4px',
                                  transition:
                                    'background-color 0.3s ease, color 0.3s ease',
                                  cursor: 'pointer',
                                  flex: 1,
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    '#07b107';
                                  e.currentTarget.style.color = '#fff';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    '#f8f9fa';
                                  e.currentTarget.style.color = '#000';
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedJobId(job.jobId);
                                  setShowModal(true);
                                }}
                              >
                                Apply Now
                              </button>

                              <button
                                className="btn"
                                style={{
                                  backgroundColor: '#fff',
                                  color: '#dc3545',
                                  border: '2px solid #dc3545',
                                  padding: '10px',
                                  borderRadius: '50%',
                                  width: '42px',
                                  height: '42px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'border-color 0.3s ease',
                                  cursor: 'pointer',
                                }}
                                title="Save Job"
                                onClick={handleClickFavorite}
                              >
                                <i className="fa fa-heart" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className="no-data-message"
                    style={{
                      padding: '30px 20px',
                      textAlign: 'center',
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa',
                      margin: '20px 0',
                      border: '1px dashed #ccc',
                    }}
                  >
                    <i
                      className="fa fa-search"
                      style={{
                        fontSize: '48px',
                        color: '#6c757d',
                        marginBottom: '15px',
                        display: 'block',
                      }}
                    ></i>
                    <h4 style={{ color: '#343a40', marginBottom: '10px' }}>
                      No data found
                    </h4>
                    <p style={{ color: '#6c757d' }}>
                      There are no jobs matching your search criteria. Please
                      try again with other filters.
                    </p>
                  </div>
                )}
              </article>
            </div>

            {/*/.row*/}
            <ul className="pagination">
              <li>
                <a
                  href="#"
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={page === 1 ? 'disabled' : ''}
                >
                  «
                </a>
              </li>

              {[...Array(totalPage)].map((_, index) => {
                const current = index + 1;
                return (
                  <li
                    key={current}
                    className={page === current ? 'active' : ''}
                  >
                    <a href="#" onClick={() => setPage(current)}>
                      {current}
                    </a>
                  </li>
                );
              })}

              <li>
                <a
                  href="#"
                  onClick={() => page < totalPage && setPage(page + 1)}
                  className={page === totalPage ? 'disabled' : ''}
                >
                  »
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
      {showModal && selectedJobId && (
        <JobApplicationForm
          jobId={selectedJobId}
          onClose={() => {
            setShowModal(false);
            setSelectedJobId(null);
          }}
        />
      )}
    </>
  );
}
