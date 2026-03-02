import { screen } from '@testing-library/react';
import { ContractorHome } from '../ContractorHome';
import { renderWithTheme } from '../../test';

describe('ContractorHome', () => {
  it('renders dashboard heading and description', () => {
    renderWithTheme(<ContractorHome />);

    expect(screen.getByText('Contractor Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText('Welcome to the Contractor portal. This is a placeholder page.'),
    ).toBeInTheDocument();
  });

  it('wraps content in paper container', () => {
    const { container } = renderWithTheme(<ContractorHome />);
    expect(container.querySelector('.MuiPaper-root')).toBeInTheDocument();
  });
});
