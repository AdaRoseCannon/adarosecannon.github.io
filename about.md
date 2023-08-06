---
author: Ada Rose Cannon
title: About
layout: post
---

<figure class="gallery-item"><img src="/images/ada-pedestal.jpg" alt="Ada presenting at QConSf" width="320px" /></figure>

# Welcome to my Website!

## About Me:

I'm **Ada Rose Cannon**, and I am passionate about web development, virtual reality (VR), and augmented reality (AR). My journey in the tech industry has been an exciting and fulfilling one, driven by a relentless desire to push the boundaries of immersive experiences on the web.

Currently, I work on AR/VR projects at **Apple**, where I get to explore the fascinating intersection between cutting-edge web technologies and the captivating world of virtual and augmented reality. It's an incredible opportunity to contribute to the evolution of immersive experiences and make a positive impact in this dynamic field.

Inclusivity and diversity are at the core of my work. As a developer, I believe in creating web experiences that are user-friendly and accessible to all, ensuring that the magic of VR and AR is available to a broader audience.

Throughout my journey, I have had the privilege of speaking at various conferences and events, sharing my knowledge and insights about web development, VR, AR, and the ever-evolving tech landscape. I find immense joy in inspiring and educating others, fueling the collective passion for innovative web experiences.

Thank you for visiting my Personal Website. I hope you find inspiration and valuable insights here. If you have any inquiries or would like to collaborate, please don't hesitate to reach out through social media or email.

Stay curious, stay connected, and let's build a more immersive and inclusive web together!

Sincerely,

**Ada Rose Cannon**

<p><h2 style="clear:none;">Popular Posts</h2></p>

{% for post in site.posts %}
{% if post.link %}
{% if post.star %}
<div><a class="article-link" href="{{ post.link }}" target="_blank" rel="noopener">{{ post.title }}</a></div>
{% endif %}
{% else %}
{% if post.star %}
<div><a class="article-link" href="{{ post.url }}">{{ post.title }}</a></div>
{% endif %}
{% endif %}
{% endfor %}
