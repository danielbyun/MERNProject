import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  // [state, setState]
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  const { name, email, password, password2 } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      console.error("Passwords do not match.");
    } else {
      console.log("success");
      // const newUser = {
      //   name,
      //   email,
      //   password
      // };

      // try {
      //   // headers
      //   const config = {
      //     headers: {
      //       "Content-Type": "application/json"
      //     }
      //   };

      //   // body to send
      //   const body = JSON.stringify(newUser);

      //   // API endpoint, data, header
      //   const res = await axios.post(`/api/users`, body, config);

      //   console.log(res.data);
      // } catch (err) {
      //   console.error(err.res.data);
      // }
    }
  };

  return (
    <Fragment>
      <section className="container">
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead">
          <i className="fas fa-user" /> Create Your Account
        </p>
        <form className="form" onSubmit={e => onSubmit(e)}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              required
              value={name}
              onChange={e => onChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={e => onChange(e)}
              required
            />
            <small className="form-text">
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              minLength={6}
              value={password}
              onChange={e => onChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              minLength={6}
              value={password2}
              onChange={e => onChange(e)}
            />
          </div>
          <input
            type="submit"
            className="btn btn-primary"
            defaultValue="Register"
          />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </section>
    </Fragment>
  );
};

export default Register;
