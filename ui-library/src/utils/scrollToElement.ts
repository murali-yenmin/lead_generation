/**
 * Scrolls to the specified element with customizable options.
 *
 * @param selector - The CSS selector to identify the target element (e.g., '.my-element', '#my-element').
 * @param options - Optional configuration object for scroll behavior.
 * @param options.behavior - Scroll behavior (smooth or auto). Default is 'smooth'.
 * @param options.offset - Optional offset (in pixels) from the target element's position.
 * @param options.block - Vertical alignment in the viewport ('start', 'center', 'end', or 'nearest'). Default is 'start'.
 * @param options.inline - Horizontal alignment in the viewport ('start', 'center', 'end', or 'nearest'). Default is 'nearest'.
 *
 * Example usages:
 *
 * 1. `scrollToElement('.my-element', { behavior: 'smooth', offset: 100 });`
 * 2. `scrollToElement('#my-element', { behavior: 'smooth' });`
 * 3. `scrollToElement('.my-element', { behavior: 'smooth', block: 'center' });`
 * 4. `scrollToElement('#my-element', { behavior: 'smooth', inline: 'end', offset: 50 });`
 * 5. `scrollToElement('div', { behavior: 'smooth', block: 'start' });`
 * 6. `scrollToElement('.my-element', { behavior: 'auto' });`
 * 7. `scrollToElement('.my-element', { behavior: 'smooth', offset: 200 });`
 * 8. `scrollToElement('.my-element', { behavior: 'smooth', block: 'end', inline: 'center' });`
 * 9. `scrollToElement('.my-element');`
 * 10. `scrollToElement('.my-element', { behavior: 'smooth', block: 'center', offset: 150 });`
 *
 * @returns void
 */
export const scrollToElement = (
  selector: string,
  options: {
    behavior?: ScrollBehavior;
    offset?: number;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  } = {},
): void => {
  const { behavior = 'smooth', offset = 0, block = 'start', inline = 'nearest' } = options;
  const el = document.querySelector(selector);

  if (el) {
    if (offset === 0) {
      el.scrollIntoView({
        behavior,
        block,
        inline,
      });
    } else {
      const rect = el.getBoundingClientRect();
      const scrollPosition = rect.top + window.pageYOffset - offset;

      window.scrollTo({
        top: scrollPosition,
        behavior,
      });
    }
  }
};
