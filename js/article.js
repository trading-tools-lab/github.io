(() => {
  'use strict';

  const root = document.querySelector('#article-detail');
  if (!root) return;
  const endpoint = window.SITE_CONFIG?.contentEndpoint || 'data/articles.json';
  const id = new URLSearchParams(location.search).get('id');
  const text = value => String(value ?? '');
  const decode = value => {
    const element = document.createElement('textarea');
    element.innerHTML = text(value);
    return element.value;
  };

  const appendStoredHtml = (container, value) => {
    const template = document.createElement('template');
    template.innerHTML = text(value);
    container.append(template.content.cloneNode(true));
  };

  const appendBodyField = (container, value) => {
    text(value).split(/<\/p>\s*<p>/i).filter(Boolean).forEach(fragment => {
      const paragraph = document.createElement('p');
      appendStoredHtml(paragraph, fragment);
      container.append(paragraph);
    });
  };

  const render = article => {
    const body = article.body && typeof article.body === 'object' ? article.body : {};
    document.title = `${decode(article.title)} · Zerik`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', decode(article.summary));

    const back = document.createElement('a');
    back.className = 'text-link';
    back.href = 'articles.html';
    back.textContent = '← All articles';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = [decode(article.category || 'Article'), text(article.date)].filter(Boolean).join(' · ');
    const title = document.createElement('h1');
    title.textContent = decode(article.title);
    const summary = document.createElement('p');
    summary.className = 'dek';
    summary.textContent = decode(article.summary);
    const meta = document.createElement('div');
    meta.className = 'pub-meta';
    const readTime = document.createElement('span');
    readTime.textContent = `${text(article.readTime || '1 min')} read`;
    meta.append(readTime);
    (Array.isArray(article.tags) ? article.tags : []).forEach(tag => {
      const item = document.createElement('span');
      item.textContent = decode(tag);
      meta.append(item);
    });

    const content = document.createElement('div');
    content.className = 'article-body';
    appendBodyField(content, body.intro);
    [1, 2].forEach(index => {
      const headingText = text(body[`heading${index}`]);
      const sectionText = text(body[`section${index}`]);
      if (headingText) {
        const heading = document.createElement('h2');
        heading.textContent = decode(headingText);
        content.append(heading);
      }
      if (sectionText) {
        appendBodyField(content, sectionText);
      }
      if (index === 1 && body.quote) {
        const quote = document.createElement('blockquote');
        appendStoredHtml(quote, body.quote);
        content.append(quote);
      }
    });
    if (body.close) {
      appendBodyField(content, body.close);
    }
    root.replaceChildren(back, eyebrow, title, summary, meta, content);
  };

  fetch(endpoint, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('Article data is not a list');
      const article = data.find(item => item?.id === id && (!item.status || item.status === 'published'));
      if (!article) {
        root.innerHTML = '<h1>Article not found.</h1><p>The article may have moved or is no longer published.</p><a href="articles.html">Back to articles</a>';
        return;
      }
      render(article);
    })
    .catch(() => {
      root.innerHTML = '<h1>Article unavailable.</h1><p>The article could not be loaded right now. Please try again shortly.</p><a href="articles.html">Back to articles</a>';
    });
})();
