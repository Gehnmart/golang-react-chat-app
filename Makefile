all: run

run:
	docker-compose up -d

build:
	docker-compose up --build

down:
	docker-compose down