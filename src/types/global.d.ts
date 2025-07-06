// Global type declarations to fix build issues
// This file overrides problematic type definitions that cause Vercel build failures

// Fix for minimatch type definition error
declare module 'minimatch' {
  export function minimatch(target: string, pattern: string, options?: any): boolean;
  export = minimatch;
}

// Declare types for any other problematic modules
declare module '@types/minimatch' {
  // Empty declaration to prevent TypeScript errors
}

// Add any other global type overrides here as needed
declare global {
  interface Window {
    // Add any window extensions here if needed
  }
}

export {}; 