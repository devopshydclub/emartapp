package com.springwork.bookwork.repository;




import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springwork.bookwork.model.Book;

public interface BookRepository  extends JpaRepository<Book, Long>{

	
	
	
	List<Book> findByPublished(boolean published);
	List<Book> findByTitleContaining(String title);
	
	
	
}
