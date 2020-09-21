import React, { useContext } from 'react'
//to prevent page from refreshing as we have used anchor tag...use links to solve this issue
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'

//functional component
const NavBar = () => {
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    
    const renderList = () => {
        if (state) {
            return [
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/create">Create Post</Link></li>,
                <li><Link to="/myfollowingpost">My Following Post</Link></li>,
                <li>
                    <button className="btn waves-effect waves-light #d32f2f red darken-2"
                     onClick={()=>{
                         localStorage.clear()
                         dispatch({type:"CLEAR"})
                         history.push('/signin')
                     }}>Logout
    
    </button>
                    </li>
            ]
        } else {
            return [
                <li><Link to="/signin">Login</Link></li>,
                <li><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar