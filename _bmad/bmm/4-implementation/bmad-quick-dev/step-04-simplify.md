---
---

# Step 4: Simplify

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- This step is solely for improving code quality and cleanup of the implementation.
- Do not introduce feature changes or add new functionality.

## INSTRUCTIONS

### Invoke Simplify

Invoke `/simplify` (Claude Code built-in command) to review and clean up code changed in step-03.

Scope:
- All files changed since `{baseline_commit}`
- If `{baseline_commit}` is missing or `NO_VCS`, use the list of files worked on in step-03

### Apply Simplify Results

Apply the changes suggested by simplify:
- Improve code reuse
- Remove unnecessary complexity
- Enhance consistency and readability
- Follow existing project patterns/conventions

### Self-Check

Verify that existing functionality is not broken after applying simplify:
- Run tests if they exist
- Run type checks if available
- Run build if available

If issues are found, revert simplify changes and keep the original implementation.

## NEXT

Read fully and follow `./step-05-review.md`
