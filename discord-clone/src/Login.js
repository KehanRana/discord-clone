import React from 'react'
import "./Login.css";
import { Button } from "@material-ui/core";
import db, { auth, provider } from "./firebase";

function Login() {
    const signIn = () => {
        //do clever stuff with loginnn
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                createUserInFireStore(user);
            })
            .catch((error) => alert(error.message));
    };

    const createUserInFireStore = async (user) => {
        try {
            const userRef = db.collection("users").doc(user.uid);
            const doc = await userRef.get();

            if (!doc.exists) {
                await userRef.set({
                    displayName: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                });
                console.log("User document created successfully.");
                
            } else {
                console.log("User document already exists.");
                console.log("PFP", user.photoURL);
            }
        } catch (error) {
            console.error("Error creating user document: ", error);
        }
    };

  return (
    <div className='login'>

        <div className='login__logo'>
            <img src="https://1000logos.net/wp-content/uploads/2021/06/Discord-logo.png" alt=""/>
        </div>

        <Button onClick={signIn}>
            Sign in
        </Button>
    </div>
  );
}

export default Login