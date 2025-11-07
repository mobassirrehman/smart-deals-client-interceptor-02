import React, { useContext } from "react";
import { Link } from "react-router";
import { AuthContexts } from "../../contexts/AuthContexts";

const Login = () => {
      const { signInWithGoogle } = useContext(AuthContexts);
    
      const handleWithGoogleSignIn = () => {
        signInWithGoogle()
          .then((result) => {
            console.log(result.user);
          })
          .catch((error) => {
            console.log(error);
          });
      };
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left"></div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <h1 className="text-5xl mx-auto font-bold">Login!</h1>
            <p className="my-4">
              Don't have an account? {""}
              <Link className="text-blue-600 underline" to="/register">
                Register Now!
              </Link>
            </p>
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="Email" />

              <label className="label">Password</label>
              <input type="password" className="input" placeholder="Password" />
              <div>
                <a className="link link-hover">Forgot password?</a>
              </div>
              <button className="btn btn-secondary mt-4">Login</button>
              <button
                className="btn btn-primary mt-4"
                onClick={handleWithGoogleSignIn}
              >
                SignIN with Google
              </button>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
