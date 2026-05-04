# Meta Calc — Calculadora Metabólica

**Projeto Acadêmico - Universidade Presbiteriana Mackenzie**
**Tecnologia em Análise e Desenvolvimento de Sistemas**
**Disciplina: Prática Profissional em Análise e Desenvolvimento de Sistemas**

---

## Equipe de Desenvolvimento

| Nome | RA |
|------|----|
| Vinicius Santos Ribeiro | 10441258 |
| Anny Violeta Rodrigues Freire | 10441240 |
| Guilherme Henrique Ferraz Contrera | 10300145 |
| Matheus Neves Cavalcante | 10433639 |

**Professor:** Cristiano Morais de Sousa / Paula Torales Leite

---

## Sobre o Projeto

**Meta Calc** é uma aplicação web profissional para cálculo da Taxa Metabólica Basal (TMB) e Índice de Massa Corporal (IMC), desenvolvida como projeto avaliativo de disciplina. A aplicação oferece uma interface moderna, intuitiva e acessível voltada a profissionais de saúde, estudantes e usuários que desejam monitorar indicadores corporais com precisão.

O nome **Meta Calc** une *meta* (metabolismo) com *calc* (calculadora), refletindo o propósito central da aplicação: calcular e acompanhar indicadores metabólicos de saúde.

---

## Funcionalidades

### Cálculos Principais
- **IMC (Índice de Massa Corporal)**: cálculo pela fórmula `peso / altura²`
- **TMB (Taxa Metabólica Basal)**: duas fórmulas reconhecidas pela literatura:
  - **Mifflin-St Jeor** *(recomendada, mais moderna)*
  - **Harris-Benedict** *(clássica)*
- **Gasto Calórico Total (GCT)**: TMB × fator de atividade
- Metas calóricas personalizadas para perda ou ganho de 0,5 kg/semana

### Recursos e Melhorias

| Funcionalidade | Descrição |
|---|---|
| Salvamento automático | O histórico é salvo automaticamente ao calcular — sem necessidade de botão manual |
| Toast notifications | Feedback visual elegante para erros, avisos e confirmações |
| Validação em tempo real | Campos com indicador visual de erro/sucesso durante o preenchimento |
| Histórico com avatares | Cards de histórico com iniciais do nome, pílulas de resultado e data/hora |
| Paleta saúde | Design claro com tons de verde, inspirado em identidades de saúde |
| Relatório PDF | Relatório completo com tabela IMC, resultados e aviso médico |
| Compartilhamento WhatsApp | Resultados formatados enviados diretamente ao WhatsApp |
| Responsividade | Layout adaptável para celular, tablet e desktop |
| Atalhos de teclado | `Ctrl+Enter` para calcular · `Esc` para novo cálculo |
| Fluxo de uso guiado | Banner com etapas visuais do processo (preenchimento → cálculo → histórico) |

### Objetivos Atendidos

#### Funcionais
Calcular TMB usando equações de Mifflin-St Jeor e Harris-Benedict
Calcular IMC com base em peso e altura
Gerar relatórios personalizados com sugestões calóricas
Comparar resultados com padrões da OMS
Compartilhar resultados via WhatsApp
Salvar automaticamente cada consulta no histórico local
Recomendações personalizadas por categoria de IMC

#### Não-Funcionais
**Desempenho**: interface rápida, sem dependências externas além de Font Awesome e Google Fonts
**Segurança**: dados armazenados exclusivamente no navegador do usuário (localStorage)
**Usabilidade**: fluxo guiado com etapas visuais, feedback por toast e validação em tempo real
**Compatibilidade**: funciona em navegadores modernos (Chrome, Firefox, Edge, Safari)
**Acessibilidade**: HTML semântico, contraste adequado, labels descritivos e navegação por teclado

---

## Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura semântica da aplicação |
| **CSS3** | Design system com variáveis CSS, Flexbox/Grid, animações e responsividade |
| **JavaScript ES6+** | Lógica, cálculos, DOM manipulation, localStorage |
| **Google Fonts (Inter)** | Tipografia moderna |
| **Font Awesome 6.0** | Ícones intuitivos |
| **LocalStorage** | Persistência local dos dados do histórico |

---

## Estrutura do Projeto

