import { pagePath } from '../../environments/PagePath';
import { ApiService } from '../ApiService';



export class MarketSimulationService {
    _apiService = new ApiService();
    

    getBaseYear(id){
        return this._apiService.get(pagePath.MarketSimulation+"/BaseYear?id="+id).then(res => res);
    }

    executee(data) {
        return this._apiService.post(pagePath.PROCESS+"/execute",data).then(res => res);
    }

    mcp_estimation(data) {
        return this._apiService.post(pagePath.PROCESS+"/mcp_estimation",data).then(res => res);
    }

    executeeNW(data) {
        return this._apiService.post(pagePath.PROCESS+"/executeNW",data).then(res => res);
    }
    
    
    



}