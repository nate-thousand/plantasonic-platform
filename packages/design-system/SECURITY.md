# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 1.x | Yes |

## Reporting a vulnerability

If you discover a security issue in the Plantasonic Design System:

1. **Do not** open a public GitHub issue for exploitable vulnerabilities
2. Contact the maintainer via GitHub private security advisory or direct message
3. Include steps to reproduce, impact assessment, and suggested fix if available

We aim to acknowledge reports within 7 days.

## Scope

This repository contains design tokens, CSS, SCSS, documentation, CLI scaffolding, and the showcase. It does not run production services. Security concerns are primarily:

- Malicious dependencies in templates or showcase
- CLI path traversal or unsafe file operations
- Supply-chain tampering of generated artifacts

## CLI security

The `plantasonic create` command copies template files only within the user-specified target directory. It does not execute remote code beyond `npm install` in the generated project.

## Dependencies

Run `npm audit` in `showcase/` and generated apps. The root design system package has zero runtime dependencies.
