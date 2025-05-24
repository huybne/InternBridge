import { useState } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "../../../../app/hook";
import { forgotPassword } from "../../../../features/auth/authSlice";
import "./forgetpassword.css";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please enter your email",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await dispatch(forgotPassword({ email })).unwrap();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.message + "Please check your email.",
        width: '800px',
        customClass: {
          popup: 'swal-wide',
          title: 'swal-title-lg',
          htmlContainer: 'swal-text-lg'
        }
      });
      
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err as string,
        customClass: {
          popup: 'swal-wide',
          title: 'swal-title-lg',
          htmlContainer: 'swal-text-lg'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="simple-bg-screen"
      style={{
        backgroundImage: "url(/assets/img/banner-10.jpg)",
        height: "100vh",
      }}
    >
      <div className="Loader" />
      <div className="wrapper">
        <section className="lost-ps-screen-sec">
          <div className="container">
            <div className="lost-ps-screen">
              <a href="/">
                <img
                  alt="logo"
                  className="img-responsive"
                  src="/assets/img/logo.png"
                />
              </a>
              <form onSubmit={handleSubmit}>
                <input
                  className="form-control"
                  placeholder="Enter your Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="btn btn-login"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
