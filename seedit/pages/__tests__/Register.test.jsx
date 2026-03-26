import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Register from '../Register';
import authService from '../../services/authService';

// Mock authService
vi.mock('../../services/authService', () => {
    return {
        default: {
            register: vi.fn(),
        }
    };
});

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Register Component Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderRegister = () => {
        return render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );
    };

    it('successfully registers a user and navigates to verify-email', async () => {
        const user = userEvent.setup();
        authService.register.mockResolvedValueOnce({ success: true });

        renderRegister();

        // Fill form
        await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
        await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
        await user.type(screen.getByLabelText(/^Password$/i), 'password123');
        await user.type(screen.getByLabelText(/^Confirm$/i), 'password123');

        // Choose mentor role
        await user.click(screen.getByRole('button', { name: /mentor/i }));

        // Submit form
        await user.click(screen.getByRole('button', { name: /create account/i }));

        // Verify authService.register is called correctly
        await waitFor(() => {
            expect(authService.register).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'mentor'
            });
        });

        // Verify navigation
        expect(mockNavigate).toHaveBeenCalledWith('/verify-email', {
            state: { email: 'john@example.com' }
        });
    });

    it('shows error when passwords do not match and prevents submission', async () => {
        const user = userEvent.setup();

        renderRegister();

        // Fill form with mismatched passwords
        await user.type(screen.getByLabelText(/Full Name/i), 'Jane Doe');
        await user.type(screen.getByLabelText(/Email Address/i), 'jane@example.com');
        await user.type(screen.getByLabelText(/^Password$/i), 'password123');
        await user.type(screen.getByLabelText(/^Confirm$/i), 'password456');

        // Submit form
        await user.click(screen.getByRole('button', { name: /create account/i }));

        // Assert error message is shown
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        
        // Assert API was never called
        expect(authService.register).not.toHaveBeenCalled();
    });

    it('displays error message from API on registration failure', async () => {
        const user = userEvent.setup();
        authService.register.mockRejectedValueOnce(new Error('Email already in use'));

        renderRegister();

        // Fill form
        await user.type(screen.getByLabelText(/Full Name/i), 'Test User');
        await user.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
        await user.type(screen.getByLabelText(/^Password$/i), 'pass123');
        await user.type(screen.getByLabelText(/^Confirm$/i), 'pass123');

        // Submit form
        await user.click(screen.getByRole('button', { name: /create account/i }));

        // Assert API error is displayed
        await waitFor(() => {
            expect(screen.getByText('Email already in use')).toBeInTheDocument();
        });
    });

    it('validates required fields using HTML5 attributes', () => {
        renderRegister();

        // Check that inputs have the 'required' attribute
        expect(screen.getByLabelText(/Full Name/i)).toBeRequired();
        expect(screen.getByLabelText(/Email Address/i)).toBeRequired();
        expect(screen.getByLabelText(/^Password$/i)).toBeRequired();
        expect(screen.getByLabelText(/^Confirm$/i)).toBeRequired();
        
        // Check that email input is of type email
        expect(screen.getByLabelText(/Email Address/i)).toHaveAttribute('type', 'email');
    });

    it('verifies visual structure, static text, and navigation links of the component', () => {
        renderRegister();

        // Verify Header / Title text
        expect(screen.getByRole('heading', { level: 2, name: /Create your account/i })).toBeInTheDocument();
        
        // Verify default subtitle text based on student role
        expect(screen.getByText(/Join our community of learners today/i)).toBeInTheDocument();

        // Verify bottom links
        const signInLink = screen.getByRole('link', { name: /Sign in instead/i });
        expect(signInLink).toBeInTheDocument();
        expect(signInLink).toHaveAttribute('href', '/login');
        
        const homeLink = screen.getByRole('link', { name: /SeedIt/i });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');
    });
});
