# Agency OS

## Nuxt UI v4 Design Tokens

Use semantic CSS variable classes instead of raw Tailwind color classes. These handle light/dark mode automatically.

### Border
- `border-default` — standard border (replaces `border-gray-200 dark:border-gray-800`)
- `border-muted` — subtle border
- `border-accented` — stronger border (replaces `border-gray-300 dark:border-gray-700`)
- `border-inverted` — inverted border

### Background
- `bg-default` — page background (replaces `bg-white dark:bg-gray-900`)
- `bg-muted` — slightly offset background
- `bg-elevated` — raised surface background
- `bg-accented` — stronger contrast background
- `bg-inverted` — inverted background

### Text
- `text-dimmed` — least prominent
- `text-muted` — secondary text (replaces `text-gray-500 dark:text-gray-400`)
- `text-toned` — slightly muted
- `text-default` — standard body text (replaces `text-gray-700 dark:text-gray-200`)
- `text-highlighted` — emphasized text (replaces `text-gray-900 dark:text-white`)
- `text-inverted` — inverted text

### Semantic Colors
- `text-primary`, `bg-primary`, `border-primary`
- `text-secondary`, `bg-secondary`, `border-secondary`
- `text-success`, `text-info`, `text-warning`, `text-error`

### Components (v2 → v4 renames)
- `UDropdown` → `UDropdownMenu`
- `UModal` / `USlideover` content must use `<template #content>` slot
- `color="gray"` → `color="neutral"`
- `:click` callback on items → `:onClick`

## Directus CLI

CLI for managing a [Directus](https://directus.io) instance.

Run `d6s --help` to list all commands. Run `d6s <command> --help` for args, flags, and examples.

### Setup

```bash
DIRECTUS_URL=https://your-instance.directus.app
DIRECTUS_TOKEN=your-token
```

Or: `d6s setup --url <url> --token <token> --profile default`

### Rules

- **Always pass `--json`** on every command. Human output is unstable.
- **Always pass `--yes`** to skip confirmation prompts.
- **Never guess schema.** Discover first, then act.
- **`d6s api call` is a last resort.** Check `d6s --help` first — most operations have a dedicated command.
- **Don't pipe to python/jq.** Read JSON output directly — you can parse it.
- **Always pass `--fields`** on read/create/update to limit response size.
- **Always pass `--limit`** — default is 25, lower when you only need a few items.

### Command Groups

| Group | Key commands |
|---|---|
| Schema | `schema inspect/apply/diff`, `collections`, `fields`, `relations`, `recipes` |
| Data | `items`, `files`, `folders`, `search` |
| Dashboards | `dashboards`, `panels` |
| Access | `permissions`, `policies`, `roles`, `users` |
| Automation | `flows`, `operations`, `settings`, `utils` |
| Meta | `server`, `activity`, `revisions`, `versions` |

### Schema Discovery

```bash
# List all collections
d6s schema inspect --json

# Fields + relations for specific collections
d6s schema inspect -c posts,authors --json

# Always refresh after schema changes (uses local cache)
d6s schema inspect --refresh --json
```

**Response shapes:**

No collections → lightweight overview:
```json
{"data":{"collections":["posts","authors"],"collection_folders":[],"notes":{"posts":"Blog posts"}}}
```

With collections → detailed field map keyed by collection:
```json
{"data":{"posts":{"title":{"type":"string","required":true},"author":{"type":"uuid","relation":{"type":"m2o","collection":"authors"}}}}}
```

Prefer `schema inspect <collections>` over bare `schema inspect` — only request detail for collections you need. After schema changes, use `schema inspect --refresh <collection>` not bare `--refresh`.

### Recipes

Reusable schema patterns. Run `d6s recipes list --json` for all IDs. Run `d6s recipes show <id> --json` for options and example payloads. Run `d6s recipes apply --help` for full usage.

```bash
d6s recipes apply --collection posts \
  --collection-options '{"meta":{"display_template":"{{title}}","icon":"article"}}' \
  --fields '[
    {"recipe":"field.text","field":"title","required":true},
    {"recipe":"field.slug","field":"slug","sourceField":"title"},
    {"recipe":"relation.m2o","field":"author","relatedCollection":"authors","oneField":"posts","displayTemplate":"{{name}}"}
  ]' --json --yes
```

**Always set `display_template`** on every collection via `--collection-options`. Without it, relational fields show raw UUIDs. Use `displayTemplate` on relation recipes for field-level control.

### Token Efficiency

Every token of CLI output costs reasoning quality. Minimize output size:

- **`--fields id,name,...`** on every read/create/update — only request fields you need.
- **`--limit 1`** when you only need one item. Default is 25.
- **`--meta total_count --limit 0`** to count without fetching items.
- **`schema inspect <collections>`** — only request detail for collections you need.
- **`schema inspect --refresh <collection>`** — only refresh what changed, not the full schema.

### Tips

- **Sort descending:** prefix field with `-`: `--sort -date_created`
- **Error format:** `{"errors":[{"message":"...","extensions":{"code":"..."}}]}`
