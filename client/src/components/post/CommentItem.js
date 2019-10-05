import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { deleteComment } from "../../actions/post";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, user, date },
  auth,
  deleteComment
}) => {
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img className="round-img" src={avatar} alt />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          Posted on <Moment date={date} format="MM/DD/YYYY" fromNow />
        </p>
        {!auth.loading && user === auth.user._id && (
          <button
            className="btn btn-danger"
            onClick={e => deleteComment(postId, _id)}
            type="button"
          >
            <i className="fas fa-times"></i> Delete
          </button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

CommentItem.propTypes = {
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { deleteComment }
)(CommentItem);
