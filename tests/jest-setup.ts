// This file is used to set up Jest's testing environment.
// It runs before each test file.

// Polyfill TextEncoder, TextDecoder, and ReadableStream for Jest's Node environment
// These are available in browsers and recent Node versions (v18+),
// but Jest's default Node environment may not include them globally.

// Import TextEncoder and TextDecoder from Node's 'util' module
import { TextEncoder, TextDecoder } from 'util';
// Import ReadableStream from Node's 'stream/web' module (available in Node v18+)
import { ReadableStream } from 'node:stream/web';

// Assign them to the global scope so they are available in tests
global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;
global.ReadableStream = ReadableStream as any;

// Import setup for @testing-library/jest-dom
import '@testing-library/jest-dom';
