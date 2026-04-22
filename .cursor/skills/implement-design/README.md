# Implement Design Skill

Translates UI/UX designs into production-ready code following Alation's architecture, design system, accessibility, and i18n standards.

## Files

| File           | Purpose                                          | When to use                                  |
| -------------- | ------------------------------------------------ | -------------------------------------------- |
| `SKILL.md`     | Comprehensive patterns, code examples, and rules | Implementing a new component or feature      |
| `checklist.md` | Pure checkbox list referencing SKILL.md sections | Reviewing work or ensuring nothing is missed |

## Workflow

1. `/implement-design` to load the skill
2. Assess if changes will break e2e tests (see [Environment Flags](#environment-flags) in SKILL.md)
3. If yes, use `/createEnvFlag` to gate changes
4. Read the relevant [documentation guides](../../docs/) first
5. Implement following patterns from SKILL.md
6. Verify against checklist.md before committing

## Related

- [Design System Guide](../../docs/design-system.md)
- [i18n Guide](../../docs/i18n-guide.md)
- [Testing Documentation](../../docs/testing/)
- [Project Structure](../../docs/project-structure.md)
- [API Architecture](../../docs/api-architecture.md)
- [`/createEnvFlag` skill](../createEnvFlag/) - Gate e2e-breaking changes behind flags
