import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  return (
    <>
      <footer className="footer">
        <div className="row lg-menu">
          <div className="container">
            <div className="col-md-4 col-sm-4">
              <img
                alt=""
                className="img-responsive"
                src="assets/img/footer-logo.png"
              />
            </div>
            <div className="col-md-8 co-sm-8 pull-right">
              <ul>
                <li>
                  <a href="index-2.html" title="">
                    Home
                  </a>
                </li>
                <li>
                  <a href="blog.html" title="">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="404.html" title="">
                    404
                  </a>
                </li>
                <li>
                  <a href="faq.html" title="">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="contact.html" title="">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row no-padding">
          <div className="container">
            <div className="col-md-3 col-sm-12">
              <div className="footer-widget">
                <h3 className="widgettitle widget-title">About Job Stock</h3>
                <div className="textwidget">
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem.
                  </p>
                  <p>
                    7860 North Park Place
                    <br />
                    San Francisco, CA 94120
                  </p>
                  <p>
                    <strong>Email:</strong> Support@careerdesk
                  </p>
                  <p>
                    <strong>Call:</strong>{' '}
                    <a href="tel:+15555555555">555-555-1234</a>
                  </p>
                  <ul className="footer-social">
                    <li>
                      <a href="#">
                        <i className="fa fa-facebook" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-google-plus" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-instagram" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-linkedin" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-4">
              <div className="footer-widget">
                <h3 className="widgettitle widget-title">All Navigation</h3>
                <div className="textwidget">
                  <div className="textwidget">
                    <ul className="footer-navigation">
                      <li>
                        <a href="manage-company.html" title="">
                          Front-end Design
                        </a>
                      </li>
                      <li>
                        <a href="manage-company.html" title="">
                          Android Developer
                        </a>
                      </li>
                      <li>
                        <a href="manage-company.html" title="">
                          CMS Development
                        </a>
                      </li>
                      <li>
                        <a href="manage-company.html" title="">
                          PHP Development
                        </a>
                      </li>
                      <li>
                        <a href="manage-company.html" title="">
                          IOS Developer
                        </a>
                      </li>
                      <li>
                        <a href="manage-company.html" title="">
                          Iphone Developer
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-4">
              <div className="footer-widget">
                <h3 className="widgettitle widget-title">All Categories</h3>
                <div className="textwidget">
                  <ul className="footer-navigation">
                    <li>
                      <a href="manage-company.html" title="">
                        Front-end Design
                      </a>
                    </li>
                    <li>
                      <a href="manage-company.html" title="">
                        Android Developer
                      </a>
                    </li>
                    <li>
                      <a href="manage-company.html" title="">
                        CMS Development
                      </a>
                    </li>
                    <li>
                      <a href="manage-company.html" title="">
                        PHP Development
                      </a>
                    </li>
                    <li>
                      <a href="manage-company.html" title="">
                        IOS Developer
                      </a>
                    </li>
                    <li>
                      <a href="manage-company.html" title="">
                        Iphone Developer
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-4">
              <div className="footer-widget">
                <h3 className="widgettitle widget-title">Connect Us</h3>
                <div className="textwidget">
                  <form className="footer-form">
                    <input
                      className="form-control"
                      placeholder="Your Name"
                      type="text"
                    />
                    <input
                      className="form-control"
                      placeholder="Email"
                      type="text"
                    />
                    <textarea className="form-control" placeholder="Message" />
                    {!user && (
                      <button
                        className="btn btn-primary"
                        type="submit"
                        onClick={() => navigate('/login')}
                      >
                        Login
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
