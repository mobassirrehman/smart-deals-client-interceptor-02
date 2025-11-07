import React, { useContext } from "react";
import { Link } from "react-router";
import { AuthContexts } from "../../contexts/AuthContexts";

const Register = () => {
  const { signInWithGoogle } = useContext(AuthContexts);

  const handleWithGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        console.log(result.user);
        const newUser = {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        };

        //create user in the database
        fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(newUser),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("data after creating user in db", data);
          });
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
            <h1 className="text-4xl mx-auto font-bold">Register now!</h1>
            <p className="my-4 mx-auto">
              Already have an account? Please{" "}
              <Link className="text-blue-600 underline" to="/login">
                Login.
              </Link>
            </p>
            <fieldset className="fieldset">
              <label className="label">Name</label>
              <input
                type="text"
                name="name"
                className="input"
                placeholder="Your Name"
              />
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="Email" />

              <label className="label">Photo URL</label>
              <input
                type="text"
                name="photo"
                className="input"
                placeholder="Photo URL"
              />
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="Password" />
              <button className="btn btn-secondary mt-4">Register</button>
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

export default Register;
