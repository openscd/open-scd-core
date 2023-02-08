import { expect, fixture } from '@open-wc/testing';

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Configurating } from './Configurating.js';

namespace util {
  @customElement('configurating-element')
  export class ConfiguratingElement extends Configurating(LitElement) {}
}

describe('Configurating Element', () => {
  let editor: util.ConfiguratingElement;

  beforeEach(async () => {
    editor = <util.ConfiguratingElement>(
      await fixture(html`<configurating-element></configurating-element>`)
    );
  });

  it('Sets no configuration', () => {
    expect(editor).property('configuration').to.be.empty;
    expect(editor.configuration).to.be.empty;
  });

  it('Sets a configuration with Dev environment', () => {
    editor.configuration = {
      environment: 'dev',
    };

    expect(editor)
      .property('configuration')
      .property('environment')
      .to.equal('dev');

    expect(editor.configurationItem('environment')).to.equal('dev');
  });
});
