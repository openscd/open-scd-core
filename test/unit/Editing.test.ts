import { html, fixture, expect } from '@open-wc/testing';

import { newActionEvent, newOpenDocEvent } from '../../src/foundation.js';

import '../editing-element.js';
import { EditingElement } from '../editing-element.js';

describe('Editing Element', () => {
  let editor: EditingElement;
  const doc = new DOMParser().parseFromString(
    `<?xml version="1.0" encoding="UTF-8"?>
      <SCL version="2007" revision="B" xmlns="http://www.iec.ch/61850/2003/SCL">
        <Substation name="A1" desc="test substation"></Substation>
      </SCL>`,
    'application/xml'
  );
  beforeEach(async () => {
    editor = <EditingElement>(
      await fixture(html`<editing-element></editing-element>`)
    );
  });

  it('loads a document on OpenDocEvent', () => {
    editor.dispatchEvent(newOpenDocEvent(doc, 'test.scd'));
    expect(editor.doc).to.equal(doc);
  });

  it('inserts an element on InsertActionEvent', () => {
    editor.dispatchEvent(newOpenDocEvent(doc, 'test.scd'));
    const node = doc.createElement('test');
    editor.dispatchEvent(
      newActionEvent({ parent: doc.documentElement, node, reference: null })
    );
    expect(doc.documentElement.querySelector('test')).to.exist;
  });

  it("updates an element's attributes on UpdateActionEvent", () => {
    editor.dispatchEvent(newOpenDocEvent(doc, 'test.scd'));
    const element = doc.querySelector('Substation')!;
    editor.dispatchEvent(
      newActionEvent({ element, attributes: { name: 'A2', desc: null } })
    );
    expect(element).to.have.attribute('name', 'A2');
    expect(element).to.not.have.attribute('desc');
  });
});
