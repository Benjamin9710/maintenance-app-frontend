import { screen } from '@testing-library/react';
import { AppLayout } from '../AppLayout';
import { renderWithTheme } from '../../test';

describe('AppLayout', () => {
  it('renders children inside main container', () => {
    renderWithTheme(
      <AppLayout>
        <div data-testid="layout-children">Hello content</div>
      </AppLayout>,
    );

    const container = screen.getByRole('main');
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('layout-children')).toHaveTextContent('Hello content');
  });

  it('applies layout spacing styles', () => {
    const { container } = renderWithTheme(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );

    const main = container.querySelector('main');
    expect(main).toHaveStyle('min-height: calc(100vh - 64px)');
  });
});
