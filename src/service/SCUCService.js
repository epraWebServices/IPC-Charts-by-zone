import { ApiService } from './ApiService';

export class SCUCService {
    _apiService = new ApiService();
    


    executee(data) {
        return this._apiService.post("/SCUCResult/get",data).then(res => res);
    }


}