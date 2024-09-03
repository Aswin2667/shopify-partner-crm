import { z } from 'zod';

export const CreateProjectDto = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  type: z.string().min(1),
  data: z.any(), // Accept any valid JSON object
  organizationId: z.string().uuid(),
  integrationId: z.string().uuid().optional(),
});

export const UpdateProjectDto = CreateProjectDto.partial().extend({
  deletedAt: z.bigint().optional(),
});

// import { z } from 'zod';

// // Define the Zod schema for the 'CreateProjectDto'
// export const CreateProjectDtoSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   type: z.string().min(1, "Type is required"),
//   data: z.any().optional(),  // 'data' can be any valid JSON
//   organizationId: z.string().uuid("Invalid organization ID"),
//   integrationId: z.string().uuid("Invalid integration ID").optional(),
// });

// // Define the Zod schema for the 'UpdateProjectDto'
// export const UpdateProjectDtoSchema = z.object({
//   name: z.string().min(1, "Name is required").optional(),
//   type: z.string().min(1, "Type is required").optional(),
//   data: z.any().optional(),  // 'data' can be any valid JSON
//   organizationId: z.string().uuid("Invalid organization ID").optional(),
//   integrationId: z.string().uuid("Invalid integration ID").optional(),
// });

// export type CreateProjectDto = z.infer<typeof CreateProjectDtoSchema>;
// export type UpdateProjectDto = z.infer<typeof UpdateProjectDtoSchema>;
