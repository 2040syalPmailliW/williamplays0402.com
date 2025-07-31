---
title: "Adding a contact form to my website"
excerpt: "Learn how I implemented a contact form on my website using Astro and Tailwind CSS, focusing on user experience and security."
author: "William Plays0402"
date: "2025-07-31"
category: "Web Development"
tags: "Express, Cloudflare, Web Development"
readTime: 8
featured: true
gradient: "from-yellow-500 to-orange-600"
color: "blue"
---

# Adding a Contact Form to My Website
Hi everyone! As you might have noticed, I've recently added a contact form to my website. In this blog post, I'll walk you through the process of implementing it using Astro and Tailwind CSS, focusing on user experience and security.

## Why a Contact Form?
Having a contact form on my website allows visitors to easily reach out to me with questions, feedback, or collaboration requests. It provides a structured way for users to communicate to me without them needing to send an email directly, which can sometimes be inconvenient.

## Setting Up the Contact Form
I realised that security is crucial when handling user data, especially on the web. To ensure that my contact form is secure, I implemented a few key features:
1. Input Validation: I used HTML5 validation attributes to ensure that the email format is correct and that required fields are filled out.
2. CAPTCHA: I integrated Cloudflare's Turnstile CAPTCHA to prevent spam submissions. This adds an extra layer of security by verifying that the user is human.
3. Server-side Processing: I set up a simple Express server to handle form submissions securely. This server processes the data and sends a discord webhook notification when a new message is received.

## Setting up the Turnstile CAPTCHA
Setting up the Turnstile CAPTCHA was more straightforward than I expected. I already have a Cloudflare account, as I use Cloudflare for my website's DNS and performance optimizations. Here's how I set it up:
1. I created a new Turnstile site key in the Cloudflare dashboard.
2. I added the Turnstile widget to my contact form by including the necessary script in my Astro component.
3. I configured the server to verify the CAPTCHA response before processing the form data.

I also made sure to include the Turnstile secret key in my server's environment variables for secure verification.

I won't go into too much detail about the code, as you can find the complete implementation in my GitHub repository. 

## Conclusion
In conclusion, adding a contact form to my website was a valuable enhancement that improves user engagement while prioritizing security. By leveraging Astro, Tailwind CSS, and Cloudflare's Turnstile CAPTCHA, I was able to create a user-friendly and secure form for visitors to reach out to me. If you're considering adding a contact form to your own website, I highly recommend following a similar approach to ensure a smooth and secure user experience.

And don't forget to check out the complete implementation in my GitHub repository!

Happy coding! If you have any questions or suggestions, feel free to reach out through the contact form on my website!