# dshbase-catalog

Query the [dshbase](https://dshbase.com) plugin directory from inside DeepSeek Harness — search, list, and get install commands for 1,100+ community plugins without leaving your session.

## Install

```bash
dsh plugin add dshbase-catalog
```

## Tools

### Tool · Description
- **Tool**: `search_dsh_plugins` · **Description**: Full-text search across plugin name + description
- **Tool**: `get_dsh_plugin` · **Description**: Look up one plugin: install command, verification status, stats
- **Tool**: `list_dsh_plugins` · **Description**: List plugins by category
- **Tool**: `get_dsh_stats` · **Description**: Catalog totals (plugins, npm vs git, verification)
- **Tool**: `get_dsh_categories` · **Description**: All categories with counts

## Data

The catalog snapshot is regenerated daily from the live [dshbase](https://dshbase.com) directory (see `scripts/sync-catalog.py`), so the built-in index stays current.