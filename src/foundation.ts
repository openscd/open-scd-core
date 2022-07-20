import { LitElement } from 'lit';

/** Constructor type for defining `LitElement` mixins. */
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type LitElementConstructor = new (...args: any[]) => LitElement;

export { newOpenDocEvent } from './foundation/open-doc.js';
export type { OpenDocEvent } from './foundation/open-doc.js';

export {
  newActionEvent,
  isInsert,
  isUpdate,
  isRemove,
} from './foundation/editor-action.js';
export type {
  EditorActionEvent,
  Insert,
  Update,
  Remove,
} from './foundation/editor-action.js';
