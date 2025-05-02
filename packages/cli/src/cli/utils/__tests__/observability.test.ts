import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import trackEvent from '../observability';

vi.mock('posthog-node', () => {
  const mockCapture = vi.fn();
  const mockShutdown = vi.fn().mockResolvedValue(undefined);
  
  const MockPostHog = vi.fn().mockImplementation(() => ({
    capture: mockCapture,
    shutdown: mockShutdown
  }));
  
  return {
    PostHog: MockPostHog,
    default: {
      PostHog: MockPostHog
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
    
    const { PostHog } = await import('posthog-node');
    
    expect(PostHog).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        host: expect.any(String)
      })
    );
    
    const mockInstance = PostHog.mock.results[0].value;
    
    expect(mockInstance.capture).toHaveBeenCalledWith({
      distinctId: 'user123',
      event: 'test_event',
      properties: expect.objectContaining({
        test: true,
        meta: expect.objectContaining({
          isCi: expect.any(Boolean)
        })
      })
    });
    
    expect(mockInstance.shutdown).toHaveBeenCalled();
  });
  
  it('should not track when DO_NOT_TRACK is set', async () => {
    process.env.DO_NOT_TRACK = '1';
    
    await trackEvent('user123', 'test_event');
    
    const { PostHog } = await import('posthog-node');
    expect(PostHog).not.toHaveBeenCalled();
  });
  
  it('should handle errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    process.env.DEBUG = 'true';
    
    const { PostHog } = await import('posthog-node');
    const mockInstance = PostHog.mock.results[0]?.value;
    
    if (mockInstance && mockInstance.capture) {
      mockInstance.capture.mockRejectedValueOnce(new Error('Test error'));
    }
    
    await trackEvent('user123', 'test_event');
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
