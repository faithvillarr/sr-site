import { NextResponse } from 'next/server';
import axios from 'axios';
import nodemailer from 'nodemailer';

export async function POST(request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { name, email, message, recaptchaToken } = await request.json();

    // Verify required fields
    if (!name || !email || !message || !recaptchaToken) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA
    const recaptchaVerification = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!recaptchaVerification.data.success) {
      return NextResponse.json(
        { message: 'reCAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use your app-specific password
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sending to yourself
      subject: `New Contact Form Submission from ${name}`,
      text: `New contact form submission received:

Name: ${name}
Email: ${email}

Message:
${message}

This message was sent from your website's contact form.`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <br>
        <p><small>This message was sent from your website's contact form.</small></p>
      `
    });

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}