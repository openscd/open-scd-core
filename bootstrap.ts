import { OpenSCD } from './open-scd.js';

type ObjectType<T extends OpenSCD> = { new (): T };

export const bootstrap = (entrypoint: ObjectType<OpenSCD>) => {
  window.customElements.define('open-scd', entrypoint);
};
