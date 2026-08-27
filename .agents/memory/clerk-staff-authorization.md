---
name: Clerk staff authorization
description: Managed Clerk staff allowlists require exact user IDs supplied after accounts are created in the Project Editor Auth tool.
---

Use the Project Editor Auth tool to create or verify staff accounts, then obtain each exact Clerk user ID before configuring a content allowlist. Never infer IDs from names, emails, or unrelated workspace identifiers.

**Why:** The managed Clerk status can report limited dashboard access even though user administration belongs in the Project Editor Auth tool, and guessing an ID could grant catalogue access to the wrong account.

**How to apply:** For content authorization work, keep `CONTENT_STAFF_USER_IDS` unset until the account IDs are explicitly confirmed; the API should remain fail-closed.