import { property } from 'lit/decorators.js';
import {
  LitElementConstructor,
  OpenDocEvent,
  EditorActionEvent,
  isInsert,
  isUpdate,
  Insert,
  Update,
} from '../foundation.js';

function onInsertAction(action: Insert) {
  action.parent.insertBefore(action.node, action.reference);
}

function onUpdateAction(action: Update) {
  for (const [attribute, value] of Object.entries(action.attributes))
    if (value === null) action.element.removeAttribute(attribute);
    else if (value !== undefined) action.element.setAttribute(attribute, value);
}

function onEditorAction(event: EditorActionEvent) {
  const action = event.detail;
  if (isInsert(action)) onInsertAction(action);
  else if (isUpdate(action)) onUpdateAction(action);
}

/** A mixin for editing a set of [[docs]] using [[EditorActionEvent]]s */
export function Editing<TBase extends LitElementConstructor>(Base: TBase) {
  class EditingElement extends Base {
    /** The `XMLDocument` currently being edited */
    get doc(): XMLDocument {
      return this.docs[this.docName];
    }

    /** The set of `XMLDocument`s currently loaded */
    @property({ attribute: false })
    docs: Record<string, XMLDocument> = {};

    /** The name of the [[`doc`]] currently being edited */
    @property({ type: String }) docName = '';

    private onOpenDoc(event: OpenDocEvent) {
      this.docName = event.detail.docName;
      this.docs[this.docName] = event.detail.doc;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);

      this.addEventListener('open-doc', this.onOpenDoc);
      this.addEventListener('editor-action', onEditorAction);
    }
  }
  return EditingElement;
}
