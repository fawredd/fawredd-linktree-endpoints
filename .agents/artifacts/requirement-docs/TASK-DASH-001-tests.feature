Feature: Admin Dashboard Implementation
  As an owner
  I want to manage my profiles and links
  So that my landing page is always up to date

  Background:
    Given the user is logged in as "user_3C8UoStuQKr96G2yOk3zMwMutGq"
    And the user is on the "/dashboard" page

  Scenario: User views their profiles
    Then the user should see a list containing the profile "fawredd"

  Scenario: User edits a profile
    When the user clicks on the "Manage Content" button for "fawredd"
    Then the user should see the Profile Editor for "/fawredd"
    And the Profile Editor should display the real-time preview

  Scenario: User modifies profile display name
    Given the user is in the Profile Editor for "fawredd"
    When the user changes "Display Name" to "FAWREDD PRO"
    And the user clicks "Save Changes"
    Then a success message "Profile updated successfully" should appear

  Scenario: User adds a new link
    Given the user is in the Profile Editor for "fawredd"
    When the user clicks "Add Link"
    Then a new link item "New Link" should appear in the links list

  Scenario: User deletes a link
    Given the user is in the Profile Editor for "fawredd"
    And the user has a link titled "Old Link"
    When the user clicks the "Delete" icon for "Old Link"
    And the user confirms the deletion
    Then the link "Old Link" should disappear from the list
