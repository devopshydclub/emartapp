import { Injectable } from '@angular/core';
import { BackendConfigService } from '../backend_config/backend-config.service';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Book } from '../models/Book';
import { Axios } from 'axios';


@Injectable({
  providedIn: 'root'
})

export class AxiosHttpService {

  private baseUrl:String ="";
  constructor(private http: HttpClient,private bcs:BackendConfigService) {  
      this.baseUrl =this.bcs.backend_url;
    
    }


} //class close
