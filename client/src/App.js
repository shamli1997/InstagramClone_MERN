import React, { useEffect, createContext, useReducer, useContext } from 'react';
import NavBar from './components/Navbar'
import './App.css'
import { BrowserRouter, Router, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import { reducer, initialstate } from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import SubscribeUserPost from './components/screens/SubscribeUserPost'
import Reset from './components/screens/Reset'
import Newpassword from './components/screens/Newpassword'


export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    //convert into obj from str
    const user = JSON.parse(localStorage.getItem("user"))

    if (user) {
      dispatch({ type: "USER", payload: user })
      //history.push('/')
    } else {
      if (!history.location.pathname.startsWith('/reset'))
        history.push('/signin')
    }
  }, [])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>

      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribeUserPost />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <Newpassword />
      </Route>
    </Switch>

  )
}

//can't access history in APP but can access in other components as we've surrounded it with browserRouter
//
function App() {
  const [state, dispatch] = useReducer(reducer, initialstate)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter >
    </UserContext.Provider>

  );
}

export default App;
