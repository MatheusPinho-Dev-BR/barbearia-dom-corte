# Barbearia Dom Corte

Site one page (HTML, CSS e JavaScript puro) com serviços, agendamento que abre o WhatsApp, contato com mapa e botão flutuante.

**No ar:** https://barbearia.matheuspinho5050.workers.dev

## Onde trocar os dados

| O que | Arquivo |
|---|---|
| Nome, slogan, endereço, horários, links de WhatsApp/Instagram, mapa | `index.html` (procure `TROQUE AQUI`) |
| Preços, descrições, número do WhatsApp, horário usado nos horários | `script.js` (`numeroWhatsApp`, `servicos`, `horariosFuncionamento`) |
| Cores e foto do topo | `style.css` (`:root` e `.hero-fundo`) |

## Rodar no computador

Abra o `index.html` no navegador, ou:

```powershell
python -m http.server 8765
```

Depois acesse http://127.0.0.1:8765.

## Publicar atualização

O deploy é automático: todo push na branch `main` publica em ~15 segundos.

```powershell
git add .
git commit -m "Descrição da mudança"
git push
```

O Worker `barbearia-dom-corte` está conectado ao repositório no Cloudflare (Builds).
