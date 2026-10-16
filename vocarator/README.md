# Vocarator

Extensão Chromium que identifica nomes e veículos e mostra relações públicas documentadas com Daniel Vorcaro, com datas, contexto, fontes e respostas dos citados.

- Site: https://pmarkun.github.io/vorcarator/
- Download: https://github.com/pmarkun/vorcarator/releases/latest/download/vocarator.zip
- Versão: 0.3.0

## Instalar

1. Baixe e extraia o ZIP. Preserve a pasta `vocarator` no computador.
2. Abra `chrome://extensions` (ou `edge://extensions`).
3. Ative **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação** e selecione a pasta `vocarator`.
5. Recarregue as páginas que já estavam abertas.

## Atualizar as relações

No menu da extensão, clique em **Atualizar base pelo GitHub**. O JSON publicado em `main/vocarator/base-inicial.json` é validado e salvo localmente; páginas abertas recebem a nova base. Falhas de rede ou validação preservam os dados atuais. A importação manual de JSON e a exportação continuam disponíveis. A base inicial acompanha o pacote e funciona sem rede.

**Isso atualiza dados, não código.** Para atualizar funcionalidades durante a distribuição manual, baixe o novo ZIP, substitua os arquivos da pasta e clique em Recarregar em `chrome://extensions`. A distribuição pela Chrome Web Store será um passo separado.

## Fontes e correções

A presença no grafo não demonstra irregularidade nem influência editorial. Vínculos têm natureza, período e fonte próprios. A base inclui alegações e respostas; documentos originais citados por reportagens ainda não foram auditados pelo projeto. Homônimos exigem conferência no contexto.

Para corrigir ou ampliar a base, abra uma issue ou pull request com fonte pública, data e descrição precisa. Edite `vocarator/base-inicial.json` e gere `data.js` com `python3 scripts/build.py`. O build valida e empacota a extensão, além de preparar o site em `_site`.

## Privacidade

Sem telemetria e sem envio das páginas visitadas. O reconhecimento acontece no navegador. A atualização manual consulta somente uma URL fixa de JSON no GitHub, sem credenciais e sem incluir a página visitada. Fontes externas abrem apenas quando clicadas. Nenhum JavaScript remoto é baixado ou executado.

## Desenvolvimento e publicação

```sh
node --test tests/*.test.cjs
python3 scripts/build.py
```

O workflow publica o site no GitHub Pages ao enviar para `main`. Tags `v*` também criam um GitHub Release com `vocarator.zip`. Configure Pages com origem **GitHub Actions** nas configurações do repositório. O nome/conta usados são `pmarkun/vorcarator`; se mudar, ajuste os links e a URL fixa e permissão de host em `remote.js` e `manifest.json`.
