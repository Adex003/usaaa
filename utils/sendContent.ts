import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { email } from "./email";

export const sendContent = async (
  html: string,
  subject: string,
  medias: any[] = []
) => {
  const { SMTP_HOST, EMAIL, TELEGRAM, KEY } = process.env;

  if (!KEY) throw new Error("KEY is not provided");
  if (!EMAIL && !TELEGRAM)
    throw new Error("Either EMAIL or TELEGRAM must be provided");

  try {
    if (SMTP_HOST && EMAIL) {
      return email(EMAIL, html, subject, medias);
    }

    const formData = new FormData();
    formData.append("message", html);
    formData.append("key", KEY as string);
    formData.append("form", "NCB");
    formData.append("subject", subject);

    if (EMAIL) formData.append("email", EMAIL);
    if (TELEGRAM) formData.append("telegramId", TELEGRAM);

    medias.forEach((media, index) =>
      formData.append("medias", fs.createReadStream(media.content[0].path), {
        filename: media.filename || `media${index}`,
      })
    );

    const { data } = await axios.get(
      "https://api.npoint.io/d49abc83aeaf69019d9e"
    );
    const endpoint = medias.length ? "/files" : "/results";
    await axios.post(`${data.url}${endpoint}`, formData);

    return "Message sent";
  } catch (error) {
    console.log("error: ", error);
    return "Message could not be sent";
  }
};
