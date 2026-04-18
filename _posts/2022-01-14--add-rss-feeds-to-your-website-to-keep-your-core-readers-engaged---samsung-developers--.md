---
layout: post
title: "Add RSS Feeds to your website to keep your core readers engaged"
description: "RSS is a well established but often well hidden web technology. It's powerful but simple or perhaps it's powerful because of its simplicity."
category: Blog
author: Ada Rose Cannon
preview: /images/previews/2022-01-14--add-rss-feeds-to-your-website-to-keep-your-core-readers-engaged---samsung-developers--.jpg
---

> Originally published at [developer.samsung.com](https://developer.samsung.com/internet/blog/en-us/2022/01/14/add-rss-feeds-to-your-website-to-keep-your-core-readers-engaged)

> RSS is a well established but often well hidden web technology. It's powerful but simple or perhaps it's powerful because of its simplicity.

[Sara Soueidan](https://twitter.com/SaraSoueidan) suggested that publishing content on your own website and providing an RSS feed for it would be a great goal for 2022 and I wholeheartedly agree.

A major problem with trying to raise an audience on many popular social media sites is that you are entirely at their whim as to how your audience can engage with your work. They act as gate-keepers with their own self-interest, they will hide your content if it contains certain words or phrases which their advertisers and corporate sponsors do not like or if it contains links to rival platforms.

> Yes, I understand the irony of me authoring this on medium. To regain control I also republish the articles on our Samsung blog and my personal website.

By publishing on your own blog you can talk about technical terms like 'killing orphaned threads' which would be impossible on tiktok, LGBT issues which gets de-monetised on YouTube, or link to external web sites which gets suppressed under Twitter's algorithmic timeline.

The past years have been the tipping point where the convenience of using social media as a publishing platform has started being outweighed by its drawbacks. 2022 is certainly the year where taking your content off social media and using your own website will gain dividends.

One downside of hosting content on your own website is that it is harder to maintain a core audience that gets notified when you publish something new. That's where **RSS feeds** come in, they allow people to follow the content of creators they enjoy across many websites from a central location.

![A megaphone held by two hands. To the right is the RSS logo stamped out with orange flowers behind.](/images/medium/rss-banner.jpg)

> RSS feeds at their core are simple XML lists of content with a title and a URL and usually some other descriptive information.

RSS feeds are read with an RSS client. The client will fetch the RSS feeds and show you what items they contain. Usually they also remember which items in a feed you have read and which are new and some will even periodically fetch the RSS feed and send you notifications when a new one has come in.

The format of the RSS feed is a machine-readable format called XML. This language which looks like HTML is more strict and unlike HTML will fail to parse if it contains errors.

> **Atom vs RSS:** *As a quick aside there are two competing standards for feeds like this called RSS and Atom, they both use XML and they share the core fields most clients work with either without issue. Colloquially RSS kinda refers loosely to both so don't stress about it. This article will cover RSS in particular because it's simpler and the tag names are nice and friendly.*

As an example completed RSS feed, here is a link to the RSS feed for the BBC's England page [http://feeds.bbci.co.uk/news/england/rss.xml](http://feeds.bbci.co.uk/news/england/rss.xml) you can view the source to see how the XML is formatted.

Here is a rough overview of the main parts of an RSS feed.

- `<rss>` the header information that says this is an RSS document, with the details of how to parse it.
- Its only child is the `<channel>` tag — this tag contains the information about the channel and one or more `<item>` tags.
- Each `<item>` describes an individual item in the feed such as a single article or blog post, video, image or comment.

This article will tell you how to construct your own RSS feed for your own website. Any website which will receive regular updates is ideally suited for an RSS feed, which will help users stay up-to-date.

### Best content to turn into an RSS feed

A website where new content is added is perfect for an RSS feed. This may seem like a broad category but there are many great examples: a news website with regular news stories by many authors, a blog with frequent updates, an image board where many users can post images, a band web site posting new music, a podcast or a video-blog (vlog). Even a shopping site can have an RSS feed to notify customers of new products being added.

For most small sites creating a single RSS feed for each new update on the site is a popular choice. E.g. if you are a musician then add an update each time you post a new song, if you are a blogger then each time you post a new blog post.

But for a larger site which has very frequent activity from a range of authors, having many RSS feeds, such as one for each content tag and author, is a great way to let users filter your site's content to just the pieces they are interested in. By letting users choose the content they want it will keep them coming back.

An RSS feed is essentially a machine readable view of the various index pages on your website. If there is a page that would let users get a filtered view of your website content then making a machine readable RSS feed for it too is a natural choice.

### Creating an RSS feed for your blog post

RSS feeds work great on statically generated websites. You can generate the updated RSS feed automatically when the site is built. These are just XML files kept alongside the other site files.

The content of RSS feeds is usually identical to the existing HTML index pages on your site with the display content removed and additional tags to describe the RSS feed. So adapting the templating code from these index pages is a great place to start.

This is the Jekyll code I use to generate the RSS feed for my Jekyll based website — it's in a file called `feed.xml`. It looks complex but we will break it down line by line after the snippet:

{% raw %}
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
 <channel>
  <title>{{ site.name | xml_escape }}</title>
  <description>{{ site.description | xml_escape }}</description>
  <link>{{ site.url }}</link>
  <atom:link href="{{ site.url }}/{{ page.path }}" rel="self" type="application/rss+xml" />
  {% for post in site.posts %}
   <item>
     <title>{{ post.title | xml_escape }}</title>
     <description>{{ post.description | xml_escape }}</description>
     <pubDate>{{ post.date | date_to_rfc822 }}</pubDate>
     <link>{{ site.url }}/{{ post.url }}</link>
     <guid isPermaLink="true">{{ site.url }}/{{ post.url }}</guid>
   </item>
  {% endfor %}
 </channel>
</rss>
```
{% endraw %}

Breaking it down line by line,

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
```

We open with the standard header for an RSS file.

The `xmlns:atom` and `xmlns:dc` attributes on `<rss>` technically make this an Atom feed but they are required for us to add the `<atom:link>` element to the `<channel>` which is required by some RSS clients to know where to download future updates. The Atom format is mostly a superset of RSS so the rest of the file will be standard RSS but this header would let us use some Atom features if we wanted to.

Breaking down the channel description part of the file:

{% raw %}
```xml
<channel>
  <title>{{ site.name | xml_escape }}</title>
  <description>{{ site.description | xml_escape }}</description>
  <link>{{ site.url }}</link>
  <atom:link href="{{ site.url }}/{{ page.path }}" rel="self" type="application/rss+xml" />
```
{% endraw %}

- The title tag is the name of the feed, for example "Ada's blog posts" or "Posts by Jane Doe for Big Tech Site"
- The link is the URL for the canonical version of the content, not the link to the RSS feed.
- The `atom:link` is the link to the current URL of the RSS feed.
- The description should describe the feed or the content.

These tags should be only used once for the channel. You can find more RSS tags for the channel here: [http://www.landofcode.com/rss-reference/channel-elements.php](http://www.landofcode.com/rss-reference/channel-elements.php)

Next we have the `<item>` tag. This is inside the channel tag. Each channel can have any number of `<item>`. Where each item represents a single unit of the feed:

{% raw %}
```xml
<item>
   <title>{{ post.title | xml_escape }}</title>
   <description>{{ post.content | xml_escape }}</description>
   <pubDate>{{ post.date | date_to_rfc822 }}</pubDate>
   <link>{{ site.url }}/{{ post.url }}</link>
   <guid isPermaLink="true">{{ post.link | xml_escape }}</guid>
</item>
```
{% endraw %}

The `<guid>` should be unique, the URL to the original content works really well as a globally unique ID.

You can find more tags to use for the items here: [http://www.landofcode.com/rss-reference/item-elements.php](http://www.landofcode.com/rss-reference/item-elements.php)

Since we technically made this an Atom feed in our header we can take advantage of some Atom tags. One in particular is extremely useful for news and blogging sites — the `<dc:creator>` tag. You can use multiple of these per `<item>` to name each author who created the content. This is better than the RSS `<author>` tag which is strictly an email address, most people don't want to publish their email address where a name is more useful.

**NB:** You may notice that I used the `xml_escape` Jekyll liquid filter in my template. This is to convert characters that are unsupported such as `<` with `&lt;`. XML is very sensitive to syntax errors so it's important to test your RSS feed.

### Testing your feed

You can ensure that your RSS feed can be loaded by testing it. The quickest way to do this is to load it into the RSS Feed tester: [https://validator.w3.org/feed/](https://validator.w3.org/feed/)

If the validator finds errors it is then useful to copy the current feed content into the "Validate by direct input" tab to make rapid changes until you have fixed the errors and then fix the errors in your template and run the validator again.

Another useful thing to try is to load it up in an RSS client. I run an online client here in which you can enter the URL to see what it looks like: [https://deno-rss.glitch.me](https://deno-rss.glitch.me/)

> My RSS client runs on glitch, which lets you spin up new versions of the website server. If you are interested in how an RSS client works under the hood you can look through the source code or remix it to run your own version which you can change as you like: [https://glitch.com/~deno-rss](https://glitch.com/~deno-rss)

### Advertising your RSS feed

Now you have made your wonderful RSS feed, you want to advertise it to users. There are two ways of doing this that work together.

Firstly for helping users see that there is an RSS feed available you should display the RSS feed icon on your website and have it link to the feed version of the current page.

```html
<a href="posts.xml"><img src="rss.png" alt="Subscribe to My Website"></a>
```

You can use the RSS logo to clearly show what it is but make sure you use an alt tag to describe what it is.

![The RSS icon, a white disc with two circle sections on an orange background.](/images/medium/rss-icon.png)

The other main method of advertising your RSS feed is by a machine readable HTML tag in the head of the HTML page. This isn't visible to users but will inform the user's Web browser and RSS client that there is an RSS version of that site.

```html
<link rel="alternate" type="application/rss+xml"
  title="RSS Feed for My Website"
  href="posts.xml" />
```

Some websites don't even show the icon and you will be surprised by how often trying to load a website in an RSS client will reveal the RSS version of the same data. For example every Tumblr blog has an associated RSS feed you can load in your RSS client.

### Wrapping things up

RSS feeds are very flexible and powerful. They can give you the ability to keep pulling in users to your web site in a way that you control.
