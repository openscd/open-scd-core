export type EditorAction = SimpleAction | ComplexAction;

export type SimpleAction = Insert | Remove | Update;
export type ComplexAction = {
  title: string;
  actions: SimpleAction[];
};

export type Insert = {
  parent: Node;
  node: Node;
  reference?: Node | null;
};

export type Remove = {
  node: Node;
};

export type Update = {
  element: Element;
  attributes: Partial<Record<string, string | null>>;
};

export function isInsert(action: EditorAction): action is Insert {
  return (action as Insert).parent !== undefined;
}

export function isUpdate(action: EditorAction): action is Update {
  return (action as Update).element !== undefined;
}

export function isRemove(action: EditorAction): action is Remove {
  return (
    (action as Insert).parent === undefined &&
    (action as Remove).node !== undefined
  );
}

export type EditorActionEvent<E extends EditorAction = EditorAction> =
  CustomEvent<E>;

export function newActionEvent(action: EditorAction): EditorActionEvent {
  return new CustomEvent<EditorAction>('editor-action', {
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
