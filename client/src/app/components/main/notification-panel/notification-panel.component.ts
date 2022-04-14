import { Component, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";
// Services
import { AuthService } from "src/app/services/auth.service";
// Models
import { Order } from "src/app/models/Order";
import { User } from "src/app/models/User";

@Component({
  selector: "app-notification-panel",
  templateUrl: "./notification-panel.component.html",
  styleUrls: ["./notification-panel.component.css"]
})
export class NotificationPanelComponent implements OnInit, OnChanges {
  @Input() user: User;
  orders: Order[];
  total: number = 0;
  // modal & loading
  isLoading: boolean = true;
  display: string = "none";
  modalHeader: string = "";
  modalBody: string = "";

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // import user data
    this.authService
      .getCurrentUser()
      .subscribe(res => (this.authService.userDetails(res.user), this.authService.userOrdersDetails(res.orders[0])));
    this.authService.currentUserData.subscribe(user => (this.user = user));
    this.authService.currentUserOrdersData.subscribe(orders => (this.orders = orders));
    this.isLoading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.total = 0;
    this.user.cart.items.forEach(item => (this.total += item.prod_total));
  }

  // modal
  openModal() {
    this.display = "block";
  }
  onCloseHandled() {
    this.display = "none";
  }
  onError() {
    this.isLoading = false;
    this.modalHeader = "An Error Has Occurred";
    this.modalBody =
      "Could not show user purchases & cart info do to server communication problem. Please try again later.";
    this.openModal();
  }
}
