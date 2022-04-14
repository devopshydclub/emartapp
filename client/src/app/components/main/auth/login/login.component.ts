import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
// Services
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  isEmpty: boolean = false;
  isAuth: boolean = false;
  warning: string = "";
  // modal & loading
  isLoading: boolean = true;
  display: string = "none";
  modalHeader: string = "";
  modalBody: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentAuthStatus.subscribe(auth => (this.isAuth = auth));
    this.isLoading = false;
  }

  onLoginUser(form: NgForm) {
    if (!form.valid) {
      this.isEmpty = true;
      this.warning = "Please fill all required fields";
    } else {
      this.isLoading = true;
      let userLoginData = { email: form.controls.email.value, password: form.controls.password.value };
      this.isEmpty = false;
      this.authService.changeAuthStatus(true);
      this.authService.loginUser(userLoginData).subscribe(
        res => {
          this.isLoading = false;
          localStorage.setItem("token", res.token);
          this.authService.getCurrentUser().subscribe(res => this.authService.userDetails(res.user));
          this.authService.userOrdersDetails(res.orders);
          if (res.user.role === 0) this.router.navigate(["/"]);
          if (res.user.role === 1) this.router.navigate(["/dashboard"]);
        },
        err => {
          this.isLoading = false;
          if (err.status) {
            this.warning = "Sorry,unable to login user. Ensure that the entered e-mail and password are correct";
            this.isEmpty = true;
          } else this.onError();
        }
      );
      form.reset();
    }
  }

  // modal
  openModal() {
    this.display = "block";
  }
  onCloseHandled() {
    this.display = "none";
  }
  onError() {
    this.modalHeader = "An Error Has Occurred";
    this.modalBody = "Could not login user do to server communication problem. Please try again later.";
    this.openModal();
  }
}
