# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.21.0] - 2025-01-23

### Alterado
- 📱 **App ID Profissional**: Atualizado de `app.lovable.571d87a94b3d4271a838d57e4af04a18` para `com.mrbarkan.nima`
  - Utiliza domínio personalizado em notação reversa (reverse domain notation)
  - Formato compatível com requisitos do Android e iOS
  - Vinculação profissional ao domínio `nima.mrbarkan.com`
  - Resolve erro de validação no comando `npx cap add android`

### Técnico
- Atualizado: `capacitor.config.ts`
  - `appId: 'com.mrbarkan.nima'` (formato Java package válido)
  - Mantida configuração de hot-reload para desenvolvimento
  - Plugins LocalNotifications preservados

### Importante
⚠️ Este App ID é permanente após publicação nas lojas de aplicativos (Google Play Store / Apple App Store)

## [0.20.0] - 2025-01-23

### Adicionado
- 📱 **Migração para Capacitor**: Suporte completo para aplicativos nativos Android e iOS
- 🔔 **Notificações Nativas 100% Confiáveis**: 
  - LocalNotifications do Capacitor substituindo Web Notifications API em dispositivos móveis
  - Notificações agendadas funcionam de forma confiável em Android e iOS
  - Mantida compatibilidade com PWA para navegadores web
  - Sistema híbrido detecta automaticamente plataforma (nativa vs web)

### Melhorado
- Arquitetura de notificações refatorada para suportar múltiplas plataformas
- `notification.service.ts` agora detecta se está rodando em Capacitor ou navegador
- Métodos `isGranted()` e `requestPermission()` adaptados para ambas plataformas
- Agendamento de notificações usa `LocalNotifications.schedule()` em apps nativos
- Cancelamento de notificações unificado entre plataformas

### Técnico
- Novo: `capacitor.config.ts` - Configuração do Capacitor
- Atualizado: `src/services/notification.service.ts`
  - Importado: `Capacitor`, `LocalNotifications` do `@capacitor/core`
  - Novo método: `getNotificationId()` - Gera IDs consistentes para notificações nativas
  - Modificado: `scheduleNotification()`, `cancelNotification()`, `showNotification()`
  - Modificado: `isSupported()`, `isGranted()`, `requestPermission()` com suporte a Capacitor
- Atualizado: `src/hooks/useNotifications.tsx`
  - `isGranted()` agora é assíncrona devido à API do Capacitor
- Dependências adicionadas:
  - `@capacitor/core@latest`
  - `@capacitor/cli@latest`
  - `@capacitor/android@latest`
  - `@capacitor/ios@latest`
  - `@capacitor/local-notifications@latest`

### Instruções de Deploy
Para testar em dispositivos físicos ou emuladores:
1. Transferir projeto para repositório Github via "Export to Github"
2. Git pull do projeto
3. Executar `npm install`
4. Executar `npx cap init` (se necessário)
5. Adicionar plataforma: `npx cap add android` e/ou `npx cap add ios`
6. Atualizar dependências: `npx cap update android` ou `npx cap update ios`
7. Build do projeto: `npm run build`
8. Sincronizar: `npx cap sync`
9. Rodar: `npx cap run android` ou `npx cap run ios`

**Nota**: iOS requer Mac com Xcode instalado.

## [0.19.0] - 2025-01-23

### Adicionado
- Filtro dinâmico de métodos de produtividade na página Todo baseado nas configurações do usuário
- Ajuste automático do método ativo quando o método atual é desativado nas configurações

### Melhorado
- Tabs de métodos agora renderizam apenas os métodos visíveis selecionados em Configurações
- Grid de tabs ajusta automaticamente o número de colunas baseado nos métodos visíveis (1-4 colunas)
- Nomes dos métodos agora usam traduções i18n para consistência

## [0.18.1] - 2025-01-23

### Corrigido
- Aviso de jejum na página de Cafeína agora mostra mensagem geral "(sem leite, sem açúcar)" ao invés de repetir em cada item
- Lógica de filtro do jejum corrigida: café preto, chá verde e chá preto são permitidos durante jejum
- Melhorada legibilidade das restrições de jejum com aviso destacado e lembrete de hidratação

### Melhorado
- Card de dicas agora inclui lembrete de hidratação destacado com 💧
- Dica específica sobre bebidas permitidas durante jejum
- Traduções i18n atualizadas para PT-BR e EN com novas dicas

## [0.18.0] - 2025-01-09

