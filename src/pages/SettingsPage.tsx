// SettingsPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface ProfileFormValues {
  username: string;
  email: string;
  currency: string;
  theme: string;
}

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      currency: user?.currency || 'INR',
      theme: user?.theme || 'light',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (updateUser) {
      updateUser({ ...user, ...data });
      toast.success('Profile updated successfully');
    } else {
      toast.error('Update function not available');
    }
  };

  const currencies = [
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
  ];

  const themes = [
    { value: 'light', name: 'Light' },
    { value: 'dark', name: 'Dark' },
    { value: 'system', name: 'System Default' },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  id="username"
                  label="Username"
                  error={errors.username?.message}
                  {...register('username', {
                    required: 'Username is required',
                  })}
                />

                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />

                <Select
                  id="currency"
                  label="Default Currency"
                  error={errors.currency?.message}
                  {...register('currency', { required: 'Currency is required' })}
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name}
                    </option>
                  ))}
                </Select>

                <Select
                  id="theme"
                  label="Theme"
                  error={errors.theme?.message}
                  {...register('theme', { required: 'Theme is required' })}
                >
                  {themes.map((theme) => (
                    <option key={theme.value} value={theme.value}>
                      {theme.name}
                    </option>
                  ))}
                </Select>

                <Button type="submit" isLoading={isSubmitting}>
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
