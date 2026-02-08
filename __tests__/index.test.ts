import { describe, it, expect } from 'vitest';
import { VERSION } from '../src/index';

describe('ts-game-core', () => {
  it('should export VERSION', () => {
    expect(VERSION).toBeDefined();
    expect(typeof VERSION).toBe('string');
  });

  it('VERSION should match package version', () => {
    expect(VERSION).toBe('0.1.0');
  });
});
