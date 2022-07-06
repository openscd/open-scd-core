import { LitElement } from 'lit';

/** Constructor type for defining `LitElement` mixins. */
export type LitElementConstructor = new (...args: any[]) => LitElement;

export {
  OpenDocEvent,
  newOpenDocEvent
} from './foundation/open-doc.js';

