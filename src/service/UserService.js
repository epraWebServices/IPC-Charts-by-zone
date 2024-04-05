import axios from 'axios';
import { apiPath } from '../environments/ApiPath';
import { pagePath } from '../environments/PagePath';
import { ApiService } from './ApiService';

export class UserService {
    _apiService = new ApiService();

    login(data) {
        return axios.post(apiPath.API_BASE_PATH+"/auth/signin",data).then(res => res.data);
    }

    forgotPass(data) {
        return axios.post(apiPath.API_BASE_PATH+"/auth/forgotPass",data).then(res => res);
    }

    getUserList() {
        return this._apiService.get(pagePath.USER+'/getAll').then(res => res)
    }

    saveUser(data){
        return this._apiService.post(pagePath.USER+'/save',data).then(res => res)
    }


}