import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { Book } from "src/app/models/Book";
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { Product2Service } from 'src/app/services/product2.service';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  book: Book;
  books:Book[];
  books_p:Book[];
  product:Book;
  b:string;
  bk:string ="Helloooooooooooooooo";
  displayAllBooks:boolean=false;
  displayAddBookForm:boolean=false;
  displayPublishedBooks:boolean =false;
  // constructor() { 
   
  // }
  constructor(private ps:Product2Service) { 
   
  }
  ngOnInit() {
    // this.bs.getAllBooks().subscribe((data: Book[])=>{
    //   console.log(data);
    //   this.books = data;
    // })  
    // this.bs.currentBooks.subscribe(books => (this.books = books), err => {});

  }
  // abc() {
  //   this.bs.getAllBooks().subscribe((data: Book[])=>{
  //     console.log(data);
  //     this.books = data;
  //   });  
  // }
  abc() {
    console.log(" logged in Get ALL Books");
   this.displayAllBooks = !this.displayAllBooks;
  //this.ps.getAllProducts().forEach(product=>{this.product=product;console.log(product)});
  this.ps.getAllProducts().subscribe(data=>{this.books=data});

    this.bk = this.ps.rootURL;
  }
  addBookFlag(){
    this.displayAddBookForm = !this.displayAddBookForm;

  }
  publishedBooksFlag(){
    this.displayPublishedBooks = !this.displayPublishedBooks;

  }
 addBook(t,a,p){
    var newBook= {
      title:t.value,author:a.value,publisher:p.value
        
    }
    console.log(newBook);
    
   this.ps.createBook(newBook).subscribe(res=>{console.log(res);
   },err=>{console.log(err);
   });
  } 
   
   displayAllPublishedBooks(){
     console.log(" logged in");
     this.displayPublishedBooks = !this.displayPublishedBooks;
     this.ps.getAllPublishedBooks().subscribe(data=>{this.books_p=data;console.log(data);
     });
   }
  // this.bs.get(6).subscribe((data: Book)=>{
  //   console.log(data);
  //   this.book = data;
  // });
    

//       getOneBook(): void {
//         // import product data
//         this.bs.get(6).subscribe(
//           res =>
//             (this.book = res.books.map(product => {
//               return {
//                 id: product._id,
//                 prod_name: product.prod_name,
//                 price: product.price,
//                 imageUrl: product.imageUrl,
//                 category: product.category.cat_name
//               };
//             })),
//           err => {
//             if (!err.status) this.onError();
//           }
//         );
    
// }

// retrieveBooks() {
//   this.bs.getAll()
//     .then(response => {
//       this.books= response.data
//       console.log(response.data);
//     })
//     .catch(e => {
//       console.log(e);
//     });
// }



 
}