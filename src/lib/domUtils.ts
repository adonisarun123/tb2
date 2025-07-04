/**
 * Utility functions for safely interacting with the DOM
 * These utilities help prevent common DOM manipulation errors
 */

/**
 * Safely removes a DOM element by checking if it exists and is still in the document
 * Prevents "Failed to execute 'removeChild' on 'Node'" errors
 * 
 * @param element The element to safely remove
 * @returns boolean indicating if the element was successfully removed
 */
export const safeRemoveElement = (element: Element | null): boolean => {
  if (!element) return false;
  
  // Check if the element is still in the document
  if (document.contains(element)) {
    // Use the parent node to remove the child for maximum compatibility
    return !!element.parentNode?.removeChild(element);
  }
  
  return false;
};

/**
 * Safely removes elements matching a selector
 * 
 * @param selector CSS selector to find elements to remove
 * @returns number of elements successfully removed
 */
export const safeRemoveElementsBySelector = (selector: string): number => {
  let removedCount = 0;
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    if (safeRemoveElement(element)) {
      removedCount++;
    }
  });
  
  return removedCount;
};