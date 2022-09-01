import { property } from 'lit/decorators.js';
import {
  AttributeValue,
  EditorAction,
  isInsert,
  isNamespaced,
  isUpdate,
  isRemove,
  Insert,
  LitElementConstructor,
  OpenDocEvent,
  Remove,
  Update,
} from '../foundation.js';

function onInsertAction({ parent, node, reference }: Insert) {
  try {
    parent.insertBefore(node, reference);
  } catch (e) {
    // do nothing if insert doesn't work on these nodes
  }
}

function onUpdateAction({ element, attributes }: Update) {
  for (const entry of Object.entries(attributes))
    if (entry[0] !== '__proto__')
      try {
        const [attribute, value] = entry as [string, AttributeValue];
        if (isNamespaced(value)) {
          if (value.value === null)
            element.removeAttributeNS(value.namespaceURI, attribute);
          else
            element.setAttributeNS(value.namespaceURI, attribute, value.value);
        } else if (value === null) element.removeAttribute(attribute);
        else element.setAttribute(attribute, value);
      } catch (e) {
        // do nothing if update doesn't work on this element / these attributes
      }
}

function onRemoveAction({ node }: Remove) {
  node.parentNode?.removeChild(node);
}

function onEditorAction(action: EditorAction) {
  if (isInsert(action)) onInsertAction(action);
  else if (isUpdate(action)) onUpdateAction(action);
  else if (isRemove(action)) onRemoveAction(action);
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

    private onOpenDoc({ detail: { docName, doc } }: OpenDocEvent) {
      this.docName = docName;
      this.docs[this.docName] = doc;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);

      this.addEventListener('open-doc', this.onOpenDoc);
      this.addEventListener('editor-action', ({ detail }) =>
        onEditorAction(detail)
      );
    }
  }
  return EditingElement;
}
