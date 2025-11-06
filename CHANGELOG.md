# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2025-11-06

### Added

- Automated release workflow for version management
- Automatic changelog generation

### Changed

- Refactored ask-rs page

## Version Bump Guidelines

This project uses semantic versioning:

- **MAJOR** version (X.0.0): Breaking changes
  - Commit format: `feat!: description` or `BREAKING CHANGE:` in commit body
- **MINOR** version (0.X.0): New features (backwards compatible)
  - Commit format: `feat: description` or `feature: description`
- **PATCH** version (0.0.X): Bug fixes and minor changes
  - Commit format: `fix:`, `chore:`, `docs:`, or any other prefix

### Examples:

- `feat: add new chat interface` → Minor version bump (1.0.4 → 1.1.0)
- `fix: resolve message loading issue` → Patch version bump (1.0.4 → 1.0.5)
- `feat!: redesign API structure` → Major version bump (1.0.4 → 2.0.0)
