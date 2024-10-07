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

export const shopifySchema = z.object({
  partnerId: z.string().min(1, "Partner ID is required"),
  accessToken: z.string().min(1, "Access Token is required"),
});

const ShopifyInput = ({ control }: Props) => {
  return (
    <>
      <FormField
        control={control}
        name="data.partnerId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Partner ID</FormLabel>
            <FormControl>
              <Input type="text" placeholder="e.g. 123456" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="data.accessToken"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Access Token</FormLabel>
            <FormControl>
              <Input type="text" placeholder="e.g. shpat_1234..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ShopifyInput;
