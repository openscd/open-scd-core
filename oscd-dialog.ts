import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import '@material/mwc-dialog';
import '@material/mwc-button';
import type { Dialog } from '@material/mwc-dialog';

type Primary = {
  label: string;
  icon?: string;
  action: () => void;
};

@customElement('oscd-dialog')
/** Slottable (multi page) dialog with primary action handler */
export class OscdDialog extends LitElement {
  /** Whether dialog is open */
  @property({ type: Boolean })
  open = true;

  /** Dialogs header content */
  @property({ type: String })
  heading = '';

  /** Optional primary action button label, icon and callback  */
  @property({ attribute: false })
  primary?: Primary;

  /** Starting page in a multi pages dialog */
  @property({ type: Number })
  startPage = 1;

  @state()
  private pageIndex = 1;

  private get pages(): HTMLElement[] {
    return Array.from(this.querySelectorAll('*[slot="page"]'));
  }

  @query('mwc-dialog') dialog!: Dialog;

  private firstPage(): boolean {
    return this.pageIndex === 1;
  }

  private lastPage(): boolean {
    if (this.pages.length === 0 || this.pages.length === 1) return true;
    return this.pages.length === this.pageIndex;
  }

  private onClosed(ae: CustomEvent<{ action: string } | null>): void {
    if (ae.detail!.action === 'close') this.open = false;
  }

  private updatePageVisibility(): void {
    if (this.pages)
      for (const page of this.pages) {
        if (this.pages.indexOf(page) + 1 === this.pageIndex)
          page.classList.remove('hidden');
        else page.classList.add('hidden');
      }
  }

  private next(): void {
    this.pageIndex += 1;
    this.updatePageVisibility();
  }

  private prev(): void {
    this.pageIndex -= 1;
    this.updatePageVisibility();
  }

  protected firstUpdated(): void {
    this.pageIndex = Math.min(this.startPage, this.pages.length);
    this.updatePageVisibility();
  }

  render(): TemplateResult {
    return html`<mwc-dialog
      heading=${this.heading}
      ?open=${this.open}
      @closed=${this.onClosed}
    >
      <nav><slot name="header"></slot></nav>
      <slot name="page"></slot>
      <slot></slot>
      ${this.pages && this.pages.length > 1 && !this.firstPage()
        ? html`<mwc-button
            slot="secondaryAction"
            icon="navigate_before"
            @click=${this.prev}
            label="Prev Page"
          ></mwc-button>`
        : html``}
      <mwc-button
        slot="secondaryAction"
        dialogAction="close"
        label="close"
        style="--mdc-theme-primary: var(--mdc-theme-error)"
      ></mwc-button
      >${this.pages && this.pages.length > 1 && !this.lastPage()
        ? html`<mwc-button
            slot="primaryAction"
            icon="navigate_next"
            @click=${this.next}
            label="Next Page"
            trailingIcon
          ></mwc-button>`
        : html``}
      ${this.primary && this.lastPage()
        ? html`<mwc-button
            slot="primaryAction"
            @click=${() => this.primary!.action()}
            icon="${this.primary.icon ?? ''}"
            label="${this.primary.label}"
            trailingIcon
          ></mwc-button>`
        : html``}</mwc-dialog
    >`;
  }

  static styles = css`
    mwc-dialog > nav {
      position: absolute;
      top: 8px;
      right: 14px;
    }

    ::slotted(.hidden) {
      display: none;
    }
  `;
}
