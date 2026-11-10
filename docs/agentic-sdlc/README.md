# PoC — GitHub Actions + Pi / OpenCode Go + pi-lens + Playwright MCP

Projeto-alvo: `vivaldomp/vivaldomp.github.io` (Astro 6, branch de produção `master`, build `dist/`).
A alteração é aditiva; o deploy original `.github/workflows/deploy.yml` continua intacto.

## Arquitetura operacional

```text
Issue PRD (formulário, label prd, autor vivaldomp)
   -> Pi Product Analyst + pi-lens -> comentário com plano
   -> GATE HUMANO: autor aplica sdlc:approved
   -> Pi Developer + pi-lens -> branch e draft PR (token com escrita em etapa posterior)
   -> CI determinístico + build Astro
   -> Playwright screenshots garantidos por CLI (desktop/mobile)
   -> Pi Visual QA + pi-lens + Playwright MCP (navegação, snapshot, console, screenshot)
   -> artefatos: desktop.png, mobile.png, mcp-desktop.png, mcp-mobile.png,
                  evidence.json, visual-audit.md
   -> Pi QA/Security reviewer + pi-lens -> comentário na PR
   -> GATE HUMANO: inspecionar artefatos/checks e fazer merge manual
   -> GitHub Pages existente publica a partir de master
```

Usamos dois modos Playwright intencionalmente: **Playwright CLI determinístico** fornece screenshots
mesmo antes de haver um parecer de IA; **Playwright MCP** faz inspeção da UI por agente.
A etapa MCP é obrigatória para sucesso do job de preview: se falhar, o job falha, mas os
screenshots já produzidos são enviados com `if: always()` para diagnóstico.

### Por que não usar `gh-aw` como executor principal agora?

O Pi do `gh-aw` documenta `engine.extensions` e servidores `mcp-servers` customizados, mas
seu gateway isolado não documenta a rota de assinatura `opencode-go`. A própria referência
avisa que provedores incompatíveis falham na compilação. Para preservar a assinatura
OpenCode Go e evitar inventar compatibilidade, a PoC **funcional** usa o Pi CLI
em Actions e integra extensão/MCP pela configuração nativa do Pi. Veja o exemplo
puramente declarativo de `gh-aw` em `docs/agentic-sdlc/GH_AW_PI_MCP_REFERENCE.md`.

## Instalar sobre o projeto existente (overlay)

```bash
# Requer gh autenticado, Node >=22.19, Actions e GitHub Issues habilitados
git clone https://github.com/vivaldomp/vivaldomp.github.io.git
cd vivaldomp.github.io
unzip /caminho/vivaldomp-opencode-go-pi-mcp-lens-overlay.zip -d /tmp/sdlc-mcp-overlay
rsync -av /tmp/sdlc-mcp-overlay/ ./

# Se havia PoC antiga usando gh-aw, remover SÓ os workflows legados conhecidos:
bash scripts/sdlc/migrate-opencode-go.sh

npm ci
npm run sdlc:validate
npm test
npm run build

git switch -c chore/pi-lens-playwright-mcp
git add -A
git commit -m 'chore: add Pi Lens and Playwright MCP visual gate'
git push -u origin HEAD
gh pr create --base master --title 'PoC: Pi + OpenCode Go + Playwright MCP + pi-lens' \
 --body 'Adiciona gates humanos, auditoria visual via MCP e evidências de PR.'
```

### Configurar credenciais e labels no GitHub

```bash
gh repo set-default vivaldomp/vivaldomp.github.io
gh secret set OPENCODE_API_KEY
gh secret set SDLC_BOT_TOKEN  # PAT fine-grained somente para Contents/PR; veja abaixo

gh label create prd --color 7f54b5 || true
gh label create 'sdlc:approved' --color 0e8a16 || true
```

`OPENCODE_API_KEY` vem de uma chave pessoal ligada a workspace com **OpenCode Go**.
`SDLC_BOT_TOKEN`: PAT fine-grained limitado ao repositório, com `Contents: read/write`
e `Pull requests: read/write` (e possivelmente `Metadata: read`, inerente). Ele é
usado **após** o agente executar e os testes passarem, para que a PR dispare workflows.

