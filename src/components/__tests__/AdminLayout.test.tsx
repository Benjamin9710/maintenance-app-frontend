import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '../AdminLayout';
import { renderWithRouter } from '../../test';

describe('AdminLayout', () => {
  const renderLayoutAt = (path: string) => {
    return renderWithRouter(
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<div>Dashboard Content</div>} />
          <Route path="managers" element={<div>Managers Content</div>} />
          <Route path="contractors" element={<div>Contractors Content</div>} />
        </Route>
      </Routes>,
      { initialEntries: [path] },
    );
  };

  it('highlights dashboard tab by default', () => {
    renderLayoutAt('/admin/dashboard');

    expect(screen.getByRole('tab', { name: 'Dashboard' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });

  it('highlights managers tab when managers route is active', () => {
    renderLayoutAt('/admin/managers');

    expect(screen.getByRole('tab', { name: 'Managers' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('Managers Content')).toBeInTheDocument();
  });

  it('highlights contractors tab when contractors route is active', () => {
    renderLayoutAt('/admin/contractors');

    expect(screen.getByRole('tab', { name: 'Contractors' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('Contractors Content')).toBeInTheDocument();
  });

  it('renders provided children instead of outlet when present', () => {
    renderWithRouter(
      <AdminLayout>
        <div data-testid="custom-content">Custom children</div>
      </AdminLayout>,
      { initialEntries: ['/admin/dashboard'] },
    );

    expect(screen.getByTestId('custom-content')).toHaveTextContent('Custom children');
  });
});
