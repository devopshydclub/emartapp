import { Injectable } from '@angular/core';
import { BackendConfigService } from '../backend_config/backend-config.service';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/Book';
import { Axios } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private baseUrl:String ='';
  public hello:string ="Hai"; 

  private books_ = new BehaviorSubject(null);
  currentBooks = this.books_.asObservable();
  constructor(private http: HttpClient,private bcs:BackendConfigService,
  public http_:Axios, private router: Router) {  this.baseUrl =this.bcs.backend_url;
                       alert(this.baseUrl);
                     }




     
                    
   getAllBooks() {
    
    return this.http.get<any>(this.baseUrl+"/books");
  }

  get(id) {
    return this.http.get(this.baseUrl+`/books/${id}`);
  }

  create(data) {
    return this.http.post(this.baseUrl+"/books", data);
  }

  update(id, data) {
    return this.http.put(this.baseUrl+`/books/${id}`, data);
  }

  delete(id) {
    return this.http.delete(this.baseUrl+`/books/${id}`);
  }

  deleteAll() {
    return this.http.delete(this.baseUrl+`/books`);
  }

  findByTitle(title) {
    return this.http.get(this.baseUrl+`/books?title=${title}`);
  }
  //new mwthod
  getPublished() {
    return this.http.get(this.baseUrl+`/books/published`);
  }


} //class close



