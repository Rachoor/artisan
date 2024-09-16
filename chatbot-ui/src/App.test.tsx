/* eslint-disable testing-library/no-wait-for-multiple-assertions */
// App.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the sendMessageToAPI function
jest.mock('./App', () => ({
  ...jest.requireActual('./App'),
  sendMessageToAPI: jest.fn(() =>
    Promise.resolve({
      id: Date.now(),
      text: `Hi Jane,\nAmazing how Mosey is simplifying state compliance\nfor businesses across the board!`,
      type: 'bot',
      actions: ['Create Report this month', 'Call Lead'],
    })
  ),
}));

describe('App Component', () => {
  test('renders the component correctly', () => {
    render(<App />);
    expect(screen.getByText(/Hey👋, I'm Ava/i)).toBeInTheDocument();
  });

  test('sends a new message and receives a bot response', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Your question');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText(/Hi Jane,/i)).toBeInTheDocument();
    });
  });

  test('edits an existing message', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Your question');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    // Edit the message
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    fireEvent.change(input, { target: { value: 'Hello World' } });
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
  });

  test('deletes a message', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Your question');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    // Delete the message
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    });
  });

  test('handles Enter key press to send message', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Your question');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  test('renders dropdown menu items', () => {
    render(<App />);
    const dropdownButton = screen.getByText('Context');
    fireEvent.click(dropdownButton);

    expect(screen.getByText('Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });
});
