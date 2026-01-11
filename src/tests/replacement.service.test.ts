import { ReplacementService } from '../services/replacement.service.js';

describe('ReplacementService', () => {

  it('should not change anything if no limit is set', () => {
    const service = new ReplacementService(0);
    const result = service.replace('I have a dog');
    expect(result).toBe('I have a dog');
  });

  it('should not replace anything if an empty string is given', () => {
    const service = new ReplacementService(10);
    const result = service.replace('');
    expect(result).toBe('');
  });

  it('should replace "dog" with "cat" in a simple string', () => {
    const service = new ReplacementService(10);
    const result = service.replace('I have a dog');
    expect(result).toBe('I have a cat');
  });

  it('should respect the maximum replacement limit in a single string', () => {
    const limit = 2;
    const service = new ReplacementService(limit);
    // 3 dogs, limit 2
    const result = service.replace('dog dog dog');
    expect(result).toBe('cat cat dog');
  });

  it('should handle deeply nested objects and arrays', () => {
    const service = new ReplacementService(10);
    const input = {
      animals: ['dog', { type: 'dog' }],
      meta: { owner: 'dog lover' }
    };
    const expected = {
      animals: ['cat', { type: 'cat' }],
      meta: { owner: 'cat lover' }
    };
    expect(service.replace(input)).toEqual(expected);
  });

  it('should maintain state across different branches of the JSON tree', () => {
    const limit = 2;
    const service = new ReplacementService(limit);
    const input = {
      first: 'dog',
      second: ['dog', 'dog'],
    };
    const expected = {
      first: 'cat',
      second: ['cat', 'dog'],
    };
    expect(service.replace(input)).toEqual(expected);
  });

  it('should replace multiple occurrences in a long string', () => {
    const service = new ReplacementService(2);
    const input = 'catdogcatdogcatdogcatdog';
    expect(service.replace(input)).toBe('catcatcatcatcatdogcatdog');
  });

  it('should not modify non-string types', () => {
    const service = new ReplacementService(10);
    const input = { count: 5, isActive: true, data: null };
    expect(service.replace(input)).toEqual(input);
  });

  it('should be case sensitive (following standard requirement)', () => {
    const service = new ReplacementService(10);
    const result = service.replace('DOG and dog');
    expect(result).toBe('DOG and cat');
  });

  it('should handle an incorrect value type gracefully', () => {
    const service = new ReplacementService(10);
    const input = { text: undefined as unknown as string };
    const output = service.replace(input);
    expect(output).toEqual({ text: undefined });
  });
});
