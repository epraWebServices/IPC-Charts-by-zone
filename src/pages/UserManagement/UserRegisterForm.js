import React from 'react';
import classNames from 'classnames';

import { InputText } from 'primereact/inputtext';


const UserRegisterForm = (props) => {


    const {user, setSubmitted} = props;
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <div className="field">
                        <label htmlFor="name">Name Surname</label>
                        <InputText autocomplete="off" id="name" value={user.name_surname} onChange={(e) => props.onInputChange(e, 'name_surname')} required autoFocus className={classNames({ 'p-invalid': setSubmitted && !user.name_surname })} />
                        {setSubmitted && !user.name && <small className="p-invalid">required!</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText autocomplete="off" id="email" value={user.email} onChange={(e) => props.onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': setSubmitted && !user.email })} />
                        {setSubmitted && !user.email && <small className="p-invalid">required!</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="phone">Phone</label>
                        <InputText autocomplete="off" id="phone" value={user.phone} onChange={(e) => props.onInputChange(e, 'phone')} required autoFocus className={classNames({ 'p-invalid': setSubmitted && !user.phone })} />
                        {setSubmitted && !user.phone && <small className="p-invalid">required!</small>}
                    </div>                
                </div>
            </div>
        </div>
    );



}

export default UserRegisterForm;