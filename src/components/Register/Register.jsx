import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContexts } from "../../contexts/AuthContexts";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const { signInWithGoogle, createUser } = useContext(AuthContexts);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleWithGoogleSignIn = () => {
    setLoading(true);
    signInWithGoogle()
      .then((result) => {
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
              title: "Registration Successful!",
              showConfirmButton: false,
              timer: 1500,
            });
            navigate("/");
          });
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.message,
        });
      });
  };

  const handleEmailRegistration = (e) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const photo = e.target.photo.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password.length < 6) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match",
      });
      return;
    }

    createUser(email, password)
      .then((result) => {
        updateProfile(result.user, {
          displayName: name,
          photoURL: photo || "https://via.placeholder.com/150",
        })
          .then(() => {
            const newUser = {
              name: name,
              email: email,
              photo: photo || "https://via.placeholder.com/150",
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
                  title: "Registration Successful!",
                  showConfirmButton: false,
                  timer: 1500,
                });
                e.target.reset();
                navigate("/");
              });
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.message,
        });
      });
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left lg:ml-8">
          <h1 className="text-5xl font-bold">Register now!</h1>
          <p className="py-6">
            Join SmartDeals today and start buying and selling amazing products
            in your local community.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleEmailRegistration}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered"
                  placeholder="Your Name"
                  required
                />
              </div>

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
                  <span className="label-text">Photo URL</span>
                </label>
                <input
                  type="url"
                  name="photo"
                  className="input input-bordered"
                  placeholder="Photo URL (optional)"
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
                  placeholder="Password (min 6 characters)"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="input input-bordered"
                  placeholder="Confirm Password"
                  required
                />
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
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

            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link className="text-blue-600 underline" to="/login">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;