import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editExperience, getCurrentProfile } from "../../actions/profile";
import TextField from "@material-ui/core/TextField";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import moment from "moment";
import { Link } from "react-router-dom";

const EditExperience = ({
  profile: { profile, loading },
  editExperience,
  getCurrentProfile,
  history,
  match
}) => {
  const [experience, setExperience] = useState({
    id: "",
    company: "",
    title: "",
    location: "",
    from: "",
    to: "",
    current: false,
    description: ""
  });

  const [toDateDisabled, toggleDisabled] = useState(false);

  useEffect(() => {
    getCurrentProfile();

    for (let i = 0; i < profile.experience.length; i++) {
      if (profile.experience[i]._id === match.params.id) {
        experience.id = profile.experience[i]._id;
        experience.company = profile.experience[i].company;
        experience.title = profile.experience[i].title;
        experience.location = profile.experience[i].location;
        experience.from = moment(profile.experience[i].from).format(
          "YYYY-MM-DD"
        );
        experience.to = moment(profile.experience[i].to).format("YYYY-MM-DD");
        experience.current = profile.experience[i].current;
        experience.description = profile.experience[i].description;

        setExperience(experience);
      }
    }
  }, [loading, getCurrentProfile]);

  const {
    company,
    title,
    location,
    from,
    to,
    current,
    description
  } = experience;

  const onChange = e => {
    setExperience({ ...experience, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    editExperience(experience, experience.id, history);
  };

  return (
    <Fragment>
      <div>
        <h1 className="large text-primary">Update Your Experience</h1>
        <p className="lead">
          <i className="fas fa-user" />{" "}
          <span style={{ font: "inherit" }}>
            Let's get some information to make your profile stand out
          </span>
        </p>
        <form className="form" onSubmit={e => onSubmit(e)}>
          <div className="form-group">
            <TextField
              label="company"
              value={company}
              name="company"
              onChange={e => onChange(e)}
            />
          </div>
          <div className="form-group">
            <TextField
              label="title"
              value={title}
              name="title"
              onChange={e => onChange(e)}
            />
          </div>
          <div className="form-group">
            <TextField
              label="location"
              value={location}
              name="location"
              onChange={e => onChange(e)}
            />
          </div>
          <div className="form-group">
            {/* date type */}
            <TextField
              InputLabelProps={{ shrink: true }}
              label="from"
              type="date"
              value={from}
              name="from"
              onChange={e => onChange(e)}
            />
          </div>
          <div className="form-group">
            {/* checkbox type */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={current}
                  onChange={e => {
                    setExperience({
                      ...experience,
                      current: !current,
                      to: ""
                    });
                    toggleDisabled(!toDateDisabled);
                  }}
                  value={current}
                  name="current"
                />
              }
              label="Current"
            />
          </div>
          <div className="form-group">
            {/* date type */}
            <input
              // InputLabelProps={{ shrink: true }}
              // label="to"
              type="date"
              value={to}
              name="to"
              onChange={e => onChange(e)}
              disabled={current ? "Now" : ""}
            />
          </div>
          <div className="form-group">
            {/* textarea type*/}
            <textarea
              aria-label="Description"
              rows={3}
              placeholder="Description"
              label="description"
              value={description}
              name="description"
              onChange={e => onChange(e)}
            />
          </div>
          <input type="submit" className="btn btn-primary my-1" />
          <Link to="/dashboard" className="btn btn-light my-1">
            Go Back
          </Link>
        </form>
      </div>
    </Fragment>
  );
};

EditExperience.propTypes = {
  editExperience: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { editExperience, getCurrentProfile }
)(EditExperience);
