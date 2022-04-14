package com.springwork.bookwork.controller;

import org.springframework.web.bind.annotation.RequestMapping;

import com.springwork.bookwork.model.Book;
import com.springwork.bookwork.repository.BookRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


//@CrossOrigin(origins = "http://localhost:8081)

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)

@RestController
@RequestMapping("/webapi")
public class BookController {


	@Autowired
	BookRepository bookRepository;
	
	@GetMapping("/books")
	public ResponseEntity<List<Book>> getAllBooks(@RequestParam(required = false) String title) {
		try {
			List<Book> Books = new ArrayList<Book>();

			if (title == null)
				bookRepository.findAll().forEach(Books::add);
			else
				bookRepository.findByTitleContaining(title).forEach(Books::add);

			if (Books.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}

			return new ResponseEntity<>(Books, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		
		
		
		
	}

	@GetMapping("/books/{id}")
	public ResponseEntity<Book> getBookById(@PathVariable("id") long id) {
		Optional<Book> bookData = bookRepository.findById(id);

		if (bookData.isPresent()) {
			return new ResponseEntity<>(bookData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		
		
              	}

	@PostMapping("/books")
	public ResponseEntity<Book> createBook(@RequestBody Book book) {
		try {
			Book _book = bookRepository.save(new Book(book.getTitle(), book.getDescription(),book.getAuthor(),book.getPublisher(), false));
			return new ResponseEntity<>(_book, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.EXPECTATION_FAILED);
		}
		
	}

	@PutMapping("/books/{id}")
	public ResponseEntity<Book> updateBook(@PathVariable("id") long id, @RequestBody Book book) {
		Optional<Book> bookData = bookRepository.findById(id);

		if (bookData.isPresent()) {
			Book _book = bookData.get();
			_book.setTitle(book.getTitle());
			_book.setDescription(book.getDescription());
			_book.setAuthor(book.getAuthor());
			_book.setPublisher(book.getPublisher());
			_book.setPublished(book.isPublished());
			return new ResponseEntity<>(bookRepository.save(_book), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	
	
	
	}

	@DeleteMapping("/books/{id}")
	public ResponseEntity<HttpStatus> deleteBook(@PathVariable("id") long id) {
		try {
			bookRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
		}
		
	}

	@DeleteMapping("/books")
	public ResponseEntity<HttpStatus> deleteAllBooks() {
		try {
			bookRepository.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
		}
		
	}

	@GetMapping("/books/published")
	public ResponseEntity<List<Book>> findByPublished() {
		try {
			List<Book> books = bookRepository.findByPublished(true);

			if (books.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(books, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
		}
		
		
	}
	

}


	
	
	
	
	

