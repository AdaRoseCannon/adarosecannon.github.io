---
author: Ada Rose Cannon
title: About
layout: post
no_disqus: 1
---

<figure class="gallery-item"><img src="/images/ada-pedestal.jpg" alt="Ada presenting at QConSf" width="320px" /></figure>

<p><h2 style="clear:none;">Web and VR Advocate at Samsung.</h2></p>

As part of the developer relations effort from Samsung Internet my role is to engage with the Web and VR community through blog posts, open source contributions and participaating in events. The effort is to promote the web platform and to help with the production of Web Apps and WebVR experiences amongst other new Web Technology with a focus on the Samsung Internet browser.

<a href="https://medium.com/samsung-internet-dev/launching-samsung-internet-dev-rel-591ea6fe22af#.8z9y8n31b" target="_blank" rel="noopener">Role of the team at Samsung</a>

<figure class="gallery-item"><img src="/images/ada-vr.jpg" alt="Ada and Daniel wearing VR headsets." width="320px" /></figure>

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
