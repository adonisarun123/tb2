/**
 * Utility functions for safely interacting with the DOM
 * These utilities help prevent common DOM manipulation errors
 */

// Enable debug mode to log DOM operations
const DEBUG_MODE = false;

/**
 * Safely removes a DOM element by checking if it exists and is still in the document
 * Prevents "Failed to execute 'removeChild' on 'Node'" errors
 *
 * @param element The element to safely remove
 * @param debugInfo Optional info for debugging
 * @returns boolean indicating if the element was successfully removed
 */
export const safeRemoveElement = (element: Element | null, debugInfo = ''): boolean => {
  if (!element) {
    if (DEBUG_MODE) console.log(`[DOM Utils] Element not found for removal ${debugInfo ? `(${debugInfo})` : ''}`);
    return false;
  }
  
  try {
    // Check if the element is still in the document
    if (document.contains(element)) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
        if (DEBUG_MODE) console.log(`[DOM Utils] Element successfully removed ${debugInfo ? `(${debugInfo})` : ''}`);
        return true;
      } else {
        if (DEBUG_MODE) console.log(`[DOM Utils] Element has no parent node ${debugInfo ? `(${debugInfo})` : ''}`);
        return false;
      }
    } else {
      if (DEBUG_MODE) console.log(`[DOM Utils] Element not in document ${debugInfo ? `(${debugInfo})` : ''}`);
      return false;
    }
  } catch (error) {
    console.error(`[DOM Utils] Error removing element ${debugInfo ? `(${debugInfo})` : ''}:`, error);
    return false;
  }
};

/**
 * Safely removes elements matching a selector
 *
 * @param selector CSS selector to find elements to remove
 * @param debugInfo Optional info for debugging
 * @returns number of elements successfully removed
 */
export const safeRemoveElementsBySelector = (selector: string, debugInfo = ''): number => {
  try {
    let removedCount = 0;
    const elements = document.querySelectorAll(selector);
    
    if (DEBUG_MODE) console.log(`[DOM Utils] Found ${elements.length} elements to remove with selector "${selector}" ${debugInfo ? `(${debugInfo})` : ''}`);
    
    elements.forEach((element, index) => {
      if (safeRemoveElement(element, `${debugInfo} - index ${index}`)) {
        removedCount++;
      }
    });
    
    return removedCount;
  } catch (error) {
    console.error(`[DOM Utils] Error removing elements by selector "${selector}" ${debugInfo ? `(${debugInfo})` : ''}:`, error);
    return 0;
  }
};

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
    console.error(`[DOM Utils] Error finding element with selector "${selector}":`, error);
    return null;
  }
};