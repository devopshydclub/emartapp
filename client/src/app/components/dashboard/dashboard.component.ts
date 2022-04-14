import { Component, OnInit } from "@angular/core";
// Services
import { AuthService } from "src/app/services/auth.service";
// Models
import { User } from "src/app/models/User";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  isSidenavOpen: boolean = true;
  isAuth: boolean = false;
  user: User = null;
  // modal & loading
  isLoading: boolean = true;
  display: string = "none";
  modalHeader: string = "";
  modalBody: string = "";

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // import user data
    this.authService.getCurrentUser().subscribe(
      res => {
        this.authService.userDetails(res.user);
        this.authService.userOrdersDetails(res.orders[0]);
        this.authService.currentUserData.subscribe(
          user => ((this.user = user), (this.isLoading = false)),
          err => this.onError()
        );
      },
      err => this.onError()
    );
  }

  // modal
  openModal() {
    this.display = "block";
  }
  onCloseHandled() {
    this.display = "none";
  }
  onError() {
    this.isLoading = false
    this.modalHeader = "An Error Has Occurred";
    this.modalBody = "Could not load shopping section do to server communication problem. Please try again later.";
    this.openModal();
  }
}
