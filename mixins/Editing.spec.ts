import { html, fixture, expect } from '@open-wc/testing';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Editing } from './Editing.js';
import { newActionEvent, newOpenDocEvent } from '../foundation.js';

@customElement('editing-element')
class EditingElement extends Editing(LitElement) {}

describe('Editing Element', () => {
  let editor: EditingElement;
  const doc = new DOMParser().parseFromString(
    `<?xml version="1.0" encoding="UTF-8"?>
      <SCL version="2007" revision="B" xmlns="http://www.iec.ch/61850/2003/SCL" xmlns:sxy="http://www.iec.ch/61850/2003/SCLcoordinates">
        <Substation name="A1" desc="test substation" sxy:x="1" sxy:y="1"></Substation>
      </SCL>`,
    'application/xml'
  );

  beforeEach(async () => {
    editor = <EditingElement>(
      await fixture(html`<editing-element></editing-element>`)
    );
  });

  it('loads a document on OpenDocEvent', async () => {
    editor.dispatchEvent(newOpenDocEvent(doc, 'test.scd'));
    await editor.updateComplete;
    expect(editor.doc).to.equal(doc);
    expect(editor.docName).to.equal('test.scd');
  });

  describe('given a loaded document', () => {
    beforeEach(() => {
      editor.dispatchEvent(newOpenDocEvent(doc, 'test.scd'));
    });

    it('inserts an element on InsertActionEvent', () => {
      const parent = doc.documentElement;
      const node = doc.createElement('test');
      const reference = doc.querySelector('Substation');
      editor.dispatchEvent(newActionEvent({ parent, node, reference }));
      expect(doc.documentElement.querySelector('test')).to.have.property(
        'nextSibling',
        reference
      );
    });

    it("updates an element's attributes on UpdateActionEvent", async () => {
      const element = doc.querySelector('Substation')!;
      editor.dispatchEvent(
        newActionEvent({ element, attributes: { name: 'A2', desc: null } })
      );
      expect(element).to.have.attribute('name', 'A2');
      expect(element).to.not.have.attribute('desc');
    });

    it('removes an element on Remove Action', async () => {
      const node = doc.querySelector('Substation')!;
      editor.dispatchEvent(newActionEvent({ node }));
      expect(doc.querySelector('Substation')).to.not.exist;
    });
  });
});
