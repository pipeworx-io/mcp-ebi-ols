# @pipeworx/ebi-ols

EBI [Ontology Lookup Service (OLS)](https://www.ebi.ac.uk/ols4) MCP — search and traverse ~250 biomedical ontologies (GO, EFO, MONDO, CL, ChEBI, HP, …). Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `list_ontologies(size?, page?)` — list all loaded ontologies
- `get_ontology(id)` — ontology metadata (latest release, term count, …)
- `search(query, ontology?, type?, exact?, rows?)` — full-text search across terms
- `get_term(ontology, iri|short_form|obo_id)` — term details
- `term_ancestors(ontology, iri)` — transitive parents
- `term_children(ontology, iri)` — direct children

## Data source

`https://www.ebi.ac.uk/ols4/api/`

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
