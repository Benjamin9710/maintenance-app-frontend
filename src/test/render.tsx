import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../hooks/AuthContext';
import { theme } from '../lib/theme';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  routerProps?: Partial<MemoryRouterProps>;
}

/**
 * Custom render function that wraps components with necessary providers
 * Includes ThemeProvider, MemoryRouter, and AuthProvider
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {}
) {
  const { routerProps = {} } = options;

  // Default router props
  const defaultRouterProps: Partial<MemoryRouterProps> = {
    initialEntries: ['/'],
    ...routerProps,
  };

  // Wrapper component that provides all necessary context
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider theme={theme}>
        <MemoryRouter {...defaultRouterProps}>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
}

/**
 * Render with just ThemeProvider (for components that don't need routing/auth)
 */
export function renderWithTheme(
  ui: React.ReactElement,
  renderOptions: RenderOptions = {}
) {
  const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );

  return render(ui, { wrapper: ThemeProviderWrapper, ...renderOptions });
}

/**
 * Render with ThemeProvider and MemoryRouter (for components that need routing but not auth)
 */
export function renderWithRouter(
  ui: React.ReactElement,
  routerProps: Partial<MemoryRouterProps> = {},
  options: RenderOptions = {}
) {
  const defaultRouterProps: Partial<MemoryRouterProps> = {
    initialEntries: ['/'],
    ...routerProps,
  };

  const RouterThemeProvider = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>
      <MemoryRouter {...defaultRouterProps}>{children}</MemoryRouter>
    </ThemeProvider>
  );

  return render(ui, { wrapper: RouterThemeProvider, ...options });
}
