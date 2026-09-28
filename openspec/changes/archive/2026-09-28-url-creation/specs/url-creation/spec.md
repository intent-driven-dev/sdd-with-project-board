## Purpose

Allow visitors to create a shareable short URL from a destination URL and follow the generated link to that destination.

## ADDED Requirements

### Requirement: URL creation form
The system SHALL provide a creation page with a labeled destination URL field and a **Shorten URL** button.

#### Scenario: View the creation form
- **WHEN** a visitor opens the creation page
- **THEN** the destination URL field and **Shorten URL** button are visible and usable

### Requirement: Generate a short URL
The system SHALL accept an absolute HTTP or HTTPS destination URL, ignoring surrounding whitespace, and generate a short URL that resolves to that destination. Creating another link SHALL NOT change the destination of any previously generated link during the running process.

#### Scenario: Create a link
- **WHEN** a visitor submits a valid HTTP or HTTPS destination using **Shorten URL**
- **THEN** the system generates a short URL associated with the destination

#### Scenario: Trim surrounding whitespace
- **WHEN** a visitor submits a valid destination surrounded by whitespace
- **THEN** the system creates a link for the trimmed destination

#### Scenario: Preserve earlier links
- **WHEN** a visitor creates a second link for a different destination
- **THEN** both short URLs resolve to their respective destinations

### Requirement: Show a clickable result
After successful creation the system SHALL show the generated short URL in a result area as a link whose target is that short URL.

#### Scenario: See and select the result
- **WHEN** URL creation completes successfully
- **THEN** the result area displays the generated short URL as a selectable link

### Requirement: Follow a short URL
The system SHALL redirect a visitor following a generated short URL to its stored destination, preserving the destination's path, query parameters, and fragment. Generated mappings SHALL remain available throughout the running process; durability across restarts is outside this initial change.

#### Scenario: Follow the generated link
- **WHEN** a visitor selects a generated short URL associated with `https://example.com/articles?id=42#details`
- **THEN** the browser receives a redirect to `https://example.com/articles?id=42#details`

#### Scenario: Reuse a shared link
- **WHEN** another browser requests a generated short URL while the application process remains running
- **THEN** it receives a redirect to the same destination without requiring the creator's session

### Requirement: Invalid destination feedback
The system SHALL reject empty input, malformed URLs, relative URLs, and schemes other than HTTP or HTTPS. It SHALL show an understandable error alongside the form, retain the submitted text safely, and create no short URL for rejected input.

#### Scenario: Reject invalid input
- **WHEN** a visitor submits an empty value, `not-a-url`, `/relative`, or `javascript:alert(1)`
- **THEN** the form shows an error and no short URL is generated

#### Scenario: Treat submitted markup as text
- **WHEN** rejected input contains HTML markup
- **THEN** the form displays the submitted value as text without executing it

### Requirement: Unknown short link
The system SHALL return an HTTP 404 response with an understandable not-found message for an unrecognized short link.

#### Scenario: Follow an unknown link
- **WHEN** a visitor requests a short code that has no stored destination
- **THEN** the system returns HTTP 404 without redirecting
