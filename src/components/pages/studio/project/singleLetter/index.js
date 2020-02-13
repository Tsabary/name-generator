import "./styles.scss";
import React from "react";
import { connect } from "react-redux";
import { lockLetter, removeLetter } from "../../../../../actions";

const SingleLetter = ({ letter, lockLetter, removeLetter }) => {
  const handleLock = () => {
    lockLetter({ ...letter, locked: !letter.locked })
  };

  const handleRemove = () => {
    console.log("handleRemove");
    removeLetter(letter.position);
  };

  const handleType = newLetter => {
    console.log("handleType");
    lockLetter({ ...letter, letter: newLetter });
  };

  return (
    <div className="letter">
      <div className="letter__action letter__remove" onClick={handleRemove}>
        ✖
      </div>
      <input
        className="letter__input"
        onFocus={event => event.target.select()}
        value={letter.letter.toUpperCase()}
        maxLength="1"
        onChange={e => handleType(e.target.value)}
      />

      <i
        className={
          letter.locked
            ? "icon lock letter__icon letter__action"
            : "icon unlock grey letter__icon letter__action"
        }
        onClick={handleLock}
      />
    </div>
  );
};

export default connect(null, { lockLetter, removeLetter })(SingleLetter);

// class SingleLetter extends React.Component {
//   componentDidMount() {
//     this.inputRef = React.createRef();
//   }

//   handleLock = () => {
//     this.props.letter.locked
//       ? this.props.lockLetter({ ...this.props.letter, locked: false })
//       : this.props.lockLetter({ ...this.props.letter, locked: true });
//   };

//   handleRemove = () => {
//     this.props.removeLetter(this.props.letter.position);
//   };

//   handleType = newLetter => {
//     this.props.lockLetter({ ...this.props.letter, letter: newLetter });
//   };

//   render() {
//     return (
//       <div className="letter">
//         <div
//           className="letter__action letter__remove"
//           onClick={this.handleRemove}
//         >
//           ✖
//         </div>
//         <input
//           className="letter__input"
//           onFocus={event => event.target.select()}
//           value={this.props.letter.letter.toUpperCase()}
//           maxLength="1"
//           onChange={e => this.handleType(e.target.value)}
//         />
//         {this.props.letter.locked ? (
//           <i
//             className="icon lock letter__icon letter__action"
//             onClick={this.handleLock}
//           />
//         ) : (
//           <i
//             className="icon unlock grey letter__icon letter__action"
//             onClick={this.handleLock}
//           />
//         )}
//       </div>
//     );
//   }
// }

// export default connect(null, { lockLetter, removeLetter })(SingleLetter);
