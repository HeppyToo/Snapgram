import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';

import { Loader } from 'lucide-react';
import { SigninValidation } from '@/lib/validation';
import { useSignInAccount } from '@/lib/react-query/queries';
import { useUserContext } from '@/context/AuthContext';
import FormElement from '@/components/forms/AuthForm';

export interface SignInFormValuesType {
  email: string;
  password: string;
}

const initialValues: SignInFormValuesType = {
  email: '',
  password: '',
};

const SigninForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const date = new Date();

  // FormVerification
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: initialValues,
  });

  // Query
  const { mutateAsync: singInAccount, isPending } = useSignInAccount();

  //Handle
  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    const session = await singInAccount(user);

    if (!session) {
      toast({
        title: 'Sign in failed. Please try again.',
        description: date.toLocaleString(),
      });

      return;
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset;

      navigate('/');
    } else {
      toast({
        title: 'Sign in failed. Please try again.',
        description: date.toLocaleString(),
      });

      return;
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormElement
            control={form.control}
            name="email"
            label="Email"
            type="text"
          />
          <FormElement
            control={form.control}
            name="password"
            label="Password"
            type="password"
          />
          <Button type="submit" className="shad-button_primary ">
            {isPending || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              'Sign in'
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Log-up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
