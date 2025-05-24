import HomePage from '../pages/HomePage';
import Error404 from '../pages/Error404';
import ErrorBan from '../pages/ErrorBan';
import Login from '../pages/identity/login/Login';
import SignUp from '../pages/identity/register/SignUp';

import DefaultLayout from '../components/layout/DefaultLayout';
import AuthLayout from '../components/layout/AuthLayout';
import { JSX } from 'react';
import UserProfile from '../pages/identity/user/UserProfile';
import RequireGuest from '../components/guards/RequireGuest';
import SecuritySettings from '../pages/identity/user/setting/SecuritySetting';
import RequireAuth from '../components/guards/RequireAuth';
import ResetPassword from '../pages/identity/user/resetPassword/ResetPassword';
import ForgetPassword from '../pages/identity/user/resetPassword/ForgetPassword';
import Authenticate from '../pages/identity/login/authenticate';

import StudentProfile from '../pages/identity/user/StudentProfile';
import StudentVerifycation from '../pages/identity/user/StudentVerifycation/StudentVerifycation';
import ManageCv from '../pages/identity/user/ManageCv/ManageCv';
import UpdateProfile from '../pages/identity/user/UpdateProfile/UpdateProfile';
import LogoutSang from '../pages/identity/user/StudentVerifycation/LogoutSang';

import BusinessProfile from '../pages/identity/user/business/BusinessProfile';

import VerifyBusinessForm from '../pages/identity/user/business/VerifyBusinessForm';
import EditBusinessProfile from '../pages/identity/user/business/EditBusinessProfile';
import RequireRole from '../components/guards/RequireRole';
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashBoard';

import ListStudentAccount from '../pages/admin/ListStudentAccount';
import ListBussinessAccount from '../pages/admin/ListBussinessAccount';

import RefreshTokenTester from '../pages/RefreshTokenTester';
import StaffAdmin from '../pages/staff-admin/StaffAdmin';
import CreateJobPosting from '../pages/business/job-postings/CreateJobPosting';
import ListJobPosting from '../pages/business/job-postings/ListJobPosting';
import ListJobPublic from '../pages/business/job-postings/ListJobPublic';
import JobDetail from '../pages/business/job-postings/Job-Detail';
import AppliedJobsList from '../pages/business/apply-jobs/AppliedJobsList';
import ListApplyJobs from '../pages/business/apply-jobs/ListApplyJobs';
import DetailApplyJob from '../pages/business/apply-jobs/DetailApplyJob';
import StudentInterviewList from '../pages/business/interviews/StudentInterviewList';
import UpdateJobPosting from '../pages/business/job-postings/UpdateJobPosting';
import CategoriesList from '../pages/business/categories/CategoriesList';
import ListUsers from '../pages/admin/ListUsers';
import ListProfiles from '../pages/admin/ListProfiles/ListProfiles';
import PublicJobListByBusiness from '../pages/business/apply-jobs/PublicJobListByBusiness';
import BusinessDetail from '../pages/identity/user/business/BusinessDetail';

import ListJobfavorites from '../pages/business/job-postings/ListJobfavorites';

import ListJobs from '../pages/admin/Jobs/ListJobs';
import InterviewCalendar from '../pages/business/interviews/InterviewCalendar';

