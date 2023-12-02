import * as z from 'zod';
import { FileUploader } from '../shared';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '../ui';
import { useUserContext } from '@/context/AuthContext';
import { StoryValidation } from '@/lib/validation';
import { useCreateStory } from '@/lib/react-query/queries';

interface IModalProps {
  open: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StoryForm: React.FC<IModalProps> = ({ setModalOpen }) => {
  const { toast } = useToast();
  const { user } = useUserContext();
  const date = new Date();

  const initialValues = {
    file: [],
    tags: '',
  };

  const form = useForm<z.infer<typeof StoryValidation>>({
    resolver: zodResolver(StoryValidation),
    defaultValues: initialValues,
  });

  // Query
  const { mutateAsync: createStory, isPending: isLoadingCreate } =
    useCreateStory();

  // Handler
  const handleSubmit = async (values: z.infer<typeof StoryValidation>) => {
    const newPost = await createStory({
      ...values,
      userId: user.id,
    });

    if (!newPost) {
      toast({
        title: 'Please try again',
        description: date.toLocaleString(),
      });
    }

    setModalOpen(false);
  };
  return (
    <div
      className="w-screen h-screen bg-black/40 fixed top-0 left-0 z-50 flex justify-center"
      onClick={() => setModalOpen(false)}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="bg-dark-3 w-[450px] flex flex-col justify-between gap-5 my-10 overflow-auto custom-scrollbar p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Photos</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    height={'h-auto'}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Tags (separated by comma " , ")</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Art, Expression, Learn"
                    type="text"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap pt-3 align-bottom"
            disabled={isLoadingCreate}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StoryForm;
