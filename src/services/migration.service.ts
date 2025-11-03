import { STORAGE_KEYS } from "@/config/constants";

/**
 * Serviço responsável por migrações de dados legados
 */
export class MigrationService {
  /**
   * Realiza migração one-time de dados de tarefas legados para novo formato
   * Executa apenas uma vez por dispositivo/usuário
   */
  static async migrateTodoData(): Promise<void> {
    // Verifica se migração já foi executada
    const migrationDone = localStorage.getItem(STORAGE_KEYS.TODO_MIGRATION_DONE);
    
    if (migrationDone === "true") {
      // Migração já executada, retorna imediatamente
      console.debug("[Migration] Todo migration already completed");
      return;
    }

    console.debug("[Migration] Starting todo data migration...");

    try {
      // Carrega dados brutos do localStorage
      const rawData = localStorage.getItem(STORAGE_KEYS.TODO_DATA);
      
      if (!rawData) {
        // Sem dados para migrar
        console.debug("[Migration] No todo data found to migrate");
        localStorage.setItem(STORAGE_KEYS.TODO_MIGRATION_DONE, "true");
        return;
      }

      const data = JSON.parse(rawData);

      // Aplica transformações aos dados legados
      const migratedData = {
        method: data.method || "ivy-lee",
        tasks: (data.tasks || []).map((task: any) => ({
          id: task.id,
          text: task.text,
          completed: task.completed ?? false,
          archived: false, // Garantir que tarefas ativas não estão arquivadas
          priority: task.priority ?? 1,
          category: task.category || undefined,
        })),
        archivedTasks: (data.archivedTasks || []).map((task: any) => ({
          id: task.id,
          text: task.text,
          completed: task.completed ?? false,
          archived: true, // Garantir que tarefas arquivadas têm flag
          priority: task.priority ?? 1,
          category: task.category || undefined,
        })),
      };

      // Salva dados migrados
      localStorage.setItem(STORAGE_KEYS.TODO_DATA, JSON.stringify(migratedData));
      
      // Marca migração como completa
      localStorage.setItem(STORAGE_KEYS.TODO_MIGRATION_DONE, "true");

      console.debug("[Migration] Todo data migration completed successfully", {
        tasksCount: migratedData.tasks.length,
        archivedCount: migratedData.archivedTasks.length,
      });
    } catch (error) {
      console.error("[Migration] Error during todo migration:", error);
      // Em caso de erro, marca como migrado para não tentar novamente
      // (evita loop infinito de erros)
      localStorage.setItem(STORAGE_KEYS.TODO_MIGRATION_DONE, "true");
    }
  }
}
