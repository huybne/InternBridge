import './BusinessProfile.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { useEffect, useState } from 'react';
import { getMyBusiness } from '../../../../service/business/MyBusinessService';

import AboutTab from '../../../../components/BusinessProfile/AboutTab';
import ProfileOverview from '../../../../components/BusinessProfile/ProfileOverview';
import BusinessVerifyNotice from './BusinessVerifyNotice';
import InformationTab from '../../../../components/BusinessProfile/InforBusinessTab';
import Loading from '../../../../common/Loading';
import Error404 from '../../../Error404';
import { useDispatch } from 'react-redux';
import { fetchBusinessInfo } from '../../../../features/auth/businessSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import axiosPrivate from '../../../../api/axiosPrivate';
import { ApiResponse } from '../../../../features/auth/authType';
import { getRequestBusiness } from '../../../../service/business/verifyBusinessService';

export class RequestBusinesses {
  requestId: string;
  businessId: string;
  reason: string;
  sendTime: Date;
  status: 'pending' | 'approve' | 'reject'; // Enum-like string literals
  isDeleted: boolean;

  constructor(
    requestId: string,
    businessId: string,
    reason: string,
    sendTime: Date,
    status: 'pending' | 'approve' | 'reject',
    isDeleted: boolean
  ) {
    this.requestId = requestId;
    this.businessId = businessId;
    this.reason = reason;
    this.sendTime = sendTime;
    this.status = status;
    this.isDeleted = isDeleted;
  }
}


export default function UserProfile() {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('about');
  // const [business, setBusiness] = useState<any>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const business = useSelector((state: RootState) => state.business.data);
  const isApproved = useSelector(
    (state: RootState) => state.business.isApproved,
  );
  const status = useSelector((state: RootState) => state.business.status);
  const error = useSelector((state: RootState) => state.business.error);
  const [businessData, setBusinessData] = useState<RequestBusinesses|null>();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchBusinessInfo());
    if(status=="failed"){
      navigate("/verify-business");
    }


    const getrequest = async () => {
      try {
        const response = await axiosPrivate.get<ApiResponse<RequestBusinesses>>('/request-business/getrequest');
        setBusinessData(response.data.data);
      } catch (error) {
        console.error('❌ Failed to request business:', error);
      }

    };
    getrequest()
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <>
        <Error404 />
      </>
    );
  }

  if (!business) {
    return (
      <section className="verify-notice-section">
        <BusinessVerifyNotice />
      </section>
    );
  }

  return (
    <div className="business-profile-page">
      {/* Title Banner */}
      <section
        className="inner-header-title"
        style={{ backgroundImage: 'url(/assets/img/banner-10.jpg)' }}
      >
        <div className="container">
          <h1>Business Profile</h1>
        </div>
      </section>

      {/* Profile Overview */}
      <ProfileOverview
        user={user}
        isApproved={isApproved}
        status={status}
        businessData={businessData}
      />

      {/* Tabs Section */}
      <section className="full-detail-description full-detail gray-bg">
        <div className="container">
          <div className="deatil-tab-employ tool-tab">
            <ul className="nav simple nav-tabs">
              <li className={activeTab === 'about' ? 'active' : ''}>
                <a href="#aboutTab" onClick={() => setActiveTab('about')}>
                  About
                </a>
              </li>
              <li className={activeTab === 'information' ? 'active' : ''}>
                <a
                  href="#infomationTab"
                  onClick={() => setActiveTab('information')}
                >
                  Information
                </a>
              </li>
            </ul>
            <div className="tab-content">
              {activeTab === 'about' && <AboutTab user={user} />}
              {activeTab === 'information' && (
                <InformationTab  />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
