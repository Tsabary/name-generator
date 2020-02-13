import "./styles.scss";
import React, { useState, useContext } from "react";
import Moment from "react-moment";


const SingleReply = ({ reply }) => {

  return (
    <div className="comment">
      <div className="round-image__container round-image__container--small">
        <img
          className="round-image"
          src={
            reply.author_avatar ||
            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
          }
        />
      </div>
      <div>
        <div className="comment__body">
          <div className="comment__title">
            <p className="comment__author bold-700">{reply.author_name}</p>
            <Moment className="comment__date" fromNow>
              {!!reply.timestamp.seconds
                ? reply.timestamp.seconds * 1000
                : Date.now()}
            </Moment>
          </div>
          <p className="comment__content">{reply.content}</p>
        </div>
    
      </div>
    </div>
  );
};



export default SingleReply;
