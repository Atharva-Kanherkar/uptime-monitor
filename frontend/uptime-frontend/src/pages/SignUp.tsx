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
import { CREATE_USER } from '../mutations'; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });

  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await createUser({ variables: { input: formData } });
      // Store the token in local storage
      localStorage.setItem('token', data.createUser.token);
      // Redirect to the new screen
      navigate('/new-screen');
    } catch (e) {
      // Handle errors
      console.error('Error creating user:', e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px] p-6">
        <CardHeader className="flex flex-col items-center text-center mb-4">
          <CardTitle className="text-xl font-semibold">Create Account</CardTitle>
          <CardDescription className="text-sm text-gray-600">Sign up to get started.</CardDescription>
          <CardDescription className="text-sm text-gray-600 mt-2">
            Already have an account? <a href="/signin" className="text-blue-500 hover:underline">Log in</a>
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
              <Button variant="outline" type="button">Cancel</Button>
              <Button type="submit" disabled={loading}>Sign Up</Button>
            </CardFooter>
          </form>
          {error && <p className="text-red-600 mt-4">Error: {error.message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;
