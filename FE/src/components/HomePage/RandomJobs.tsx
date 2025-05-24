import { useEffect, useState } from 'react';
import { getRandomJob } from '../../service/business/jobpostings/JobPostingsService';
import Loading from '../../common/Loading';
import './RandomJobs.css';
import { useNavigate } from 'react-router-dom';

export default function RandomJobs() {
  const [randomJobList, setRandomJobList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRandomJobs = async () => {
      try {
        const response = await getRandomJob();
        console.log(response);
        setRandomJobList(response.data);
      } catch (error) {
        console.error('Error fetching random jobs:', error);
      }
    };

    fetchRandomJobs();
  }, []);

  console.log(randomJobList);

  if (!randomJobList || randomJobList.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="main-heading">
              <p>200 New Jobs</p>
              <h2>
                New & Random <span>Jobs</span>
              </h2>
            </div>
          </div>
          <div className="row extra-mrg">
            {randomJobList.map((job) => (
              <div className="col-12 col-sm-6 col-md-3 mb-4" key={job.jobId}>
                <div
                  className="grid-view brows-job-list"
                  style={{
                    height: '100%',
                    minHeight: '360px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                    backgroundColor: 'white',
                    overflow: 'hidden',
                  }}
                >
                  <div className="avatar-wrapper">
                    <img
                      alt="avatar"
                      className="img-responsive"
                      src={job.avatarUrl || '/default-avatar.png'}
                    />
                  </div>
                  <div className="brows-job-position">
                    <h3>
                      <p
                        onClick={() => navigate(`/detail-job/${job.jobId}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        {job.title}
                      </p>
                    </h3>
                    <p>
                      <span>{job.companyName}</span>
                    </p>
                  </div>
                  <div className="job-position">
                    <span className="job-num">
                      {job.numberEmployees} Position
                    </span>
                  </div>
                  <ul className="grid-view-caption">
                    <li>
                      <div className="brows-job-location">
                        <p>
                          <i className="fa fa-map-marker" /> {job.location}
                        </p>
                      </div>
                    </li>
                    <li>
                      <p>
                        <span className="brows-job-sallery">
                          <i className="fa fa-money" />{' '}
                          {job.salary || 'Thỏa thuận'}
                        </span>
                      </p>
                    </li>
                  </ul>
                  {job.urgentRecruitment && (
                    <span className="tg-themetag tg-featuretag">
                      Urgent hiring
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="clearfix" />
    </>
  );
}
