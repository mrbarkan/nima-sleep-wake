# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

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
