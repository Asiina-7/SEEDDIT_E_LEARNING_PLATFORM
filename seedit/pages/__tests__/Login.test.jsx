import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Login from '../Login';
import authService, { UnverifiedError } from '../../services/authService';

// Mock authService
vi.mock('../../services/authService', () => {
    return {
        default: {
            login: vi.fn(),
        },
        UnverifiedError: class extends Error {
            constructor(message) {
                super(message);
                this.name = 'UnverifiedError';
            }
        }
    };
});

const mockNavigate = vi.fn();
let mockLocationState = null;

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ state: mockLocationState, pathname: '/login' }),
    };
});

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockLocationState = null;
    });

    const renderLogin = () => {
        return render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
    };

    it('renders initial form correctly with default student role', () => {
        renderLogin();
        expect(screen.getByText(/Welcome back!/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
        // default role student is selected
        expect(screen.getByRole('button', { name: /student/i })).toHaveClass('text-emerald-600');
    });

    it('switches roles and updates labels', async () => {
        const user = userEvent.setup();
        renderLogin();

        // Switch to Admin
        await user.click(screen.getByRole('button', { name: /admin/i }));
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/e.g. admin/i)).toBeInTheDocument();
        
        // Switch to Mentor
        await user.click(screen.getByRole('button', { name: /mentor/i }));
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    });

    it('handles successful login for generic user', async () => {
        const user = userEvent.setup();
        authService.login.mockResolvedValueOnce({ role: 'student', token: 'fake' });
        
        renderLogin();
        
        await user.type(screen.getByLabelText(/Email Address/i), 'student@test.com');
        await user.type(screen.getByPlaceholderText(/••••••••/i), 'pass123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({ email: 'student@test.com', password: 'pass123' });
        });
        
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    it('handles successful login for admin', async () => {
        const user = userEvent.setup();
        authService.login.mockResolvedValueOnce({ role: 'admin', token: 'fake' });
        
        renderLogin();
        
        // switch to admin
        await user.click(screen.getByRole('button', { name: /admin/i }));

        await user.type(screen.getByLabelText(/Username/i), 'admin');
        await user.type(screen.getByPlaceholderText(/••••••••/i), 'pass123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard', { replace: true });
        });
    });

    it('displays error message on failed login', async () => {
        const user = userEvent.setup();
        authService.login.mockRejectedValueOnce(new Error('Invalid credentials'));
        
        renderLogin();
        
        await user.type(screen.getByLabelText(/Email Address/i), 'wrong@test.com');
        await user.type(screen.getByPlaceholderText(/••••••••/i), 'wrongpass');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('redirects to verify-email on UnverifiedError', async () => {
        const user = userEvent.setup();
        authService.login.mockRejectedValueOnce(new UnverifiedError('Please verify email'));
        
        renderLogin();
        
        await user.type(screen.getByLabelText(/Email Address/i), 'unverified@test.com');
        await user.type(screen.getByPlaceholderText(/••••••••/i), 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/verify-email', { state: { email: 'unverified@test.com' } });
        });
    });

    it('shows success message if passed via location state', () => {
        mockLocationState = { message: 'Password reset successful!' };
        renderLogin();
        expect(screen.getByText('Password reset successful!')).toBeInTheDocument();
    });
});
