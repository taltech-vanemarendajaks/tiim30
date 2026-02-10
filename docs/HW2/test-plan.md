
# Test Plan Team30
---

## Table of Contents

1. [Testing Objectives](#2-testing-objectives)
2. [Testing Levels](#3-testing-levels)
3. [Test Scope](#4-test-scope)
4. [Test Approach](#5-test-approach)
5. [Test Environment](#6-test-environment)
6. [Entry and Exit Criteria](#7-entry-and-exit-criteria)
7. [Roles and Responsibilities](#8-roles-and-responsibilities)
8. [Risks and Assumptions](#9-risks-and-assumptions)
9. [Test Deliverables](#10-test-deliverables)


---

## 1. Testing Objectives

#### Here are the main objectives  for Borsibaar application testing:

1. **Verify Functional Requirements**
   - Ensure user authentication works correctly
   - Validate inventory management operations (add, remove, adjust stock)
  2. **Data Integrity**
 		-  Validate that all transactions, inventory updates, and sales records are accurate and persistent.

3. **Ensure Quality Attributes** (ISO 25010)
   - **Security**: JWT authentication protects user data
   - **Reliability**: System handles errors gracefully
   - **Performance**: API responds within acceptable time
   - **Usability**: Frontend is intuitive for bar staff

4. **Reduce Risks**
   - Prevent incorrect price corrections
   - Avoid security vulnerabilities (injection attacks)
   - Ensure data integrity in database transactions

5. **Meet Project Requirements**
   - Ensure organizations can only access and modify their own data.
     (multi-tenant isolation)
   - Confirm that business rules (e.g., insufficient stock prevention, inactive product handling) are enforced correctly.


---

## 2. Testing Levels



**Unit Testing**
- **What**: Individual Java classes (services, repositories, controllers), React components
- **Example**: Test `InventoryService.addStock()` method in isolation
- **Tools**: JUnit (backend), Jest/React Testing Library (frontend)
- **Who**: Developers

**Component Integration Testing**
- **What**: Integration between layers (controller → service → repository)
- **Example**: Test that `InventoryController` correctly calls `InventoryService` and saves to database
- **Tools**: Spring Boot Test with MockMvc
- **Who**: Developers

**System Testing**
- **What**: Complete application (backend + frontend + database)
- **Example**: Test complete user flow: login → view inventory → add stock → verify in database
- **Tools**: Postman (API), Cypress/Playwright (E2E)
- **Who**: QA team or dedicated testers

**System Integration Testing**
- **What**: Integration with external systems (if any)
- **Example**: OAuth2 authentication with external providers
- **Who**: QA team

**Acceptance Testing**
- **What**: Validate business requirements
- **Example**: Bar manager can complete end-of-day inventory check
- **Tools**: Manual testing or automated E2E
- **Who**: Product owner, stakeholders, end users



| Test Level | Focus Area | Testing Method | Responsible Party |
|------------|-----------|----------------|-------------------|
| Unit | Individual methods/components | Automated (JUnit, Jest) | Developers |
| Integration | API endpoints, service layer | Automated (Spring Test) | Developers |
| System | Full application workflows | Automated + Manual | QA Team |
| Acceptance | Business requirements | Manual/UAT | Stakeholders |

---

## 3. Test Scope

#### In-Scope

**Functional Testing**
- Authentication and authorization
- User management (CRUD operations)
- Organization management
- Bar station management
- Product and category management
- Inventory operations (add, remove, adjust stock)
- Sales transactions
- Dashboard and reporting

**Non-Functional Testing**
- Security (authentication, authorization, input validation)
- Performance (API response times)
- Usability (frontend navigation)
- Compatibility (browser compatibility for frontend)

**Specific Features**
- JWT token validation
- Database transactions
- REST API endpoints
- Frontend forms and validation

#### Out-of-Scope:

- Third-party OAuth2 provider functionality (Google, etc.)
- Database server performance (PostgreSQL internals)
- Infrastructure/network testing
- Mobile app testing (if not part of project)
- Load testing beyond basic performance checks
- Security penetration testing (unless specified)

---

## 4. Test Approach


**1. Testing Types**

- **Functional Testing** (Black-box)
  - Test what the system does based on requirements
  - Example: Test that adding stock increases inventory count

- **White-box Testing**
  - Unit tests verify code coverage
  - Target: 80% code coverage for backend services

- **Regression Testing**
  - Automated test suite runs on every code change
  - Ensures new features don't break existing functionality

**2. Test Design Techniques**

- **Equivalence Partitioning**
  - Example: For stock quantity input
    - Valid partition: 1-10000
    - Invalid partitions: negative numbers, zero, > 10000

- **Boundary Value Analysis**
  - Test boundary values for stock quantity: 0, 1, 9999, 10000, 10001

- **Decision Table Testing**
  - For user permissions based on role
  - Example: What actions can ADMIN vs CASHIER vs VIEWER perform?

- **State Transition Testing**
  - For inventory states: Available → Reserved → Sold

- **Use Case-Based Testing**
  - Test realistic user scenarios: "Bar staff sells 5 beers during happy hour"

**3. Automation Strategy**

- **Unit Tests**: 100% automated (JUnit, Jest)
- **Integration Tests**: 100% automated (Spring Boot Test)
- **System Tests**: 70% automated (Cypress/Playwright), 30% manual
- **Acceptance Tests**: 50% automated, 50% manual

**4. Test Prioritization**

Based on theory principle "Defects cluster together" and risk analysis:

- **High Priority**
  - Authentication and security
  - Sales transactions (money involved)
  - Inventory calculations

- **Medium Priority**
  - User management
  - Reporting

- **Low Priority**
  - UI cosmetic issues
  - Non-critical features


---

## 5. Test Environment

**Development Environment**
- **Purpose**: Unit and integration testing
- **Setup**:
  - Backend: Java 21, Spring Boot 3.5.5, Maven
  - Frontend: Node.js, Next.js 15
  - Database: PostgreSQL 15 (Docker container)
  - Docker Compose for local environment
- **Who uses it**: Developers

**Test Environment (QA)**
- **Purpose**: System testing, integration testing
- **Setup**:
  - Separate server/VM or Docker containers
  - PostgreSQL test database (separate from dev)
  - Test data pre-loaded
  - Configured with test environment variables
- **URL**: `http://test.borsibaar.local` (example)
- **Who uses it**: QA team

**Staging Environment**
- **Purpose**: Acceptance testing, pre-production verification
- **Setup**:
  - Mirrors production environment
  - Production-like data (anonymized)
  - HTTPS enabled
  - Same infrastructure as production
- **URL**: `https://staging.borsibaar.com` (example)
- **Who uses it**: Stakeholders, end users

**Production Environment**
- **Purpose**: Post-deployment smoke tests only
- **Setup**: Live environment
- **Testing**: Limited smoke tests, monitoring

**Software and Tools**
- **Backend Testing**: JUnit 5, Mockito, Spring Boot Test
- **Frontend Testing**: Jest, React Testing Library, Cypress
- **API Testing**: Postman, REST Client
- **Version Control**: Git
- **CI/CD**: GitHub Actions (or GitLab CI)
- **Bug Tracking**: Jira, GitHub Issues

**Test Data**
- Sample users with different roles (Admin, Cashier, Viewer)
- Test products and categories
- Pre-configured bar stations
- Sample sales transactions



| Test Level | Environment | Database | Tools |
|-----------|------------|----------|-------|
| Unit | Developer laptop | H2 in-memory | JUnit, Jest |
| Integration | Dev environment | PostgreSQL (Docker) | Spring Test |
| System | QA environment | Dedicated test DB | Cypress, Postman |
| Acceptance | Staging | Staging DB | Manual, UAT tools |

---

## 6. Entry and Exit Criteria

**Entry Criteria (Before testing starts)**

For Unit Testing:
- Code is committed to version control
- Code compiles without errors
- Developer has run local tests

For Integration Testing:
- Unit tests pass with >80% coverage
- Test environment is set up
- Test database contains test data
- API documentation is available

For System Testing:
- All integration tests pass
- Application is deployed to test environment
- Test cases are written and reviewed
- Test data is prepared
- QA environment is stable

For Acceptance Testing:
- All system tests pass
- Application is deployed to staging
- User documentation is complete
- Stakeholders are available for testing

**Exit Criteria (When testing is complete)**

For Unit Testing:
- All unit tests pass
- Code coverage >= 80% for critical components
- No critical or high-severity defects remain

For Integration Testing:
- All integration tests pass
- All API endpoints return expected responses
- Database transactions work correctly
- No critical defects remain

For System Testing:
- All test cases executed
- 95% pass rate for test cases
- All critical and high severity defects fixed
- Regression tests pass
- Performance benchmarks met (e.g., API response < 500ms)

For Acceptance Testing:
- All business scenarios validated
- Stakeholders approve
- All critical defects fixed
- User documentation approved
- System ready for production deployment

**Overall Exit Criteria**
- Test completion report created
- Defect metrics acceptable (e.g., <5 medium bugs, 0 critical bugs)
- Test coverage goals met
- All deliverables completed
- Sign-off from project stakeholders
---

## 7. Roles and Responsibilities

**Developer**
- Write unit tests for all code
- Fix defects found in unit/integration testing
- Perform code reviews
- Maintain test automation scripts
- Achieve code coverage targets

**QA Engineer / Tester**
- Create test cases for system testing
- Execute manual tests
- Report defects in bug tracking system
- Verify defect fixes (confirmation testing)
- Maintain test documentation
- Perform regression testing

**Test Lead / QA Lead**
- Create and maintain test plan
- Define test strategy and approach
- Assign test cases to testers
- Monitor testing progress
- Report test results to stakeholders
- Coordinate with development team
- Make go/no-go decisions

**Product Owner**
- Define acceptance criteria
- Participate in acceptance testing
- Prioritize defect fixes
- Provide business requirements clarity
- Sign off on test completion

**DevOps Engineer**
- Set up and maintain test environments
- Configure CI/CD pipelines for automated tests
- Ensure test environment stability
- Provide access to test environments

**Project Manager**
- Ensure testing resources are available
- Track testing schedule
- Escalate blocking issues
- Coordinate testing activities with development timeline

--

## 8. Risks and Assumptions


| Risk ID | Risk Description | Probability | Impact | Risk Level | Mitigation Strategy |
|---------|-----------------|-------------|--------|------------|-------------------|
| R1 | Insufficient test coverage | Medium | High | **High** | Set code coverage minimum (80%), automate tests |
| R2 | Test environment instability | Low | Medium | **Medium** | Use Docker for consistency, have backup environment |
| R3 | Limited testing time before deadline | High | High | **High** | Prioritize critical features, automate regression tests |
| R4 | Lack of testing expertise in team | Medium | Medium | **Medium** | Training sessions, pair testing, use this guide! |
| R5 | Complex integration with OAuth2 | Low | High | **Medium** | Test early, use mocks for third-party services |
| R6 | Database migration issues | Medium | High | **High** | Test Liquibase migrations in test environment first |
| R7 | Performance degradation under load | Medium | Medium | **Medium** | Include basic performance tests, monitor response times |
| R8 | Security vulnerabilities (SQL injection, XSS) | Low | Critical | **High** | Use security testing tools, input validation tests |
| R9 | Test data quality issues | Medium | Low | **Low** | Create comprehensive test data sets, document test data |
| R10 | Defects found late in testing cycle | Medium | High | **High** | Early testing (shift-left), continuous integration |

**Risk Level Calculation**:
- Probability: Low (1), Medium (2), High (3)
- Impact: Low (1), Medium (2), High (3), Critical (4)
- Risk Level: Probability × Impact
  - 1-2: Low
  - 3-4: Medium
  - 6-12: High

#### Assumptions for Borsibaar:

1. **Technical Assumptions**
   - Test environment will be available and stable
   - Docker containers will run consistently across team machines
   - PostgreSQL database will be accessible
   - Internet connection available for OAuth2 testing

2. **Resource Assumptions**
   - All team members available for testing activities
   - Testing tools (JUnit, Jest, Cypress) are available
   - Test data can be created and reset as needed

3. **Schedule Assumptions**
   - Two weeks available for comprehensive testing
   - Development code freeze 3 days before deadline
   - Time available for defect fixes

4. **Scope Assumptions**
   - Requirements are complete and won't change significantly
   - Only testing features documented in requirements
   - Access to source code for white-box testing

5. **Quality Assumptions**
   - Code follows standard conventions
   - Documentation is up to date
   - Version control practices are followed


---

## 9. Test Deliverables

**Planning Phase**
1. **Test Plan** (this document!)
   - Purpose: Overall testing strategy
   - Audience: Entire team, stakeholders
   - When: Before testing starts

2. **Risk Register**
   - Purpose: Track and monitor risks
   - Content: Risks, mitigation strategies, status
   - When: Created during planning, updated throughout

**Analysis and Design Phase**
3. **Test Case Specifications**
   - Purpose: Detailed steps for each test
   - Format: ID, Description, Preconditions, Steps, Expected Results
   - Example: "TC_001: Test user login with valid credentials"
   - When: Before test execution

4. **Test Data Specification**
   - Purpose: Document test users, products, scenarios
   - Content: Sample data for different test scenarios
   - When: Before test execution

5. **Traceability Matrix**
   - Purpose: Map requirements to test cases
   - Ensures all requirements are tested
   - Format: Requirement ID ↔ Test Case IDs
   - When: During test design

**Execution Phase**
6. **Test Execution Reports**
   - Purpose: Daily/weekly status of testing
   - Content: Tests run, pass/fail status, defects found
   - When: During test execution

7. **Defect Reports**
   - Purpose: Document bugs found
   - Content:
     - Defect ID, Title, Description
     - Steps to reproduce
     - Expected vs Actual result
     - Severity, Priority
     - Screenshots/logs
   - Tool: GitHub Issues, Jira
   - When: As defects are found

8. **Test Logs**
   - Purpose: Record of automated test runs
   - Content: Test results, timestamps, pass/fail
   - When: Automated with each test run

**Completion Phase**
9. **Test Metrics Report**
   - Purpose: Quantify testing effort and quality
   - Metrics:
     - Total test cases written/executed
     - Pass/fail percentage
     - Code coverage percentage
     - Defect density (defects per module)
     - Defects by severity
     - Test execution progress
   - When: Weekly during testing, final at end

10. **Test Completion Report**
    - Purpose: Summarize entire testing effort
    - Content:
      - Testing summary
      - Test coverage achieved
      - Defects found and status
      - Exit criteria met/not met
      - Risks that materialized
      - Lessons learned
      - Recommendations
      - Go/No-Go decision
    - Audience: Stakeholders, management
    - When: At end of testing phase

**Continuous Deliverables**
11. **Automated Test Scripts**
    - JUnit tests for backend
    - Jest tests for frontend
    - Cypress E2E tests
    - Location: Project repository

12. **Code Coverage Reports**
    - Generated by tools (JaCoCo for Java, Istanbul for JS)
    - Shows which code is tested
    - When: With each build


> Written with [StackEdit](https://stackedit.io/).