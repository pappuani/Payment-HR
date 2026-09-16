# 👥💳 Cafe QR HR & Payment Modules - E2E Automation Suite

Enterprise-grade End-to-End (E2E) automation and negative boundary test suite for the **HR & Payroll Management Module** and **Payment & Credit Settlements Module** on the Cafe QR platform (`https://cafe-test-qr-frontend.vercel.app`) using **Playwright**, **TypeScript**, and the **Page Object Model (POM)** pattern.

---

## 📊 Complete Test Matrix & Coverage

### 1️⃣ HR Employee Lifecycle & Directory Management (`tests/01-hr-employee-management.spec.ts`)
| Test ID | Test Case Objective | Result | Complete Field / Feature Coverage |
|---|---|:---:|---|
| **TC-01** | HR Dashboard Loading & Segmented Tabs | **PASSED** | Validates Header, `TOTAL EMPLOYEES`, `ACTIVE STAFF`, and all 7 sub-tabs |
| **TC-02** | Multi-Criteria Search & Filtering | **PASSED** | Name/Email search, Department dropdown, Employment Type (Full Time/Part Time/Hourly) |
| **TC-03** | **Complete New Employee Registration (13 Fields)** | **PASSED** | `firstName`, `lastName`, `email`, `phone`, `departmentId`, `designationId`, `employmentType`, `baseSalary`, `bankAccountNumber`, `bankRoutingNumber`, `taxId`, `nationalId`, `pinCode` |
| **TC-04** | Row Action Triggers Inspection | **PASSED** | Validates Manage Pay Rules, Edit, and Delete action triggers |
| **TC-05** | Departments & Designations Modals | **PASSED** | Inspects Department and Designation configuration modals |

---

### 2️⃣ HR Timesheets & Leave Approvals (`tests/02-hr-leave-and-timesheet.spec.ts`)
| Test ID | Test Case Objective | Result | Observations |
|---|---|:---:|---|
| **TC-06** | Timesheets Date Range Filters | **PASSED** | Tests "Today", "Last 30 Days", and custom `startDate`/`endDate` pickers |
| **TC-07** | Add Timecard Modal Trigger | **PASSED** | Opens and verifies timecard override entry dialog |
| **TC-08** | Leave Approvals Directory | **PASSED** | Verifies leave request directory and status badges |
| **TC-09** | New Leave Request Workflow | **PASSED** | Tests leave dialog submission and cancellation handling |

---

### 3️⃣ HR Payroll Engine & Salary Advances (`tests/03-hr-payroll-and-salary-advances.spec.ts`)
| Test ID | Test Case Objective | Result | Observations |
|---|---|:---:|---|
| **TC-10** | Salary Advances Ledger & Headers | **PASSED** | Validates Employee, Date Issued, Total Loan, Monthly Deduction, Remaining Balance |
| **TC-11** | Issue Salary Advance Dialog | **PASSED** | Tests loan issuance dialog with loan amount and deduction inputs |
| **TC-12** | Salary Rules & Components | **PASSED** | Tests New Salary Component modal for allowances and deductions |
| **TC-13** | Run Payroll Engine Execution | **PASSED** | Runs batch payroll calculation engine with title and cycle date range |

---

### 4️⃣ Payment & Credit Settlements Module (`tests/04-payment-settlements-and-modes.spec.ts`)
| Test ID | Test Case Objective | Result | Observations |
|---|---|:---:|---|
| **TC-14** | Payment Dashboard Metrics | **PASSED** | Validates `ACTIVE CUSTOMERS`, `TOTAL OWED`, `TOTAL CREDIT LIFE` |
| **TC-15** | Customer Payment Collection (Cash) | **PASSED** | Opens Record Payment, inputs amount & notes, confirms settlement deduction |
| **TC-16** | Multi-Payment Methods (UPI/Card/Bank) | **PASSED** | Validates all available settlement payment options |
| **TC-17** | Vendor Credit & Supplier Payments | **PASSED** | Verifies supplier ledgers, balance payables, and PO payment dialogs |
| **TC-18** | Partner Customer Registration | **PASSED** | Creates customer partner with assigned credit limits |

---

### 5️⃣ Negative Boundary & Validation Safeguards (`tests/05-negative-and-boundary-validations.spec.ts`)
| Test ID | Test Scenario | Result | Status |
|---|---|:---:|:---:|
| **TC-19** | Empty Form Mandatory Field Enforcement | **PASSED** | HTML5 / Frontend validation prevents empty submission |
| **TC-20** | Negative & Zero Payment Input Boundary | **PASSED** | Prevents or handles negative payment values |
| **TC-21** | Search Filter Resilience (Non-matching query) | **PASSED** | Validates graceful empty state UI |
| **TC-22** | Modal Escape & Cancel Button Integrity | **PASSED** | Confirms clean state recovery across all submodules |

---

## 🛠️ Tech Stack & Architecture

- **Test Framework**: [Playwright](https://playwright.dev/)
- **Language**: TypeScript / Node.js
- **Design Pattern**: Page Object Model (POM)
- **Browser Targets**: Google Chrome
- **Artifacts**: Automatic Video Recordings, Screenshots, Traces & HTML Reports

---

## 📂 Project Structure

```
HR-and-Payment-automation/
├── pages/
│   ├── LoginPage.ts                            # Page Object: Login & Session
│   ├── HRPage.ts                               # Page Object: 100% HR Module Fields & Methods
│   └── PaymentPage.ts                          # Page Object: 100% Payment & Settlement Fields
├── tests/
│   ├── 01-hr-employee-management.spec.ts        # Employee Directory & 13-Field Registration
│   ├── 02-hr-leave-and-timesheet.spec.ts        # Timesheets, Presets & Leave Approvals
│   ├── 03-hr-payroll-and-salary-advances.spec.ts# Advances, Rules & Payroll Engine
│   ├── 04-payment-settlements-and-modes.spec.ts # Customer/Vendor Payments & Modes
│   └── 05-negative-and-boundary-validations.spec.ts # Boundary & Negative Tests
├── playwright.config.ts                        # Playwright Runner Configuration
├── tsconfig.json                               # TypeScript Config
├── package.json                                # NPM Scripts
└── README.md                                   # Suite Documentation
```

---

## 🚦 Execution Commands

```bash
# Run all tests in Headed Chrome
npx playwright test --headed

# Run individual modules
npx playwright test tests/01-hr-employee-management.spec.ts --headed
npx playwright test tests/02-hr-leave-and-timesheet.spec.ts --headed
npx playwright test tests/03-hr-payroll-and-salary-advances.spec.ts --headed
npx playwright test tests/04-payment-settlements-and-modes.spec.ts --headed
npx playwright test tests/05-negative-and-boundary-validations.spec.ts --headed

# View HTML Report
npx playwright show-report
```
