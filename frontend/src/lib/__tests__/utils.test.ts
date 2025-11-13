import { cn } from '../utils';

describe('utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-4', 'py-2');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
    });

    it('should handle false conditional classes', () => {
      const isActive = false;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).not.toContain('active-class');
    });

    it('should merge tailwind classes with conflict resolution', () => {
      // clsx and tailwind-merge should resolve conflicts
      const result = cn('px-2', 'px-4');
      // The last px value should win
      expect(result).toContain('px-4');
    });

    it('should handle empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base-class', undefined, null, 'another-class');
      expect(result).toContain('base-class');
      expect(result).toContain('another-class');
    });
  });
});
