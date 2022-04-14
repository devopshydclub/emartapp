import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { BackendConfigService } from "../backend_config/backend-config.service";

@Injectable({ providedIn: "root" })
export class Product2Service {
  
  private baseUrl:String ="";
  // rootURL = 'http://localhost:9000/webapi';
  rootURL = '/webapi';
  // rootURL = this.baseUrl+ this.bcs.javaport+'/webapi';
  private url: string = `${this.rootURL}/books`;

  // private url = "http://localhost:5000/shop";

 
  constructor(private http: HttpClient, private router: Router,private bcs:BackendConfigService) {
   this.baseUrl =this.bcs.backend_url;
  }

  

  getAllProducts() {
    return this.http.get<any>(this.url);
  }

  getAllPublishedBooks() {
    return this.http.get<any>(this.url +"/published");
  }

  // getProductsByCategory(categoryName) {
  //   return this.http.get<any>(this.url + "/category/" + categoryName);
  // }

  // getProductsByName(productName) {
  //   return this.http.get<any>(this.url + "/search/" + productName);
  // }

  createBook(newBook) {
    return this.http.post<any>(this.url, newBook);
  }

  // editProduct(productId, updatedProduct) {
  //   return this.http.put<any>(this.url + "/" + productId, updatedProduct);
  // }

  // deleteProduct(productId) {
  //   return this.http.delete<any>(this.url + "/" + productId);
  // }

  // createCategory(category) {
  //   return this.http.post<any>(this.url + "/category", category);
  // }
}
