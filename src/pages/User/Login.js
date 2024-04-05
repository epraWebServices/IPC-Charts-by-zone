import React, { useContext, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Image } from "primereact/image";
import { UserService } from '../../service/UserService';
import { Toast } from 'primereact/toast';
import AuthContext from '../../store/auth/auth-context';

import {useHistory } from 'react-router-dom';
import './login.css';
import { Input, InputGroup } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';

const Login = (props) => {

    const history = useHistory();
    const authCtx = useContext(AuthContext);
    const toastBR = useRef(null);
    const userNameRef = useRef();
    const [password, setPassword] = useState('');
    const [visible, setVisible] = React.useState(false);
    const loginSubmitHandler = (event) => {
        event.preventDefault();
        const data = {
            usernameOrEmail: userNameRef.current.value.toLowerCase(),
            password: password
        }


        const userService = new UserService();
        const response = userService.login(data);
        response.then(res => {
            const expirationTime = new Date(
                new Date().getTime() + 3600 * 1000
            );
            authCtx.login(res, expirationTime.toISOString());
    
        },
        res =>{
            toastBR.current.show({ severity: 'error', summary: 'Error', detail: "Username or password is wrong!", life: 10000});
        }
        )
        
    }
    const ChangeVisibility = () => {
        setVisible(!visible);
      };
    var password_input = document.getElementById("password");
    if(password_input){
        password_input.addEventListener("keypress", function(event) {
            debugger
            if (event.key === "Enter") {
              event.preventDefault();
              document.getElementById("LoginBtn").click();
            }
          });
    }
    var username_input = document.getElementById("username");
    if(username_input){
        username_input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                debugger
              event.preventDefault();
              document.getElementById("LoginBtn").click();
            }
          });
    }
    return (

        <div className="form-box">
            <div className="header-text">
            
                <div style={{ margin: 'auto' }}>
                    <center>
                        <div style={{width: "70%", height:"50%", backgroundColor:"#E8F0FE"}}>
                            <Image src="assets/layout/images/epra_büyük_logo.png" alt="galleria" />
                        </div>
                        
                        <h2 style={{color:"white", fontSize: 24}} >Login</h2>
                    </center>
                </div>
            </div>
            <center>
                <div className="field" >
                    <InputGroup id="username" inside style={{width: '70%'}}>
                        <Input type='text' placeholder="Username" ref={userNameRef}/>
                    </InputGroup>
                </div>
                <div className="field" >
                    <InputGroup id="password" inside style={{width: '70%'}}>
                        <Input type={visible ? 'text' : 'password'} placeholder="Password" onChange={(e) => setPassword(e)}/>
                            <InputGroup.Button onClick={ChangeVisibility}>
                            {visible ? <EyeIcon /> : <EyeSlashIcon />}
                            </InputGroup.Button>
                    </InputGroup>
                </div>

                <Button id="LoginBtn" onClick={loginSubmitHandler}  label="Login" style={{ backgroundColor:"#6366F1", width: '50%', fontSize: 14}}></Button> <br /><br />
                <div>
                
                <Button className="p-button-help p-button-text" aria-label="Forgot Password" label="Forgot Password" style={{backgroundColor:"#A855F7", color:"white", width: '50%', fontSize: 12}}onClick={() => history.push('/forgotPass')}/>
                

                </div>
                <div> </div>
                <Toast ref={toastBR} style={{width: "300px", height: "200px", fontSize: 16}}/>
            </center>
        </div>
    )

}

export default Login;
