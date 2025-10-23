all:
	docker-compose build --no-cache
	docker-compose up
build:
	docker-compose build --no-cache
up:
	docker-compose up -d
account_go:
	docker-compose up account_go
down:
	docker-compose down

clean:lsls
	docker-compose down
	docker-compose rm -f

fclean: clean
	docker system prune -af

re: fclean all
