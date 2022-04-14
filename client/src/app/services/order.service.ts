import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { BackendConfigService } from "../backend_config/backend-config.service";

@Injectable({ providedIn: "root" })
export class OrderService {
  private baseUrl:String ="";
  
  rootURL = '/api';
  // rootURL = this.baseUrl+this.bcs.nodeport+"/api";
  private url: string = `${this.rootURL}/shop`;

  
  // private url: string = "http://localhost:5000/shop";

  private userOrder = new BehaviorSubject(null);
  currentUserOrder = this.userOrder.asObservable();

  private orderStatus = new BehaviorSubject(false);
  currentOrderStatus = this.orderStatus.asObservable();

  constructor(private http: HttpClient, private router: Router,private bcs:BackendConfigService) {
    this.baseUrl =this.bcs.backend_url;
  }

  changeOrderStatus(status) {
    this.orderStatus.next(status);
  }

  ordersDetails(orders) {
    this.userOrder.next(orders);
  }

  getAllOrders() {
    return this.http.get<any>(this.url + "/orders");
  }

  addProductToCart(user, product: any) {
    return this.http.put<any>(this.url + `/cart/${user._id}/${product.id}`, { quantity: product.quantity });
  }

  removeProductFromCart(user, product: any) {
    return this.http.put<any>(this.url + `/cart/delete/${user._id}/${product.productId}`, user._id);
  }

  emptyCart(user) {
    return this.http.put<any>(this.url + `/empty-cart/${user._id}`, user._id);
  }

  revokeOrder(user) {
    return this.http.put<any>(this.url + `/open-cart/${user._id}`, user._id);
  }

  initializeOrder(user) {
    return this.http.put<any>(this.url + `/orders/${user._id}`, user._id);
  }

  addOrder(user, order) {
    return this.http.post<any>(this.url + `/orders/${user._id}`, order);
  }
}
