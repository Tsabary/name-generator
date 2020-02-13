import "./styles.scss";
import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import SingleComment from "../singleComment";
import { AuthContext } from "../../../../../providers/Auth";
import { addComment, removeWord, voteOnWord } from "../../../../../actions";
import InputField from "../../../../formComponents/inputField";

const SingleWord = ({
  savedWord,
  addComment,
  removeWord,
  voteOnWord,
  comments,
  currentProject
}) => {
  const { currentUserProfile } = useContext(AuthContext);
  const [word, setWord] = useState(savedWord);
  const [comment, setComment] = useState("");

  const wordComments = comments.filter(comment => {
    return comment.word === word.title;
  });

  const compare = (a, b) => {
    if (a.timestamp.seconds > b.timestamp.seconds) return 1;
    if (b.timestamp.seconds > a.timestamp.seconds) return -1;

    return 0;
  };

  const renderComments = () => {
    return !!wordComments.length
      ? wordComments.sort(compare).map(comment => {
          return <SingleComment comment={comment} key={comment.id} />;
        })
      : null;
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!!comment.length)
    addComment(
      currentProject.id,
      word.title,
      comment,
      currentUserProfile.uid,
      currentUserProfile.name,
      currentUserProfile.avatar,
      setComment
    );
  };

  const handleVote = vote => {
    voteOnWord(
      word,
      setWord,
      vote,
      currentUserProfile.uid,
      currentProject.team.length
      
    );
  };

  const renderVotes = () => {
    return (
      <>
        {word.score_items[currentUserProfile.uid] === -1 ? (
          <i className="big angle down icon single-word__icon--active"></i>
        ) : (
          <i
            className="big angle down icon single-word__icon"
            onClick={() => handleVote(-1)}
          ></i>
        )}
        <p className="single-word__vote-count">{word.total_score}</p>
        {word.score_items[currentUserProfile.uid] === 1 ? (
          <i className="big angle up icon single-word__icon--active"></i>
        ) : (
          <i
            className="big angle up icon single-word__icon"
            onClick={() => handleVote(1)}
          ></i>
        )}
      </>
    );
  };

  return (
    <div className="single-word">
      <div className="single-word__top">
        <div className="single-word__word">{word.title}</div>

        <a
          rel="noopener noreferrer"
          href={`https://www.namecheap.com/domains/registration/results.aspx?domain=${word.title}`}
          target="_blank"
          className="single-word__cta"
        >
          Check Domain
        </a>

        {renderVotes()}
      </div>

      <form
        onSubmit={handleSubmit}
        className="single-word__comment-form tiny-margin-top"
      >
        <InputField
          placeHolder={"Comment on this name"}
          label={"Add a comment"}
          onChange={setComment}
          value={comment}
        />

        <button className="boxed-button">
          <i className="icon edit"></i> Comment
        </button>
      </form>
      <details>
        <summary>{wordComments.length} comments</summary>
        {!!wordComments.length ? (
          <div className="single-word__comments tiny-margin-top">
            {renderComments()}
          </div>
        ) : null}
      </details>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    comments: state.comments,
    currentProject: state.currentProject
  };
};

export default connect(mapStateToProps, { addComment, removeWord, voteOnWord })(
  SingleWord
);
