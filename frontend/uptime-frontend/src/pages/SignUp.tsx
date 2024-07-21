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

function Signup() {
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
      // Handle successful signup (e.g., redirect or show a success message)
      console.log('User created:', data.createUser);
    } catch (e) {
      // Handle errors
      console.error('Error creating user:', e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Sign up to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Your password" value={formData.password} onChange={handleChange} />
              </div>
            </div>
            <CardFooter className="flex justify-between mt-4">
              <Button variant="outline" type="button">Cancel</Button>
              <Button type="submit" disabled={loading}>Sign Up</Button>
            </CardFooter>
          </form>
          {error && <p>Error: {error.message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;
