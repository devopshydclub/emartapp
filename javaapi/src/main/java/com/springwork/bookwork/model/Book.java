package com.springwork.bookwork.model;

import javax.persistence.*;

@Entity
@Table(name = "books_data")
public class Book {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;


	@Column(name = "title")
	private String title;

	@Column(name = "description")
	private String description;
    
	@Column(name = "author")
	private String author;
    @Column(name = "publisher")
	private String publisher;
	@Column(name = "published")
	private boolean published;
	
	public Book() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	public String toString() {
		return "Book [id=" + id + ", title=" + title + ", description=" + description + ", author=" + author
				+ ", publisher=" + publisher + ", published=" + published + "]";
	}

	public Book(String title, String description, String author, String publisher, boolean published) {
		//super();
		this.title = title;
		this.description = description;
		this.author = author;
		this.publisher = publisher;
		this.published = published;
	}
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public long getId() {
		return id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getPublisher() {
		return publisher;
	}

	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	public boolean isPublished() {
		return published;
	}

	public void setPublished(boolean published) {
		this.published = published;
	}

	
	
	
	
}
