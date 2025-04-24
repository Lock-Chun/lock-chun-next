// tests/unit/home.test.tsx

import { render, screen } from '@testing-library/react';
import Home from '@/app/page'; // Path to your Home component

describe('HomePage Unit Test', () => {
  it('renders "Lock Chun" text on the page', () => {
    render(<Home />);
    const lockChunNameElement = screen.getByText('Lock Chun');
    expect(lockChunNameElement).toBeInTheDocument();
  });
});