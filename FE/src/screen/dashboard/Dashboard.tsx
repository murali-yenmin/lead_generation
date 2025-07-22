import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input } from 'UI-Library';

const Dashboard = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = async (data: { title: string }) => {
    try {
      const response = await fetch('https://n8n-k70h.onrender.com/webhook/react-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: data.title }),
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const result = await response.json();
      console.log('API Response:', result);
      alert('API call successful!');
    } catch (error) {
      console.error('Error:', error);
      alert('API call failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Input</h2>
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input control={control} name="title" type="text" placeholder="Enter title" />
        <Button type="submit" label="Submit" />
      </form>
    </div>
  );
};

export default Dashboard;
