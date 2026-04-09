Feature: Clerk Authentication Integration
  As a user
  I want to sign in securely
  So that I can manage my own Linktree profile

  Background:
    Given the application is running at http://localhost:3000

  Scenario: Unauthenticated user is redirected from admin area
    Given the user is not logged in
    When the user navigates to "/dashboard"
    Then the user should be redirected to the Clerk login page

  Scenario: Authenticated user can see their dashboard link
    Given the user is logged in as "user_3C8UoStuQKr96G2yOk3zMwMutGq"
    When the user views the home page
    Then the user should see a "Go to your Dashboard" button

  Scenario: Authenticated user cannot access other user's data (IDOR prevention)
    Given the user is logged in as "user_B"
    When the user navigates to "/dashboard/fawredd" (owned by user_3C8UoStuQKr96G2yOk3zMwMutGq)
    Then the system should return a 404 Not Found error
