import { fixture, html } from '@open-wc/testing';
import { visualDiff } from '@web/test-runner-visual-regression';

import '@material/mwc-icon-button';
import type { Button } from '@material/mwc-button';

import './oscd-dialog.js';
import type { OscdDialog } from './oscd-dialog.js';

const factor = process.env.CI ? 2 : 1;

function timeout(ms: number) {
  return new Promise(res => setTimeout(res, ms * factor));
}

mocha.timeout(2000 * factor);

const primary1 = { label: 'primary action', icon: 'edit', action: () => {} };
const primary2 = { label: 'primary action', action: () => {} };

describe('Customized OpenSCD dialog', () => {
  let parent: HTMLDivElement;
  let dialog: OscdDialog;

  beforeEach(() => {
    parent = document.createElement('div');
    parent.style.width = '100%';
    parent.style.height = '100%';
    document.body.prepend(parent);
  });

  afterEach(() => {
    parent.remove();
  });

  describe('has a slot in the header to add user-defined content', () => {
    beforeEach(async () => {
      dialog = await fixture(
        html`<oscd-dialog ?open=${true} heading="heading"
          >SomeDialogContent<mwc-icon-button
            icon="edit"
            slot="header"
          ></mwc-icon-button
          ><mwc-icon-button icon="delete" slot="header"></mwc-icon-button
        ></oscd-dialog>`
      );
      await dialog.requestUpdate();

      document.body.prepend(dialog);
    });

    afterEach(() => dialog.remove());

    it('looks like the old one', async () => {
      await timeout(300);
      await visualDiff(parent, `oscd-dialog-header`);
    });
  });

  describe('without any pages slotted', () => {
    beforeEach(async () => {
      dialog = await fixture(
        html`<oscd-dialog ?open=${true} heading="heading" .primary=${primary1}
          >SomeDialogContent</oscd-dialog
        >`
      );
      await dialog.requestUpdate();

      document.body.prepend(dialog);
    });

    afterEach(() => dialog.remove());

    it('looks like the latest screenshot', async () => {
      await timeout(300);
      await visualDiff(parent, `oscd-dialog-wo-pages`);
    });
  });

  describe('with one page slotted', () => {
    beforeEach(async () => {
      dialog = await fixture(
        html`<oscd-dialog ?open=${true} heading="heading" .primary=${primary2}
          ><div slot="page">FirstPageContent</div></oscd-dialog
        >`
      );
      await dialog.requestUpdate();

      document.body.prepend(dialog);
    });

    afterEach(() => dialog.remove());

    it('looks like the latest screenshot', async () => {
      await timeout(300);
      await visualDiff(parent, `oscd-dialog-one-page`);
    });
  });

  describe('with multiple pages slotted', () => {
    describe('starting on the first page', () => {
      beforeEach(async () => {
        dialog = await fixture(
          html`<oscd-dialog ?open=${true} heading="heading" .primary=${primary1}
            ><div slot="page">FirstPageContent</div>
            <div slot="page">SecondPageContent</div>
            <div slot="page">ThirdPageContent</div></oscd-dialog
          >`
        );
        await dialog.requestUpdate();

        document.body.prepend(dialog);
      });

      afterEach(() => dialog.remove());

      it('looks like the latest screenshot', async () => {
        await timeout(300);
        await visualDiff(parent, `oscd-dialog-multi-1st-pages`);
      });

      describe('going forward to the last page', () => {
        beforeEach(async () => {
          await timeout(100);

          dialog.shadowRoot
            ?.querySelector<Button>('mwc-button[dialogAction="next"]')
            ?.click();
          await dialog.updateComplete;
          dialog.shadowRoot
            ?.querySelector<Button>('mwc-button[dialogAction="next"]')
            ?.click();
          await dialog.updateComplete;
        });

        it('looks like the latest screenshot', async () => {
          await timeout(100);
          await visualDiff(parent, `oscd-dialog-multi-1st-to-3rd-pages`);
        });
      });
    });

    describe('starting on the middle page', () => {
      beforeEach(async () => {
        dialog = await fixture(
          html`<oscd-dialog
            ?open=${true}
            heading="heading"
            startPage="2"
            .primary=${primary1}
            ><div slot="page">FirstPageContent</div>
            <div slot="page">SecondPageContent</div>
            <div slot="page">ThirdPageContent</div></oscd-dialog
          >`
        );
        await dialog.requestUpdate();

        document.body.prepend(dialog);
      });

      afterEach(() => dialog.remove());

      it('looks like the latest screenshot', async () => {
        await timeout(300);
        await visualDiff(parent, `oscd-dialog-multi-2nd-pages`);
      });
    });

    describe('starting on the last page', () => {
      beforeEach(async () => {
        dialog = await fixture(
          html`<oscd-dialog
            ?open=${true}
            heading="heading"
            startPage="3"
            .primary=${primary1}
            ><div slot="page">FirstPageContent</div>
            <div slot="page">SecondPageContent</div>
            <div slot="page">ThirdPageContent</div></oscd-dialog
          >`
        );
        await dialog.updateComplete;

        document.body.prepend(dialog);
      });

      afterEach(() => dialog.remove());

      it('looks like the latest screenshot', async () => {
        await timeout(300);
        await visualDiff(parent, `oscd-dialog-multi-3rd-pages`);
      });

      describe('going back to the second page', () => {
        beforeEach(async () => {
          await timeout(300);

          dialog.shadowRoot
            ?.querySelector<Button>('mwc-button[dialogAction="prev"]')
            ?.click();
          await dialog.updateComplete;
        });

        it('looks like the latest screenshot', async () => {
          await timeout(300);
          await visualDiff(parent, `oscd-dialog-multi-3rd-to-2nd-pages`);
        });
      });
    });
  });
});
