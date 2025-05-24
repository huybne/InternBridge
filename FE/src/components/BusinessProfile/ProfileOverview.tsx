import { useNavigate } from 'react-router-dom';
import '../../pages/identity/user/business/BusinessProfile.css';
import { useEffect, useState } from 'react';
import axiosPrivate from '../../api/axiosPrivate';
import { ApiResponse } from '../../features/auth/authType';
import { RequestBusinesses } from '../../pages/identity/user/business/BusinessProfile';


export default function ProfileOverview({ user, isApproved, status, businessData}) {
  const navigate = useNavigate();
  return (
    <>
      <section className="detail-desc advance-detail-pr gray-bg">
        <div className="container white-shadow profile-box-centered text-center">
          {user ? (
            <>
              <div className="profile-header">
                <div className="avatar-wrapper">
                  <img
                    src={user.picture || '/assets/img/can-1.png'}
                    className="avatar-img"
                    alt="Avatar"
                  />
                  <a href="#" className="edit-avatar" title="edit">
                    <i className="fa fa-pencil"></i>
                  </a>
                </div>
                {businessData?.status==="reject"?(<span className="badge-inactive">reject</span>):(<span className="badge-active">{businessData?.status}</span>)}

                
              </div>

              <h4 className="username">{user.username}</h4>
              <span className="designation">{user.email}</span>

              <div className="profile-stats row">

              </div>
              {businessData?.status==="reject"?(<div style={{color: 'red'}} >{businessData?.reason}</div>):("")}
              

              <div
                className="button-group"
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-evenly',
                }}
              >
                {businessData?.status==="reject" ? (
                  <>
                    <button
                      className="footer-btn grn-btn"
                      onClick={() => navigate('/edit')}
                    >
                      Edit Now
                    </button>
                    <button className="footer-btn blu-btn">Save Draft</button>
                  </>
                ) : (
                  <></>
                )}
                {/* <a href="#" className="footer-btn grn-btn">
                  Edit Now
                </a> */}
                {/* <button className="footer-btn blu-btn">Save Draft</button> */}
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-danger">User information not found.</p>
              <a href="/login" className="btn btn-primary mt-3">
                Log back in
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
function setError(arg0: string) {
  throw new Error('Function not implemented.');
}

