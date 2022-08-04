/** Represents the intent to `parent.insertBefore(node, reference)`. */
export type Insert = {
  parent: Node;
  node: Node;
  reference: Node | null;
};

/** Represents the user's intent to change an XMLDocument. */
export type EditorAction = Insert;

export function isInsert(action: EditorAction): action is Insert {
  return (action as Insert).parent !== undefined;
}

export type EditorActionEvent<E extends EditorAction = EditorAction> =
  CustomEvent<E>;

export function newActionEvent<E extends EditorAction>(
  action: E
): EditorActionEvent<E> {
  return new CustomEvent<E>('editor-action', {
    composed: true,
    bubbles: true,
    detail: action,
  });
}

declare global {
  interface ElementEventMap {
    ['editor-action']: EditorActionEvent;
  }
}
