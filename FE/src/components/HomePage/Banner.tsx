import { useNavigate } from 'react-router-dom';
import { brandImages } from '../../data/brandImages';

export default function Banner() {
  const navigate = useNavigate();
  //   useEffect(() => {
  //     const loadScripts = async () => {
  //       const scripts = ['/assets/plugins/js/owl.carousel.min.js'];

  //       for (const script of scripts) {
  //         await loadScript(script);
  //       }
  //     };
  //     loadScripts();
  //   }, []);
  return (
    <>
      <div
        className="banner"
        style={{
          backgroundImage: 'url(assets/img/banner-9.jpg)',
        }}
      >
        <div className="container">
          <div className="banner-caption">
            <div className="col-md-12 col-sm-12 banner-text">
              <h1
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/list-jobs')}
              >
                Discover Your Next Career Move
              </h1>
              <form className="form-horizontal">
                <div className="col-md-4 no-padd">
                  <div className="input-group">
                    <input
                      className="form-control right-bor"
                      id="joblist"
                      placeholder="Skills, Designations, Companies"
                      type="text"
                    />
                  </div>
                </div>
                <div className="col-md-3 no-padd">
                  <div className="input-group">
                    <input
                      className="form-control right-bor"
                      id="location"
                      placeholder="Search By Location.."
                      type="text"
                    />
                  </div>
                </div>
                <div className="col-md-3 no-padd">
                  <div className="input-group">
                    <select className="form-control" id="choose-city">
                      <option>Choose City</option>
                      <option>Chandigarh</option>
                      <option>London</option>
                      <option>England</option>
                      <option>Pratapcity</option>
                      <option>Ukrain</option>
                      <option>Wilangana</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-2 no-padd">
                  <div className="input-group">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      onClick={() => navigate('/list-jobs')}
                    >
                      Search Job
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="company-brand">
          <div className="container">
            <div className="owl-carousel" id="company-brands">
              {brandImages.map((src, index) => (
                <div className="brand-img" key={index}>
                  <img alt="" className="img-responsive" src={src} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
