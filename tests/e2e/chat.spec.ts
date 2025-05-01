import { test, expect } from '@playwright/test';

test.describe('POST /api/chat', () => {
  test('should return 200 OK and a reply for a valid message', async ({ request }) => {
    const message = 'What is Kung Pao Chicken?';

    const response = await request.post('/api/chat', {
      data: {
        message: message,
      },
    });

    // Check status code
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // Check response body structure
    const body = await response.json();
    expect(body).toHaveProperty('reply');
    expect(typeof body.reply).toBe('string');

    // Optional: Check if the reply seems reasonable (might be brittle depending on AI)
    // console.log('AI Reply:', body.reply);
    // expect(body.reply.toLowerCase()).toContain('chicken'); // Example assertion
  });

  test('should return 400 Bad Request if message is missing', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {}, // Send empty data object
    });

    // Check status code
    expect(response.status()).toBe(400);
    expect(response.ok()).toBeFalsy();

    // Check response body for error message
    const body = await response.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Message is required and must be a non-empty string.');
  });

  // Add more tests here for other scenarios if needed
});