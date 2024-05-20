import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  sendNotification(message: string): void {
    console.log(message);
  }
}
