import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteEducation } from "../../actions/profile";
import EditEducation from "./EditEducation";

const Education = ({ education, deleteEducation }) => {
  const [educationToggle, setEducationToggle] = useState(false);

  const handleClick = event => {
    setEducationToggle(!educationToggle);
  };

  const educations = education
    .sort(function(a, b) {
      return +new Date(a.from) - +new Date(b.from);
    })
    .reverse()
    .map(edu => (
      <tr key={edu._id}>
        <td>{edu.school}</td>
        <td className="hide-sm">{edu.degree}</td>
        <td>
          <Moment format="MM/DD/YYYY">{edu.from}</Moment> -{" "}
          {edu.to === null ? (
            " Now"
          ) : (
            <Moment format="MM/DD/YYYY">{edu.to}</Moment>
          )}
        </td>
        <td>
          <Link to={`/edit-education/${edu._id}`} className="btn btn-secondary">
            Edit
          </Link>
          <button
            onClick={() => deleteEducation(edu._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
      {educationToggle && (
        <Fragment>
          <EditEducation />
        </Fragment>
      )}
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteEducation }
)(Education);
