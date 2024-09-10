// import { Injectable, Logger } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { PrismaService } from '@org/data-source';

// @Injectable()
// export class EmailCronService {
//   private readonly logger = new Logger(EmailCronService.name);

//   private readonly MAX_RETRIES = 3;

//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly emailService: EmailService
//   ) {}

//   @Cron('*/1 * * * *') 
//   async handleCron() {
//     this.logger.log('Cron job running every minute');

//     try {
//       // Fetch emails from the queue that are scheduled to be sent
//       const emailsToSend = await this.prisma.emailQueue.findMany({
//         where: {
//           scheduledAt: {
//             lt: BigInt(Date.now()), // Only fetch emails scheduled for before the current time
//           },
//           status: 'PENDING',
//         },
//         include: {
//           email: true, // Include related email details
//         },
//       });

//       for (const emailQueueEntry of emailsToSend) {
//         try {
//           // Send the email
//           await this.emailService.sendEmail(emailQueueEntry.email);

//           // Update email record status to SENT and set sentAt timestamp
//           await this.prisma.email.update({
//             where: { id: emailQueueEntry.emailId },
//             data: { 
//               status: 'SEND', 
//               sentAt: BigInt(Date.now()) 
//             },
//           });

//           // Remove email from the queue
//           await this.prisma.emailQueue.delete({
//             where: { id: emailQueueEntry.id },
//           });

//           this.logger.log(`Email sent successfully and removed from queue: ${emailQueueEntry.emailId}`);
//         } catch (error) {
//           this.logger.error(`Failed to send email ${emailQueueEntry.emailId}`, error.stack);

//           // Check retry count and update queue entry
//           if (emailQueueEntry.retryCount < this.MAX_RETRIES) {
//             await this.prisma.emailQueue.update({
//               where: { id: emailQueueEntry.id },
//               data: {
//                 status: 'PENDING', // Reset status to PENDING for retry
//                 retryCount: emailQueueEntry.retryCount + 1,
//               },
//             });
//             this.logger.log(`Retrying email ${emailQueueEntry.emailId}, attempt ${emailQueueEntry.retryCount + 1}`);
//           } else {
//             // Update queue entry status to FAILED after max retries
//             await this.prisma.emailQueue.update({
//               where: { id: emailQueueEntry.id },
//               data: { status: 'FAILED' },
//             });
//             this.logger.error(`Email ${emailQueueEntry.emailId} failed after ${this.MAX_RETRIES} attempts`);
//           }
//         }
//       }
//     } catch (error) {
//       this.logger.error('Error processing email queue', error.stack);
//     }
//   }
// }