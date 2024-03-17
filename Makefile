all: run

run:
	docker-compose up -d

build:
	docker-compose --build