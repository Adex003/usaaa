import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export const email = async(to: string,
    html: string,
    subject: string,
    attachments?: Mail.Attachment[] | undefined,) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    
      try {
        const info = await transporter.sendMail({
          from: `"Fred Foo 👻" ${process.env.SMTP_USERNAME}`,
          to,
          subject,
          html,
          attachments,
        });
    
        console.log(`Message sent: %s`, info.messageId);
        return `Message sent: ${info.messageId}`
      } catch (error) {
        console.log(`error: `, error);
        return error
      }
}