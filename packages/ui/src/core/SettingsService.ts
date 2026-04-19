export type SettingsScope = 'default' | 'user' | 'project' | 'workspace';

export interface SettingDefinition<T = any> {
  id: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  default: T;
  description: string;
}

export class SettingsService {
  private definitions = new Map<string, SettingDefinition>();
  private values: Record<SettingsScope, Record<string, any>> = {
    default: {},
    user: {},
    project: {},
    workspace: {}
  };

  registerSetting(def: SettingDefinition) {
    this.definitions.set(def.id, def);
    this.values.default[def.id] = def.default;
  }

  get<T>(id: string): T {
    const def = this.definitions.get(id);
    if (!def) {
      throw new Error(`Setting ${id} is not registered`);
    }

    // Precedence: workspace > project > user > default
    if (this.values.workspace[id] !== undefined) return this.values.workspace[id] as T;
    if (this.values.project[id] !== undefined) return this.values.project[id] as T;
    if (this.values.user[id] !== undefined) return this.values.user[id] as T;
    
    return this.values.default[id] as T;
  }

  set<T>(id: string, value: T, scope: SettingsScope = 'user') {
    if (!this.definitions.has(id)) {
      throw new Error(`Setting ${id} is not registered`);
    }
    
    this.values[scope][id] = value;
    this.persist(scope);
  }

  private persist(scope: SettingsScope) {
    if (typeof localStorage !== 'undefined' && scope !== 'default') {
      localStorage.setItem(`becode_settings_${scope}`, JSON.stringify(this.values[scope]));
    }
  }

  load() {
    if (typeof localStorage !== 'undefined') {
      ['user', 'project', 'workspace'].forEach((scope) => {
        const data = localStorage.getItem(`becode_settings_${scope}`);
        if (data) {
          try {
            this.values[scope as SettingsScope] = JSON.parse(data);
          } catch (e) {
            console.error(`Failed to parse settings for scope ${scope}`, e);
          }
        }
      });
    }
  }
}

export const globalSettingsService = new SettingsService();
