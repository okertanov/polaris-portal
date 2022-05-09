##
## Copyright (c) 2022 - Team11. All rights reserved.
##

##
## Default
##

all: build

##
## Local Infrastructure
##

build: install
	npm run build

install: node_modules

node_modules: package.json
	npm install

start:
	npm run start

start-dev:
	npm run start --watch

test:
	npm run test

clean:
	-@rm -rf ./dist

distclean: clean
	-@rm -rf ./node_modules

##
## Docker targets
##
docker-build:
	docker-compose build --parallel

##
## Publish targets
##

PROJECT_NAME=polaris-portal
HUB_REGISTRY_NAME=${PROJECT_NAME}
HUB_REGISTRY_USER=okertanov
HUB_REGISTRY_TOKEN=5bd37ac1-045d-4923-8c94-b0f9fbfbe19b

docker-publish: docker-build
	@echo ${HUB_REGISTRY_TOKEN} | docker login --username ${HUB_REGISTRY_USER} --password-stdin
	docker tag ${PROJECT_NAME}:latest ${HUB_REGISTRY_USER}/${HUB_REGISTRY_NAME}:latest
	docker push ${HUB_REGISTRY_USER}/${HUB_REGISTRY_NAME}:latest

.PHONY: all build install \
		start start-dev \
		test e2e \
		clean distclean \
		docker-build \
		docker-publish

.SILENT: clean docker-clean distclean
