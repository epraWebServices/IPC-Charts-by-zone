import { pagePath } from '../environments/PagePath';
import {ApiService} from './ApiService'

export class ProcessService {

    _apiService = new ApiService();
   

    getMarketProcessList(){
        return this._apiService.get(pagePath.PROCESS+"/getMarketProcessList").then(res => res);
    }

    getNetworkProcessList(){
        return this._apiService.get(pagePath.PROCESS+"/getNetworkProcessList").then(res => res);
    }

    getDocument(documentId) {
        return this._apiService.get(pagePath.DOCUMENT+'/download/'+documentId).then(res=>res);

    }
    getProcessById(id) {
        return this._apiService.get(pagePath.PROCESS+'/getMSResultsById?id='+id).then(res=>res);
    } 

    getNWProcessById(id) {
        return this._apiService.get(pagePath.PROCESS+'/getNWResultsById?id='+id).then(res=>res);
    } 
}