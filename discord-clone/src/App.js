import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import "./Chat.css";
import { selectUser } from "./features/userSlice";
import Login from "./Login";
import { auth } from "./firebase";
import { login, logout, selectRecentChannelId, selectRecentChannelName, setRecentChannelInfo } from "./features/userSlice";
import { setChannelInfo } from "./features/appSlice";

function App() {    
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const recentChannelId = useSelector(selectRecentChannelId);
  const recentChannelName = useSelector(selectRecentChannelName);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // the user is logged in
        dispatch(
          login({
            uid: authUser.uid,
            photo: authUser.photoURL,
            email: authUser.email,
            displayName: authUser.displayName,
          })
        );

        if (recentChannelId && recentChannelName) {
          dispatch(setChannelInfo({ channelId: recentChannelId, channelName: recentChannelName }));
        }
      } else {
        // the user is logged out
        dispatch(logout());
      }
    });
  }, [dispatch, recentChannelId, recentChannelName]);

     return (
      <div className="app">
        {user ? (
          <>
            <Sidebar />
            <Chat />
          </>
        ) : (
          <Login />
        )}
      </div>
  );
}
export default App;