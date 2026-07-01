# Navigation, Sidebars, And Widgets

Core Platform uses a CMS-managed navigation system and reusable sidebar/widget system instead of hard-coded menu content.

## Menus

Theme menu locations control where a menu appears on the frontend, such as:

- main navigation
- footer columns
- footer legal links

Editors should update menus through the Menus area rather than changing links directly in templates.

### Bootstrap And Seed Safety

Production startup bootstrap does not remove, rewrite, or repoint admin-created menu links by default. Menu cleanup only applies to menus that are explicitly system-managed.

A menu is treated as system-managed only when its name starts with `System - `. Admin-created navigation should not use this prefix unless the menu is intentionally managed by bootstrap cleanup rules.

The Glass public CMS seed command also preserves existing menus by default. Use `GLASS_CMS_SEED_FORCE_MENUS=true` only when intentionally resetting seeded navigation from code. Force mode may overwrite menu labels, URLs, nesting, theme location assignments, and duplicate menu location assignments.

## Sidebars

Sidebars are reusable content areas made from widgets. They can be assigned to pages that use a sidebar template and are used by the blog by default.

## Widget Use Cases

Common widgets include:

- recent posts
- categories
- newsletter sign-up
- custom text or HTML

## Recommended Workflow

1. Create or update the sidebar in Sidebars & Widgets.
2. Confirm the page template expects a sidebar.
3. Assign the sidebar in page settings.
4. Check the frontend page to confirm sidebar placement and spacing.
