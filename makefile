.PHONY: build up down 

ifneq (,$(wildcard ./.env))
	include .env
	export
endif

build:
	docker build -t tireni/emartapp-client ./client 
	docker build -t tireni/emartapp-webapi ./javaapi
	docker build -t tireni/emartapp-api ./nodeapi

push:
	docker login
	docker push tireni/emartapp-client
	docker push tireni/emartapp-webapi
	docker push tireni/emartapp-api

up: 
	docker compose up -d 
down:
	docker compose down

clean:
	docker compose down --volumes --remove-orphans
	docker volume prune -f