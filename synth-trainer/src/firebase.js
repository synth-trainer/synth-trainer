import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDaVxaWeNQ8drV4aoG1igtrZWPRb9Dk5p0",
  authDomain: "synth-trainer.firebaseapp.com",
  databaseURL: "https://synth-trainer.firebaseio.com",
  projectId: "synth-trainer",
  storageBucket: "synth-trainer.appspot.com",
  messagingSenderId: "278946042578",
  appId: "1:278946042578:web:6e1e15e3cbdda35296930b",
  measurementId: "G-VZJ76FEXHN",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const storageRef = storage.ref();

// Configure FirebaseUI.
export const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  signInSuccessUrl: "/profilePage",
};

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope("email");

export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

export const signOut = () => {
  auth.signOut();
};

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    const inProgressModules = [];
    const completedModules = [];
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        inProgressModules,
        completedModules,
        ...additionalData,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async (uid) => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data(),
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

export const generateUsernameDocument = async (user, displayName) => {
  if (!user) return;
  const usernameRef = firestore.doc(`usernames/${displayName}`);
  const snapshot = await usernameRef.get();
  if (!snapshot.exists) {
    const { uid } = user;
    try {
      await usernameRef.set({
        uid,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUsernameDocument(user.displayName);
};

const getUsernameDocument = async (displayName) => {
  if (!displayName) return null;
  try {
    const userDocument = await firestore.doc(`usernames/${displayName}`).get();
    return {
      displayName,
      ...userDocument.data(),
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

export const changeEmail = async (uid, email) => {
  if (!uid) return;
  const userRef = firestore.doc(`users/${uid}`);
  const snapshot = await userRef.get();
  if (snapshot.exists) {
    try {
      await userRef.update({
        email: email,
      });
    } catch (error) {
      console.error(error);
    }
  }
};

export const changeDisplayName = async (uid, newDisplayName) => {
  if (!uid || !newDisplayName) return;
  const userRef = firestore.doc(`users/${uid}`);
  const snapshot = await userRef.get();
  if (snapshot.exists) {
    try {
      await userRef.update({
        displayName: newDisplayName,
      });
    } catch (error) {
      console.error(error);
    }
  }
};

export const changeUserEmail = async (newEmail) => {
  try {
    await auth.currentUser.updateEmail(newEmail);
  } catch (error) {
    return error.code;
  }
};

export const changeProfilePic = async (imageUrl) => {
  if (!imageUrl) return;
  const userRef = firestore.doc(`users/${auth.currentUser.uid}`);
  const snapshot = await userRef.get();
  if (snapshot.exists) {
    try {
      await userRef.update({
        photoURL: imageUrl,
      });
    } catch (error) {
      console.error(error);
    }
  }
};

export const addInProgressModules = async (user, currentModule) => {
  const userRef = firestore.doc(`users/${auth.currentUser.uid}`);
  const snapshot = await userRef.get();
  if (snapshot.exists) {
    try {
      const currentInProgressModules = snapshot.data().inProgressModules;
      const newModule = setDateAccessedModule(
        currentInProgressModules,
        currentModule
      );
      if (newModule[0] === 1) {
        const index = currentInProgressModules
          .map((module) => {
            return module.name;
          })
          .indexOf(currentModule);
        currentInProgressModules.splice(index, 1);
      }
      currentInProgressModules.push(newModule[1]);
      await userRef.update({
        inProgressModules: currentInProgressModules,
      });
    } catch (error) {
      console.error(error);
    }
  }
};

const setDateAccessedModule = (currentInProgressModules, currentModule) => {
  const date = new Date();
  let currentModuleInstance = currentInProgressModules.find(
    (module) => module.name === currentModule
  );
  if (currentModuleInstance === undefined) {
    return [0, { name: currentModule, firstAccess: date, recentAccess: date }];
  } else {
    currentModuleInstance.recentAccess = date;
    return [1, currentModuleInstance];
  }
};

const setScoreModule = (currentFinishedModules, currentModule, score) => {
  const date = new Date();
  let currentModuleInstance = currentFinishedModules.find(
    (module) => module.name === currentModule
  );
  if (currentModuleInstance === undefined) {
    return [0, { name: currentModule, score: score, dateCompleted: date }];
  } else if(currentModuleInstance.score < score) {
    currentModuleInstance.score = score;
    currentModuleInstance.dateCompleted = date;
    return [1, currentModuleInstance];
  }

}

export const removeInProgressModule = async (user, module) => {
  const userRef = firestore.doc(`users/${auth.currentUser.uid}`);
  const snapshot = await userRef.get();
  if (snapshot.exists) {
    try {
      const currentInProgressModules = snapshot.data().inProgressModules;
      const index = currentInProgressModules
        .map((module) => {
          return module.name;
        })
        .indexOf(module);
      if (index > -1) {
        currentInProgressModules.splice(index, 1);
        userRef.update({
          inProgressModules: currentInProgressModules,
        });
      }
      return currentInProgressModules;
    } catch (error) {
      console.error(error);
    }
  }
};

export const getInProgressModules = async (user) => {
  const userRef = firestore.doc(`users/${auth.currentUser.uid}`);
  const snapshot = await userRef.get();
  if (snapshot.exists) {
    try {
      const result = snapshot.data().inProgressModules;
      return result;
    } catch (error) {
      console.error(error);
    }
  }
};

export const getModuleRef = async (module) => {
  const modules = firestore.doc(`modules/${module}`);
  const snapshot = await modules.get();
  if (snapshot.exists) {
    return snapshot.data();
  }
};

export const getAllModules = async () => {
  const modules = firestore.collection("modules");
  const snapshot = await modules.get();
  if (!snapshot.empty) {
    return snapshot.docs.map((doc) => doc.data());
  }
};


export const addCompletedModules = async (currentModule, score) => {
  const userRef = firestore.doc(`users/${auth.currentUser.uid}`);
  const snapshot = await userRef.get();
  if (snapshot.exists) {
    try {
      const currentCompletedModules = snapshot.data().completedModules;
      const newModule = setScoreModule(
        currentCompletedModule,
        currentModule,
        score
      );
      if (newModule[0] === 1) {
        const index = currentCompletedModules
          .map((module) => {
            return module.name;
          })
          .indexOf(currentModule);
          currentCompletedModules.splice(index, 1);
      }
      currentCompletedModules.push(newModule[1]);
      await userRef.update({
        completedModules: currentCompletedModules,
      });
    } catch (error) {
      console.error(error);
    }
  }
};