```
meta-calc/
├── index.html     # Estrutura semântica e layout da aplicação
├── style.css      # Design system completo — paleta verde saúde
├── script.js      # Lógica, cálculos e interatividade
└── README.md      # Documentação do projeto
```

---

## Como Executar (Instruções Detalhadas para Desenvolvedores)

O projeto foi construído utilizando tecnologias web padrão (HTML5, CSS3, e JavaScript Vanilla), sem a necessidade de frameworks de compilação ou processos de build. Isso torna o setup inicial instantâneo para qualquer desenvolvedor.

### Pré-requisitos

1. Um navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, ou Apple Safari).
2. Uma ferramenta de versionamento de código, como o [Git](https://git-scm.com/downloads), instalada na máquina (para clonar via terminal).
3. Um editor de código de sua preferência. Recomendamos o **Visual Studio Code (VS Code)**.
4. *(Recomendado)* No VS Code, a extensão **"Live Server"** instalada para suporte a hot-reload durante o desenvolvimento.

### Passo a Passo: Clonagem e Execução Local

**Passo 1: Obtenção do Código-Fonte (Clone do Repositório)**
Abra o terminal (ou prompt de comando) em sua máquina e execute o seguinte comando:
```bash
git clone https://github.com/vihribeiro/imc_meta_calc_ads.git
```

**Passo 2: Navegando para o Diretório do Projeto**
Acesse a pasta criada pelo comando anterior:
```bash
cd imc_meta_calc_ads
```

**Passo 3: Abrindo no Editor de Código (VS Code)**
Ainda no terminal, execute o comando abaixo para abrir o projeto diretamente no editor:
```bash
code .
```

**Passo 4: Rodando a Aplicação**
Como não há um servidor backend ou pipeline de build, você pode escolher uma das formas abaixo:

*Método de Visualização Direta (Produção simulada):*
- Pelo explorador de arquivos do seu sistema operacional, vá até a pasta `imc_meta_calc_ads`.
- Dê um duplo clique no arquivo `index.html`. Ele será aberto no seu navegador padrão e estará totalmente funcional.

*Método de Desenvolvimento (Recomendado):*
- No VS Code aberto na pasta do projeto, clique com o botão direito sobre o arquivo `index.html`.
- Selecione a opção **"Open with Live Server"**.
- O Live Server irá instanciar um servidor web local (geralmente em `http://127.0.0.1:5500/index.html`) e abrirá o navegador.
- Ao utilizar este modo, qualquer alteração que você realizar no código HTML, CSS ou JS será imediatamente atualizada no navegador, facilitando enormemente os testes em tempo real da Iteração 2 em diante.

> Nota: Todos os dados (como o histórico do usuário) são persistidos utilizando a API nativa do `localStorage` do navegador. Nenhuma configuração de banco de dados ou backend é exigida.

---

## Fluxo de Uso

```
1. Preencha os dados pessoais
   └─ Nome, Idade, Peso, Altura, Sexo, Nível de atividade

2. Escolha a fórmula para TMB
   └─ Mifflin-St Jeor (recomendada) ou Harris-Benedict

3. Clique em "Calcular TMB e IMC"
   └─ Os resultados aparecem com animação suave

4. Consulte os resultados
   └─ IMC com tabela OMS destacada
   └─ TMB, GCT e metas calóricas
   └─ Recomendações personalizadas

5. Histórico salvo automaticamente
   └─ Sem necessidade de ação manual
   └─ Persistido no localStorage do navegador

6. Opções adicionais
   └─ Gerar Relatório PDF
   └─ Compartilhar via WhatsApp
   └─ Iniciar novo cálculo
```

---

## Validações Implementadas

| Campo | Regra |
|-------|-------|
| Idade | Entre 15 e 100 anos |
| Peso | Entre 30 e 300 kg |
| Altura | Entre 100 e 250 cm |
| Sexo | Seleção obrigatória |
| Nível de atividade | Seleção obrigatória |
| Fórmula TMB | Seleção obrigatória |

---

## Fórmulas Utilizadas

### IMC
```
IMC = peso (kg) / altura (m)²
```

### TMB — Mifflin-St Jeor
```
Homens:  TMB = 10 × peso + 6.25 × altura − 5 × idade + 5
Mulheres: TMB = 10 × peso + 6.25 × altura − 5 × idade − 161
```

### TMB — Harris-Benedict
```
Homens:  TMB = 88.362 + (13.397 × peso) + (4.799 × altura) − (5.677 × idade)
Mulheres: TMB = 447.593 + (9.247 × peso) + (3.098 × altura) − (4.330 × idade)
```

### Gasto Calórico Total (GCT)
```
GCT = TMB × Fator de Atividade
```

| Nível | Fator |
|-------|-------|
| Sedentário | 1.2 |
| Levemente ativo (1–3 dias/sem) | 1.375 |
| Moderadamente ativo (3–5 dias/sem) | 1.55 |
| Muito ativo (6–7 dias/sem) | 1.725 |
| Extremamente ativo (2× dia) | 1.9 |

---

## Classificação do IMC — OMS

| Faixa | Classificação |
|-------|---------------|
| < 18.5 | Abaixo do peso |
| 18.5 – 24.9 | Peso normal |
| 25.0 – 29.9 | Sobrepeso |
| 30.0 – 34.9 | Obesidade grau I |
| 35.0 – 39.9 | Obesidade grau II |
| ≥ 40.0 | Obesidade grau III |

---

## Design

- **Tema**: Claro com paleta verde ligada à saúde e bem-estar
- **Cores principais**: `#16a34a` (verde-600), `#14b8a6` (teal-500), `#f0fdf4` (fundo verde-suave)
- **Tipografia**: Inter (Google Fonts) — moderna, legível e profissional
- **Componentes**: cards com sombras suaves, botões com gradiente, badge de auto-salvamento, toasts animados
- **Animações**: `fadeSlideUp`, `scaleIn` nos resultados, `slideInHistory` no histórico
- **Responsividade**: grid adaptável para mobile (< 768px) e desktop

---

## Segurança e Privacidade

- **Dados locais**: todas as informações ficam exclusivamente no `localStorage` do navegador
- **Sem servidor**: não há transmissão de dados pessoais para terceiros
- **Compartilhamento WhatsApp**: os dados são enviados direto ao app WhatsApp via link `wa.me`
- **Código aberto**: lógica totalmente transparente e auditável

---

## Casos de Uso

### Caso de Uso 1 — Calcular TMB
- **Ator**: Usuário
- **Pré-condições**: dados pessoais preenchidos e fórmula selecionada
- **Fluxo**: Formulário → Cálculo → Exibição de resultados → Salvamento automático no histórico
- **Pós-condições**: resultado disponível para compartilhamento e geração de relatório

### Caso de Uso 2 — Calcular IMC
- **Ator**: Usuário
- **Fluxo**: Inserção de peso/altura → Cálculo → Classificação OMS → Recomendações personalizadas
- **Resultado**: IMC com categoria destacada na escala visual

### Caso de Uso 3 — Consultar Histórico
- **Ator**: Usuário
- **Fluxo**: O histórico é salvo automaticamente; o usuário pode visualizar, remover registros individuais ou limpar tudo
- **Persistência**: dados mantidos entre sessões via `localStorage`

---

## Histórico de Versões

### Versão 2.0 (Atual — 2026)
- Renomeado para **Meta Calc — Calculadora Metabólica**
- Modificação para a Iteração 2
- Design completamente refatorado com paleta verde saúde e tema claro
- Salvamento automático no histórico a cada cálculo (sem botão manual)
- Sistema de toast notifications para feedbacks
- Validação em tempo real com indicadores visuais por campo
- Histórico com avatares (iniciais), pílulas de resultado e data/hora
- Hero banner com fluxo de 4 etapas visuais
- Relatório PDF atualizado com identidade Meta Calc
- Compartilhamento WhatsApp com mensagem aprimorada
- Tipografia Inter importada via Google Fonts
- Script movido para o final do body (melhoria de performance)

### Versão 1.1
- Compartilhamento de resultados via WhatsApp
- Ícone WhatsApp integrado ao botão

### Versão 1.0
- Cálculos básicos de TMB e IMC
- Histórico manual de cálculos
- Geração de relatórios PDF
- Interface responsiva

---

## Contribuições

Este projeto é desenvolvido para fins acadêmicos na **Universidade Presbiteriana Mackenzie**, como parte da avaliação da disciplina Prática Profissional em Análise e Desenvolvimento de Sistemas.

---

*Meta Calc — Sua saúde, com dados precisos.*
