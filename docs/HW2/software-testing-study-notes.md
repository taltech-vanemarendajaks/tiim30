# Software Testing – Study Notes

Based on lecture material by Dmitri Mironov (TalTech)

---

## 1. What Is Software Testing?

Software testing is a **process in the software development lifecycle** used to evaluate the quality of a system or component and to **reduce the risk of failures**.

Key ideas:
- Software systems are everywhere
- Software sometimes fails
- Failures can cause serious damage
- Testing helps assess quality and reduce risk

> ⚠️ Testing does **not** prove the absence of defects — only their presence.

---

## 2. Why Is Testing Important?

Testing helps to:
- Evaluate software quality
- Detect defects early
- Reduce project and product risks
- Meet contractual, legal, and regulatory requirements
- Provide feedback to stakeholders
- Build confidence in the system

### Testing vs Quality Assurance
- **Testing** → evaluates software deliverables
- **Quality Assurance (QA)** → focuses on improving development processes
- Testing is part of QA, but not the whole of it

---

## 3. Errors, Defects, and Failures

### Definitions
- **Error (Mistake)**  
  A human action that produces an incorrect result

- **Defect (Bug/Fault)**  
  An imperfection in a work product that does not meet requirements

- **Failure**  
  A system does not perform a required function

### Relationship




---

## 4. Fundamental Principles of Testing (ISTQB)

1. **Testing shows presence of defects, not their absence**
2. **Exhaustive testing is impossible**
3. **Early testing saves time and money**
4. **Defects cluster together**
5. **Tests wear out**
6. **Testing is context-dependent**
7. **Absence of errors is a fallacy**

---

## 5. Risk Analysis

### What Is Risk?
Risk is the **possibility that something bad will happen**:
- Has a probability
- Has an impact
- Can be mitigated or monitored

### Risk Level


### Types of Risks
- **Project risks** (schedule, resources, skills)
- **Product risks** (quality, performance, security, usability)

### Risk Management Activities
- Risk identification
- Risk assessment
- Risk control
- Risk mitigation
- Risk monitoring

---

## 6. Test Process Activities

The test process consists of the following activities:

1. Test planning
2. Test monitoring and control
3. Test analysis
4. Test design
5. Test implementation
6. Test execution
7. Test completion

Each activity has a **clear goal** and follows a **specific order**.

---

## 7. Test Artifacts (Testware)

Examples of test artifacts:
- Test plan
- Risk register
- Test conditions
- Test cases
- Test procedures
- Test data
- Test reports
- Defect reports
- Test completion report

---

## 8. Requirements

### What Are Requirements?
Requirements describe:
- What the system must do
- System behavior
- Constraints
- Value for stakeholders

### Types of Requirements
- **Functional requirements** → WHAT the system does
- **Non-functional requirements** → HOW the system performs

Sources:
- Stakeholders
- Documentation
- Existing systems
- Standards and regulations

---

## 9. Software Quality Attributes (ISO 25010)

Main quality characteristics:
- Functional suitability
- Reliability
- Usability
- Performance efficiency
- Security
- Compatibility
- Maintainability
- Portability

---

## 10. Test Levels

1. **Unit (Component) Testing**
2. **Component Integration Testing**
3. **System Testing**
4. **System Integration Testing**
5. **Acceptance Testing**

---

## 11. Unit Testing

- Tests individual components (classes, methods)
- Performed in isolation
- Often automated
- Typical defects:
  - Incorrect logic
  - Data flow issues

Pros:
- Fast feedback
- Finds defects early

Cons:
- No user perspective
- Requires technical skills

---

## 12. Integration Testing

### Component Integration Testing
- Tests interfaces between components or systems
- Focuses on communication and data exchange

Integration strategies:
- Functional (incremental)
- Big Bang

---

## 13. System Testing

- Tests the complete system
- Functional and non-functional
- Performed in a stable environment similar to production
- Often done by an independent team

---

## 14. Acceptance Testing

Purpose:
- Validate readiness for use
- Focus on business needs, not defect discovery

Types:
- User Acceptance Testing (UAT)
- Operational Acceptance Testing (OAT)
- Alpha and Beta testing
- Contract and regulation acceptance testing

---

## 15. Test Types

### Black-box Testing
- Based on specifications
- No knowledge of internal structure

### White-box Testing
- Based on internal structure (code)
- Focuses on coverage

### Grey-box Testing
- Partial knowledge of internals

---

## 16. Functional vs Non-Functional Testing

### Functional Testing
- Verifies system behavior
- WHAT the system does

### Non-Functional Testing
- Verifies quality attributes
- HOW WELL the system works
- Includes:
  - Performance
  - Load
  - Stress
  - Security
  - Usability
  - Reliability

---

## 17. Confirmation and Regression Testing

- **Confirmation testing (re-test)**  
  Verifies a defect fix

- **Regression testing**  
  Ensures changes did not break existing functionality  
  → Strong candidate for automation

---

## 18. Black-Box Test Design Techniques

- Equivalence Partitioning
- Boundary Value Analysis
- Decision Table Testing
- State Transition Testing
- Use Case–Based Testing

---

## 19. Equivalence Partitioning (EP)

Idea:
- Divide inputs into groups that behave similarly
- Test one value per group

Benefits:
- Reduces number of tests
- Works at all test levels

Rules:
- Valid partitions can be combined
- Invalid partitions should be tested separately

---

## 20. Boundary Value Analysis (BVA)

- Defects often occur at boundaries
- Test values:
  - On the boundary
  - Just below
  - Just above

Types:
- 2-value BVA
- 3-value BVA

---

## 21. Decision Table Testing

Used when:
- Business rules are complex
- Many condition combinations exist

Approach:
- Identify conditions and actions
- Create rules for combinations
- One test per rule

---

## 22. State Transition Testing

Used when:
- System behavior depends on state
- Past actions affect current behavior

Focus:
- States
- Valid transitions
- Invalid transitions

---

## 23. Use Case–Based Testing

- Based on user scenarios
- Covers:
  - Main flow
  - Alternative flows
- Suitable for:
  - Integration testing
  - Acceptance testing

---

## 24. White-Box Test Design

Goals:
- Measure test coverage
- Improve coverage

Coverage types:
- Statement coverage
- Decision/branch coverage

White-box tests **complement**, not replace, black-box tests.

---

## 25. Test Coverage

Test coverage indicates how much of the code is exercised by tests.

Formula:


Coverage helps identify **untested areas**, not correctness.

---
