import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editEducation, getCurrentProfile } from "../../actions/profile";
import TextField from "@material-ui/core/TextField";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import moment from "moment";
import { Link } from "react-router-dom";

const EditEducation = ({
  profile: { profile, loading },
  editEducation,
  getCurrentProfile,
  history,
  match
}) => {
  const [education, setEducation] = useState({
    school: "",
    degree: "",
    fieldofstudy: "",
    from: "",
    to: "",
    current: false,
    description: "",
    disabled: false
  });

  const [toDateDisabled, toggleDisabled] = useState(false);

  useEffect(() => {
    getCurrentProfile();

    for (let i = 0; i < profile.education.length; i++) {
      if (profile.education[i]._id === match.params.id) {
        education.id = profile.education[i]._id;
        education.school = profile.education[i].school;
        education.degree = profile.education[i].degree;
        education.fieldofstudy = profile.education[i].fieldofstudy;
        education.from = moment(profile.education[i].from).format("YYYY-MM-DD");
        education.to = moment(profile.education[i].to).format("YYYY-MM-DD");
        education.current = profile.education[i].current;
        education.description = profile.education[i].description;

        setEducation(education);
      }
    }
  }, [loading, getCurrentProfile]);

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = education;

  const onChange = e =>
    setEducation({ ...education, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    editEducation(education, education.id, history);
  };

  return (
    <Fragment>
      <div>
        <h1 className="large text-primary">Update Your Education</h1>
        <p className="lead">
          <i className="fas fa-user" />{" "}
          <span style={{ font: "inherit" }}>
            Let's get some information to make your profile stand out
          </span>
        </p>
        <form className="form" onSubmit={e => onSubmit(e)}>
          <div className="form-group">
            <TextField
              label="school"
              value={school}
              name="school"
              onChange={e => onChange(e)}
            />
          </div>
          <div className="form-group">
            <TextField
              label="degree"
              value={degree}
              name="degree"
              onChange={e => onChange(e)}
            />
          </div>
          <div className="form-group">
            <TextField
              label="fieldofstudy"
              value={fieldofstudy}
              name="fieldofstudy"
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
                    setEducation({ ...education, current: !current, to: "" });
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
            <TextField
              InputLabelProps={{ shrink: true }}
              label="to"
              type="date"
              value={to}
              name="to"
              onChange={e => onChange(e)}
              disabled={current ? "disabled" : ""}
            />
          </div>
          <div className="form-group">
            {/* textarea type*/}
            <TextField
              aria-label="Description"
              rows={3}
              placeholder="Description"
              label="description"
              value={description}
              name="description"
              onChange={e => onChange(e)}
            />
          </div>
          <input type="submit" className="btn btn-primary my-1 submit" />
          <Link to="/dashboard" className="btn btn-light my-1">
            Go Back
          </Link>
        </form>
      </div>
    </Fragment>
  );
};

EditEducation.propTypes = {
  editEducation: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { editEducation, getCurrentProfile }
)(EditEducation);
