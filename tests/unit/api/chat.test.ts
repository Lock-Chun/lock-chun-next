// Set a dummy API key for testing environment before importing the route
process.env.GOOGLE_API_KEY = 'dummy-test-key';

import { POST } from '../../../src/app/api/chat/route';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

// Mock dependencies
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ // Return an object resembling Response
      json: async () => body,
      status: init?.status || 200,
      ok: (init?.status || 200) < 400,
      headers: new Headers(),
      // Add other Response properties/methods if needed by the code under test
    })),
  },
}));

// Mock fs.readFileSync to avoid actual file system access
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue('{}'), // Return empty JSON string by default
}));

// Mock the AI client minimally as it's not directly used in the 400 error path
jest.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
            startChat: jest.fn().mockReturnValue({
                sendMessage: jest.fn().mockResolvedValue({
                    response: {
                        text: jest.fn().mockReturnValue('Mock AI response')
                    }
                })
            })
        })
    }))
}));


describe('POST /api/chat', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (NextResponse.json as jest.Mock).mockClear();
    (fs.readFileSync as jest.Mock).mockClear();
    // Clear mocks for GoogleGenerativeAI if necessary, though less critical for this specific test
  });

  it('should return 400 if message is missing in the request body', async () => {
    const mockRequest = {
      json: async () => ({}), // Simulate request body without 'message'
    } as Request;

    // Call the handler
    await POST(mockRequest);

    // Assertions
    expect(NextResponse.json).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Message is required' },
      { status: 400 }
    );
  });

  // Add more tests here for other scenarios (e.g., successful response, AI errors)
});