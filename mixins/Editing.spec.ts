import { html, fixture, expect } from '@open-wc/testing';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
  Arbitrary,
  assert,
  constant,
  constantFrom,
  dictionary,
  oneof,
  property,
  record,
  string as fcString,
  stringOf,
  tuple,
  unicode,
  webUrl,
} from 'fast-check';

import { Editing } from './Editing.js';
import {
  Insert,
  isNamespaced,
  NamespacedAttributeValue,
  newActionEvent,
  newOpenDocEvent,
  Remove,
  Update,
} from '../foundation.js';

const sclDocString = `<?xml version="1.0" encoding="UTF-8"?>
<SCL version="2007" revision="B" xmlns="http://www.iec.ch/61850/2003/SCL">
  <Substation name="A1" desc="test substation"></Substation>
</SCL>`;
const testDocStrings = [
  sclDocString,
  `<?xml version="1.0" encoding="UTF-8"?>
  <testDoc1>
<element1 property1="value1" property2="value2">SomeText</element1>
<element2 property2="value2" property3="value3"><!--AComment--></element2>
<element3 property3="value3" property1="value1">
  <subelement1 property1="value1" property2="value2">SomeMoreText</subelement1>
  <subelement2 property2="value2" property3="value3"><!----></subelement2>
  <subelement3 property3="value3" property1="value1"></subelement3>
</element3>
</testDoc1>`,
  `<?xml version="1.0" encoding="UTF-8"?>
  <testDoc2>
<element1 property1="value1" property2="value2">SomeText</element1>
<element2 property2="value2" property3="value3"><!--AComment--></element2>
<element3 property3="value3" property1="value1">
  <subelement1 property1="value1" property2="value2">SomeMoreText</subelement1>
  <subelement2 property2="value2" property3="value3"><!----></subelement2>
  <subelement3 property3="value3" property1="value1"></subelement3>
</element3>
</testDoc2>`,
];

@customElement('editing-element')
class EditingElement extends Editing(LitElement) {}

