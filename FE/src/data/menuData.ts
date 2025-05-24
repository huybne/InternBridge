// src/data/menuData.ts

export interface MenuItem {
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  title: string;
  items: MenuItem[];
  tag?: string;
  roles?: string[];
}
export const megaMenu: MegaMenuColumn[] = [
  {
    title: 'Main Pages',
    items: [
      { label: 'Home', href: '/' },
      // { label: "Sign In / Sign Up", href: "/login" },
      { label: 'Search Jobs', href: '/list-jobs' },
    ],
  },
  {
    title: 'For Candidate',
    roles: ['STUDENT', 'ADMIN', 'STAFF_ADMIN'],
    items: [
      { label: 'Student Profile', href: '/studentprofile' },
      { label: 'Manage CV', href: '/cv' },
      { label: 'Applied Jobs', href: '/student/applied-jobs-list' },
      { label: 'Interviews', href: '/student/list-interview' },
    ],
  },
  {
    title: 'For Business',
    roles: ['BUSINESS', 'ADMIN', 'STAFF_ADMIN'],
    items: [
      { label: 'Create Job', href: '/business/create-job' },
      { label: 'Manage Jobs', href: '/business/list-job-created' },
      { label: 'Applicants', href: '/business/public-job-list' },
      { label: 'Interviews', href: '/business/job-interview-list' },
      { label: 'Business Profile', href: '/businessprofile' },
    ],
  },
  {
    title: 'More',
    items: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];
