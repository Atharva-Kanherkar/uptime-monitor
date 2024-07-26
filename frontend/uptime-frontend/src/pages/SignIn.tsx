import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../mutations'; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });

  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ variables: { email: formData.email, password: formData.password } });
      // Store the token in local storage
      localStorage.setItem('token', data.login.token);
      // Redirect to the new screen
      navigate('/new-screen');
    } catch (e) {
      // Handle errors
      console.error('Error logging in:', e);
    }
  };
  const onCancel = async() => {
    navigate('/');
  }
   

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px] p-6">
        <CardHeader className="flex flex-col items-center text-center mb-4">
          <CardTitle className="text-xl font-semibold">Sign In</CardTitle>
          <CardDescription className="text-sm text-gray-600">Log in to your account.</CardDescription>
          <CardDescription className="text-sm text-gray-600 mt-2">
            Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Your password" value={formData.password} onChange={handleChange} />
              </div>
            </div>
            <CardFooter className="flex justify-between mt-6">
              <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
              <Button type="submit" disabled={loading}>Sign In</Button>
            </CardFooter>
          </form>
          {error && <p className="text-red-600 mt-4">Error: {error.message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

export default SignIn;
