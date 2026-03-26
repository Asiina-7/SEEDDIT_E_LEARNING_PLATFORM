/**
 * UNIT TESTING - Register Component
 * -----------------------------------------------
 * Unit tests focus on testing individual, isolated behaviors
 * of the Register component without relying on external services.
 * The authService is fully mocked so only the component logic is tested.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Register from '../Register';
import authService from '../../services/authService';

// Mock the entire authService module
vi.mock('../../services/authService', () => ({
    default: { register: vi.fn() }
}));

// Mock useNavigate to isolate routing
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => vi.fn() };
});

const renderRegister = () =>
    render(<MemoryRouter><Register /></MemoryRouter>);

describe('Unit Testing - Register Component', () => {
    beforeEach(() => vi.clearAllMocks());

    // Unit Test 1: Component renders without crashing
    it('renders the Register form without crashing', () => {
        renderRegister();
        expect(screen.getByRole('heading', { name: /Create your account/i })).toBeInTheDocument();
    });

    // Unit Test 2: Default role is 'student'
    it('renders with default role as "student"', () => {
        renderRegister();
        const studentBtn = screen.getByRole('button', { name: /student/i });
        expect(studentBtn).toHaveClass('text-emerald-600');
    });

    // Unit Test 3: Switching role to mentor updates subtitle
    it('updates subtitle text when role switches to mentor', async () => {
        const user = userEvent.setup();
        renderRegister();
        await user.click(screen.getByRole('button', { name: /mentor/i }));
        expect(screen.getByText(/Share your knowledge and mentor students/i)).toBeInTheDocument();
    });

    // Unit Test 4: Typing in name field updates the input value
    it('updates name input as user types', async () => {
        const user = userEvent.setup();
        renderRegister();
        const nameInput = screen.getByLabelText(/Full Name/i);
        await user.type(nameInput, 'Alice');
        expect(nameInput).toHaveValue('Alice');
    });

    // Unit Test 5: Error clears when user starts typing again
    it('clears error message when user starts typing after an error', async () => {
        const user = userEvent.setup();
        renderRegister();

        // Trigger password mismatch error (fill required fields too)
        await user.type(screen.getByLabelText(/Full Name/i), 'Test');
        await user.type(screen.getByLabelText(/Email Address/i), 'test@test.com');
        await user.type(screen.getByLabelText(/^Password$/i), 'abc123');
        await user.type(screen.getByLabelText(/^Confirm$/i), 'xyz789');
        await user.click(screen.getByRole('button', { name: /create account/i }));
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();

        // Start typing to clear error
        await user.type(screen.getByLabelText(/Full Name/i), 'Bob');
        expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
    });

    // Unit Test 6: Password visibility toggle works
    it('toggles password visibility when eye icon is clicked', async () => {
        const user = userEvent.setup();
        renderRegister();
        const passwordInput = screen.getByLabelText(/^Password$/i);
        expect(passwordInput).toHaveAttribute('type', 'password');

        const toggleBtn = screen.getByRole('button', { name: '' }); // Eye icon button
        await user.click(toggleBtn);
        expect(passwordInput).toHaveAttribute('type', 'text');
    });
});
