import { pagePath } from '../../environments/PagePath';
import { ApiService} from '../../service/ApiService'



export class EpiasService {
    _apiService = new ApiService();
    


    executee(data) {
        return this._apiService.post("/ExportData/get",data).then(res => res);
    }


}