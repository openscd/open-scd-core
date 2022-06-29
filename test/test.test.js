import { expect } from '@open-wc/testing';
import { visualDiff } from '@web/test-runner-visual-regression';

it('can diff an element', async () => {
  const element = document.createElement('p');
  element.textContent = 'Hello world';
  element.style.color = 'blue';
  document.body.appendChild(element);

  await visualDiff(element, 'my-element');
});
it('sums up 2 numbers', () => {
  expect(2).to.equal(2);
});
