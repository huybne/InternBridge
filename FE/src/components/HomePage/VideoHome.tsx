export default function VideoHome() {
  return (
    <>
      <section
        className="video-sec dark"
        id="video"
        style={{
          backgroundImage: 'url(assets/img/banner-10.jpg)',
        }}
      >
        <div className="container">
          <div className="row">
            <div className="main-heading">
              <p>Best For Your Projects</p>
              <h2>
                Watch Our <span>video</span>
              </h2>
            </div>
          </div>
          <div className="video-part">
            <a
              className="video-btn"
              data-target="#my-video"
              data-toggle="modal"
              href="#"
            >
              <i className="fa fa-play" />
            </a>
          </div>
        </div>
      </section>
      <div className="clearfix" />
    </>
  );
}
