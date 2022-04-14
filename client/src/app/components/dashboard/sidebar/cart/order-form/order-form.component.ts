import { Component, OnInit, Input } from "@angular/core";
// import * as jsPDF from "jspdf";
import { jsPDF } from "jspdf";

// Services
import { OrderService } from "src/app/services/order.service";
import { AuthService } from "src/app/services/auth.service";
// Models
import { User } from "src/app/models/User";
import { Order } from "src/app/models/Order";

@Component({
  selector: "app-order-form",
  templateUrl: "./order-form.component.html",
  styleUrls: ["./order-form.component.css"]
})
export class OrderFormComponent implements OnInit {
  @Input() user: User;
  orders: Order[];
  count = 0;
  last = "";
  currentDate: string = "";
  cities: Array<String> = [
    "Hyderabad",
"Bengaluru",
"Chennai",
"Mumbai",
"New Delhi",
"Pune",
"Ahmedabad",
"Vishakapatnam",
"Vijayawada",
"Nagpur",
"Bhopal",
"Kolkata",
"Bhubhaneswar",
"Katak",
"Trivendrum",
"Kochin",
"Goa",
"Mysur",
"Surat",
"Vadodara",
"Lucknow",
"Kanpur",
"Patna",
"Ranchi",
"Aurangabad"
  ];
  isEmpty: boolean = false;
  warning: string = "";
  // modal & loading
  isLoading: boolean = true;
  display: string = "none";
  modalHeader: string = "";
  modalBody: string = "";

  constructor(private orderService: OrderService, private authService: AuthService) {}

  ngOnInit() {
    this.currentDate = this.getCurrentDate(new Date());
    this.isLoading = false;
  }

  onFinalizeOrder(form) {
    this.isEmpty = false;
    if (
      !form.valid ||
      !this.checkCreditCard(form.controls.credit.value) ||
      !this.checkShipDate(form.controls.ship.value)
    ) {
      this.isEmpty = true;
      this.warning = "Please fill all required fields";
      if (!this.checkCreditCard(form.controls.credit.value) && form.valid)
        this.warning = "Credit cart number is invalid";
      if (!this.checkShipDate(form.controls.ship.value) && form.valid)
        this.warning = "Shipping date is invalid, must be current date or follow it";
      this.display = "none";
    } else {
      this.isLoading = true;
      this.orderService.getAllOrders().subscribe(
        res => {
          this.isLoading = false;
          // Booking validation
          let ship = form.controls.ship.value,
            takenDates = [],
            isTaken = false,
            orders = res.orders;
          if (orders) {
            const dates = orders.map(order => order.user.ship.toString().split("T")[0]);
            const allShipDates = dates.reduce((a, b) => {
              if (a.indexOf(b) < 0) a.push(b);
              return a;
            }, []);
            takenDates = allShipDates.filter(shipDate => dates.filter(date => date == shipDate).length > 2);
            if (takenDates.length > 0) isTaken = takenDates.filter(date => date === ship).length > 0;
            if (isTaken) {
              this.warning = `Shipping on ${this.adjustDate(ship)} is already booked for 3 orders, pick another date`;
              this.isEmpty = true;
              this.display = "none";
            } else
              this.orderService
                .addOrder(this.user,{
                  city: form.controls.city.value,
                  street: form.controls.street.value,
                  ship: form.controls.ship.value,
                  credit: form.controls.credit.value
                })
                .subscribe(
                  res => {
                    this.authService.userDetails(res.user);
                    this.authService.currentUserData.subscribe(
                      user => ((this.user = user), form.reset(), this.openModal()),
                      err => this.onError()
                    );
                  },
                  err => this.onError()
                );
          }
        },
        err => this.onError()
      );
    }
  }

  // download pdf receipt
  download() {
    this.isLoading = true;
    this.authService.currentUserOrdersData.subscribe(
      order => {
        this.isLoading = false;
        this.count++;
        if (order && this.count == 2 && this.last !== order._id) {
          this.last = order._id;
          let orderDates = `Order date: ${this.adjustDate(
              this.getCurrentDate(order.user.order)
            )}\tShipping date: ${this.adjustDate(this.getCurrentDate(order.user.ship))}`,
            shipAddress = `Shipping address: ${order.user.street}, ${order.user.city}`,
            userInfo = `[ ID: ${this.user.cardId} ] ${this.user.fname} ${this.user.lname}`,
            itemsTXT = "";
          order.products.forEach(
            item =>
              (itemsTXT += `${item.prod_name}\tx ${item.quantity} units\ttotal:  ${item.prod_total.toFixed(2)} INR\n\n`)
          );
          let doc = new jsPDF();
          doc.setFontSize(22);
          // doc.setFontStyle("bold");
          doc.text("Thank you for shopping at E-MART!!!", 20, 20);
          doc.setLineWidth(0.5);
          doc.line(0, 25, 500, 25);
          doc.setFontSize(12);
          // doc.setFontStyle("normal");
          doc.text("Order: " + order._id, 10, 35);
          doc.text(orderDates, 10, 45);
          doc.text(shipAddress, 10, 55);
          doc.text("Customer details: " + userInfo, 10, 65);
          doc.text("Credit card: ****-****-****-" + order.user.credit.slice(-4), 10, 75);
          doc.line(0, 80, 500, 80);
          // doc.setFontStyle("normal")
         
          doc.text(itemsTXT, 10, 105);
          
          doc.line(0, 95, 500, 95);
          // doc.setFontStyle("bold");
          doc.text("Total price: " + order.total.toFixed(2) + " INR", 10, 90);
          
          doc.save("receipt-" + this.user.fname + "-" + this.user.lname + "-" + order._id + ".pdf");
        }
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
  // shipping date validation
  checkShipDate = ship => {
    let shipDate = new Date(ship).getTime(),
      orderDate = new Date(Date.now()).getTime();
    if (
      ship.match(/^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/) &&
      (shipDate >= orderDate || ship === new Date().toISOString().split("T")[0])
    )
      return true;
    else return false;
  };
  getCurrentDate = date => {
    let today = new Date(date),
      current = today.getFullYear().toString();
    if (today.getMonth() + 1 < 10) current += "-0" + (today.getMonth() + 1);
    else current += "-" + (today.getMonth() + 1);
    if (today.getDate() < 10) current += "-0" + today.getDate();
    else current += "-" + today.getDate();
    return current;
  };
  adjustDate = date => {
    let correct = date.slice(-2) + "/" + date.slice(5, -3) + "/" + date.slice(0, 4);
    return correct;
  };
  // credit card validation
  checkCreditCard = (function(credit) {
    return function(ccNum) {
      var len = ccNum.length,
        bit = 1,
        sum = 0,
        val;
      while (len) {
        val = parseInt(ccNum.charAt(--len), 10);
        sum += (bit ^= 1) ? credit[val] : val;
      }
      return sum && sum % 10 === 0;
    };
  })([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]);

  onError() {
    this.modalHeader = "An Error Has Occurred";
    this.modalBody = "Could not proccess your order do to server communication problem. Please try again later.";
    this.openModal();
  }
}
