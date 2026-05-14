interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * EBI OLS4 MCP — Ontology Lookup Service.
 *
 * Auth: none. Docs: https://www.ebi.ac.uk/ols4/help
 */


const BASE = 'https://www.ebi.ac.uk/ols4/api';
const UA = 'pipeworx-mcp-ebi-ols/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'list_ontologies',
    description: 'List loaded ontologies (paginated).',
    inputSchema: {
      type: 'object',
      properties: {
        size: { type: 'number', description: '1-500 (default 20).' },
        page: { type: 'number', description: '0-based page (default 0).' },
      },
    },
  },
  {
    name: 'get_ontology',
    description: 'Ontology metadata by id (e.g. "efo", "mondo", "go").',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'search',
    description: 'Full-text search across all ontologies (or one).',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        ontology: { type: 'string', description: 'Restrict to one ontology id (optional).' },
        type: { type: 'string', description: 'class | property | individual' },
        exact: { type: 'boolean', description: 'Exact-match (default false).' },
        rows: { type: 'number', description: '1-1000 (default 20).' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_term',
    description: 'Term details. Pass either iri, short_form, or obo_id (the latter two require ontology).',
    inputSchema: {
      type: 'object',
      properties: {
        ontology: { type: 'string' },
        iri: { type: 'string', description: 'Full term IRI (preferred).' },
        short_form: { type: 'string' },
        obo_id: { type: 'string', description: 'OBO id, e.g. "EFO:0000408"' },
      },
      required: ['ontology'],
    },
  },
  {
    name: 'term_ancestors',
    description: 'Transitive ancestors of a term.',
    inputSchema: {
      type: 'object',
      properties: { ontology: { type: 'string' }, iri: { type: 'string' } },
      required: ['ontology', 'iri'],
    },
  },
  {
    name: 'term_children',
    description: 'Direct children of a term.',
    inputSchema: {
      type: 'object',
      properties: { ontology: { type: 'string' }, iri: { type: 'string' } },
      required: ['ontology', 'iri'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'list_ontologies': {
      const params = new URLSearchParams({
        size: String(Math.min(500, Math.max(1, (args.size as number) ?? 20))),
        page: String(Math.max(0, (args.page as number) ?? 0)),
      });
      return olsGet(`/ontologies?${params}`);
    }
    case 'get_ontology':
      return olsGet(`/ontologies/${encodeURIComponent(reqStr(args, 'id', '"efo"').toLowerCase())}`);
    case 'search': {
      const params = new URLSearchParams({
        q: reqStr(args, 'query', '"diabetes"'),
        rows: String(Math.min(1000, Math.max(1, (args.rows as number) ?? 20))),
      });
      if (args.ontology) params.set('ontology', String(args.ontology).toLowerCase());
      if (args.type) params.set('type', String(args.type));
      if (args.exact === true) params.set('exact', 'true');
      return olsGet(`/search?${params}`);
    }
    case 'get_term': {
      const ont = reqStr(args, 'ontology', '"efo"').toLowerCase();
      if (args.iri) {
        const params = new URLSearchParams({ iri: String(args.iri) });
        return olsGet(`/ontologies/${ont}/terms?${params}`);
      }
      if (args.short_form) {
        return olsGet(`/ontologies/${ont}/terms/short_form/${encodeURIComponent(String(args.short_form))}`);
      }
      if (args.obo_id) {
        return olsGet(`/ontologies/${ont}/terms/obo_id/${encodeURIComponent(String(args.obo_id))}`);
      }
      throw new Error('get_term: pass iri, short_form, or obo_id.');
    }
    case 'term_ancestors': {
      const ont = reqStr(args, 'ontology', '"efo"').toLowerCase();
      const params = new URLSearchParams({ iri: reqStr(args, 'iri', '"http://www.ebi.ac.uk/efo/EFO_0000408"') });
      return olsGet(`/ontologies/${ont}/ancestors?${params}`);
    }
    case 'term_children': {
      const ont = reqStr(args, 'ontology', '"efo"').toLowerCase();
      const params = new URLSearchParams({ iri: reqStr(args, 'iri', '"http://www.ebi.ac.uk/efo/EFO_0000408"') });
      return olsGet(`/ontologies/${ont}/children?${params}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function olsGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('EBI OLS: not found');
  if (!res.ok) throw new Error(`EBI OLS: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
