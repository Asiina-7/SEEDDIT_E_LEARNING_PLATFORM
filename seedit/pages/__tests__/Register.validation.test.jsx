/**
 * VALIDATION TESTING - Register Component
 * -----------------------------------------------
 * Validation tests verify that the form enforces all input rules
 * correctly — both client-side constraints (HTML5 & JS) and that
 * invalid data is blocked before reaching the backend API.
 */

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

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => vi.fn() };
});

const renderRegister = () =>
    render(<MemoryRouter><Register /></MemoryRouter>);

describe('Validation Testing - Register Component', () => {
    beforeEach(() => vi.clearAllMocks());

    // Validation Test 1: All fields are marked as required (HTML5)
    it('marks all form fields as required', () => {
        renderRegister();
        expect(screen.getByLabelText(/Full Name/i)).toBeRequired();
        expect(screen.getByLabelText(/Email Address/i)).toBeRequired();
        expect(screen.getByLabelText(/^Password$/i)).toBeRequired();
        expect(screen.getByLabelText(/^Confirm$/i)).toBeRequired();
    });

    // Validation Test 2: Email field enforces email format via HTML5
    it('validates email format using HTML5 type="email"', () => {
        renderRegister();
        expect(screen.getByLabelText(/Email Address/i)).toHaveAttribute('type', 'email');
    });

    // Validation Test 3: Mismatched passwords block form submission
    it('shows error and blocks API call when passwords do not match', async () => {
        const user = userEvent.setup();
        renderRegister();

        await user.type(screen.getByLabelText(/Full Name/i), 'John');
        await user.type(screen.getByLabelText(/Email Address/i), 'john@test.com');
        await user.type(screen.getByLabelText(/^Password$/i), 'pass1234');
        await user.type(screen.getByLabelText(/^Confirm$/i), 'pass9999'); // mismatch

        await user.click(screen.getByRole('button', { name: /create account/i }));

        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        expect(authService.register).not.toHaveBeenCalled();
    });

    // Validation Test 4: Matching passwords allows form to proceed to API
    it('allows form submission when passwords match', async () => {
        const user = userEvent.setup();
        authService.register.mockResolvedValueOnce({ success: true });
        renderRegister();

        await user.type(screen.getByLabelText(/Full Name/i), 'Jane');
        await user.type(screen.getByLabelText(/Email Address/i), 'jane@test.com');
        await user.type(screen.getByLabelText(/^Password$/i), 'secure123');
        await user.type(screen.getByLabelText(/^Confirm$/i), 'secure123'); // match

        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(authService.register).toHaveBeenCalledTimes(1);
        });
    });

    // Validation Test 5: Error message disappears after user corrects input
    it('clears mismatch error when user types again', async () => {
        const user = userEvent.setup();
        renderRegister();

        await user.type(screen.getByLabelText(/Full Name/i), 'Test');
        await user.type(screen.getByLabelText(/Email Address/i), 'test@test.com');
        await user.type(screen.getByLabelText(/^Password$/i), 'abc');
        await user.type(screen.getByLabelText(/^Confirm$/i), 'xyz');
        await user.click(screen.getByRole('button', { name: /create account/i }));

        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();

        // Start typing again to clear error
        await user.type(screen.getByLabelText(/Full Name/i), 'A');
        expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
    });

    // Validation Test 6: API-level error is displayed on duplicate email
    it('displays server-side validation error for duplicate email', async () => {
        const user = userEvent.setup();
        authService.register.mockRejectedValueOnce(new Error('Email already in use'));
        renderRegister();

        await user.type(screen.getByLabelText(/Full Name/i), 'Duplicate User');
        await user.type(screen.getByLabelText(/Email Address/i), 'dup@test.com');
        await user.type(screen.getByLabelText(/^Password$/i), 'pass123');
        await user.type(screen.getByLabelText(/^Confirm$/i), 'pass123');
        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText('Email already in use')).toBeInTheDocument();
        });
    });
});
