import { useSignUpForm } from "./useSignUpForm";


export default function SignUp() {
  const {
    username,
    email,
    password,
    repeatPassword,
    successMessage,
    loading,
    error,
    setUsername,
    setEmail,
    setPassword,
    setRepeatPassword,
    handleSubmit,
  } = useSignUpForm();
  
  return (
    <>
      <div
        className="simple-bg-screen"
        style={{
          backgroundImage: 'url(assets/img/banner-10.jpg)',
          height: '100vh',
        }}
      >
        <div className="Loader" style={{ transition: 'opacity 0.5s' }} />
        <div className="wrapper">
          <section className="signup-screen-sec">
            <div className="container">
              <div className="signup-screen">
                <a href="/">
                  <img
                    alt=""
                    className="img-responsive"
                    src="assets/img/logo.png"
                  />
                </a>
                <form onSubmit={handleSubmit}>
                    <input
                    className="form-control"
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <input
                    className="form-control"
                    placeholder="Your Email"
                    type="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    required
                  />

                  <input
                    className="form-control"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input 
                    className="form-control"
                    placeholder="Repeat Password"
                    type="password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                  />
                  <button className="btn btn-login" type="submit" disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </button>
                  {error && <p style={{color: 'red', marginTop: 10}}>{error}</p>}
                  {successMessage && (
                    <p style={{color: 'green', marginTop: 10}}>{successMessage}</p>
                  )}
                  <span>
                    Have You Account? <a href="/login"> Login</a>
                  </span>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
