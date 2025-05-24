import Banner from '../components/HomePage/Banner';
import RandomJobs from '../components/HomePage/RandomJobs';
import VideoHome from '../components/HomePage/VideoHome';
import WorkingProcess from '../components/HomePage/WorkingProcess';

export default function HomePage() {
  return (
    <>
      {/* <ScriptProvider /> */}
      {/* <Header /> */}
      <Banner />
      <RandomJobs />
      <VideoHome />
      <WorkingProcess />
      {/* <Footer /> */}
    </>
  );
}
