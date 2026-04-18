---
layout: post
title: Demos & Experiments
---

<p>Things I've built over the years &mdash; WebXR experiences, CSS experiments, progressive web apps, and developer tools.</p>

<div class="demos-list">
{% assign sorted_demos = site.demos | sort: "date" | reverse %}
{% for demo in sorted_demos %}
<div class="demo-item">
  {% if demo.preview %}
  <a href="{{ demo.url_link | default: demo.links.first.url }}" class="demo-preview">
    <img src="{{ demo.preview }}" alt="{{ demo.title }}" width="400" height="200">
  </a>
  {% endif %}
  <div class="demo-info">
    {% if demo.links %}
    <h3>{{ demo.title }}</h3>
    <ul class="demo-links">
      {% for link in demo.links %}
      <li><a href="{{ link.url }}">{{ link.label }} &rarr;</a></li>
      {% endfor %}
    </ul>
    {% else %}
    <h3><a href="{{ demo.url_link }}">{{ demo.title }} &rarr;</a></h3>
    {% endif %}
    <p>{{ demo.content | strip_html | strip }}</p>
    {% if demo.articles.size > 0 %}
    <ul class="demo-article-links">
      {% for article_url in demo.articles %}
        {% for post in site.posts %}
          {% if post.url == article_url %}
            <li><a href="{{ post.url }}">{{ post.title }}</a></li>
          {% endif %}
        {% endfor %}
      {% endfor %}
    </ul>
    {% endif %}
  </div>
</div>
{% endfor %}
</div>
