# Test Plan Guide for Homework 2

**A Beginner-Friendly Guide to Creating a Test Plan for Borsibaar**

This guide connects the theory from the course material to the practical homework task of creating a test plan for the Borsibaar application.

---

## Table of Contents

1. [Understanding Test Plans](#1-understanding-test-plans)
2. [Testing Objectives](#2-testing-objectives)
3. [Testing Levels](#3-testing-levels)
4. [Test Scope](#4-test-scope)
5. [Test Approach](#5-test-approach)
6. [Test Environment](#6-test-environment)
7. [Entry and Exit Criteria](#7-entry-and-exit-criteria)
8. [Roles and Responsibilities](#8-roles-and-responsibilities)
9. [Risks and Assumptions](#9-risks-and-assumptions)
10. [Test Deliverables](#10-test-deliverables)
11. [Putting It All Together](#11-putting-it-all-together)

---

## 1. Understanding Test Plans

### What Is a Test Plan?

A test plan is a **document that describes the testing strategy, objectives, schedule, resources, and scope** for a software project. Think of it as a roadmap for your testing activities.

### Why Do We Need It?

According to the theory material:
- Testing helps evaluate software quality and detect defects early
- Testing reduces project and product risks
- A test plan ensures everyone on the team knows what to test, how to test it, and when

### For Borsibaar Project

Borsibaar is a fullstack application with:
- **Backend**: Spring Boot (Java)
- **Frontend**: Next.js (React/TypeScript)
- **Database**: PostgreSQL
- **Purpose**: Stock exchange/bar management system

Your test plan will guide how to ensure this application works correctly and reliably.

---

## 2. Testing Objectives

### Theory Connection

From the study notes:
> Testing helps to:
> - Evaluate software quality
> - Detect defects early
> - Reduce project and product risks
> - Build confidence in the system

### What to Write in Your Test Plan

**Testing objectives** answer: "Why are we testing?"

#### Example Objectives for Borsibaar:

1. **Verify Functional Requirements**
   - Ensure user authentication works correctly
   - Validate inventory management operations (add, remove, adjust stock)
   - Confirm sales transactions are processed accurately

2. **Ensure Quality Attributes** (ISO 25010)
   - **Security**: JWT authentication protects user data
   - **Reliability**: System handles errors gracefully
   - **Performance**: API responds within acceptable time
   - **Usability**: Frontend is intuitive for bar staff

3. **Reduce Risks**
   - Prevent incorrect stock calculations
   - Avoid security vulnerabilities (injection attacks)
   - Ensure data integrity in database transactions

4. **Meet Project Requirements**
   - Satisfy stakeholder expectations
   - Ensure deployment readiness

### Practical Tip

Start with 3-5 clear, measurable objectives. Use verbs like "verify," "ensure," "validate," "confirm."

---

## 3. Testing Levels

### Theory Connection

From study notes, the five test levels are:
1. **Unit Testing** - individual components
2. **Component Integration Testing** - interfaces between components
3. **System Testing** - complete system
4. **System Integration Testing** - integration with external systems
5. **Acceptance Testing** - readiness for use

### What to Write in Your Test Plan

For each level, specify **what will be tested** and **who will test it**.

#### For Borsibaar:

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

### Practical Tip

In your test plan, create a table:

| Test Level | Focus Area | Testing Method | Responsible Party |
|------------|-----------|----------------|-------------------|
| Unit | Individual methods/components | Automated (JUnit, Jest) | Developers |
| Integration | API endpoints, service layer | Automated (Spring Test) | Developers |
| System | Full application workflows | Automated + Manual | QA Team |
| Acceptance | Business requirements | Manual/UAT | Stakeholders |

---

## 4. Test Scope

### Theory Connection

From study notes:
> Test planning includes defining what will be tested (in-scope) and what won't be tested (out-of-scope).

### What to Write in Your Test Plan

Test scope defines **boundaries** - what you WILL test and what you WON'T test.

#### In-Scope for Borsibaar:

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

### Practical Tip

Be specific! Instead of "test the application," say "test user login, inventory management, and sales processing."

---

## 5. Test Approach

### Theory Connection

From study notes:
- **Black-box Testing**: Based on specifications, no knowledge of code
- **White-box Testing**: Based on code structure
- **Functional vs Non-functional Testing**
- **Regression Testing**: Ensure changes don't break existing features
- **Test Design Techniques**: Equivalence Partitioning, Boundary Value Analysis, Decision Tables, etc.

### What to Write in Your Test Plan

The test approach describes **HOW** you will test.

#### For Borsibaar:

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

Use specific techniques from the theory:

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

### Practical Tip

Create sections in your test plan for:
1. What techniques you'll use
2. How much automation vs manual testing
3. What you'll test first (priorities)

---

## 6. Test Environment

### Theory Connection

From study notes:
> System testing is performed in a stable environment similar to production.

### What to Write in Your Test Plan

Describe the **technical setup** where testing will happen.

#### For Borsibaar:

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

### Practical Tip

Create a table showing what environment is used for which test level:

| Test Level | Environment | Database | Tools |
|-----------|------------|----------|-------|
| Unit | Developer laptop | H2 in-memory | JUnit, Jest |
| Integration | Dev environment | PostgreSQL (Docker) | Spring Test |
| System | QA environment | Dedicated test DB | Cypress, Postman |
| Acceptance | Staging | Staging DB | Manual, UAT tools |

---

## 7. Entry and Exit Criteria

### Theory Connection

From study notes:
> Test process activities include test planning, monitoring, and control. Entry and exit criteria help control when testing starts and ends.

### What to Write in Your Test Plan

**Entry Criteria**: Conditions that must be met BEFORE testing can begin
**Exit Criteria**: Conditions that must be met to consider testing complete

#### For Borsibaar:

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

### Practical Tip

Think of entry criteria as "What do I need to START testing?" and exit criteria as "What proves I'm DONE testing?"

---

## 8. Roles and Responsibilities

### Theory Connection

From study notes:
> Test process involves different activities and stakeholders. Clear roles prevent confusion.

### What to Write in Your Test Plan

Define **who does what** in testing.

#### For Borsibaar Team:

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

### Practical Tip

For your team of 4-5 students, you might assign:
- 1 person: Test Lead (coordinates, writes test plan)
- 2 people: Developers (write unit/integration tests)
- 1-2 people: QA Engineers (write and execute system/acceptance tests)

Everyone should participate in some testing activities!

---

## 9. Risks and Assumptions

### Theory Connection

From study notes:
> **Risk** is the possibility that something bad will happen
> Risk = Probability × Impact
>
> Risk management activities:
> - Risk identification
> - Risk assessment
> - Risk mitigation

### What to Write in Your Test Plan

**Risks**: Things that could go wrong
**Assumptions**: Things you're assuming to be true

#### Risks for Borsibaar:

Create a risk table:

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

### Practical Tip

**For Risks**: Think "What could prevent us from testing properly?" Then plan how to prevent or minimize each risk.

**For Assumptions**: Think "What are we taking for granted?" Document these so if an assumption is wrong, you can adjust the plan.

---

## 10. Test Deliverables

### Theory Connection

From study notes:
> **Test artifacts (testware)** include:
> - Test plan
> - Test cases
> - Test procedures
> - Test data
> - Test reports
> - Defect reports
> - Test completion report

### What to Write in Your Test Plan

List **what documents/artifacts** testing will produce.

#### For Borsibaar:

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

### Practical Tip

Create a deliverables checklist:
- [ ] Test Plan
- [ ] Test Cases (at least 50 for Borsibaar)
- [ ] Defect Reports (as found)
- [ ] Test Execution Report
- [ ] Test Metrics Report
- [ ] Test Completion Report

---

## 11. Putting It All Together

### Sample Test Plan Structure for Borsibaar

Here's how to organize your test plan document:

```
1. INTRODUCTION
   1.1 Purpose
   1.2 Scope
   1.3 Intended Audience
   1.4 Document Structure

2. TEST OBJECTIVES
   [Section 2 content from this guide]

3. TESTING LEVELS
   3.1 Unit Testing
   3.2 Integration Testing
   3.3 System Testing
   3.4 Acceptance Testing
   [Use Section 3 content]

4. TEST SCOPE
   4.1 In-Scope
   4.2 Out-of-Scope
   [Use Section 4 content]

5. TEST APPROACH
   5.1 Testing Types
   5.2 Test Design Techniques
   5.3 Automation Strategy
   5.4 Test Prioritization
   [Use Section 5 content]

6. TEST ENVIRONMENT
   6.1 Development Environment
   6.2 Test Environment
   6.3 Staging Environment
   6.4 Tools and Software
   6.5 Test Data
   [Use Section 6 content]

7. ENTRY AND EXIT CRITERIA
   7.1 Entry Criteria
   7.2 Exit Criteria
   [Use Section 7 content]

8. ROLES AND RESPONSIBILITIES
   [Use Section 8 content with team member names]

9. RISKS AND ASSUMPTIONS
   9.1 Risk Analysis
   9.2 Risk Mitigation
   9.3 Assumptions
   [Use Section 9 content]

10. TEST DELIVERABLES
    [Use Section 10 content]

11. TEST SCHEDULE
    [Create timeline based on your project dates]

12. APPROVALS
    [Signature section for team members and mentor]

APPENDICES
A. Test Case Template
B. Defect Report Template
C. Acronyms and Definitions
```

### Quick Checklist

Use this checklist to ensure your test plan is complete:

**Structure**
- [ ] All required sections included
- [ ] Table of contents
- [ ] Page numbers
- [ ] Version history

**Content - Required Elements**
- [ ] Testing objectives clearly stated
- [ ] All testing levels defined (unit, integration, system, acceptance)
- [ ] Test scope (in/out) specified
- [ ] Test approach documented with specific techniques
- [ ] Test environment described in detail
- [ ] Entry criteria for each test level
- [ ] Exit criteria for each test level
- [ ] Roles and responsibilities assigned
- [ ] Risks identified with mitigation strategies
- [ ] Assumptions documented
- [ ] Test deliverables listed

**Quality Checks**
- [ ] Borsibaar application features referenced
- [ ] Specific examples from the project
- [ ] Realistic and achievable criteria
- [ ] Clear, professional language
- [ ] No spelling/grammar errors
- [ ] Consistent formatting

**Theory Application**
- [ ] References test levels from course material
- [ ] Uses test design techniques (EP, BVA, etc.)
- [ ] Applies risk analysis principles
- [ ] Follows ISO 25010 quality attributes
- [ ] Incorporates ISTQB principles

### Tips for Success

1. **Be Specific to Borsibaar**: Don't write a generic test plan. Reference actual features like "JWT authentication", "inventory management", "sales transactions"

2. **Use the Theory**: Show you understand the course concepts by explicitly using them. For example:
   - "We will use Boundary Value Analysis for testing stock quantities"
   - "Following the principle that 'defects cluster together', we prioritize authentication testing"

3. **Be Realistic**: Don't promise 100% automation or unrealistic timelines. Be honest about what your team can achieve.

4. **Think Like a Tester**: Ask yourself:
   - What could go wrong?
   - How do we know the app works?
   - What would a user care about?

5. **Reference Your Repository**: Since you're using the actual Borsibaar codebase, reference real files:
   - "Unit tests in `backend/src/test/java/com/borsibaar/service/`"
   - "Integration tests for InventoryController at line 45"

6. **Collaborate**: This is a team assignment. Divide sections among team members but review together for consistency.

---

## Key Takeaways

1. **Test Plan = Roadmap**: It tells everyone what to test, how, when, and who does it

2. **Connect Theory to Practice**: Use concepts from study notes (test levels, techniques, risk analysis) in your plan

3. **Be Comprehensive**: Cover all 9 required sections thoroughly

4. **Be Specific**: Tailor everything to Borsibaar application, not generic testing

5. **Show Understanding**: Don't just list terms—explain how you'll apply them

6. **Make It Usable**: Your test plan should be something your team can actually follow

---

## Additional Resources

- **Your Study Notes**: `software-testing-study-notes.md` (review sections 6, 9, 10, 18-24)
- **Borsibaar Codebase**: Explore the actual code to understand what needs testing
- **ISTQB Glossary**: For standard testing terminology
- **IEEE 829 Standard**: For test plan templates (optional, for reference)

---

**Good luck with your homework! Remember: A good test plan shows you understand both the theory AND the application you're testing.**
