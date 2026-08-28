# Revisão visual do Fogão

## Escopo

Mudanças de CSS e atributos de apresentação. Não foram alterados endpoints,
Firebase, autenticação, estados, hooks, ordenação, filtros, retenção de alertas,
regras premium, destinos dos links ou handlers. As alterações locais existentes
em `layout.tsx` e `public/fonts` foram preservadas; o layout recebe apenas uma
importação adicional de CSS nesta revisão.

## Auditoria e direção

| Área | Problema encontrado no código | Tratamento |
| --- | --- | --- |
| Tipografia | Raiz de 18–22px altera também todo espaçamento em rem; compensações globais com `!important` no mobile | Raiz de 100%, respeitando preferência do navegador; tamanhos editoriais por função |
| Fontes | Roboto local coexistia com `Outfit` inline sem carregamento correspondente | Roboto existente em títulos e interface, sem download ou dependência adicional |
| Hierarquia | Muitos pesos 900, tracking amplo e títulos com line-height próximo de 1 | Peso 700 nos cards, entrelinha 1.3–1.4; manchete distinta da lista |
| Leitura | Colunas e parágrafos sem limite editorial consistente | Artigo limitado a 68ch; preservada preferência `--font-scale` e destaque do parágrafo ativo |
| Cards mobile | Alturas variáveis e espaço vazio abaixo da miniatura | Após feedback: largura de 100%, altura uniforme de 9.5rem, imagem preenchendo a altura interna, título de até duas linhas e fonte/data e ações em linhas próprias; menu ancorado no próprio controle |
| Destaques desktop | Quatro cards de imagem muito baixos, com títulos, categorias e data sobrepostos | Retratos com altura mínima; duas colunas em telas intermediárias e quatro em telas maiores |
| Manchete | Conteúdo absoluto e padding muito alto dentro de proporção fixa | Conteúdo participa da altura do destaque; fundo continua preenchendo o card |
| Cards sem imagem / mistos | Transparência, blur e bordas decorativas competindo com leitura | Superfície escura sólida, borda simples e escala compartilhada |
| Categorias | Cores saturadas numerosas e letras de 8–10px | Badge editorial compacto de 12px, dourado discreto e rótulos existentes preservados |
| Notificações | Datas pequenas, leitura com pouco contraste e altura de painel fixa | Texto de 14px, data de 12px, indicador de não lida e altura limitada ao viewport |
| Estados esportivos | Urgente e ao vivo com pílulas grandes e pulso contínuo | Estados existentes com badge compacto; urgente e ao vivo distintos por texto e cor |
| Navegação | Conteúdo podia se aproximar da barra flutuante inferior | Reserva inferior de 6rem + safe-area; indicador ativo com traço e texto reforçado |
| Efeitos | Zoom demorado, bordas giratórias, brilho nas bordas da tela | Efeitos decorativos reduzidos; carregadores, carrosséis e navegação mantidos |

## Escala e sistema

- Família: Roboto local já configurada, com fallback sans-serif.
- Metadados e badges: 12px; controles e notificações: 14px; corpo da interface: 16px.
- Cards: 16–18px; manchetes: 24–36px conforme largura; artigo mantém ajuste de tamanho existente.
- Pesos predominantes: 400/500 para leitura e informações secundárias, 700 para títulos e ações.
- Espaçamentos baseados nos múltiplos de 4px já disponíveis no Tailwind.
- Cards de 16px de raio; controles e alertas de 12px; listas compactas sem sombra.
- Identidade mantida: preto, branco e dourado. A preferência de tema não foi modificada.

Os estilos compartilhados estão em `portal/src/app/editorial.css`.
As classes são aplicadas às famílias correspondentes, sem transformar todos os
cards em um único formato. Cards legados também recebem a tipografia global;
controles de vídeo e histórias em tela cheia não foram redimensionados por seletores genéricos.

## Notificações: limites intencionais

A API atual fornece `NEWS_MERCADO`, `NEWS_MEDICO`, `NEWS_URGENT` e `DAILY_BRIEFING`.
Esses tipos existentes recebem tratamento visual próprio. O estilo também
contempla `MATCH_RESULT`, já reconhecido pelo cliente, mas não o reativa na API.
Não foram inventados eventos de gol, intervalo, contratação ou novas notificações.
Não se inferiu urgência a partir de palavras no cliente.

Os erros de login/configurações mantêm conteúdo e condições, com apresentação
padronizada e semântica `role="alert"`. Os `alert()` nativos foram preservados:
trocar uma confirmação bloqueante por toast/snackbar exigiria mudar comportamento.
Nenhuma biblioteca de notificações foi instalada.

## Verificação

- `npx tsc --noEmit`: aprovado.
- Comparação estrutural via TypeScript AST: 27 arquivos TSX alterados diferem
  apenas em atributos de apresentação. Verificados hooks, handlers, condições,
  conteúdo e links. Layout excluído por conter alteração anterior do usuário.
- `git diff --check`: aprovado.
- `npm run build`: aprovado, incluindo TypeScript e geração de 22 páginas,
  após execução autorizada com acesso à rede para leitura dos dados existentes.

### Validação visual pendente

O navegador abriu a tela de carregamento em 390 × 844. A primeira execução local
não conseguiu acessar o Firebase por restrição de rede. Após autorização para
executar o servidor com rede, o navegador bloqueou a navegação por política de URL.
Não houve contorno desse bloqueio nem uso de dados fictícios como prova de validação.

Antes de publicar, conferir com dados reais:

1. 320, 390, 430, 768, 1024 e 1440px: manchete, filtros, lista, menu de notícia e barra inferior.
2. Notificações lidas/não lidas, vazias, urgentes e com títulos longos; scroll do painel em paisagem.
3. Artigo, preferência de tamanho de fonte, login, perfil, vídeos, jogos e tabela.
4. Android e Safari/iOS físicos: teclado, safe-area, notch/Dynamic Island e rotação.
5. Temas Glorioso e Gloriosa, zoom 200%, foco de teclado e movimento reduzido.

Não há alegação de validação em aparelhos físicos ou garantia de ausência de regressão visual.
Não foi realizado deploy.
