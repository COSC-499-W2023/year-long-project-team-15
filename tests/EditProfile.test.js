import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import EditProfileForm from './EditProfileForm';

describe('EditProfileForm Manual Testing', () => {
  it('allows the user to update their profile', async () => {
    const { getByLabelText, getByText } = render(<EditProfileForm />);

    // Verify that user data is displayed
    expect(getByLabelText('ID:')).toHaveValue('user123');
    expect(getByLabelText('Name:')).toHaveValue('John Doe');
    expect(getByLabelText('Email:')).toHaveValue('johndoe@example.com');

    // Update the name field
    const nameInput = getByLabelText('Name:');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    // Trigger profile update
    fireEvent.click(getByText('Update Profile'));

    // Wait for profile update to complete
    await waitFor(() => {
      // Add assertions to check if the profile is updated correctly
      expect(getByText('User profile updated')).toBeInTheDocument();
    });
  });

  it('displays verification code input when email is updated', async () => {
    const { getByLabelText, getByText } = render(<EditProfileForm />);

    // Verify that user data is displayed
    expect(getByLabelText('ID:')).toHaveValue('user123');
    expect(getByLabelText('Name:')).toHaveValue('John Doe');
    expect(getByLabelText('Email:')).toHaveValue('johndoe@example.com');

    // Update the email field
    const emailInput = getByLabelText('Email:');
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

    // Trigger profile update
    fireEvent.click(getByText('Update Profile'));

    // Wait for verification code input to be displayed
    await waitFor(() => {
      // Verify that the verification code input is displayed
      expect(getByLabelText('Verification Code:')).toBeInTheDocument();
    });

    // Enter a verification code
    const verificationCodeInput = getByLabelText('Verification Code:');
    fireEvent.change(verificationCodeInput, { target: { value: '123456' } });

    // Trigger email verification
    fireEvent.click(getByText('Verify'));

    // Wait for email verification to complete
    await waitFor(() => {
      // Add assertions to check if email is verified successfully
      // For example, you can check if a success message is displayed
      expect(getByText('Email verified successfully')).toBeInTheDocument();
    });
  });
});