interface RouteConfig {
  path: string;
  element: JSX.Element;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
}
const routes: RouteConfig[] = [
  {
    path: '/',
    element: <HomePage />,
    layout: DefaultLayout,
  },
  {
    path: '/404',
    element: <Error404 />,
    layout: DefaultLayout,
  },
  {
    path: '/401',
    element: <ErrorBan />,
    layout: DefaultLayout,
  },
  {
    path: '/login',
    element: (
      <RequireGuest>
        <Login />
      </RequireGuest>
    ),
    layout: AuthLayout,
  },
  {
    path: '/signup',
    element: (
      <RequireGuest>
        <SignUp />
      </RequireGuest>
    ),
    layout: AuthLayout,
  },
  {
    path: '/forget-password',
    element: (
      <RequireGuest>
        <ForgetPassword />
      </RequireGuest>
    ),
    layout: AuthLayout,
  },
  {
    path: '/businessprofile',
    element: (
      <RequireAuth>
        <BusinessProfile />
      </RequireAuth>
    ),
    layout: DefaultLayout,
  },
  {
    path: '/edit',
    element: (
      <RequireAuth>
        <EditBusinessProfile />
      </RequireAuth>
    ),
    layout: DefaultLayout,
  },
  {
    path: '/verify-business',
    element: (
      <RequireAuth>
        <VerifyBusinessForm />
      </RequireAuth>
    ),
    layout: DefaultLayout,
  },
  {
    path: '/profile',
    element: (
      <RequireAuth>
        <UserProfile />
      </RequireAuth>
    ),
    layout: DefaultLayout,
  },
  {
    path: '/logoutsang',
    element: (
      <RequireAuth>
        <LogoutSang />
      </RequireAuth>
    ),
    layout: DefaultLayout,
  },
  {
    path: '/studentprofile',
    element: (
      <RequireAuth>
        <StudentProfile />
      </RequireAuth>
    ),
    layout: DefaultLayout,
  },
  {
    path: '/studentverifycation',
    element: (
      <RequireAuth>
        <StudentVerifycation />
      </RequireAuth>
    ),
    layout: DefaultLayout,
  },
  {
    path: '/updateprofile',
    element: (
      <RequireAuth>
        <UpdateProfile />
      </RequireAuth>
    ),
    layout: DefaultLayout,
  },
  {
    path: '/cv',
    element: (
      <RequireAuth>
        <ManageCv />
      </RequireAuth>
    ),
    layout: DefaultLayout,
  },
  {
    path: '/student/listjobfavorite',
    element: (
      <RequireAuth>
        <ListJobfavorites />
      </RequireAuth>
    ),
    layout: DefaultLayout,
  },
  {
    path: '/settings/security',
    element: (
      <RequireAuth>
        <SecuritySettings />
      </RequireAuth>
    ),
    layout: DefaultLayout,
  },

  {
    path: '/reset-password',
    element: (
      <RequireGuest>
        <ResetPassword />
      </RequireGuest>
    ),
    layout: DefaultLayout,
  },
  {
    path: '/authenticate',
    element: <Authenticate></Authenticate>,
  },
  {
    path: '/test',
    element: (
      <RequireAuth>
        <DefaultLayout>
          <RefreshTokenTester />
        </DefaultLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['ADMIN', 'STAFF_ADMIN']}>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: '/admin/staff-admins',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['ADMIN']}>
          <AdminLayout>
            <StaffAdmin />
          </AdminLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },

  // RECRUIMENT ROUTES
  {
    path: '/business/create-job',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['BUSINESS']}>
          <DefaultLayout>
            <CreateJobPosting />
          </DefaultLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: '/business/update-job/:id',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['BUSINESS']}>
          <DefaultLayout>
            <UpdateJobPosting />
          </DefaultLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: '/business/list-job-created',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['BUSINESS']}>
          <DefaultLayout>
            <ListJobPosting />
          </DefaultLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: '/business/list-apply-jobs/:jobId',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['BUSINESS']}>
          <DefaultLayout>
            <ListApplyJobs />
          </DefaultLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  // {
  //   path: '/business/job-interview-list/:jobId',
  //   element: (
  //     <RequireAuth>
  //       <RequireRole allowRoles={['BUSINESS']}>
  //         <DefaultLayout>
  //           <JobInterviewList />
  //         </DefaultLayout>
  //       </RequireRole>
  //     </RequireAuth>
  //   ),
  // },
  {
    path: '/business/job-interview-list',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['BUSINESS']}>
          <DefaultLayout>
            <InterviewCalendar />
          </DefaultLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: '/business/public-job-list',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['BUSINESS']}>
          <DefaultLayout>
            <PublicJobListByBusiness />
          </DefaultLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
    {
    path: '/student/interview-list',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['STUDENT']}>
          <DefaultLayout>
            <PublicJobListByBusiness />
          </DefaultLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: '/list-jobs',
    element: (
      <DefaultLayout>
        <ListJobPublic />
      </DefaultLayout>
    ),
  },
  {
    path: 'detail-job/:jobId',
    element: (
      <DefaultLayout>
        <JobDetail />
      </DefaultLayout>
    ),
  },
  {
    path: '/student/applied-jobs-list',
    element: (
      <RequireAuth>
        <DefaultLayout>
          <AppliedJobsList />
        </DefaultLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/business/detail-apply-job/:applyId',
    element: (
      <RequireAuth>
        <DefaultLayout>
          <DetailApplyJob />
        </DefaultLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/student/list-interview',
    element: (
      <RequireAuth>
        <DefaultLayout>
          <StudentInterviewList />
        </DefaultLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/admin/categories',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['ADMIN']}>
        <AdminLayout>
          <CategoriesList />
        </AdminLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },

  {
    path: '/reset-password',
    element: (
      <RequireGuest>
        <ResetPassword />
      </RequireGuest>
    ),
    layout: DefaultLayout,
  },
  {
    path: '/authenticate',
    element: <Authenticate></Authenticate>,
  },
  {
    path: '/test',
    element: (
      <RequireAuth>
        <DefaultLayout>
          <RefreshTokenTester />
        </DefaultLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['ADMIN', 'STAFF_ADMIN']}>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: '/admin/staff-admins',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['ADMIN']}>
          <AdminLayout>
            <StaffAdmin />
          </AdminLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: '/admin/students-account',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['ADMIN', 'STAFF_ADMIN']}>
          <AdminLayout>
            <ListStudentAccount />
          </AdminLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },

  {
    path: '/admin/business-account',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['ADMIN', 'STAFF_ADMIN']}>
          <AdminLayout>
            <ListBussinessAccount />
          </AdminLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['ADMIN', 'STAFF_ADMIN']}>
          <AdminLayout>
            <ListUsers />
          </AdminLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: '/admin/pending-profiles',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['ADMIN', 'STAFF_ADMIN']}>
          <AdminLayout>
            <ListProfiles />
          </AdminLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: '/BusinessDetail/:id',
    element: (
      <RequireAuth>
        <DefaultLayout>
          <BusinessDetail />
        </DefaultLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/admin/pending-jobs',
    element: (
      <RequireAuth>
        <RequireRole allowRoles={['ADMIN', 'STAFF_ADMIN']}>
          <AdminLayout>
            <ListJobs />
          </AdminLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
];
export default routes;
