import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Register from '../Register';
import authService from '../../services/authService';

vi.mock('../../services/authService', () => ({
    default: { register: vi.fn() }
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

const renderRegister = () =>
    render(<MemoryRouter><Register /></MemoryRouter>);

describe('Verification Testing - Register Component', () => {
    beforeEach(() => vi.clearAllMocks());

    // Verification Test 1: Page title/heading is correctly rendered
    it('verifies the main heading text is displayed', () => {
        renderRegister();
        expect(
            screen.getByRole('heading', { level: 2, name: /Create your account/i })
        ).toBeInTheDocument();
    });

    // Verification Test 2: Student subtitle text shown by default
    it('verifies default subtitle is shown for student role', () => {
        renderRegister();
        expect(
            screen.getByText(/Join our community of learners today/i)
        ).toBeInTheDocument();
    });

    // Verification Test 3: Mentor subtitle text shown after switching role
    it('verifies subtitle changes when role is switched to mentor', async () => {
        const user = userEvent.setup();
        renderRegister();
        await user.click(screen.getByRole('button', { name: /mentor/i }));
        expect(
            screen.getByText(/Share your knowledge and mentor students/i)
        ).toBeInTheDocument();
    });

    // Verification Test 4: All four input fields are present
    it('verifies all input fields are rendered', () => {
        renderRegister();
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Confirm$/i)).toBeInTheDocument();
    });

    // Verification Test 5: Role toggle buttons are rendered correctly
    it('verifies Student and Mentor role toggle buttons exist', () => {
        renderRegister();
        expect(screen.getByRole('button', { name: /student/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /mentor/i })).toBeInTheDocument();
    });

    // Verification Test 6: Navigation links point to the correct routes
    it('verifies navigation links are present and have correct hrefs', () => {
        renderRegister();
        const signInLink = screen.getByRole('link', { name: /Sign in instead/i });
        expect(signInLink).toBeInTheDocument();
        expect(signInLink).toHaveAttribute('href', '/login');

        const homeLink = screen.getByRole('link', { name: /SeedIt/i });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');
    });

    // Verification Test 7: After successful register, navigates to verify-email
    it('verifies navigation to /verify-email after successful registration', async () => {
        const user = userEvent.setup();
        authService.register.mockResolvedValueOnce({ success: true });
        renderRegister();

        await user.type(screen.getByLabelText(/Full Name/i), 'Verified User');
        await user.type(screen.getByLabelText(/Email Address/i), 'verified@test.com');
        await user.type(screen.getByLabelText(/^Password$/i), 'pass123');
        await user.type(screen.getByLabelText(/^Confirm$/i), 'pass123');
        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/verify-email', {
                state: { email: 'verified@test.com' }
            });
        });
    });
});
