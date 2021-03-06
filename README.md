[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/cycle2work/c2w-lambda-api-clubs.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/cycle2work/c2w-lambda-api-clubs/context:javascript)
[![Build Status](https://travis-ci.org/cycle2work/c2w-lambda-api-clubs.svg?branch=master)](https://travis-ci.org/cycle2work/c2w-lambda-api-clubs)
[![codecov](https://codecov.io/gh/cycle2work/c2w-lambda-api-clubs/branch/master/graph/badge.svg)](https://codecov.io/gh/cycle2work/c2w-lambda-api-clubs)
[![Dependency Status](https://david-dm.org/cycle2work/c2w-lambda-api-clubs.svg)](https://david-dm.org/cycle2work/c2w-lambda-api-clubs)
[![devDependency Status](https://david-dm.org/cycle2work/c2w-lambda-api-clubs/dev-status.svg)](https://david-dm.org/cycle2work/c2w-lambda-api-clubs#info=devDependencies)

# c2w-lambda-api-clubs

AWS Lambda function to expose user activities data and enjoy [`Cycle2work`](https://cycle2work.io).

After cloning the repository, run `npm install` or [`yarn`](https://yarnpkg.com) to install all dependencies.

## Table of Contents

- [Configuration](#folder-structure)
  - [Env Vars](#env-vars)

## Configuration

The lambda can be configured using a [`dotenv`](https://github.com/motdotla/dotenv) file (key=value format).

## Env Vars

Example of `.env` file:

```bash
MONGODB_URL="mongodb://localhost:27017/test"
LOG_LEVEL=debug
```
