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
  docName: string,
  eventInitDict?: CustomEventInit<Partial<OpenDocDetail>>
): OpenDocEvent {
  return new CustomEvent<OpenDocDetail>('open-doc', {
    bubbles: true,
    composed: true,
    ...eventInitDict,
    detail: { doc, docName, ...eventInitDict?.detail },
  });
}

declare global {
  interface ElementEventMap {
    ['open-doc']: OpenDocEvent;
  }
}
