import React from "react";
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
  appId: z.string().min(1, "App ID is required"),
});

const ShopifyInput = ({ control }: Props) => {
  return (
    <FormField
      control={control}
      name="data.appId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>App ID</FormLabel>
          <FormControl>
            <Input type="number" placeholder="e.g. 123456" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ShopifyInput;
