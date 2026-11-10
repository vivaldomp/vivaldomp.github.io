# Pi + OpenCode Go + pi-lens + Playwright MCP — overlay SDLC

**Instalação e uso:** [`docs/agentic-sdlc/README.md`](docs/agentic-sdlc/README.md).

O GitHub Actions executa Pi CLI (assinatura OpenCode Go) com extensão
`pi-lens@4.4.11` e Playwright MCP `@playwright/mcp@0.0.79` para auditar o preview
local da PR. PRD → plano → **aprovação por label** → implementação → draft PR →
CI → screenshots + auditoria MCP → **merge humano** → Pages.

Para `gh-aw` com `engine.extensions` e `mcp-servers` consulte
[`GH_AW_PI_MCP_REFERENCE.md`](docs/agentic-sdlc/GH_AW_PI_MCP_REFERENCE.md):
a rota OpenCode Go no gateway não foi confirmada e o exemplo não está ativo.
