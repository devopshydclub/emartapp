import { Component, OnInit, OnChanges, SimpleChanges, Input } from "@angular/core";
// Srvices
import { AuthService } from "src/app/services/auth.service";
import { OrderService } from "src/app/services/order.service";
// Models
import { User } from "src/app/models/User";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"]
})
export class CartComponent implements OnInit, OnChanges {
  @Input() user: User;
  isOrdered: boolean = false;
  total: number = 0;
  filteredStatus: string = "";
  isLoading: boolean = true;
  isError: boolean = false;
  errorBody: string = "";
  constructor(private authService: AuthService, private orderService: OrderService) {}

  ngOnInit() {
    if (this.user) {
      if (this.user.cart.status == "pending") this.isOrdered = true;
      else if (this.user.cart.status == "new") this.isOrdered = false;
      this.orderService.changeOrderStatus(this.isOrdered);
    }
    this.isLoading = false;
    this.isError = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.user) {
      this.total = 0;
      this.user.cart.items.forEach(item => (this.total += item.prod_total));
      if (this.user.cart.status == "pending") this.isOrdered = true;
      else if (this.user.cart.status == "new") this.isOrdered = false;
      this.orderService.changeOrderStatus(this.isOrdered);
    }
  }

  onRemoveProductFromCart(product) {
    this.isError = false;
    this.isLoading = true;
    this.orderService
      .removeProductFromCart(this.user,product)
      .subscribe(
        res => ((this.isLoading = false), this.authService.userDetails(res.user)),
        err => ((this.errorBody = "Could not remove item from cart"), (this.isError = true), (this.isLoading = false))
      );
  }

  onEmptyCart() {
    this.orderService
      .emptyCart(this.user)
      .subscribe(
        res => ((this.isLoading = false), this.authService.userDetails(res.user)),
        err => ((this.errorBody = "Could not delete cart"), (this.isError = true), (this.isLoading = false))
      );
  }

  onBackToShop() {
    this.isLoading = true;
    this.orderService.revokeOrder(this.user).subscribe(
      res => {
        this.isLoading = false;
        this.isOrdered = false;
        this.orderService.changeOrderStatus(this.isOrdered);
        this.authService.userDetails(res.user);
      },
      err => ((this.errorBody = "Could not resume shopping"), (this.isError = true), (this.isLoading = false))
    );
  }

  onOrder() {
    if (this.total > 0) {
      this.isLoading = true;
      this.orderService.initializeOrder(this.user).subscribe(
        res => ((this.isLoading = false), (this.isOrdered = true), this.authService.userDetails(res.user)),
        err => {
          this.isOrdered = false;
          this.isLoading = false;
          this.errorBody = "Could not proccess order";
          this.isError = true;
        }
      );
    } else this.isOrdered = false;
    this.orderService.changeOrderStatus(this.isOrdered);
  }
}
