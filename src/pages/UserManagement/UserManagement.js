import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { UserService } from '../../service/UserService';

import UserRegisterForm from './UserRegisterForm';

const UserManagement = () => {
    let emptyUser = {
        id: null,
        name_surname: '',
        email: '',
        phone:'',
        role:null,
        username:''
    };
    const confirmButtons= useState(false);
    const [users, setUsers] = useState(null);
    const _userService = new UserService();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [userDialog, setUserDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    useEffect(() => {
        setLoading(true);

        const loadData = async () => {
            await _userService.getUserList().then(data => {
                setUsers(data.object);
                
            });
        }
        loadData().then(res => {
            setLoading(false);
        });



    }, []);

    const openNew = () => {
        setUser(emptyUser);
        setUserDialog(true);
    }
    const onInputChange = (e, name) => {
          
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${name}`] = val;
        setUser(_user);
    }

    const leftToolbarTemplate = () => { //new button
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New User" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>  
            </React.Fragment>
        )
    }
    const hideDialog = () => {
        setUserDialog(false);
    }
    
    const saveUser = () => {
          
        if (user.name_surname.trim()) {
            if (user.id) {
                _userService.updateUser(user).then(res => {
                   // console.log(res)
                    if (res.success) {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
                        _userService.getUserList().then(data => {
                            setUsers(data.object);
                        });   
                    } else {
                        toast.current.show({ severity: 'eror', summary: 'eror', detail: res.message, life: 3000 });
                    }
                });

            }
            else {
                const data = {
                    ...user,
                }
                _userService.saveUser(data).then(res => {
                    if (res.success) {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
                        alert(res.object.name + "Şiresi Mail Olarak Gönderiliyor....!");
                        _userService.getUserList().then(data => {
                            setUsers(data.object);
                        });
                       
                    } else {
                        toast.current.show({ severity: 'eror', summary: 'eror', detail: res.message, life: 3000 });
                    }  
                }
                );
             }
             setUserDialog(false);
            setUser(emptyUser);
        }
    }

    const editUser = (user) => { //Kullanıcı Update        
        setUser({ ...user });
        setUserDialog(true);

    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUser(rowData)} ></Button>
            </div>
        );
    }

    const userDialogFooter = (  // User Detail Save or Cancel
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" disabled={
              user.name_surname === "" || user.email === "" || user.phone===''? true : false
            } icon="pi pi-check" className="p-button-text" onClick={saveUser}/>
        </>
    );
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">User List</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                <Toast ref={toast} />
                    {!loading && <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>}
                {!loading &&<DataTable ref={dt} value={users} header={header}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                globalFilter={globalFilter}
                emptyMessage="No user found."
                responsiveLayout="scroll" sortField="id" sortOrder={1}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users">
                        <Column field="id" sortable header="ID"  headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="name_surname" sortable header="User" headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="email" sortable header="Email" headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="role" sortable header="Role" headerStyle={{ minWidth: '10rem' }}></Column>
                        {!confirmButtons && <Column body={actionBodyTemplate}></Column>}
                </DataTable>}
                <Dialog visible={userDialog} style={{ width: '500px' }} header="User Info" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        {user.image && <img src={`assets/demo/images/user/${user.image}`} alt={user.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <UserRegisterForm user={user} page={'userManagment'}onInputChange={onInputChange} ></UserRegisterForm>
                    </Dialog>
                </div>
            </div>
        </div>

    );

}

export default UserManagement