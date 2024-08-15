# Le Club - Coach Web Application

## Running a development server

```sh
# only use --build when you've edited some files outside ./src (e.g. you've updated your dependencies with `yarn add`) 
docker compose -f docker-compose.development.yml up --build 
```

Live reloading is enabled by default for all files under in the .src directory.

## Deploying on AWS

### Creating an ECS context for local to remote deployment

```sh
docker context create ecs # prompts user to enter their AWS credentials
docker context use ecs
```

### Building a new image and pushing it into ECR

```sh
docker context use default # make sure to use default context while building
docker buildx build --platform=linux/amd64 -t 052941667971.dkr.ecr.eu-west-3.amazonaws.com/le-club-coach:latest -o type=registry .
```

### Updating the ECS container

When everything is ready for deployment (make sure URLs and ENV variables reflect real world usage),
you can update the service remotely on AWS with compose.

```sh
docker context use ecs # make sure to use default context while updating
docker compose -f '/Users/evan/Documents/le-club/development/le-club-web/docker-compose.prod.yml' up
```