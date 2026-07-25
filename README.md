<div align="center">

# 💰 Planner Financeiro

**Um PWA (Progressive Web App) para organizar metas financeiras, calcular quanto guardar por dia e acompanhar sua evolução — instalável no celular, funciona offline e roda 100% em JavaScript puro.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](#)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](#)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Online-222222?style=for-the-badge&logo=github&logoColor=white)](https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/)

### 🔗 [Acessar o app ao vivo](https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/)

[Funcionalidades](#-funcionalidades) · [Tecnologias](#-tecnologias) · [Como rodar](#-como-rodar-localmente) · [Deploy](#-deploy-no-github-pages)

</div>

<br>

## 📸 Preview

<div align="center">

<!--
  Coloque os prints do projeto em docs/screenshots/ e ajuste os nomes abaixo.
  Dica: um GIF curto mostrando o fluxo (criar meta → aporte → dashboard) vende muito bem no portfólio.
-->

<img src="./docs/screenshots/dashboard.png" alt="Dashboard do Planner Financeiro exibindo metas, gráficos e resumo financeiro" width="800">

<br><br>

<img src="./docs/screenshots/mobile.png" alt="Planner Financeiro instalado e em uso em um smartphone" width="260">
&nbsp;&nbsp;
<img src="./docs/screenshots/modal.png" alt="Modal de criação de meta financeira" width="260">

</div>

<br>

## 🎯 Sobre o projeto

O **Planner Financeiro** nasceu de um problema bem prático: como saber, todos os dias, **quanto eu preciso guardar** para bater cada uma das minhas metas financeiras antes do prazo?

O app centraliza várias metas (viagem, reserva de emergência, um curso, uma compra) e calcula automaticamente, para cada uma, o valor diário necessário até o vencimento — além de dar uma visão consolidada em dashboard, gráficos de distribuição/evolução e histórico de aportes e retiradas.

Foi construído **sem frameworks**, com HTML, CSS e JavaScript puro, como exercício de fundamentar bem os conceitos de DOM, estado em memória, persistência local e Service Workers — e para entregar uma experiência de app nativo (instalável, responsivo, offline-first) usando só tecnologias web nativas.

## ✨ Funcionalidades

- 🎯 **Metas ilimitadas** — cadastro com nome, valor alvo, valor inicial e data de vencimento
- 📊 **Dashboard consolidado** — total das metas, total guardado, quanto falta e quantidade de metas ativas
- 💸 **Aportes e retiradas** — registre movimentações em cada meta, com histórico completo e cores diferenciando entrada/saída
- 📈 **Gráficos dinâmicos** — distribuição entre metas e evolução ao longo do tempo (Chart.js)
- 🧠 **Análise automática** — mensagens contextuais por meta ("reta final", "no caminho certo", "meta vencida"), calculadas a partir do prazo e do progresso
- 🌗 **Tema claro/escuro** — com preferência salva
- 📱 **PWA instalável** — manifest + Service Worker configurados para instalação no celular e uso offline
- 💾 **Persistência local** — tudo salvo em `localStorage`, sem depender de backend
- 📐 **100% responsivo** — layout adaptado para desktop, tablet e celular, com áreas de toque otimizadas para mobile

## 🛠 Tecnologias

| Camada | Stack |
|---|---|
| Estrutura | HTML5 semântico |
| Estilo | CSS3 (variáveis, Grid, Flexbox, media queries) |
| Interatividade | JavaScript (ES6+), sem frameworks |
| Gráficos | [Chart.js](https://www.chartjs.org/) |
| Persistência | `localStorage` |
| PWA | Web App Manifest + Service Worker (cache offline) |
| Tipografia | Google Fonts (Poppins) |

## 📂 Estrutura do projeto

```
Planner Financeiro/
├── index.html              # Estrutura da aplicação
├── manifest.json            # Configuração do PWA (ícones, tema, instalação)
├── service-worker.js        # Cache offline
├── css/
│   ├── style.css             # Estilos base (desktop)
│   └── styleMobile.css       # Ajustes responsivos (≤ 600px)
├── js/
│   └── script.js             # Toda a lógica: metas, aportes, gráficos, tema
├── assets/
│   └── icon-192.png / icon-512.png   # Ícones do PWA
└── docs/
    └── screenshots/          # Imagens usadas neste README
```

## ▶️ Como rodar localmente

Por ser um projeto 100% estático, não precisa de build nem de instalação de dependências.

```bash
# clone o repositório
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
cd NOME_DO_REPOSITORIO

# sirva os arquivos com qualquer servidor estático
npx serve .
# ou
python3 -m http.server 8080
```

Depois é só abrir `http://localhost:8080` no navegador.

> ⚠️ O Service Worker só registra em `http://`/`https://` (inclusive `localhost`) — abrindo o `index.html` direto como arquivo (`file://`) o app funciona normalmente, só o cache offline fica desativado.

### Instalando no celular

1. Acesse o site publicado pelo navegador do celular (Chrome/Safari)
2. Toque em **Adicionar à tela inicial** / **Instalar app**
3. Pronto — o Planner Financeiro passa a abrir como um app nativo, com ícone próprio e funcionando offline

## 🚀 Deploy no GitHub Pages

O projeto é 100% estático, então o GitHub Pages é a forma mais simples (e gratuita) de publicá-lo:

1. Suba o conteúdo desta pasta para um repositório no GitHub
2. No repositório, vá em **Settings → Pages**
3. Em **Build and deployment**, selecione **Deploy from a branch**
4. Escolha a branch `main` e a pasta `/ (root)` → **Save**
5. Em alguns minutos o GitHub ativa o endereço:
   `https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/`
6. Atualize esse link no topo deste README e no badge **GitHub Pages**

> ✅ Como todos os caminhos do projeto (`css/`, `js/`, `assets/`, `manifest.json`) são relativos, ele funciona normalmente publicado dentro de um subcaminho como `usuario.github.io/repositorio/` — não precisa ajustar nada no código.

### Colocando no seu site de portfólio

O jeito mais confiável é **linkar** para a URL do GitHub Pages (um botão "Ver projeto" / "Live demo" apontando pra ela), em vez de colocar o app dentro de um `<iframe>`. PWAs com Service Worker às vezes se comportam de forma inconsistente dentro de iframe (o registro do Service Worker pode ser bloqueado pelo navegador dependendo do contexto). Para o portfólio, o combo que funciona bem é:

- Print/GIF do app na seção do projeto (use os arquivos de `docs/screenshots/`)
- Botão/link "🔗 Ver ao vivo" apontando para o GitHub Pages
- Botão/link "💻 Código-fonte" apontando para o repositório

## 🧠 Desafios e aprendizados

- Modelar o cálculo de **"valor necessário por dia"** considerando prazo, valor já guardado e situação da meta (em dia, urgente, atrasada, concluída)
- Estruturar um Service Worker resiliente, que não quebra o cache inteiro se um único arquivo falhar ao ser baixado
- Trabalhar toda a persistência e o estado da aplicação em JavaScript puro, sem um framework reativo, mantendo a UI sincronizada manualmente após cada ação
- Ajustar a ordem visual dos componentes por breakpoint (com `order` no Flexbox/Grid) para priorizar as informações mais relevantes em telas pequenas

## 🗺 Próximos passos

- [ ] Exportar/importar dados (backup em JSON)
- [ ] Notificações locais de vencimento próximo
- [ ] Múltiplas moedas
- [ ] Testes automatizados (unitários para as funções de cálculo)

## 👤 Autor

Feito por **[Seu Nome]**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/seu-usuario)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/seu-usuario)

---

<div align="center">Se este projeto foi útil ou você gostou da ideia, deixe uma ⭐ no repositório!</div>
