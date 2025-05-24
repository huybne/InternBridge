import React, { useEffect, useState } from 'react';
import {
  createCategory,
  getAllCategoriesWithPagination,
  updateCategory,
} from '../../../service/business/categories/CategoryService';
import Swal from 'sweetalert2';
import CategoryToggle from './CategoryToggle';

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  return 'Just now';
}

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(20);

  useEffect(() => {
    const offset = (page - 1) * limit;
    fetchCategories(offset);
  }, [page]);

  const fetchCategories = async (offset: number) => {
    try {
      const response = await getAllCategoriesWithPagination(offset, limit);
      console.log('Categories response:', response);
      if (response.code === 1000) {
        setCategories(response.data.data);
        setTotalPage(response.data.totalPages);
      } else {
        console.error('Failed to fetch job postings');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Something went wrong while fetching categories');
    }
  };

  const handleEditClick = ({ name, description, categoryId }) => {
    const originalName = name;
    const originalDesc = description;

    Swal.fire({
      title: 'Edit category',
      html: ` 
<input id="swal-name" class="swal2-input" placeholder="Name" value="${originalName}" /> 
<textarea id="swal-desc" class="swal2-textarea" placeholder="Description">${originalDesc}</textarea> 
`,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      didOpen: () => {
        const nameInput = Swal.getPopup().querySelector('#swal-name');
        const descInput = Swal.getPopup().querySelector('#swal-desc');
        const confirmButton = Swal.getConfirmButton();

        const checkChanges = () => {
          const changed =
            nameInput.value !== originalName ||
            descInput.value !== originalDesc;
          confirmButton.disabled = !changed;
        };

        nameInput.addEventListener('input', checkChanges);
        descInput.addEventListener('input', checkChanges);
        checkChanges(); // initial call
      },
      preConfirm: async () => {
        const name = Swal.getPopup().querySelector('#swal-name').value;
        const description = Swal.getPopup().querySelector('#swal-desc').value;

        const confirmRes = await Swal.fire({
          title: 'Are you sure?',
          text: 'Information will be updated.',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
        });

        if (confirmRes.isConfirmed) {
          try {
            await updateCategory(categoryId, name, description);

            Swal.fire({
              title: 'Success!',
              html: 'Data has been updated. <br><b>The page will reload in <span id="countdown">3</span> seconds.</b>',
              icon: 'success',
              showConfirmButton: false,
              timer: 3000,
              didOpen: () => {
                const countdownEl =
                  Swal.getHtmlContainer().querySelector('#countdown');
                let timeLeft = 3;
                const interval = setInterval(() => {
                  timeLeft -= 1;
                  if (countdownEl)
                    countdownEl.textContent = timeLeft.toString();
                }, 1000);
              },
              willClose: () => {
                window.location.reload();
              },
            });
          } catch (error) {
            Swal.fire('Error', 'Update failed!', 'error');
          }
        }
      },
    });
  };

  const handleCreateClick = () => {
    Swal.fire({
      title: 'Create New Category',
      html: `
      <input id="swal-name" class="swal2-input" placeholder="Name" />
      <textarea id="swal-desc" class="swal2-textarea" placeholder="Description"></textarea>
    `,
      showCancelButton: true,
      confirmButtonText: 'Create',
      cancelButtonText: 'Cancel',
      didOpen: () => {
        const nameInput = Swal.getPopup().querySelector('#swal-name');
        const descInput = Swal.getPopup().querySelector('#swal-desc');
        const confirmButton = Swal.getConfirmButton();

        const checkValid = () => {
          confirmButton.disabled = !nameInput.value.trim(); // Chỉ cần name
        };

        nameInput.addEventListener('input', checkValid);
        checkValid(); // Disable nếu chưa nhập
      },
      preConfirm: async () => {
        const name = Swal.getPopup().querySelector('#swal-name').value.trim();
        const description = Swal.getPopup()
          .querySelector('#swal-desc')
          .value.trim();

        const confirmRes = await Swal.fire({
          title: 'Are you sure?',
          text: 'This will create a new category.',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, create it!',
          cancelButtonText: 'No',
        });

        if (confirmRes.isConfirmed) {
          try {
            await createCategory(name, description);
            // console.log('Creating category:', name, description);

            Swal.fire({
              title: 'Success!',
              html: 'Category created successfully.<br>Reloading in <b><span id="countdown">3</span></b> seconds.',
              icon: 'success',
              showConfirmButton: false,
              timer: 3000,
              didOpen: () => {
                const countdownEl =
                  Swal.getHtmlContainer().querySelector('#countdown');
                let timeLeft = 3;
                const interval = setInterval(() => {
                  timeLeft -= 1;
                  if (countdownEl)
                    countdownEl.textContent = timeLeft.toString();
                }, 1000);
              },
              willClose: () => {
                window.location.reload();
              },
            });
          } catch (error) {
            Swal.fire('Error', 'Creation failed!', 'error');
          }
        }
      },
    });
  };

  const handleUpdateToggle = (id: number, newDeleted: boolean) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.categoryId === id
          ? { ...category, isDeleted: newDeleted ? 1 : 0 }
          : category,
      ),
    );
  };

  console.log(categories);

  return (
    <>
      <div className="clearfix" />
      {/* Title Header Start */}
      <section
        className="inner-header-title"
        style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}
      >
        <div className="container">
          <h1>Manage Category</h1>
        </div>
      </section>
      <div className="clearfix" />

      <section className="manage-company gray" style={{paddingLeft: '70px'}}>
        <div className="container">
          {/* search filter */}
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="search-filter">
                <div className="col-md-4 col-sm-5">
                  <div className="filter-form">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search…"
                      />
                      <span className="input-group-btn">
                        <button type="button" className="btn btn-default">
                          Go
                        </button>
                        <button
                          type="button"
                          className="btn btn-default"
                          style={{ marginLeft: '20px' }}
                          onClick={handleCreateClick}
                        >
                          New Category
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-8 col-sm-7">
                  <div className="short-by pull-right">
                    Short By
                    <div className="dropdown">
                      <a
                        href="#"
                        className="dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        Dropdown{' '}
                        <i className="fa fa-angle-down" aria-hidden="true" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="#">Short By Date</a>
                        </li>
                        <li>
                          <a href="#">Short By Views</a>
                        </li>
                        <li>
                          <a href="#">Short By Popular</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* search filter End */}

          <div
            className="row"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              justifyContent: 'flex-start',
            }}
          >
            {categories.map((category) => (
              <div
                key={category.categoryId}
                className="category-card"
                style={{
                  background: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: '300px',
                  flex: '1 1 calc(25% - 20px)',
                }}
              >
                {/* Header */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <img
                    src="/assets/img/com-1.jpg"
                    alt=""
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '4px',
                    }}
                  />
                  <div>
                    <h5 style={{ margin: 0 }}>{category.name}</h5>
                    <small style={{ color: '#999' }}>
                      {formatTimeAgo(category.updatedAt)}
                    </small>
                  </div>
                </div>

                {/* Description */}
                <p
                  style={{
                    marginTop: '10px',
                    color: '#666',
                    minHeight: '40px',
                  }}
                >
                  {category.description || (
                    <em style={{ color: '#bbb' }}>No description</em>
                  )}
                </p>

                {/* Actions */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: 'auto',
                  }}
                >
                  <i
                    className="fa fa-edit"
                    title="Edit"
                    style={{ cursor: 'pointer', color: '#28a745' }}
                    onClick={() => handleEditClick(category)}
                  />
                  <CategoryToggle
                    categoryId={category.categoryId}
                    initiallyDeleted={category.deleted === true}
                    onStatusChange={(newDeleted) =>
                      handleUpdateToggle(category.categoryId, newDeleted)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="row">
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
        </div>
      </section>
    </>
  );
}
