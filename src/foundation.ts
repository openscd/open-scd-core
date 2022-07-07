import { LitElement } from 'lit';

/** Constructor type for defining `LitElement` mixins. */
export type LitElementConstructor = new (...args: any[]) => LitElement;

export { newOpenDocEvent } from './foundation/open-doc.js';
export type { OpenDocEvent } from './foundation/open-doc.js';

export { newActionEvent, isInsert } from './foundation/editor-action.js';
export type { EditorActionEvent } from './foundation/editor-action.js';
