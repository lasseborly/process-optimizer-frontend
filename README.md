# Process Optimizer Frontend

This project implements a web based frontend for the statistical tool [ProcessOptimizer](https://github.com/novonordisk-research/ProcessOptimizer). It is meant to be used in conjunction with the REST base API for ProcessOptimizer realised in [process-optimizer-api](https://github.com/BoostV/process-optimizer-api).

## Getting Started

Install dependencies and run the development server:

```bash
yarn install
```

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build and run production docker image

```bash
docker build -t process-optimizer-frontend .
docker run --rm -it --name process-optimizer-frontend -p 3000:3000 process-optimizer-frontend
```

## Run pre-built docker image 

```bash
docker run -d -p3000:3000 ghcr.io/boostv/process-optimizer-frontend/server:main
```
## Local development with docker

The included script "dockeryarn.sh" can be used as substitute for yarn if you have docker installed and don't want to use natively installed node installation

```bash
./dockeryarn.sh install
./dockeryarn.sh dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Update OpenAPI client

When the process-optimizer-api changes, adjust the API version in the "openapi" script in package.json run the following command and commit the resulting changes.

    yarn openapi

# Updating the change log

In order to keep the overhead of maintaining the change log as low as possible this project use a tool to automatically generate
as much of the change log as possible.

Before creating a new release please run the following command inside a clean working directory

    docker run -it --rm -v "$(pwd)":/usr/local/src/your-app githubchangeloggenerator/github-changelog-generator --user BoostV --project process-optimizer-frontend
## Learn More

This project is based on Next.js and follow the project structure and conventions of that project.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

