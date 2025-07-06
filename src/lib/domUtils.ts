/**
 * Utility functions for safely interacting with the DOM
 * These utilities help prevent common DOM manipulation errors
 */

/**
 * Gets an element safely, returning null if not found
 *
 * @param selector The CSS selector to find the element
 * @returns The element or null if not found
 */
export const safeGetElement = (selector: string): Element | null => {
  try {
    return document.querySelector(selector);
  } catch (error) {
    console.error(`Error finding element with selector "${selector}":`, error);
    return null;
  }
};

/**
 * Safely check if an element exists in the DOM
 *
 * @param element The element to check
 * @returns boolean indicating if element exists and is in DOM
 */
export const isElementInDOM = (element: Element | null): boolean => {
  return element !== null && document.contains(element);
};

/**
 * Safely add a class to an element
 *
 * @param element The element to add class to
 * @param className The class name to add
 */
export const safeAddClass = (element: Element | null, className: string): void => {
  if (element && element instanceof HTMLElement) {
    element.classList.add(className);
  }
};

/**
 * Safely remove a class from an element
 *
 * @param element The element to remove class from
 * @param className The class name to remove
 */
export const safeRemoveClass = (element: Element | null, className: string): void => {
  if (element && element instanceof HTMLElement) {
    element.classList.remove(className);
  }
};