import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { LoggerUtils } from '@utils/utils';

interface MailJobData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
}

@Processor('mail-queue')
@Injectable()
export class MailProcessor extends WorkerHost {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<MailJobData>) {
    const { to, subject, text, html, template, context } = job.data;
    if (template) {
      await this.mailerService.sendMail({ to, subject, template, context });
    } else {
      await this.mailerService.sendMail({ to, subject, text, html });
    }

    LoggerUtils.info(
      `Mail job completed, success send email to ${to} for ${subject}`,
    );
  }
}
