import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import { doc, getFirestore,setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyA3aDZob-67S4N5vP4Yyb5vx8Nqvsg_FDQ",
  authDomain: "chat-app-p-57e65.firebaseapp.com",
  projectId: "chat-app-p-57e65",
  storageBucket: "chat-app-p-57e65.appspot.com",
  messagingSenderId: "799963282799",
  appId: "1:799963282799:web:f442341f98b94d63977c9a"
};


const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);
const signup = async (username, email, password) => {
    try {
      const rep = await createUserWithEmailAndPassword(auth, email, password);
      const user = rep.user; // <--- Fix: use rep.user instead of res.user
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        username: username.toLowerCase(),
        email,
        name: "",
        avatar: "",
        bio: "Hey, I am learning",
        lastseen: Date.now()
      });
      await setDoc(doc(db, "chats", user.uid), {
        chatData: []
      });
    } catch (error) {
      console.error(error);
      toast.error(error.code.split('/')[1].split('-').join(' '));
    }
  };
const login=async (email,password)=>{
  try {
    await signInWithEmailAndPassword(auth,email,password)
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(' '));
  }
}
const logout= async()=>{
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(' '));
  }
}

export {signup , login, logout,auth,db}