export const prerender = false;

import nodemailer from "nodemailer";
import { type APIRoute } from "astro";
import type { ContactFormData } from "../../types/ContactFormData";

export const POST: APIRoute = async ({ request }) => {
    const contact_form_data: ContactFormData = await request.json() as ContactFormData;

    console.log(contact_form_data)

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: import.meta.env.SMTP_USER,
            pass: import.meta.env.SMTP_PASS
        }
    });

    const send_info = await transporter.sendMail({
        from: contact_form_data.email,
        to: import.meta.env.SMTP_DEST,
        subject: contact_form_data.subject,
        text: contact_form_data.message
    });

    if (send_info.accepted.length === 0) {
        return new Response(JSON.stringify({
            success: false
        }), {
            status: 500
        });
    }

    return new Response(JSON.stringify({
        success: true
    }), {
        status: 200
    });
}