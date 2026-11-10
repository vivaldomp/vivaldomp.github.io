# Plano de validação — SDLC Pi + OpenCode Go

## Verificações locais (sem chaves)

- `npm run sdlc:validate` garante 3 workflows Actions, 3 playbooks e modelo OpenCode Go, detecta resíduos `gh-aw`.
- `npm test` executa a suíte disponível no site Astro.
- `npm run build` produz `dist/index.html`.
- `node --check scripts/sdlc/check-agent-changes.mjs` verifica a sintaxe do guard.
- Validar YAML dos workflows usando parser/actionlint quando disponível.

## Validação integrada na conta do proprietário

1. Configurar `OPENCODE_API_KEY` e `SDLC_BOT_TOKEN`.
2. Garantir modelo `opencode-go/deepseek-v4.1-flash` liberado no workspace.
3. Criar issue PRD do próprio usuário; verificar comentário de refinamento.
4. Validar ausência de implementação antes da label humana.
5. Aplicar `sdlc:approved` pelo dono; verificar branch e draft PR.
6. Verificar CI, screenshots desktop/mobile, e comentário de review IA.
7. Rejeitar PR com falhas de CI ou mudanças de caminhos protegidos.
8. Revisar screenshots, realizar merge manual em `master`, verificar Pages.

**Limitação:** nenhuma execução online, credencial ou avaliação visual real foi feita na geração deste pacote.

## New visual MCP / pi-lens acceptance gates
1. Confirm `pi list` reports `pi-lens@4.4.11` in refine, developer, reviewer, and preview workflows.
2. `pi mcp list` reports `playwright` connected on the preview job.
3. Verify `desktop.png`, `mobile.png`, `mcp-desktop.png`, `mcp-mobile.png`, `evidence.json`, and `visual-audit.md` are present in the Actions artifact.
4. If the model cannot call `browser_take_screenshot`, `check-mcp-preview.mjs` must fail the preview job.
5. Check visual report cannot approve or merge PRs.
6. The human inspects screenshots and approves by manually merging to `master`.
