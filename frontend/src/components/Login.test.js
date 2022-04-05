import React from 'react';
import { screen, fireEvent, render } from '@testing-library/react';
import Login from './Login';
import { MemoryRouter } from 'react-router-dom';

describe('Login', () => {
    it('should render', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        const username = screen.getByTestId('username');
        expect(username).toBeTruthy();
        const password = screen.getByTestId('password');
        expect(password).toBeTruthy();
        const button = screen.getByTestId('button');
        expect(button).toBeTruthy();
        expect(
            screen.getByText(/Iniciar sesión/i).getAttribute('disabled')
        ).toBe('');
    });
    it('should pass with valid data', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        const username = screen.getByTestId('username');
        fireEvent.change(username, {
            target: { value: 'luios' },
        });
        expect(username.value).toBe('luios');

        const password = screen.getByTestId('password');
        fireEvent.change(password, {
            target: { value: '123456' },
        });
        expect(password.value).toBe('123456');
        expect(
            screen.getByText(/Iniciar sesión/i).getAttribute('disabled')
        ).toBe(null);
    });
});
