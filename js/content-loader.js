(() => {
  'use strict';

  const endpoint = window.SITE_CONFIG?.contentEndpoint || 'data/articles.json';
  const lists = [...document.querySelectorAll('[data-article-list]')];
  if (!lists.length) return;

  const text = value => String(value ?? '');
  const decode = value => {
    const element = document.createElement('textarea');
    element.innerHTML = text(value);
    return element.value;
  };
  const published = article => !article?.status || article.status === 'published';
  const newestFirst = (a, b) => text(b.date).localeCompare(text(a.date));

  const buildCard = (article, index) => {
    const id = text(article.id);
    const title = decode(article.title);
    const category = decode(article.category || 'Article');
    const href = `article.html?id=${encodeURIComponent(id)}`;
    const card = document.createElement('article');
    card.className = 'publication';
    card.dataset.category = category;

    const visual = document.createElement('a');
    visual.className = `pub-visual visual-${index % 4 + 1}`;
    visual.href = href;
    visual.setAttribute('aria-label', `Read ${title}`);
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    const label = document.createElement('b');
    label.textContent = category;
    visual.append(number, label);

    const copy = document.createElement('div');
    copy.className = 'pub-copy';
    const eyebrow = document.createElement('span');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = [category, text(article.date)].filter(Boolean).join(' · ');
    const heading = document.createElement('h3');
    const headingLink = document.createElement('a');
    headingLink.href = href;
    headingLink.textContent = title;
    heading.append(headingLink);
    const summary = document.createElement('p');
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
    const readLink = document.createElement('a');
    readLink.className = 'text-link';
    readLink.href = href;
    readLink.textContent = 'Read article →';
    copy.append(eyebrow, heading, summary, meta, readLink);
    card.append(visual, copy);
    return card;
  };

  const buildFilters = (articles, cards) => {
    const root = document.querySelector('#article-filters');
    if (!root) return;
    const categories = [...new Set(articles.map(item => decode(item.category)).filter(Boolean))];
    const options = ['All', ...categories];
    root.replaceChildren(...options.map((category, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = category;
      button.dataset.filter = category;
      button.classList.toggle('active', index === 0);
      button.setAttribute('aria-pressed', String(index === 0));
      button.addEventListener('click', () => {
        [...root.children].forEach(item => {
          const active = item === button;
          item.classList.toggle('active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        cards.forEach(card => {
          card.hidden = category !== 'All' && card.dataset.category !== category;
        });
      });
      return button;
    }));
  };

  fetch(endpoint, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('Article data is not a list');
      const articles = data.filter(published).sort(newestFirst);
      document.documentElement.dataset.articleCount = String(articles.length);
      lists.forEach(root => {
        const limit = Number.parseInt(root.dataset.limit || '', 10);
        const selected = Number.isFinite(limit) ? articles.slice(0, limit) : articles;
        const cards = selected.map(buildCard);
        if (cards.length) {
          root.replaceChildren(...cards);
        } else {
          const empty = document.createElement('p');
          empty.className = 'empty-state';
          empty.textContent = 'No articles have been published yet.';
          root.replaceChildren(empty);
        }
        if (root.id === 'article-list') buildFilters(selected, cards);
      });
    })
    .catch(() => {
      document.documentElement.dataset.articleCount = 'unavailable';
      lists.forEach(root => {
        const message = document.createElement('p');
        message.className = 'empty-state';
        message.textContent = 'Articles are temporarily unavailable. Please try again shortly.';
        root.replaceChildren(message);
      });
    });
})();
