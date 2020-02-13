import firebase from "../firebase";
import {
  FETCH_PROJECTS,
  FETCH_SINGLE_PROJECT,
  FETCH_WORDS,
  SET_PAGE,
  LOCK_LETTER,
  REMOVE_LETTER,
  ADD_START,
  ADD_END,
  SHUFFLE,
  GENERATE_SET,
  ADD_WORD,
  SET_PROJECT,
  REMOVE_WORD,
  ADD_COMMENT,
  FETCH_COMMENTS,
  FETCH_REPLIES,
  CLASSIFY_WORDS,
  REMOVE_WORD_FROM_BANK,
  ASSIGN_WORD
} from "./types";

const db = firebase.firestore();
const storageRef = firebase.storage().ref();

///////////////////fucking dangorous cleaning actions//////////

export const cleanWords = collection => () => {
  db.collection(collection)
    .get()
    .then(allDocs => {
      allDocs.docs.map(singleDoc => {
        db.collection(collection)
          .doc(singleDoc.data().id)
          .delete();
      });
    });
};

////////// Auth related actions ///////////

export const logIn = (email, password) => () => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.hash = "";
    });
};

export const logOut = () => () => {
  firebase.auth().signOut();
};

export const signUp = (email, password, setSent) => () => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(result => {
      result.user.sendEmailVerification();
      setSent(true);
    });
};

export const resendVerification = () => () => {
  firebase.auth().currentUser.sendEmailVerification();
};

export const providerSignIn = provider => () => {
  var googleProvider = new firebase.auth.GoogleAuthProvider();
  var facebookProvider = new firebase.auth.FacebookAuthProvider();
  switch (provider) {
    case "google":
      firebase.auth().signInWithPopup(googleProvider);
    case "facebook":
      firebase.auth().signInWithPopup(facebookProvider);
  }
};

export const updateProfile = (values, user, imageObj) => () => {
  db.collection("users")
    .doc(user.uid)
    .set(values, { merge: true });
  storageRef.child(`images/user_avatars/${user.uid}`).put(imageObj);
};

//////// data population actions //////////

export const fetchProjects = currentUser => async dispatch => {
  const data = await db
    .collection("projects")
    .where("users", "array-contains", `${currentUser.uid}`)
    .get();

  dispatch({
    type: FETCH_PROJECTS,
    payload: !!data.docs
      ? data.docs.map(doc => {
          return doc.data();
        })
      : []
  });
};

export const fetchSingleProject = (id, setProject) => async dispatch => {
  const data = await db
    .collection("projects")
    .doc(id)
    .get();

  setProject(data.data());

  dispatch({
    type: FETCH_SINGLE_PROJECT,
    payload: !!data.data() ? data.data() : {}
  });

  // if (!!data)
  //   dispatch({
  //     type: FETCH_SINGLE_PROJECT,
  //     payload: data.data()
  //   });
};

export const fetchWords = projectID => async dispatch => {
  const data = await db
    .collection("words")
    .where("project_ID", "==", projectID)
    .orderBy("total_score", "desc")
    .get();

  dispatch({
    type: FETCH_WORDS,
    payload: !!data.docs
      ? data.docs.map(doc => {
          return doc.data();
        })
      : []
  });
};

export const fetchComments = projectID => async dispatch => {
  const data = await db
    .collection("comments")
    .where("project_ID", "==", projectID)
    .get();

  dispatch({
    type: FETCH_COMMENTS,
    payload: !!data.docs
      ? data.docs.map(doc => {
          return doc.data();
        })
      : []
  });
};

export const fetchReplies = projectID => async dispatch => {
  const data = await db
    .collection("replies")
    .where("project_ID", "==", projectID)
    .get();

  dispatch({
    type: FETCH_REPLIES,
    payload: !!data.docs
      ? data.docs.map(doc => {
          return doc.data();
        })
      : []
  });
};

////////// Data creation/update methods //////////

export const newProject = values => () => {
  const newDoc = db.collection("projects").doc();

  newDoc.set({ ...values, id: newDoc.id });
};

export const addMember = (email, project_ID) => async () => {
  const data = await db
    .collection("users")
    .where("email", "==", email)
    .get();
  const newUser = data.docs[0].data();

  db.collection("projects")
    .doc(project_ID)
    .set(
      {
        users: firebase.firestore.FieldValue.arrayUnion(newUser.uid),
        team: firebase.firestore.FieldValue.arrayUnion({
          uid: newUser.uid,
          name: newUser.name,
          avatar: newUser.avatar
        })
      },
      { merge: true }
    );
};

///////////// internal actions ///////////

export const setCurrentPage = value => {
  return {
    type: SET_PAGE,
    payload: value
  };
};

export const setProject = project => {
  // fetchWords(project.id);

  return {
    type: SET_PROJECT,
    payload: project
  };
};

//////// Word related actions////////

export const generateSet = currentWord => {
  return {
    type: GENERATE_SET,
    payload: currentWord
  };
};

export const classifyWords = set => {
  return {
    type: CLASSIFY_WORDS,
    payload: set
  };
};

export const removeWordFromBank = word => {
  return {
    type: REMOVE_WORD_FROM_BANK,
    payload: word
  };
};

export const lockLetter = letter => {
  return {
    type: LOCK_LETTER,
    payload: letter
  };
};

export const removeLetter = letterPosition => {
  return {
    type: REMOVE_LETTER,
    payload: letterPosition
  };
};

export const assignWord = bank => {
  return {
    type: ASSIGN_WORD,
    payload: bank
  };
};

// export const shuffleLetters = bank => {
//   return {
//     type: SHUFFLE,
//     payload: bank
//   };
// };

