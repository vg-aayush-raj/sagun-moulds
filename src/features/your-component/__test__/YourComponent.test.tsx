import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import YourComponent from '../YourComponent';

describe('YourComponent Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<YourComponent />);
    expect(container).toBeTruthy();
  });

  it('should render YourComponent', () => {
    render(<YourComponent />);
    expect(screen.getByText('Your Component')).toBeTruthy();
  });
});
