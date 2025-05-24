import { useEffect, useState } from 'react';
import Select from 'react-select';

import { getAllCategories, getAllCategoryJobPostings } from '../../../service/business/categories/CategoryService';
import {
  getDetailJob,
  updateJobPosting,
} from '../../../service/business/jobpostings/JobPostingsService';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateJobPosting() {
  const { id } = useParams();
  console.log('jobId:', id);

  const navigate = useNavigate();
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    companyName: '',
    title: '',
    description: '',
    location: '',
    numberEmployees: 0,
    isUrgentRecruitment: false,
    expirationDate: '',
    salary: '',
  });

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 5); // cộng thêm 5 ngày
    return today.toISOString().split('T')[0]; // format yyyy-mm-dd
  };

  const handleConfirmSubmit = () => {
    Swal.fire({
      title: 'Confirm update job?',
      text: 'Are you sure you want to submit this update job request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#07b107',
      cancelButtonColor: '#e74c3c',
      confirmButtonText: 'Agree',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#333333',
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit();
      }
    });
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    console.log('Form data:', formData);

    const selectedCategoryIds = selectedOptions.map((option) =>
      String(option.value),
    );

    console.log(selectedCategoryIds);

    const jobPostingPayload = {
      jobId: id,
      ...formData,
      categoryIds: selectedCategoryIds,
      isUrgentRecruitment:
        formData.isUrgentRecruitment === 'true' ||
        formData.isUrgentRecruitment === true,
      expirationDate: formData.expirationDate,
    };

    if (
      !formData.companyName ||
      !formData.title ||
      !formData.description ||
      !formData.location ||
      formData.numberEmployees <= 0 ||
      !formData.expirationDate ||
      !formData.salary ||
      selectedCategoryIds.length === 0
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please fill in all fields.',
        confirmButtonColor: '#e74c3c',
        background: '#ffffff',
        color: '#333333',
      });
      return;
    }

    console.log('Job posting payload:', jobPostingPayload);

    try {
      const response = await updateJobPosting(jobPostingPayload);
      console.log('Job posting updated and sent successfully:', response);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Job created.',
        confirmButtonColor: '#07b107',
        background: '#ffffff',
        color: '#333333',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      setTimeout(() => {
        navigate('/business/list-job-created');
      }, 3000);
    } catch (error) {
      console.error('Error updating job posting:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update job. Please try again.',
        confirmButtonColor: '#e74c3c',
        background: '#ffffff',
        color: '#333333',
      });
    }
  };

  useEffect(() => {
    const getAllCategoryJobPostingsU = async () => {
      const response = await getAllCategoryJobPostings(id ?? "");
      console.log('All category job postings:', response);
      setSelectedOptions(response);
    }


    const fetchCategories = async () => {
      console.log('Fetching categories...');

      try {
        const response = await getAllCategories();
        const data = response.data;
        console.log('Response:', response);
        console.log('Response.data:', response.data);
        const formattedOptions = data.map(
          (category: { name: string; id: string }) => ({
            label: category.name,
            value: category.categoryId,
          }),
        );

        setOptions(formattedOptions);

        if (id) {
          const jobRes = await getDetailJob(id);
          console.log('Job response:', jobRes);

          const job = jobRes.data;
          console.log('Job details:', job);

          setFormData({
            companyName: job.companyName || '',
            title: job.title || '',
            description: job.description || '',
            location: job.location || '',
            numberEmployees: job.numberEmployees || 0,
            isUrgentRecruitment: job.isUrgentRecruitment || false,
            expirationDate: job.expirationDate || '',
            salary: job.salary || '',
          });

          // // Khớp selectedOptions với các options có sẵn
          // const selected =
          //   job.categoryNames?.map((cat: any) => ({
          //     label: cat.name,
          //     value: cat.categoryId,
          //   })) || [];
          // setSelectedOptions(selected);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    getAllCategoryJobPostingsU();
    fetchCategories();
  }, [id]);

  console.log(options);
  console.log(selectedOptions);

  return (
    <>
      <div>
        <div className="clearfix"></div>

        <section
          className="inner-header-title"
          style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}
        >
          <div className="container">
            <h1>Update Job</h1>
          </div>
        </section>
        <div className="clearfix"></div>

        <section className="full-detail">
          <div className="container">
            <div className="row bottom-mrg extra-mrg">
              <form>
                <h2 className="detail-title">Job Requirement</h2>
                <div className="col-md-6 col-sm-6">
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa fa-flag" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-6">
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa-solid fa-heading" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="col-md-6 col-sm-6">
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa fa-pencil" />
                    </span>
                    <div style={{ flex: 1, height: '50px' }}>
                      <Select
                        options={options}
                        isMulti
                        placeholder="Select Job Categories"
                        value={selectedOptions}
                        onChange={(selected) => {
                          console.log('Tùy chọn đã chọn:', selected); // Debug để kiểm tra tùy chọn
                          setSelectedOptions(selected || []);
                          console.log(selectedOptions);
                        }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          control: (base) => ({
                            ...base,
                            minHeight: '50px',
                            height: '50px',
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            height: '50px',
                            paddingTop: '0',
                            paddingBottom: '0',
                          }),
                          input: (base) => ({
                            ...base,
                            margin: '0px',
                            padding: '0px',
                          }),
                          multiValue: (base) => ({
                            ...base,
                            margin: '2px',
                          }),
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-sm-6">
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa-solid fa-user" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Number of Employees"
                      value={formData.numberEmployees ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setFormData({ ...formData, numberEmployees: null });
                          return;
                        }

                        // Nếu giá trị KHÔNG phải là một số nguyên dương hợp lệ, thì bỏ qua
                        if (!/^\d+$/.test(value)) {
                          return;
                        }

                        setFormData({
                          ...formData,
                          numberEmployees: parseInt(value, 10),
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-6">
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa fa-map-marker" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-6">
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa-solid fa-bell" />
                    </span>
                    <select
                      className="form-control"
                      placeholder="Is Urgent Recruitment?"
                      value={formData.isUrgentRecruitment ? 'true' : 'false'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isUrgentRecruitment: e.target.value === 'true',
                        })
                      }
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6">
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa-solid fa-calendar" />
                    </span>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="expiration date"
                      min={getMinDate()}
                      value={formData.expirationDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expirationDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6 col-sm-6">
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa-solid fa-dollar-sign" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Salary"
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="row bottom-mrg extra-mrg">
              <form>
                <h2 className="detail-title">Job Description</h2>
                <div className="col-md-12 col-sm-12">
                  <textarea
                    className="form-control textarea"
                    placeholder="About Job"
                    defaultValue={''}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div
                  className="col-md-12 col-sm-12"
                  style={{ display: 'flex', justifyContent: 'space-evenly' }}
                >
                  <button
                    type="button"
                    className="btn small-btn"
                    style={{
                      backgroundColor: '#07b107',
                      color: 'white',
                      border: 'none',
                      minWidth: '200px',
                      height: '60px',
                      fontSize: '16px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = '#218838')
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = '#07b107')
                    }
                    onClick={handleConfirmSubmit}
                  >
                    Send Update Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
