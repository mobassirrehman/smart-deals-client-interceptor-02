import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { AuthContexts } from "../../contexts/AuthContexts";
import Swal from "sweetalert2";

const Login = () => {
  const { signInWithGoogle, signInUser, user } = useContext(AuthContexts);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  //  Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleWithGoogleSignIn = () => {
    setLoading(true);
    signInWithGoogle()
      .then((result) => {
        console.log(" Google Login Success:", result.user);

        const newUser = {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        };

        fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(newUser),
        })
          .then((res) => res.json())
          .then(() => {
            setLoading(false);
            Swal.fire({
              icon: "success",
              title: "Login Successful!",
              timer: 1500,
              showConfirmButton: false,
            });
            navigate(from, { replace: true });
          });
      })
      .catch((error) => {
        console.error("❌ Error:", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.message,
        });
      });
  };

  const handleEmailLogin = (event) => {
    event.preventDefault();
    setLoading(true);

    const email = event.target.email.value;
    const password = event.target.password.value;

    signInUser(email, password)
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.message,
        });
      });
  };

  //  Show loading while checking auth
  if (user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col">
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <div className="card-body">
            <h1 className="text-5xl text-center font-bold">Login</h1>
            <p className="text-center my-4">
              Don't have an account?{" "}
              <Link className="text-blue-600 underline" to="/register">
                Register Now!
              </Link>
            </p>

            <form onSubmit={handleEmailLogin}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered"
                  placeholder="Email"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className="input input-bordered"
                  placeholder="Password"
                  required
                />
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>

            <div className="divider">OR</div>

            <button
              className="btn btn-primary"
              onClick={handleWithGoogleSignIn}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in with Google"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
