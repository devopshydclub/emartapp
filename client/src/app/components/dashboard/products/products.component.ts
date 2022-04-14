import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
// Services
import { ProductService } from "src/app/services/product.service";
import { OrderService } from "src/app/services/order.service";
import { AuthService } from "src/app/services/auth.service";
// Models
import { Product } from "src/app/models/Product";
import { Category } from "src/app/models/Category";
import { User } from "src/app/models/User";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"]
})
export class ProductsComponent implements OnInit, OnChanges {
  @Input() user: User;
  filteredStatus: string = "";
  products: Product[];
  categories: Category[];
  orderStatus: boolean = false;
  currentProduct: Product;
  // modal & loading
  isLoading: boolean = true;
  display: string = "none";
  modalHeader: string = "";
  modalBody: string = "";

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // orders
    this.orderService.currentOrderStatus.subscribe(res => (this.orderStatus = res), err => this.onError());
    // products
    this.productService.currentProducts.subscribe(products => (this.products = products), err => this.onError());
    // categories
    this.productService.currentCategories.subscribe(
      categories => ((this.categories = categories), (this.isLoading = false)),
      err => this.onError()
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    // import product data
    this.productService.getAllProducts().subscribe(
      res =>
        (this.products = res.products.map(product => {
          return {
            id: product._id,
            prod_name: product.prod_name,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category.cat_name
          };
        })),
      err => {
        if (!err.status) this.onError();
      }
    );

    // import categories
    this.productService.getAllCategories().subscribe(
      res =>
        (this.categories = res.categories.map(category => {
          return {
            id: category._id,
            cat_name: category.cat_name,
            products: category.products
          };
        })),
      err => {
        if (!err.status) this.onError();
      }
    );
  }

  onSearch(productName) {
    // http request for products by name or partial string, update products display
    this.productService.getProductsByName(productName).subscribe(
      res => {
        this.isLoading = false;
        this.productService.displayedProducts(
          res.products.map(product => {
            return {
              id: product._id,
              prod_name: product.prod_name,
              price: product.price,
              imageUrl: product.imageUrl,
              category: product.category.cat_name
            };
          })
        );
      },
      err => (this.isLoading = false)
    );
  }

  onCategorySelected(categoryName) {
    this.isLoading = true;
    // http request for products by category, update products display
    this.productService.getProductsByCategory(categoryName).subscribe(
      res => {
        this.isLoading = false;
        this.productService.displayedProducts(
          res.products.map(product => {
            return {
              id: product._id,
              prod_name: product.prod_name,
              price: product.price,
              imageUrl: product.imageUrl,
              category: categoryName
            };
          })
        );
      },
      err => (this.isLoading = false)
    );
  }

  onShowAllProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe(res => {
      this.isLoading = false;
      this.productService.displayedProducts(
        res.products.map(product => {
          return {
            id: product._id,
            prod_name: product.prod_name,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category.cat_name
          };
        })
      );
    });
  }

  onAddProductToCart(product) {
    if (product.quantity > 0) {
      this.isLoading = true;
      this.orderService.addProductToCart(this.user, product).subscribe(
        res => {
          this.isLoading = false;
          this.authService.userDetails(res.user);
          product.quantity = 0;
        },
        err => {
          this.isLoading = false;
          this.modalHeader = "An Error Has Occurred";
          this.modalBody = "Could not add product to cart. Please try again later.";
          this.openModal();
        }
      );
    }
  }

  onProductEdit(product) {
    this.productService.chosenProduct(product);
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
    this.modalBody = "Could not display products do to server communication problem. Please try again later.";
    this.openModal();
  }
}
