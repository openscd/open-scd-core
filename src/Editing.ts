import { property } from 'lit/decorators.js';
import {
  LitElementConstructor,
  OpenDocEvent,
  EditorActionEvent,
  isInsert,
} from './foundation.js';

/** @typeParam TBase - a type extending `LitElement`
 * @returns `Base` with an `XMLDocument` property "`doc`" and an event listener
 * applying [[`EditorActionEvent`]]s and dispatching [[`LogEvent`]]s. */
export function Editing<TBase extends LitElementConstructor>(Base: TBase) {
  class EditingElement extends Base {
    /** The `XMLDocument` to be edited */
    get doc(): XMLDocument {
      return this.docs[this.docName];
    }
    @property({ attribute: false })
    docs: Record<string, XMLDocument> = {};
    /** The name of the current [[`doc`]] */
    @property({ type: String }) docName = '';

    private onOpenDoc(event: OpenDocEvent) {
      this.docName = event.detail.docName;
      this.docs[this.docName] = event.detail.doc;
    }

    private onEditorAction(event: EditorActionEvent) {
      const action = event.detail;
      if (isInsert(action)) {
        action.parent.insertBefore(action.node, action.reference ?? null);
      }
      return;
    }

    constructor(...args: any[]) {
      super(...args);

      this.addEventListener('open-doc', this.onOpenDoc);
      this.addEventListener('editor-action', this.onEditorAction);
    }
  }
  return EditingElement;
}
