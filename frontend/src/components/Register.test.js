import React from 'react';
import { screen, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

describe('Register', () => {
    it('should render', () => {
        render(
          <MemoryRouter>
              <Register />
            </MemoryRouter>,
        );
        const username = screen.getByTestId('username');
        expect(username).toBeTruthy();
        const password = screen.getByTestId('password');
        expect(password).toBeTruthy();
        const confirmPassword = screen.getByTestId('confirmPassword');
        expect(confirmPassword).toBeTruthy();
        const button = screen.getByTestId('button');
        expect(button).toBeTruthy();
        expect(screen.getByText(/Registrarse/i).getAttribute('disabled')).toBe(
            '',
        );
    });
    it('should pass with valid data', () => {
        render(
          <MemoryRouter>
              <Register />
            </MemoryRouter>,
        );
        const username = screen.getByTestId('username');
        const usernameHints = screen.getByTestId('usernameHints');
        expect(usernameHints.classList.contains('focused')).toBe(true);
        fireEvent.change(username, {
            target: { value: 'luios' },
        });
        expect(username.value).toBe('luios');
        fireEvent.blur(username);
        expect(usernameHints.classList.contains('hidden')).toBe(true);

        const password = screen.getByTestId('password');
        const passwordHints = screen.getByTestId('passwordHints');
        expect(passwordHints.classList.contains('focused')).toBe(true);
        fireEvent.change(password, {
            target: { value: '123456' },
        });
        expect(password.value).toBe('123456');
        fireEvent.blur(password);
        expect(passwordHints.classList.contains('hidden')).toBe(true);

        const confirmPassword = screen.getByTestId('confirmPassword');
        const confirmPasswordHints = screen.getByTestId('confirmPasswordHints');
        expect(confirmPasswordHints.classList.contains('focused')).toBe(true);
        fireEvent.change(confirmPassword, {
            target: { value: '123456' },
        });
        expect(confirmPassword.value).toBe('123456');
        fireEvent.blur(confirmPassword);
        expect(confirmPasswordHints.classList.contains('hidden')).toBe(true);

        expect(screen.getByText(/Registrarse/i).getAttribute('disabled')).toBe(
            null,
        );
    });
    it('should not pass with invalid data', () => {
        render(
          <MemoryRouter>
              <Register />
            </MemoryRouter>,
        );
        const username = screen.getByTestId('username');
        const usernameHints = screen.getByTestId('usernameHints');
        expect(usernameHints.classList.contains('focused')).toBe(true);
        fireEvent.change(username, {
            target: { value: 'lu' },
        });
        fireEvent.blur(username);
        expect(usernameHints.classList.contains('hidden')).toBe(false);

        const password = screen.getByTestId('password');
        const passwordHints = screen.getByTestId('passwordHints');
        expect(passwordHints.classList.contains('focused')).toBe(true);
        fireEvent.change(password, {
            target: { value: '1234' },
        });
        fireEvent.blur(password);
        expect(passwordHints.classList.contains('hidden')).toBe(false);

        const confirmPassword = screen.getByTestId('confirmPassword');
        const confirmPasswordHints = screen.getByTestId('confirmPasswordHints');
        expect(confirmPasswordHints.classList.contains('focused')).toBe(true);
        fireEvent.change(confirmPassword, {
            target: { value: '12345' },
        });
        fireEvent.blur(confirmPassword);
        expect(confirmPasswordHints.classList.contains('hidden')).toBe(false);

        expect(screen.getByText(/Registrarse/i).getAttribute('disabled')).toBe(
            '',
        );
    });
});