### Corrigido
- 🔧 **Co-dependências Inteligentes Funcionando**
  - **Sleep → Fasting**: Agora usa `SLEEP_SELECTED_TIME` (ciclo escolhido) ao invés de `SLEEP_TIME` (hora digitada)
  - **Sleep Mode Support**: Sugestões adaptadas para modo "sleep" (indo dormir) vs "wake" (acordando)
  - **Fasting → Caffeine**: Filtro temporal baseado no `breakfastTime` calculado do jejum
  - Interface de sugestão aprimorada com botões "Aceitar" e "Ignorar"
  - Popup contextual com ícone 😴 indicando origem da sugestão (Sleep)

- 💾 **Persistência Completa do Jejum**
  - `calculation` agora persiste em localStorage e backend via `FASTING_CALCULATION`
  - Auto-recálculo ao abrir o app se houver dados salvos
  - Atualização em tempo real a cada minuto da timeline de jejum
  - Estado completo preservado entre sessões (lastMealTime, targetDuration, calculation)

### Melhorado
- 🎯 **UX das Integrações**
  - Indicador visual dinâmico na página de Cafeína mostrando até que horas o jejum está ativo
  - Mensagens contextuais adaptadas ao modo Sleep (indo dormir vs acordando)
  - Botão X para fechar popup de sugestão
  - Layout aprimorado com flex e espaçamento adequado

### Técnico
- Atualizado: `src/config/constants.ts`
  - Adicionado: `FASTING_CALCULATION` storage key
- Atualizado: `src/services/fasting.service.ts`
  - Modificado: `suggestLastMealFromSleep()` agora aceita parâmetro `mode: "sleep" | "wake"`
  - Lógica: modo "sleep" = 2h antes, modo "wake" = 10h antes (8h sono + 2h)
- Atualizado: `src/hooks/useFastingCalculator.tsx`
  - Adicionado: `calculation` ao estado persistido com `useMultiPersistence`
  - Adicionado: `showSuggestionPopup`, `acceptSuggestion()`, `ignoreSuggestion()`
  - Implementado: Auto-recálculo no mount se houver dados salvos
  - Implementado: Recálculo automático a cada 1 minuto via `setInterval`
  - Usa `SLEEP_SELECTED_TIME` + `SLEEP_MODE` para integração correta
- Atualizado: `src/hooks/useCaffeineScheduler.tsx`
  - Filtro agora verifica `breakfastTime` do `FASTING_CALCULATION` parseado
  - Comparação temporal: antes do café da manhã = só café preto
- Atualizado: `src/pages/Fasting.tsx`
  - Novo: Popup de sugestão com UI aprimorada (botões, ícone X)
  - Importado: `Button` component e `X` icon
- Atualizado: `src/pages/Caffeine.tsx`
  - Novo: Estado `fastingInfo` extraído dinamicamente do `FASTING_CALCULATION`
  - Mensagem contextual mostra até que horas o jejum está ativo

## [0.17.0] - 2025-01-09

### Adicionado
- 🔗 **Fase 3: Integrações Avançadas**
  - Sistema completo de sincronização inteligente entre Sono, Jejum e Cafeína
  - **Integração Sono ↔ Jejum**:
    - Sugestão automática de horário da última refeição (2h antes de dormir)
    - Cálculo de horário ideal para quebrar jejum baseado no horário de acordar
    - Indicador visual quando integração está ativa
  - **Integração Jejum ↔ Cafeína**:
    - Filtro automático para apenas café preto durante jejum
    - Alerta visual "Modo Jejum" na página de cafeína
    - Manutenção do cronograma com adaptação das opções
  - **Integração Sono ↔ Cafeína**:
    - Sincronização já existente, garantida compatibilidade com novas integrações
    
- 💾 **Backend completo para Jejum**
  - Nova tabela `user_fasting_data` no Supabase
  - RLS policies para segurança de dados por usuário
  - Sincronização automática via Lovable Cloud
  - Métodos `syncFastingData()` e `loadFastingData()` no `syncService`
  
- 🎨 **Melhorias de UX**
  - Sugestões contextuais baseadas em integrações ativas
  - Indicadores visuais com bordas coloridas
  - Mensagens explicativas sobre adaptações automáticas
  
### Técnico
- Atualizado: `src/services/fasting.service.ts`
  - Novo: `suggestLastMealFromSleep()` - Calcula horário de refeição baseado no sono
  - Novo: `calculateBreakfastFromWake()` - Calcula horário de quebrar jejum
- Atualizado: `src/services/caffeine.service.ts`
  - Novo: `filterForFasting()` - Filtra opções de cafeína compatíveis com jejum
- Atualizado: `src/services/sync.service.ts`
  - Novo: `syncFastingData()` - Sincroniza dados de jejum com backend
  - Novo: `loadFastingData()` - Carrega dados de jejum do backend