Opção em Settings → Actions → General: permitir que workflows leiam PRs e publiquem comentários,
respeitando as políticas do repositório. Modelo padrão: `opencode-go/deepseek-v4.1-flash`.
Pode alterar com a variável de repositório `SDLC_MODEL`, sempre conferindo o catálogo:

```bash
export OPENCODE_API_KEY='oc_sk_...' # local; não versionar
pi --list-models opencode-go
pi --model opencode-go/deepseek-v4.1-flash --print 'Responda OK'
```

## Executar primeiro PRD

1. GitHub → Issues → New Issue → **PRD — Mudança no website**.
2. Criar issue como `vivaldomp` e com label `prd`.
3. Examinar comentário do Product Analyst e **aplicar manualmente** `sdlc:approved`.
4. A implementação gera uma **draft PR** contra `master`, sem merge.
5. CI roda e o workflow `SDLC - Preview + Playwright MCP Visual Audit` prepara `dist/`,
   inicia `http://127.0.0.1:4173` e produz duas capturas determinísticas.
6. O Pi instala `pi-lens@4.4.11`, registra Playwright MCP `@playwright/mcp@0.0.79` e
   usa ferramentas `browser_navigate`, `browser_snapshot`, `browser_resize`,
   `browser_console_messages`, `browser_take_screenshot` para inspecionar a UI.
7. Um artefato contém imagens e `visual-audit.md`; o workflow comenta link na PR.
8. Você aprova visual e tecnicamente e faz **merge manual**; Pages publica a `master`.

### Diagnóstico

Se o MCP não iniciar, revise a etapa `Register Playwright MCP` e o comando `pi mcp list`.
A versão de Chromium baixada pelo Playwright CLI pode diferir da esperada pelo MCP
pinned; nesse caso verifique a versão de navegador requerida pelo pacote `@playwright/mcp@0.0.79`
e instale a revisão apropriada na etapa anterior à execução do agente.

O DeepSeek V4.1 Flash pode não aceitar entrada de imagem. O agente verifica **snapshots de
acessibilidade, DOM representado e console**, mas screenshots são evidência para inspeção
**humana**, não prova de comparação visual pixel a pixel.

`pi-lens` requer Node >=22.19 e pode executar extensões e ferramentas de terceiros;
ela foi fixada em `4.4.11` para manter a PoC reproduzível. Revise novos releases antes
de atualizar. Ele fornece LSP, diagnósticos, formatação e análise estrutural; não
substitui `npm test`, build, auditoria de dependências e aprovação humana.

### Controle de segurança

- **Não há sandbox do gh-aw**: GitHub Actions executa a LLM em um runner. Inputs de issues,
  PRs e conteúdo web não são confiáveis. PoC indicada só para seu repositório pessoal,
  sem segredos da empresa, com código privado restrito.
- Preview com token de IA só em branches internas `ai/prd-*`; forks/branches arbitrárias não
  recebem a chave. O preview não publica URL externa nem usa segredos no servidor web.
- O build executa código da PR; no exemplo com conta pessoal, você é a única pessoa que
  escreve branches. Para repositório com múltiplos contribuidores, use runners isolados,
  gate humano para executar builds e GitHub App de permissões mínimas.
- `SDLC_BOT_TOKEN` só fica disponível ao job após agente e testes; evite PAT amplo.
- O GitHub Free pessoal pode não suportar obrigatoriedade de revisão independente em
  repositório público. **Gate final = merge manual**; agente não faz merge.

## Verificações locais possíveis

```bash
npm ci
npm run sdlc:validate
npm test
npm run build
node --check scripts/sdlc/check-mcp-preview.mjs
```

Execução real da API, `pi mcp list` no GitHub runner, e capturas via MCP **não foram
realizadas aqui**: precisam de rede npm, chave OpenCode Go e GitHub Actions.

## Documentação oficial

- https://github.github.com/gh-aw/reference/engines/pi/
- https://github.github.com/gh-aw/reference/playwright/
- https://github.github.com/gh-aw/guides/mcps/
- https://pi.dev/packages/pi-lens
- https://pi.dev/docs/latest/mcp
- https://opencode.ai/docs/console/harnesses/pi
- https://github.com/microsoft/playwright-mcp
