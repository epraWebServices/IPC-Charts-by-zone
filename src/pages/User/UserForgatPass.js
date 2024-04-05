import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Image } from "primereact/image";
import { UserService } from '../../service/UserService';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import '../../assets/demo/flags/flags.css';
import '../../assets/demo/Demos.scss';
import '../../assets/layout/layout.scss';
import '../../App.scss';
import './login.css';
import { useHistory } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { BlockUI } from 'primereact/blockui';

const UserForgatPass = (props) => {

    const toast = useRef(null);
    
    const history = useHistory();
    const userNameRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

    const resetPassSubmitHandler = (event) => {
        setIsLoading(true);
        event.preventDefault();
        const data = {
            email: userNameRef.current.value,
           
        }

        const userService = new UserService();
         userService.forgotPass(data).then(res=>{
            if(res.data.success===true) {
                toast.current.show({ severity: res.data.success, summary: 'Successful', detail: res.data.message, life: 10000 })                
                alert("Confirmation mail for password reset has been sent to your e-mail address.")
                //@todo yönlendirme               
               
             }else{
                toast.current.show({ severity: res.data.success, summary: 'ERROR', detail: res.data.message, life: 10000 });             
                
             } 
             setIsLoading(false) 
         });
          
    
    }


    return (
        <div>
            <div style={{zIndex:100}}>  <Toast ref={toast} /> </div> 
        {isLoading &&
        <>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <ProgressSpinner  style={{ width: '50px', height: '50px', justifyContent:'center'  }}  strokeWidth="8"  fill="var(--surface-ground)" animationDuration=".5s" />
         
         
         </div>
         <BlockUI blocked={isLoading} fullScreen />     </>        
        }
        
        <div className="form-box" >                     
            <div className="header-text">
                <div style={{ margin: 'auto' }}>
                    <center>
                        <div style={{backgroundColor:"#E8F0FE"}}>
                            <Image src="assets/layout/images/logo-1.png" alt="galleria" width={'80%'} height={'50%'}/>
                        </div>
                        <h2 style={{color:"white"}}>Password Reset</h2>
                    </center>
                </div>
            </div>
            <center>
                <div className="field"  >
                    <span className="p-float-label" >
                        <InputText id="username" type="text" ref={userNameRef} placeholder="Type your Email" style={{ width: '70%', fontSize: 14 }} />
                    </span>
                </div>
                <Button className="p-button-help" onClick={resetPassSubmitHandler} label="Password Reset" style={{ width: '50%', fontSize: 14 }}></Button> <br /><br />
                <Button label="Login" className="p-button-text" style={{backgroundColor:"#6366F1", color:"white", fontSize: 12}} onClick={() => history.push('/login')} />
            </center>
        </div>
        </div>
    )

}

export default UserForgatPass;