- Atualizado: `src/hooks/useFastingCalculator.tsx`
  - Integração com `useSettings` para detectar integrações ativas
  - Novo campo `integrationSuggestion` para exibir sugestões
  - Migrado para `useMultiPersistence` com sync backend
- Atualizado: `src/hooks/useCaffeineScheduler.tsx`
  - Integração com `useSettings` para aplicar filtros
  - Novo estado `filteredSchedule` para opções adaptadas
  - Novo campo `integrationActive` para indicar modo jejum
- Atualizado: `src/pages/Fasting.tsx` e `src/pages/Caffeine.tsx`
  - Indicadores visuais de integrações ativas
  - Mensagens contextuais para o usuário
- Migration: Tabela `user_fasting_data` com trigger de updated_at

### Observações
- Fase 3 completa e funcional
- Todas as integrações configuráveis via página de Settings
- Sistema pronto para expansão futura (ex: notificações de jejum)

## [0.16.0] - 2025-01-09

### Adicionado
- ✨ **Módulo de Jejum Intermitente**
  - Cálculo de fases do jejum baseado em pesquisas científicas mais recentes
  - Visualização interativa das 5 fases do jejum (Anabólica, Pós-Absorção, Cetose, Autofagia Ativa, Autofagia Profunda)
  - Timeline visual com progresso em tempo real
  - Cards expandíveis detalhando benefícios de cada fase
  - Seletor de duração de jejum (12h, 14h, 16h, 18h, 20h, 24h+)
  - Cálculo automático do horário ideal para quebrar o jejum
  
- ⚙️ **Sistema de Configurações**
  - Nova página de Settings acessível pelo menu do usuário
  - Controle de integrações entre funcionalidades:
    - Sincronizar Sono com Jejum
    - Sincronizar Sono com Cafeína
    - Sincronizar Jejum com Cafeína
  - Filtro de métodos de tarefas visíveis
  - Pelo menos um método de tarefa deve estar visível
  - Configurações persistidas localmente com validação
  
- 🎨 **Sistema de design atualizado**
  - Nova cor de ícone para módulo de jejum (`--icon-fasting`)
  - Nova cor de ícone para configurações (`--icon-settings`)
  - 5 novas cores de fase do jejum no design system
  - Cores temáticas integradas ao Tailwind config
  - Seção `icon` adicionada ao Tailwind para melhor organização
  
- 🌍 **Internacionalização expandida**
  - Traduções completas PT-BR e EN para módulo de jejum
  - Traduções completas PT-BR e EN para configurações
  - Novos namespaces i18n: `fasting.json` e `settings.json`
  
- 🧭 **Navegação atualizada**
  - Novo item "Jejum" no menu de navegação
  - Novo item "Configurações" no menu do usuário
  - Rotas `/fasting` e `/settings` adicionadas
  - Ícone Clock para jejum e Settings para configurações

### Técnico
- Novo: `src/types/fasting.types.ts` - Definições de tipos TypeScript para jejum
- Novo: `src/types/settings.types.ts` - Definições de tipos para configurações
- Novo: `src/services/fasting.service.ts` - Serviço de cálculo de fases e timeline
- Novo: `src/services/settings.service.ts` - Serviço de persistência de configurações
- Novo: `src/hooks/useFastingCalculator.tsx` - Hook de gerenciamento de jejum
- Novo: `src/hooks/useSettings.tsx` - Hook de gerenciamento de configurações
- Novo: `src/pages/Fasting.tsx` - Página principal do módulo de jejum
- Novo: `src/pages/Settings.tsx` - Página de configurações
- Novo: `src/components/features/fasting/` - Componentes reutilizáveis
- Novo: `src/components/features/settings/` - Componentes de configurações
- Atualizado: Design system (`index.css`, `tailwind.config.ts`)

## [0.15.1] - 2025-11-03

### Corrigido
- **Migração automática de dados legados**: Implementado sistema de migração one-time para converter dados de tarefas antigas para o novo formato
- **Erro ao carregar tarefas**: Removidos toasts de erro desnecessários durante o carregamento de tarefas
- **Validação de dados**: Schema Zod agora inclui valores padrão para campos `archived` e `priority`
- **Compatibilidade retroativa**: Garantida compatibilidade com dados armazenados antes da implementação de i18n

## [0.15.0] - 2025-11-02

### Adicionado
- Suporte completo a internacionalização (i18n) com português (pt-BR) e inglês (en)
- Seletor de idioma no cabeçalho da aplicação
- Traduções para todas as funcionalidades: tarefas, sono, cafeína e autenticação