describe('Editing Element', () => {
  let editor: EditingElement;
  const sclDoc = new DOMParser().parseFromString(
    sclDocString,
    'application/xml'
  );

  beforeEach(async () => {
    editor = <EditingElement>(
      await fixture(html`<editing-element></editing-element>`)
    );
  });

  it('loads a document on OpenDocEvent', async () => {
    editor.dispatchEvent(newOpenDocEvent(sclDoc, 'test.scd'));
    await editor.updateComplete;
    expect(editor.doc).to.equal(sclDoc);
    expect(editor.docName).to.equal('test.scd');
  });

  it('inserts an element on InsertActionEvent', () => {
    const parent = sclDoc.documentElement;
    const node = sclDoc.createElement('test');
    const reference = sclDoc.querySelector('Substation');
    editor.dispatchEvent(newActionEvent({ parent, node, reference }));
    expect(sclDoc.documentElement.querySelector('test')).to.have.property(
      'nextSibling',
      reference
    );
  });

  it("updates an element's attributes on UpdateActionEvent", async () => {
    const element = sclDoc.querySelector('Substation')!;
    editor.dispatchEvent(
      newActionEvent({ element, attributes: { name: 'A2', desc: null } })
    );
    expect(element).to.have.attribute('name', 'A2');
    expect(element).to.not.have.attribute('desc');
  });

  it('removes an element on Remove Action', async () => {
    const node = sclDoc.querySelector('Substation')!;
    editor.dispatchEvent(newActionEvent({ node }));
    expect(sclDoc.querySelector('Substation')).to.not.exist;
  });

  describe('generally', () => {
    const xmlAttributeName =
      /^(?!xml|Xml|xMl|xmL|XMl|xML|XmL|XML)[A-Za-z_][A-Za-z0-9-_.]*(:[A-Za-z_][A-Za-z0-9-_.]*)?$/;

    function descendants(parent: Element | XMLDocument): Node[] {
      return (Array.from(parent.childNodes) as Node[]).concat(
        ...Array.from(parent.children).map(child => descendants(child))
      );
    }

    const testDocs = tuple(
      constantFrom(...testDocStrings),
      constantFrom(...testDocStrings)
    )
      .map(strs =>
        strs.map(str => new DOMParser().parseFromString(str, 'application/xml'))
      )
      .map(docs =>
        docs.map(doc => ({ doc, nodes: descendants(doc).concat([doc]) }))
      );

    function remove(nodes: Node[]): Arbitrary<Remove> {
      const node = oneof(
        constantFrom(...nodes),
        testDocs.chain(docs => constantFrom(...docs.map(d => d.doc)))
      );
      return record({ node });
    }

    function insert(nodes: Node[]): Arbitrary<Insert> {
      const references = (nodes as (Node | null)[]).concat([null]);
      const parent = constantFrom(...nodes);
      const node = constantFrom(...nodes);
      const reference = constantFrom(...references);
      return record({ parent, node, reference });
    }

    const namespacedValue = record({
      value: oneof(stringOf(oneof(unicode(), constant(':'))), constant(null)),
      namespaceURI: oneof(webUrl(), constant(null)),
    });

    function namespacedUpdate(nodes: Node[]): Arbitrary<Update> {
      const element = <Arbitrary<Element>>(
        constantFrom(...nodes.filter(nd => nd.nodeType === Node.ELEMENT_NODE))
      );
      const attributes = dictionary(
        fcString(),
        oneof(fcString(), constant(null), namespacedValue)
      );
      return record({ element, attributes });
    }

    function update(nodes: Node[]): Arbitrary<Update> {
      const element = <Arbitrary<Element>>(
        constantFrom(...nodes.filter(nd => nd.nodeType === Node.ELEMENT_NODE))
      );
      const attributes = dictionary(
        fcString(),
        oneof(fcString(), constant(null))
      );
      return record({ element, attributes });
    }

    it('inserts elements on Insert action events', () => {
      // FIXME(#62): teach eslint that ParentNode exists
      // eslint-disable-next-line  no-undef
      function isParentNode(node: Node): node is ParentNode {
        return (
          node instanceof Element ||
          node instanceof Document ||
          node instanceof DocumentFragment
        );
      }

      function isParentOf(parent: Node, node: Node | null) {
        return (
          isParentNode(parent) &&
          (node === null ||
            (Array.from(parent.childNodes) as Node[]).includes(node))
        );
      }

      function isValidInsert({ parent, node, reference }: Insert) {
        return (
          node !== reference &&
          isParentOf(parent, reference) &&
          !node.contains(parent) &&
          ![Node.DOCUMENT_NODE, Node.DOCUMENT_TYPE_NODE].some(
            nodeType => node.nodeType === nodeType
          ) &&
          !(
            parent instanceof Document &&
            (parent.documentElement || !(node instanceof Element))
          )
        );
      }

      assert(
        property(
          testDocs.chain(([doc1, doc2]) => {
            const nodes = doc1.nodes.concat(doc2.nodes);
            return insert(nodes);
          }),
          action => {
            editor.dispatchEvent(newActionEvent(action));
            if (isValidInsert(action))
              return (
                action.node.parentElement === action.parent &&
                action.node.nextSibling === action.reference
              );
            return true;
          }
        )
      );
    });

    it('updates default namespace attributes on Update action events', () => {
      assert(
        property(
          testDocs.chain(([{ nodes }]) => update(nodes)),
          action => {
            editor.dispatchEvent(newActionEvent(action));
            return Object.entries(action.attributes)
              .filter(
                ([name]) => name !== '__proto__' && xmlAttributeName.test(name)
              )
              .every(
                ([name, value]) => action.element.getAttribute(name) === value
              );
          }
        )
      );
    });

    it('updates namespaced attributes on Update action events', () => {
      assert(
        property(
          testDocs.chain(([{ nodes }]) => namespacedUpdate(nodes)),
          action => {
            editor.dispatchEvent(newActionEvent(action));
            return Object.entries(action.attributes)
              .filter(
                ([name, value]) =>
                  name !== '__proto__' &&
                  xmlAttributeName.test(name) &&
                  isNamespaced(value!) &&
                  value.namespaceURI &&
                  name.includes(':')
              )
              .map(entry => entry as [string, NamespacedAttributeValue])
              .every(
                ([name, { value, namespaceURI }]) =>
                  action.element.getAttributeNS(
                    <string>namespaceURI,
                    <string>name.split(':', 2)[1]
                  ) === value
              );
          }
        )
      );
    });

    it('removes elements on Remove action events', () => {
      assert(
        property(
          testDocs.chain(([{ nodes }]) => remove(nodes)),
          ({ node }) => {
            editor.dispatchEvent(newActionEvent({ node }));
            return !node.parentNode;
          }
        )
      );
    });
  });
});
