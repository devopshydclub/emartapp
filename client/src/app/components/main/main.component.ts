import { Component, OnInit } from "@angular/core";
// Services
import { AuthService } from "src/app/services/auth.service";
import { ProductService } from "src/app/services/product.service";
//Models
import { User } from "src/app/models/User";
import { Order } from "src/app/models/Order";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
  isAuth: boolean = false;
  user: User = null;
  userOrders: Order = null;
  productsTotal: number = 0;
  ordersTotal: number = 0;
  // modal & loading
  isLoading: boolean = true;
  display: string = "none";
  modalHeader: string = "";
  modalBody: string = "";

  isLoading1: boolean = true;
  display1: string = "none";
  modalHeader1: string = "";
  modalBody1: string = "";
  constructor(public authService: AuthService, private productService: ProductService) {}

  ngOnInit() {
    // import shop inventory
    this.productService.getShopInventory().subscribe(
      res => {
        this.ordersTotal = res.ordersTotal;
        this.productsTotal = res.productsTotal;
        this.isLoading = false;
        // import user data
        this.authService.getCurrentUser().subscribe(res => {
          this.authService.userDetails(res.user);
          this.authService.userOrdersDetails(res.orders[0]);
          this.authService.currentUserData.subscribe(
            user => {
              this.user = user;
              this.authService.currentUserOrdersData.subscribe(
                orders => (this.userOrders = orders),
                err => this.onError()
              );
            },
            err => this.onError()
          );
        });
      },
      err => this.onError()
    );
  }

  // modal
  openModal() {
    this.display = "block";
  }
  openModal1() {
    this.display1 = "block";
  }
  onCloseHandled() {
    this.display = "none";
  }
  onCloseHandled1() {
    this.display1 = "none";
  }
  onError() {
    this.isLoading=false
    this.modalHeader = "An Error Has Occurred";
    this.modalBody = "Could not load E-MART orders & product information do to server communication problem. Please try again later.";
    this.openModal();
  }


  openForm() {
    // document.getElementById("myForm").style.display = "block";
    this.isLoading1=false
    this.modalHeader1 = "Login first to Buy or Add to CART";
    this.modalBody1 = "Register if you don't have account!.";
    this.openModal1();
  }
  
   closeForm() {
    document.getElementById("myForm").style.display = "none";
  }
}
