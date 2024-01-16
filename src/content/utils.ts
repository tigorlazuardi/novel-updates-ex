/**
 * closest traverses the DOM tree upwards until it finds a node that matches the given selector from the given element.
 * the selector.
 *
 * @param el element to start from
 * @param selector target element selector
 * @returns Element | null
 */
export function closest<E extends HTMLElement = HTMLElement>(
    el: HTMLElement,
    selector: string,
): E | null {
    let target: E | null = null;

    for (
        let current = el;
        current.parentElement;
        current = current.parentElement
    ) {
        if (target !== null) {
            break;
        }
        target = current.parentElement.querySelector<E>(selector);
    }

    return target;
}
