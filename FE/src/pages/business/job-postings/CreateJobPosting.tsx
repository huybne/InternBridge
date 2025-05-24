import { useEffect, useState } from 'react';
import Select from 'react-select';

import { getAllCategories, getCompanyName } from '../../../service/business/categories/CategoryService';
import {
  saveDraftJob,
  sendRequestCreateJob,
} from '../../../service/business/jobpostings/JobPostingsService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function CreateJobPosting() {
  const navigate = useNavigate();
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [CompanyName, setCompanyName] = useState<string>();
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
      title: 'Confirm job creation?',
      text: 'Are you sure you want to submit this job creation request?',
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

  const handleConfirmSaveDraft = () => {
    Swal.fire({
      title: 'Confirm save draf?',
      text: 'Are you sure you want to save this job creation?',
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
        handleSaveDraft();
      }
    });
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    console.log('Form data:', formData);

    const selectedCategoryIds = selectedOptions.map((option) => option.value);

    const jobPostingPayload = {
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
      !formData.salary
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

    try {
      const response = await sendRequestCreateJob(jobPostingPayload);
      console.log('Job posting created successfully:', response);

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
      console.error('Error creating job posting:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to create job. Please try again.',
        confirmButtonColor: '#e74c3c',
        background: '#ffffff',
        color: '#333333',
      });
    }
  };

  const handleSaveDraft = async () => {
    console.log('Form data:', formData);

    const selectedCategoryIds = selectedOptions.map((option) => option.value);

    const jobPostingPayload = {
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
      !formData.salary
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

    try {
      const response = await saveDraftJob(jobPostingPayload);
      console.log('Saved job successfully:', response);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Job saved as draft.',
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
      console.error('Error creating job posting:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save job. Please try again.',
        confirmButtonColor: '#e74c3c',
        background: '#ffffff',
        color: '#333333',
      });
    }
  };

  useEffect(() => {
    const fetchCompanyName = async () => {
      const data = await getCompanyName();
      console.log(data);
      setCompanyName(data.data);
      formData.companyName = data.data;
    }


    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        const data = response.data;
        console.log('Response:', data);
        const formattedOptions = data.map(
          (category: { name: string; id: string }) => ({
            label: category.name,
            value: category.categoryId,
          }),
        );

        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
    fetchCompanyName();
  }, []);

  return (
    <>
      <div>
        <div className="clearfix"></div>

        <section
          className="inner-header-title"
          style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}
        >
          <div className="container">
            <h1>Create Job</h1>
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
                      readOnly
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
                        onChange={(selected) => setSelectedOptions(selected)}
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
                    Send Create Job
                  </button>

                  <button
                    type="button"
                    className="btn small-btn"
                    style={{
                      backgroundColor: '#28a745',
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
                      (e.target.style.backgroundColor = '#1e7e34')
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = '#28a745')
                    }
                    onClick={handleConfirmSaveDraft}
                  >
                    Save Draft
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