export const addLetterStart = () => {
  return {
    type: ADD_START
  };
};

export const addLetterEnd = () => {
  return {
    type: ADD_END
  };
};

export const addWord = (word, projectId) => dispatch => {
  const newDoc = db.collection("words").doc();
  const newWord = {
    id: newDoc.id,
    project_ID: `${projectId}`,
    score_items: [],
    title: word,
    total_score: 0
  };

  newDoc.set(newWord).then(() => {
    dispatch({
      type: ADD_WORD,
      payload: newWord
    });
  });
};

export const removeWord = word => {
  return {
    type: REMOVE_WORD,
    payload: word
  };
};

export const addWordForML = (
  word,
  timeToAction,
  output,
  project,
  userUID,
  timestamp
) => () => {
  var newPostKey = firebase
    .database()
    .ref()
    .child("words")
    .push().key;

  firebase
    .database()
    .ref("words/" + newPostKey)
    .set({
      word,
      length: word.length,
      time_to_action: timeToAction,
      output: output,
      lang: project.lang,
      country: project.country,
      user: userUID,
      timestamp: Date.now(),
      timezone_offset: new Date().getTimezoneOffset()
    });
};

///// Comments/votes related actions////

export const voteOnWord = (word, setWord, vote, profileUid, teamSize) => () => {
  const newScoreItems = word.score_items; //map of all votes

  const userVote = !!newScoreItems[profileUid]
    ? newScoreItems[profileUid] + vote
    : vote;

  newScoreItems[profileUid] = userVote; // we now set the final vote of the user to the map
  const totalScore = Object.values(newScoreItems).reduce((a, b) => a + b, 0);

  db.collection("words")
    .doc(word.id)
    .set(
      {
        score_items: { [profileUid]: userVote },
        total_score: totalScore
      },
      { merge: true }
    )
    .then(() => {
      setWord({
        ...word,
        score_items: newScoreItems,
        total_score: totalScore
      });
    });
};

export const addComment = (
  projectId,
  word,
  comment,
  profileUid,
  profileName,
  profileImage,
  clearForm
) => dispatch => {
  const newDoc = db.collection("comments").doc();

  const docObject = {
    id: newDoc.id,
    project_ID: projectId,
    word: word,
    content: comment,
    author_uid: profileUid,
    author_name: profileName,
    author_avatar: profileImage,
    timestamp: new Date()
  };
  newDoc.set(docObject).then(() => {
    clearForm("");
    dispatch({
      type: ADD_COMMENT,
      payload: docObject
    });
  });
};

export const addReply = (
  projectId,
  word,
  reply,
  commentId,
  profileUid,
  profileName,
  profileImage,
  clearForm
) => dispatch => {
  const newDoc = db.collection("replies").doc();

  const docObject = {
    id: newDoc.id,
    project_ID: projectId,
    word: word,
    comment_ID: commentId,
    content: reply,
    author_uid: profileUid,
    author_name: profileName,
    author_avatar: profileImage,
    timestamp: new Date()
  };
  newDoc.set(docObject).then(() => {
    clearForm("");
    dispatch({
      type: ADD_COMMENT,
      payload: docObject
    });
  });
};

// export const fetchAllItems = () => async dispatch => {
//   const data = await db.collection("items").get();

//   if (data.docs !== undefined) {
//     const docsData = [];
//     data.docs.map(doc => {
//       docsData.push(doc.data());
//     });

//     dispatch({
//       type: FETCH_GROUP,
//       payload: docsData
//     });
//   } else {
//     dispatch({
//       type: FETCH_GROUP,
//       payload: []
//     });
//   }
// };

// export const fetchSingleItem = (id, setEvent) => async dispatch => {
//   const data = await db
//     .collection("items")
//     .doc(id)
//     .get();

//   setEvent(data.data());

//   if (!!data) {
//     dispatch({
//       type: FETCH_SINGLE,
//       payload: data.data()
//     });
//   }
// };

// export const fetchAllUsers = () => async dispatch => {
//   const data = await db.collection("users").get();

//   if (data.docs !== undefined) {
//     const docsData = [];
//     data.docs.map(doc => {
//       docsData.push(doc.data());
//     });

//     dispatch({
//       type: FETCH_USERS,
//       payload: docsData
//     });
//   } else {
//     dispatch({
//       type: FETCH_USERS,
//       payload: []
//     });
//   }
// };

// export const fetchSingleUser = (id, setEvent) => async dispatch => {
//   const data = await db
//     .collection("users")
//     .doc(id)
//     .get();

//   // setEvent(data.data());

//   if (!!data) {
//     dispatch({
//       type: FETCH_SINGLE_USER,
//       payload: data.data()
//     });
//   }
// };

// export const newItem = (values, image, setValues) => () => {
//   const newDoc = db.collection("items").doc();

//   newDoc
//     .set({ ...values, id: newDoc.id })
//     .then(() => {
//       storageRef
//         .child(`images/items/${newDoc.id}`)
//         .put(image)
//         .then(result => {
//           console.log(result);
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     })
//     // .then(() => {
//     //   setValues({});
//     // })
//     .catch(err => {
//       console.log(err);
//     });
// };

// export const updateItem = (values, image, setValues) => () => {
//   console.log(image);
//   db.collection("items")
//     .doc(values.id)
//     .set(values)
//     .then(() => {
//       if (!!image)
//         storageRef
//           .child(`images/items/${values.id}`)
//           .put(image)
//           .then(result => {
//             console.log(result);
//           })
//           .catch(err => {
//             console.log(err);
//           });
//     })
//     // .then(() => {
//     //   setValues({});
//     // })
//     .catch(err => {
//       console.log(err);
//     });
// };
