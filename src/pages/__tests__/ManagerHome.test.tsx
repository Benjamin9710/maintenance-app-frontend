import { screen } from '@testing-library/react';
import { ManagerHome } from '../ManagerHome';
import { renderWithTheme } from '../../test';

describe('ManagerHome', () => {
  it('renders dashboard heading and description', () => {
    renderWithTheme(<ManagerHome />);

    expect(screen.getByText('Manager Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText('Welcome to the Manager portal. This is a placeholder page.'),
    ).toBeInTheDocument();
  });

  it('wraps content in paper container', () => {
    const { container } = renderWithTheme(<ManagerHome />);
    expect(container.querySelector('.MuiPaper-root')).toBeInTheDocument();
  });
});
