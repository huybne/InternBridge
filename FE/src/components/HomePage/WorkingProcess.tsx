import { workingSteps } from '../../data/workingSteps';

export default function WorkingProcess() {
  return (
    <>
      <section className="how-it-works">
        <div className="container">
          <div className="row" data-aos="fade-up">
            <div className="col-md-12">
              <div className="main-heading">
                <p>Working Process</p>
                <h2>
                  How It <span>Works</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            {workingSteps.map((step) => (
              <div className="col-md-4 col-sm-4" key={step.id}>
                <div className="working-process">
                  <span className="process-img">
                    <img alt="" className="img-responsive" src={step.img} />
                    <span className="process-num">
                      {step.id.toString().padStart(2, '0')}
                    </span>
                  </span>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
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
