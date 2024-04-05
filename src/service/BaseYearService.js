import { pagePath } from '../environments/PagePath';
import {ApiService} from './ApiService'

export class BaseYearService {

    _apiService = new ApiService();
   
    getAll() {
        return this._apiService.get(pagePath.BASEYEAR+'/getAll').then(res => res)
    }

    getGenerationFleet(id) {
        return this._apiService.get(pagePath.BASEYEAR+"/getById?id="+id).then(res => res)
    }

    getAnnualLoad(id) {
        return this._apiService.get(pagePath.BASEYEAR+"/getLoadById?id="+id).then(res => res)
    }


}