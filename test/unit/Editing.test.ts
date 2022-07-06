import './editing-element.js';
import { EditingElement } from './editing-element.js';
import { newOpenDocEvent } from '../../src/foundation/open-doc.js';
import { html, fixture, expect } from '@open-wc/testing';


describe('Editing Element', () => {
  let elm: EditingElement;
  let doc = new DOMParser().parseFromString(
    `
        <?xml version="1.0" encoding="UTF-8"?>
        <SCL version="2007" revision="B" xmlns:sxy="http://www.iec.ch/61850/2003/SCLcoordinates" xmlns="http://www.iec.ch/61850/2003/SCL" xmlns:txy="http://www.iec.ch/61850/2003/Terminal" xmlns:scl="http://www.iec.ch/61850/2003/SCL" xsi:schemaLocation="http://www.iec.ch/61850/2003/SCL SCL.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:IEC_60870_5_104="http://www.iec.ch/61850-80-1/2007/SCL">
        </SCL>`,
    'application/xml'
  );
  beforeEach(async () => {
    elm = <EditingElement>(
        await fixture(html`<editing-element></editing-element>`)
      );
  })

  it('loads a document', () => {
    elm.dispatchEvent(newOpenDocEvent(doc, 'test.scd'));
    expect(elm.docs["test.scd"]).to.exist;
  });
});
