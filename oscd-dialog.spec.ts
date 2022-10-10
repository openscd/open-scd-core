import { expect, fixture, html } from '@open-wc/testing';
import { SinonSpy, spy } from 'sinon';

import './oscd-dialog.js';
import type { OscdDialog } from './oscd-dialog.js';

describe('Customized OpenSCD dialog', () => {
  let dialog: OscdDialog;
  let primaryActionSpy: SinonSpy;
  let action: () => void;

  beforeEach(async () => {
    action = () => {};
    primaryActionSpy = spy(action);
    const primary = { label: 'label', action: primaryActionSpy };

    dialog = await fixture(
      html`<oscd-dialog ?open=${true} heading="heading" .primary=${primary}
        >SomeDialogContent</oscd-dialog
      >`
    );
    await dialog.requestUpdate();

    document.body.prepend(dialog);
  });

  it('triggers primary action callback on primary button click', async () => {
    dialog.shadowRoot
      ?.querySelector<HTMLElement>('mwc-button[slot="primaryAction"]')
      ?.click();

    expect(primaryActionSpy).to.have.been.calledOnce;
  });
});
