import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import { vi, describe, test, expect } from 'vitest';
import App from '../App';
import { menu } from '../routes/menu';

// Mock react-router-dom
vi.mock('react-router-dom', async (importActual: () => Promise<Record<string, unknown>>) => {
  const actual = await importActual();
  return {
    ...actual,
    useNavigate: vi.fn(),
    createBrowserRouter: vi.fn((routes: unknown) => routes),
    RouterProvider: ({ router }: { router: { element: React.ReactNode }[] }) => <div>{router[0].element}</div>,
  };
});

// Mock dependencies
vi.mock('@valgenesis/auth', () => ({
  Auth: vi.fn(({ children }) => (
    <div data-testid="mock-auth">
      {children}
      <nav data-testid="mock-sidebar">
        <button data-testid="mock-menu-item">Mock Menu Item</button> {/* Changed data-testid to avoid conflicts */}
      </nav>
    </div>
  )),
  logout: vi.fn(),
}));

const mockContextValue = {
  user: { name: 'Test User' },
  notifications: [],
};

// Hoist store mock
const mockedStore = vi.hoisted(() => ({
  usePlatformContext: vi.fn(() => mockContextValue),
  PlatformContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-context-provider">{children}</div>
  ),
  PlatformProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-platform-provider">{children}</div>
  ),
}));

vi.mock('@valgenesis/store', () => mockedStore);

vi.mock('@valgenesis/platform-layout', () => ({
  Layout: ({ sidebar, header, footer, breadcrumbs, toast, children }: Record<string, React.ReactNode>) => (
    <div>
      <div data-testid="header">{header}</div>
      <div data-testid="sidebar">{sidebar}</div>
      <div data-testid="breadcrumbs">{breadcrumbs}</div>
      <div data-testid="content">{children}</div>
      <div data-testid="footer">{footer}</div>
      <div data-testid="toast">{toast}</div>
    </div>
  ),
  Sidebar: ({
    menus,
    navigate,
  }: {
    menus: { name: string; link: string; label: string }[];
    navigate: (link: string) => void;
  }) => (
    <div data-testid="sidebar-content">
      {menus.map(({ name, link, label }) => (
        <button key={link} data-testid={`menu-${name.toLowerCase()}`} onClick={() => navigate(link)}>
          {label}
        </button>
      ))}
    </div>
  ),
  Header: ({ handleLogout }: { handleLogout: () => void }) => (
    <div>
      <button data-testid="logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  ),
  Footer: ({ version }: { version: string }) => <div data-testid="footer-version">{version}</div>,
  Breadcrumbs: () => <div data-testid="breadcrumbs-content">Breadcrumbs</div>,
  ToastNotification: () => <div data-testid="toast-content">Toast</div>,
}));

describe('App Navigation', () => {
  test('calls navigate when a sidebar menu item is clicked', async () => {
    const mockNavigate = vi.fn();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    render(<App />, { wrapper: mockedStore.PlatformContextProvider });

    await Promise.all(
      menu.map(async ({ name, link }) => {
        const menuItems = screen.getAllByTestId(`menu-${name.toLowerCase()}`); // Use getAllByTestId
        expect(menuItems.length).toBeGreaterThan(0); // Ensure at least one exists
        await userEvent.click(menuItems[0]); // Click the first available menu item
        expect(mockNavigate).toHaveBeenCalledWith(link);
      }),
    );
  });
});
