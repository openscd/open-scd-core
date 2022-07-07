export interface OpenDocDetail {
  doc: XMLDocument;
  docName: string;
  docId?: string;
}

/** Opening an XML document */
export type OpenDocEvent = CustomEvent<OpenDocDetail>;

/** @returns a new [[OpenDocEvent]] */
export function newOpenDocEvent(
  doc: XMLDocument,
  docName: string
): OpenDocEvent {
  return new CustomEvent<OpenDocDetail>('open-doc', {
    bubbles: true,
    composed: true,
    detail: { doc, docName },
  });
}

declare global {
  interface ElementEventMap {
    ['open-doc']: OpenDocEvent;
  }
}
