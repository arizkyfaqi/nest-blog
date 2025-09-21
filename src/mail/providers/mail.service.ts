import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { name } from 'ejs';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerServices: MailerService) {}

  public async sendUserWelcome(user: User): Promise<void> {
    await this.mailerServices.sendMail({
      to: user.email,
      from: `Onboarding Team <support@nestjs-blog.com>`,
      subject: 'Welcome to NestJs Blog',
      template: './welcome',
      context: {
        name: user.firstName,
        email: user.email,
        loginUrl: 'http://localhost:3005',
      },
    });
  }
}
