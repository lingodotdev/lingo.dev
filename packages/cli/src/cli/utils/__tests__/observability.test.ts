import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import trackEvent from '../observability';

const mockCapture = vi.fn();
const mockShutdown = vi.fn().mockResolvedValue(undefined);
const MockPostHogConstructor = vi.fn().mockImplementation(() => ({
  capture: mockCapture,
  shutdown: mockShutdown
}));

vi.mock('posthog-node', () => {
  return {
    PostHog: MockPostHogConstructor,
    default: {
      PostHog: MockPostHogConstructor
    }
  };
});

describe('trackEvent', () => {
  const originalEnv = { ...process.env };
  
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.DO_NOT_TRACK;
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });
  
  it('should track an event with PostHog', async () => {
    await trackEvent('user123', 'test_event', { test: true });
    
    expect(MockPostHogConstructor).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        host: expect.any(String)
      })
    );
    
    expect(mockCapture).toHaveBeenCalledWith({
      distinctId: 'user123',
      event: 'test_event',
      properties: expect.objectContaining({
        test: true,
        meta: expect.objectContaining({
          isCi: expect.any(Boolean)
        })
      })
    });
    
    expect(mockShutdown).toHaveBeenCalled();
  });
  
  it('should not track when DO_NOT_TRACK is set', async () => {
    process.env.DO_NOT_TRACK = '1';
    
    await trackEvent('user123', 'test_event');
    
    expect(MockPostHogConstructor).not.toHaveBeenCalled();
  });
  
  it('should handle errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    process.env.DEBUG = 'true';
    
    mockCapture.mockRejectedValueOnce(new Error('Test error'));
    
    await trackEvent('user123', 'test_event');
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
