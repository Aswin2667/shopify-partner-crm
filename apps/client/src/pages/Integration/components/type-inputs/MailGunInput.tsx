import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";

type Props = {
  control: Control<any>;
};

export const mailGunSchema = z.object({
  apiKey: z.string().min(1, "API Key is Required"),
  domain: z.string().min(1, "Domain is Required"),
});

const MailGunInput = ({ control }: Props) => {
  return (
    <>
      {/* API Key Input */}
      <FormField
        control={control}
        name="data.apiKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel>API Key</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="e.g. 16642c21d157b6dlkswb672c474d5fe08-2b755df8-efa1d7f6"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Domain Input */}
      <FormField
        control={control}
        name="data.domain"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Domain</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="e.g. sandbox19b7e37b7fff403184ccb3d778790891.mailgun.org"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default MailGunInput;
