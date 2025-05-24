export interface WorkingStep {
  id: number;
  title: string;
  description: string;
  img: string;
}

export const workingSteps: WorkingStep[] = [
  {
    id: 1,
    title: 'Create An Account',
    description:
      "Post a job to tell us about your project. We'll quickly match you with the right freelancers find place best.",
    img: 'assets/img/step-1.png',
  },
  {
    id: 2,
    title: 'Search Jobs',
    description:
      "Post a job to tell us about your project. We'll quickly match you with the right freelancers find place best.",
    img: 'assets/img/step-2.png',
  },
  {
    id: 3,
    title: 'Save & Apply',
    description:
      "Post a job to tell us about your project. We'll quickly match you with the right freelancers find place best.",
    img: 'assets/img/step-3.png',
  },
];
