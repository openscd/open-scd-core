import { property } from 'lit/decorators.js';

import { LitElementConstructor } from '../foundation.js';

type ConfigurationItem = string | number | boolean | Object;

interface Configuration {
  [key: string]: ConfigurationItem;
}

/** A mixin for having a configuration on Open-SCD */
export function Configurating<TBase extends LitElementConstructor>(
  Base: TBase
) {
  class ConfiguratingElement extends Base {
    #configuration: Configuration = {};

    @property({ type: Object })
    get configuration(): Configuration {
      return this.#configuration;
    }

    set configuration(value: Configuration) {
      this.#configuration = value;
    }

    configurationItem(key: string): ConfigurationItem | undefined {
      return this.#configuration[key];
    }
  }

  return ConfiguratingElement;
}
