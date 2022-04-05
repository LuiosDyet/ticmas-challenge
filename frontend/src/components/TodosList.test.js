import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodosList from './TodosList';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider';

describe('TodosList', () => {
    it('should render', async () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <TodosList />
                </MemoryRouter>
            </AuthProvider>
        );
        const todoInput = screen.getByTestId('todoInput');
        expect(todoInput).toBeTruthy();
        const todoList = screen.getByTestId('todoList');
        expect(todoList).toBeTruthy();
        fireEvent.change(todoInput, {
            target: { value: 'todo 1' },
        });
        expect(todoInput.value).toBe('todo 1');
    });
});
