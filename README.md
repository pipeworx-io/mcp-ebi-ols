# mcp-ebi-ols

EBI OLS4 MCP — Ontology Lookup Service.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `list_ontologies` | List loaded ontologies (paginated). |
| `get_ontology` | Ontology metadata by id (e.g. "efo", "mondo", "go"). |
| `search` | Full-text search across all ontologies (or one). |
| `get_term` | Term details. Pass either iri, short_form, or obo_id (the latter two require ontology). |
| `term_ancestors` | Transitive ancestors of a term. |
| `term_children` | Direct children of a term. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "ebi-ols": {
      "url": "https://gateway.pipeworx.io/ebi-ols/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Ebi Ols data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
