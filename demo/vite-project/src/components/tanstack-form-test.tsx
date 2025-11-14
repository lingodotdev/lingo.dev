import React from 'react';

// Simulating Tanstack Forms pattern
function useForm() {
  return {
    AppForm: ({ children }: { children: React.ReactNode }) => (
      <form style={{ padding: '20px', border: '2px solid blue' }}>{children}</form>
    ),
    CancelButton: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
      <button
        type="button"
        onClick={onClick}
        style={{
          padding: '10px 20px',
          backgroundColor: 'red',
          color: 'white',
          marginRight: '10px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {children}
      </button>
    ),
    SubmitButton: ({ children }: { children: React.ReactNode }) => (
      <button
        type="submit"
        style={{
          padding: '10px 20px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {children}
      </button>
    ),
  };
}

// Simulating uppercase workaround
function useFormUppercase() {
  return {
    AppForm: ({ children }: { children: React.ReactNode }) => (
      <form style={{ padding: '20px', border: '2px solid green' }}>{children}</form>
    ),
    CancelButton: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
      <button
        type="button"
        onClick={onClick}
        style={{
          padding: '10px 20px',
          backgroundColor: 'red',
          color: 'white',
          marginRight: '10px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {children}
      </button>
    ),
    SubmitButton: ({ children }: { children: React.ReactNode }) => (
      <button
        type="submit"
        style={{
          padding: '10px 20px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {children}
      </button>
    ),
  };
}

export default function TanstackFormTest() {
  const form = useForm();
  const FormContent = useFormUppercase();

  const handleCancel = () => {
    alert('Cancel clicked!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tanstack Forms + Lingo.dev Compiler Issue #1165</h2>

      <div style={{ marginBottom: '40px' }}>
        <h3>✅ Previously broken: Lowercase variable name (form) - now fixed</h3>
        <p>Using: <code>const form = useForm()</code></p>
        <p>Expected: Blue border, styled buttons with click functionality</p>
        <form.AppForm>
          <div>
            <form.CancelButton onClick={handleCancel}>Cancel</form.CancelButton>
            <form.SubmitButton>Submit</form.SubmitButton>
          </div>
        </form.AppForm>
      </div>

      <div>
        <h3>Working: Uppercase variable name (FormContent)</h3>
        <p>Using: <code>const FormContent = useFormUppercase()</code></p>
        <p>Expected: Green border, styled buttons with click functionality</p>
        <FormContent.AppForm>
          <div>
            <FormContent.CancelButton onClick={handleCancel}>Cancel</FormContent.CancelButton>
            <FormContent.SubmitButton>Submit</FormContent.SubmitButton>
          </div>
        </FormContent.AppForm>
      </div>
    </div>
  );
}

