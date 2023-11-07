import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthContext';
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations';

import { SigninValidation } from '@/lib/validation';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import FormElement from '@/components/shared/FormElement';
import Loader from '@/components/shared/Loader';

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
  const navigete = useNavigate();

  const date = new Date();

  const { mutateAsync: singInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await singInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        title: 'Sign in failed. Please try again.',
        description: date.toLocaleString(),
      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset;

      navigete('/');
    } else {
      return toast({
        title: 'Sign in failed. Please try again.',
        description: date.toLocaleString(),
      });
    }
  }

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
          onSubmit={form.handleSubmit(onSubmit)}
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
            {isUserLoading ? (
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
