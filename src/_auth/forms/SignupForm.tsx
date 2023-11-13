import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

import { Form } from '@/components/ui/form';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import {
  useCreateUserAccount,
  useSignInAccount,
} from '@/lib/react-query/queries';
import { useUserContext } from '@/context/AuthContext';
import { SignupValidation } from '@/lib/validation';
import FormElement from '@/components/forms/AuthForm';

export interface SignUpFormValuesType {
  name: string;
  username: string;
  email: string;
  password: string;
}

const initialValues: SignUpFormValuesType = {
  name: '',
  username: '',
  email: '',
  password: '',
};

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  const date = new Date();

  // FormVerification
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: initialValues,
  });

  // Queries
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: singInAccount, isPending: isSigningInUser } =
    useSignInAccount();

  // Handler
  const handleSignup = async (values: z.infer<typeof SignupValidation>) => {
    const newUser = await createUserAccount(values);

    if (!newUser) {
      toast({
        title: 'Sign up failed. Please try again.',
        description: date.toLocaleString(),
      });

      return;
    }

    const session = await singInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      toast({
        title: 'Something went wrong. Please login your new account',
        description: date.toLocaleString(),
      });

      navigate('/sign-in');

      return;
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset;

      navigate('/');
    } else {
      return toast({
        title: 'Sign up failed. Please try again.',
        description: date.toLocaleString(),
      });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Snapgram, please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormElement
            control={form.control}
            name="name"
            label="Name"
            type="text"
          />
          <FormElement
            control={form.control}
            name="username"
            label="Username"
            type="text"
          />
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
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              'Sign up'
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Log-in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
