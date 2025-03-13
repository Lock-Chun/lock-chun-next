// tests/unit/home.test.tsx

import { render, screen } from '@testing-library/react';
import Home from '@/app/page'; // Path to your Home component

describe('HomePage Unit Test', () => {
  it('renders "Hello world" text', () => {
    render(<Home />);
    const helloWorldElement = screen.getByText('Hello world');
    expect(helloWorldElement).toBeInTheDocument();
  });
});