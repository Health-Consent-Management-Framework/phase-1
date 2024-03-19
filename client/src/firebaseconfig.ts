// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCOYQ19Pmty1WnINrokqNUdmSURJRpLUlk",
//   authDomain: "majorproject-d974d.firebaseapp.com",
//   projectId: "majorproject-d974d",
//   storageBucket: "majorproject-d974d.appspot.com",
//   messagingSenderId: "1087188747137",
//   appId: "1:1087188747137:web:abd2c9b9c20dcdd3021e80"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export default app;



import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


// const firebaseConfig = {
//   apiKey: "AIzaSyCmgLkoHKcKlSOnaJREpvb1mYrjBBIpDpw",
//   authDomain: "major-925d7.firebaseapp.com",
//   projectId: "major-925d7",
//   storageBucket: "major-925d7.appspot.com",
//   messagingSenderId: "968676347202",
//   appId: "1:968676347202:web:bfd2c2f9f0e2efc7f6ccdb"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCOYQ19Pmty1WnINrokqNUdmSURJRpLUlk",
  authDomain: "majorproject-d974d.firebaseapp.com",
  projectId: "majorproject-d974d",
  storageBucket: "majorproject-d974d.appspot.com",
  messagingSenderId: "1087188747137",
  appId: "1:1087188747137:web:abd2c9b9c20dcdd3021e80"
}

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);