import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { BackendConfigService } from "../backend_config/backend-config.service";

@Injectable({ providedIn: "root" })
export class ProductService {
  
  private baseUrl:String ="";
  rootURL = '/api';
  // rootURL = this.baseUrl+this.bcs.nodeport+"/api";
  private url: string = `${this.rootURL}/shop`;

  // private url = "http://localhost:5000/shop";

  private products = new BehaviorSubject(null);
  currentProducts = this.products.asObservable();

  private product = new BehaviorSubject(null);
  currentProduct = this.product.asObservable();

  private categories = new BehaviorSubject(null);
  currentCategories = this.categories.asObservable();

  constructor(private http: HttpClient, private router: Router,private bcs:BackendConfigService) {
    this.baseUrl =this.bcs.backend_url;
  }

  getShopInventory() {
    return this.http.get<any>(this.url + "/info");
  }

  displayedCategories(categories) {
    this.categories.next(categories);
  }

  displayedProducts(products) {
    this.products.next(products);
  }

  chosenProduct(product) {
    this.product.next(product);
  }

  getAllProducts() {
    return this.http.get<any>(this.url + "/products");
  }

  getAllCategories() {
    return this.http.get<any>(this.url + "/category");
  }

  getProductsByCategory(categoryName) {
    return this.http.get<any>(this.url + "/category/" + categoryName);
  }

  getProductsByName(productName) {
    return this.http.get<any>(this.url + "/search/" + productName);
  }

  createProduct(newProduct) {
    return this.http.post<any>(this.url, newProduct);
  }

  editProduct(productId, updatedProduct) {
    return this.http.put<any>(this.url + "/" + productId, updatedProduct);
  }

  deleteProduct(productId) {
    return this.http.delete<any>(this.url + "/" + productId);
  }

  createCategory(category) {
    return this.http.post<any>(this.url + "/category", category);
  }
}
