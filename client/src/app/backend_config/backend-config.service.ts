import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendConfigService {
    
    // backend_url ='http://localhost:9000/webapi';
    backend_url ='http://localhost:';

    javaport='9000';
    nodeport='5000';
    angularport='4200';
  constructor() { }
}
