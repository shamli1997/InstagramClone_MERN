import React,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Reset = () => {
   
    const history = useHistory()
    
   
    const[email,setEmail]=useState("")
    const PostData=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Invalid Email",classes:"#d32f2f red darken-2"})
            return
        }
        fetch("/reset-password",{
            method:"post",
            headers:{
                "content-Type":"application/json"
            },
            body:JSON.stringify({
                
             
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            //console.log(data)
            if(data.error){
                M.toast({html:data.error,classes:"#d32f2f red darken-2"})
            }
            else{
               
                
                M.toast({html:data.message,classes:"#388e3c green darken-2"})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
        
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                
                <button className="btn waves-effect waves-light #42a5f5 blue darken-1" onClick={()=>PostData()}>Reset Password
    
                </button>
              

            </div>

        </div>
    )
}

export default Reset