# Fake API Test (Mocha, Chai, Allure)

## Overview
This project is a **TypeScript-based API testing framework** using:
- **Mocha** (Test Runner)
- **Chai** (Assertions)
- **Axios** (HTTP Client)
- **Allure** (Test Reporting)

It tests the [FakeREST API](https://fakerestapi.azurewebsites.net/) with automated test cases.

---
## Features

✅ **Automated API Testing** for GET, POST, PUT, DELETE requests  
✅ **Allure Reporting** for Test Execution Results  
✅ **GitHub Actions Integration** for CI/CD  
✅ **Parallel Test Execution** for Faster Testing  

---
## Installation

1️⃣ Clone the repository:
```sh
git clone https://github.com/GoranovBorislav/fake-api-test.git
cd fake-api-test
```
2️⃣ Install dependencies:
```
npm install
```

---
## Running Tests

Run all tests:
```
npm run test
```

Run tests in parallel:
```
npm run parallel-test
```

---
## Allure Reporting

Generate Report:
```
allure generate allure-results --clean -o allure-report
```
Open Report:
```
allure open allure-report
```

---
## 🔄 Continuous Integration (CI)

This project uses GitHub Actions to:
✅ Run tests automatically on push & pull_request
✅ Deploy Allure reports to GitHub Pages
