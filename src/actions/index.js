import firebase from "../firebase";
import {
  FETCH_PROJECTS,
  NEW_PROJECT,
  FETCH_SINGLE_PROJECT,
  FETCH_WORDS,
  SET_PAGE,
  // LOCK_LETTER,
  REMOVE_LETTER,
  ADD_START,
  ADD_END,
  GENERATE_SET,
  ADD_WORD,
  SET_PROJECT,
  REMOVE_WORD,
  ADD_COMMENT,
  ADD_REPLY,
  FETCH_COMMENTS,
  FETCH_REPLIES,
  CLASSIFY_WORDS,
  REMOVE_WORD_FROM_BANK,
  ASSIGN_WORD,
  CHANGE_LETTER
} from "./types";

const db = firebase.firestore();
const storageRef = firebase.storage().ref();

///////////////////fucking dangorous cleaning actions//////////

export const cleanWords = collection => () => {
  console.log("cleaning");
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
      window.location.hash = "#";
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

export const updateProfile = (values, user, imageObj, setSubmitting) => () => {
  db.collection("users")
    .doc(user.uid)
    .set(values, { merge: true })
    .then(() => {
      if (!!imageObj) {
        storageRef
          .child(`images/user_avatars/${user.uid}`)
          .put(imageObj)
          .then(() => {
            setSubmitting(false);
            window.location.hash = "#";
          });
      } else {
        setSubmitting(false);
        window.location.hash = "#";
      }
    });
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

export const newProject = (values, setSubmitting) => dispatch => {
  const newDoc = db.collection("projects").doc();

  newDoc.set({ ...values, id: newDoc.id }).then(() => {
    window.location.hash = "#";
    setSubmitting(false);
    dispatch({
      type: NEW_PROJECT,
      payload: values
    });
  });
};

export const addMember = (email, project_ID, setFormStatus) => async () => {
  const data = await db
    .collection("users")
    .where("email", "==", email)
    .get();

  data.empty
    ? setFormStatus(
        "We couldn't find a user with a matching email. Please make sure other members create accounts before being added."
      )
    : db
        .collection("projects")
        .doc(project_ID)
        .set(
          {
            users: firebase.firestore.FieldValue.arrayUnion(
              data.docs[0].data().uid
            ),
            team: firebase.firestore.FieldValue.arrayUnion({
              uid: data.docs[0].data().uid,
              name: data.docs[0].data().name,
              avatar: data.docs[0].data().avatar
            })
          },
          { merge: true }
        )
        .then(() => {
          setFormStatus("User added! Add more members to your team.");
        });
};

///////////// internal actions ///////////

export const setCurrentPage = value => {
  return {
    type: SET_PAGE,
    payload: value
  };
};

export const setProject = project => {
  return {
    type: SET_PROJECT,
    payload: project
  };
};

//////// Word related actions////////

export const generateSet = currentWord => {
  // console.log("generating set");
  return {
    type: GENERATE_SET,
    payload: currentWord
  };
};

export const classifyWords = set => {
  // console.log("classifyWords");

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

export const changeLetter = letter => {
  // console.log("letter changing ");
  return {
    type: CHANGE_LETTER,
    payload: letter
  };
};

export const removeLetter = letterPosition => {
  // console.log("remove called from action");

  return {
    type: REMOVE_LETTER,
    payload: letterPosition
  };
};

export const assignWord = (
  bank,
  qualityBalance,
  setQualityBalance
) => dispatch => {
  // const qualityAverage =
  //   qualityBalance.reduce((a, b) => a + b, 0) / qualityBalance.length;
  // console.log(qualityAverage);

  const wordCount =
    qualityBalance.good + qualityBalance.average + qualityBalance.bad;

  console.log(qualityBalance);
  console.log(wordCount);

  switch (true) {
    case qualityBalance.good / wordCount < 0.8:
      setQualityBalance({ ...qualityBalance, good: qualityBalance.good + 1 });

      dispatch({
        type: ASSIGN_WORD,
        payload: bank.good
      });
      break;

    case qualityBalance.average / wordCount < 0.15:
      setQualityBalance({
        ...qualityBalance,
        average: qualityBalance.average + 1
      });

      dispatch({
        type: ASSIGN_WORD,
        payload: bank.average
      });
      break;

    default:
      setQualityBalance({ ...qualityBalance, bad: qualityBalance.bad + 1 });

      dispatch({
        type: ASSIGN_WORD,
        payload: bank.bad
      });
      break;
  }

  // switch (true) {
  //   case qualityAverage > 1.5:
  //     setQualityBalance([...qualityBalance, 1]);

  //     dispatch({
  //       type: ASSIGN_WORD,
  //       payload: bank.good
  //     });
  //     break;

  //   case qualityAverage > 1.3:
  //     setQualityBalance([...qualityBalance, 2]);

  //     dispatch({
  //       type: ASSIGN_WORD,
  //       payload: bank.average
  //     });
  //     break;

  //   default:
  //     setQualityBalance([...qualityBalance, 3]);

  //     dispatch({
  //       type: ASSIGN_WORD,
  //       payload: bank.bad
  //     });
  //     break;

  //   // case qualityAverage > 1.2:
  //   //   setQualityBalance([...qualityBalance, 3]);

  //   //   dispatch({
  //   //     type: ASSIGN_WORD,
  //   //     payload: bank.bad
  //   //   });
  //   //   break;
  // }
};

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
      type: ADD_REPLY,
      payload: docObject
    });
  });
};
