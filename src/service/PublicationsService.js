import { ApiService } from './ApiService';

export class PublicationsService {
    _apiService = new ApiService();
    


    getAll() {
        return this._apiService.post("/getPublications/").then(res => res);
    }


}