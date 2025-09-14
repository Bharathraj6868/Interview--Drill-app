.PHONY: up down logs install build dev clean

# Docker commands
up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

# Development commands
install:
	npm install

build:
	npm run build

dev:
	npm run dev

# Database commands
db-seed:
	node scripts/seed-database.js

# Utility commands
clean:
	rm -rf node_modules .next out

# Quick start
start: up
	@echo "Services are starting..."
	@echo "MongoDB Express: http://localhost:8081"
	@echo "Application: http://localhost:3000"
	@echo "Use 'make logs' to view logs"

# Stop everything
stop: down
	@echo "Services stopped"