# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.16.0] - 2025-11-08

### Adicionado
- ✨ **Módulo de Jejum Intermitente**
  - Cálculo de fases do jejum baseado em pesquisas científicas mais recentes
  - Visualização interativa das 5 fases do jejum (Anabólica, Pós-Absorção, Cetose, Autofagia Ativa, Autofagia Profunda)
  - Timeline visual com progresso em tempo real
  - Cards expandíveis detalhando benefícios de cada fase
  - Seletor de duração de jejum (12h, 14h, 16h, 18h, 20h, 24h+)
  - Cálculo automático do horário ideal para quebrar o jejum
  
- 🎨 **Sistema de design atualizado**
  - Nova cor de ícone para módulo de jejum (`--icon-fasting`)
  - 5 novas cores de fase do jejum no design system
  - Cores temáticas integradas ao Tailwind config
  
- 🌍 **Internacionalização expandida**
  - Traduções completas PT-BR e EN para módulo de jejum
  - Novo namespace i18n: `fasting.json`
  
- 🧭 **Navegação atualizada**
  - Novo item "Jejum" no menu de navegação
  - Rota `/fasting` adicionada ao sistema de rotas
  - Ícone Clock representando a funcionalidade

### Técnico
- Novo: `src/types/fasting.types.ts` - Definições de tipos TypeScript para jejum
- Novo: `src/services/fasting.service.ts` - Serviço de cálculo de fases e timeline
- Novo: `src/hooks/useFastingCalculator.tsx` - Hook de gerenciamento de estado
- Novo: `src/pages/Fasting.tsx` - Página principal do módulo
- Novo: `src/components/features/fasting/` - Componentes reutilizáveis:
  - `FastingHeader.tsx` - Cabeçalho com informações
  - `FastingTimeInput.tsx` - Inputs de última refeição e duração
  - `FastingTimeline.tsx` - Visualização de progresso e fases
  - `FastingPhaseCard.tsx` - Card detalhado de cada fase
- Atualizado: `src/config/constants.ts` - Novas chaves de storage e constantes
- Atualizado: `src/config/routes.ts` - Rota de jejum adicionada
- Atualizado: `src/components/layout/Navigation.tsx` - Item de navegação
- Atualizado: Design system (`index.css`, `tailwind.config.ts`)
- Atualizado: Exports centralizados (`src/types/index.ts`, `src/services/index.ts`)

### Observações
- Esta é a Fase 1 da implementação: módulo básico sem integrações com Sono/Cafeína
- Fases futuras incluirão: Sistema de Configurações e Integrações Avançadas

## [0.15.1] - 2025-11-03

### Corrigido
- **Migração automática de dados legados**: Implementado sistema de migração one-time para converter dados de tarefas antigas para o novo formato
- **Erro ao carregar tarefas**: Removidos toasts de erro desnecessários durante o carregamento de tarefas
- **Validação de dados**: Schema Zod agora inclui valores padrão para campos `archived` e `priority`, evitando erros de validação com dados antigos
- **Compatibilidade retroativa**: Garantida compatibilidade com dados armazenados antes da implementação de i18n

### Adicionado
- Novo serviço `MigrationService` para gerenciar migrações de dados
- Flag `TODO_MIGRATION_DONE` para controlar execução única da migração
- Método `TodoService.sanitizeTask()` para normalização de tarefas com valores padrão
- Logging de debug estruturado para facilitar diagnóstico de problemas

### Alterado
- Substituído `console.error` por `console.debug` no carregamento de tarefas para reduzir notificações desnecessárias
- Campo `archived` agora tem valor padrão `false` no schema
- Campo `priority` agora tem valor padrão `1` no schema
- Melhorada lógica de carregamento de dados com tratamento mais robusto de erros

## [0.15.0] - 2025-11-02

### Adicionado
- Suporte completo a internacionalização (i18n) com português (pt-BR) e inglês (en)
- Seletor de idioma no cabeçalho da aplicação
- Traduções para todas as funcionalidades: tarefas, sono, cafeína e autenticação

### Alterado
- Interface do usuário adaptada para múltiplos idiomas
- Mensagens de toast e notificações agora são traduzidas
- Documentação de métodos de produtividade traduzida
