import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Editing } from '../../src/Editing.js';

@customElement('editing-element')
export class EditingElement extends Editing(LitElement) {}
