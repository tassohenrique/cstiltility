# CLAUDE.md

Este arquivo dá contexto ao Claude Code sobre o projeto. Leia por completo antes de gerar qualquer código.

## Visão geral do projeto

**CSTiltility** é uma plataforma de membros premium/high-ticket para ensinar line-ups de CS2: smokes, flashes e HEs. Público-alvo: jogadores dispostos a pagar por conteúdo de alto nível de execução.

Referência visual: Apple (clean, minimalista, high-tech) + estrutura de navegação estilo Netflix, mas com acabamento mais sofisticado — nada de cara de "curso online genérico".

**Fase atual: MVP sem cobrança.** O acesso é liberado manualmente pelo admin (sem checkout). A camada de acesso deve ficar isolada da lógica de conteúdo para permitir plugar um provedor de pagamento (ex: Stripe) depois sem refatoração grande — não implementar pagamento agora.

## Stack

- Next.js (App Router) + TypeScript, modo estrito
- Tailwind CSS + shadcn/ui
- Supabase: Postgres (dados), Auth (login), Storage (imagens de banner/capa)
- Deploy: Vercel
- Vídeo: sempre embed do YouTube via iframe — nunca upload/hospedagem própria de vídeo

## Papéis de usuário

- `admin`: CRUD completo de conteúdo, gestão de membros, gestão de banner
- `member`: acesso à área de membros, aos mapas/aulas liberados, às próprias notas e progresso

Controle de acesso deve ser garantido por **Row Level Security (RLS)** no Supabase, não apenas por esconder elementos na UI. Rotas `/admin/*` protegidas por middleware que valida a role.

## Estrutura de conteúdo (hierarquia)

```
Course (Mapa: Mirage, Inferno, Dust2...)
  └─ Module (tipo de granada: smoke | flash | he | molotov)
       └─ Lesson (line-up específica — a aula em si)
```

Cada `Lesson` contém: vídeo do YouTube, descrição/dificuldade, campo de notas do aluno, e (futuramente) um quiz.

## Modelo de dados (conceitual — ajustar durante implementação)

- `users`: id, email, name, role (admin|member), status (active|inactive), created_at
- `courses`: id, title, slug, cover_image_url, order
- `modules`: id, course_id, title, type (smoke|flash|he|molotov), order
- `lessons`: id, module_id, title, youtube_video_id, description, difficulty, order
- `notes`: id, user_id, lesson_id, content, updated_at (uma nota por aluno por aula, autosave)
- `progress`: id, user_id, lesson_id, completed_at
- `banners`: id, image_url, title, cta_text, cta_link, active, order
- (futuro, não implementar ainda) `quiz_questions`, `quiz_options`, `quiz_attempts`

## Área de membros (frontend do usuário)

- Home: banner central dinâmico (controlado pelo admin) + grid de mapas estilo Netflix
- Página do mapa: módulos organizados por tipo de granada
- Página da aula: player do YouTube incorporado, campo de notas com autosave, marcação de aula assistida
- Perfil: progresso geral e notas salvas

## Área admin

- CRUD de mapas (courses), módulos e aulas
- Upload e gestão do banner central da home
- Gestão de membros: criar conta, ativar/desativar acesso (sem pagamento nessa fase)
- Espaço reservado para o quiz builder — NÃO implementar ainda, aguardando definição do formato

## Convenções de código

- TypeScript estrito, proibido `any`
- Nomes de arquivos, variáveis, funções e componentes em inglês, mesmo com specs em português
- Componentes em PascalCase; hooks em camelCase com prefixo `use`
- Server Components por padrão; Client Components só quando precisar de interatividade
- Design system via shadcn/ui + Tailwind — evitar CSS customizado solto
- Tema escuro como padrão

## O que NÃO fazer nesta fase

- Não implementar checkout/pagamento (deixar a camada de acesso pronta para receber isso depois)
- Não implementar o quiz (módulo em standby)
- Não hospedar vídeo fora do YouTube

## Comandos

- `npm run dev` — ambiente local
- `npm run build` — build de produção
- `npm run lint` — checagem de lint

