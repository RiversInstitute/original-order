import type { CustomWindow } from "@/lib/overrides";
import type { Medium, Series, Taxonomy } from "@/lib/types";


type QueryParams = {
  selectedId?: string;
  expanded?: boolean;
  taxonomies?: string[];
  series?: string[];
  mediums?: string[];
}

const filters = JSON.parse((document.querySelector('main') as HTMLElement | null)?.dataset.filters ?? '') as {
  taxonomies: Taxonomy[];
  series: Series[];
  mediums: Medium[];
};

const container = document.getElementById('container');
const works = container?.querySelectorAll('[data-work]');
const activeTagsContainer = document.getElementById('activeTags');

window.history.pushState = new Proxy(window.history.pushState, {
  apply: (target, thisArg, argArray: [data: any, unused: string, url?: string | URL | null | undefined]) => {
    // trigger here what you need
    const res = target.apply(thisArg, argArray);
    window.dispatchEvent(new Event('popstate'));
    return res;
  },
});

window.history.replaceState = new Proxy(window.history.replaceState, {
  apply: (target, thisArg, argArray: [data: any, unused: string, url?: string | URL | null | undefined]) => {
    // trigger here what you need
    const res = target.apply(thisArg, argArray);
    window.dispatchEvent(new Event('popstate'));
    return res;
  },
});

const updateParamsFromWork = (work: Element) => {
  const searchParams = new URLSearchParams(window.location.search);
  const taxonomies = work.getAttribute('data-taxonomies');
  const series = work.getAttribute('data-series');
  const mediums = work.getAttribute('data-mediums');

  searchParams.set('id', work.getAttribute('data-id') || '');
  if (taxonomies) searchParams.set('taxonomies', taxonomies);
  if (series) searchParams.set('series', series);
  if (mediums) searchParams.set('mediums', mediums);

  window.history.replaceState(null, '', `?${searchParams.toString()}`);
}

works?.forEach(work => {
  work.querySelector('button[data-close]')?.addEventListener('click', () => {
    work.classList.remove('expanded');
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete('expanded');
    window.history.pushState(null, '', `?${searchParams.toString()}`);
  });

  work.querySelector('button[data-open]')?.addEventListener('click', () => {
    if (work.classList.contains('selected')) {
      work.classList.add('expanded');
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('expanded', 'true');
      window.history.pushState(null, '', `?${searchParams.toString()}`);
    } else {
      work.classList.add('selected');
      (window as CustomWindow).pky?.layout();
      updateParamsFromWork(work);
    }
  });
});

container?.addEventListener('click', (e) => {
  if (e.target === container) {
    window.history.pushState(null, '', window.location.pathname);
  }
});

type TagInput = {
  taxonomies: { id: string; url: string; title: string }[];
  series: { id: string; url: string; title: string }[];
  mediums: { id: string; url: string; title: string }[];
}

const renderTags = (q: QueryParams) => {
  const tags: TagInput = {
    taxonomies: [],
    series: [],
    mediums: [],
  };

  (['taxonomies', 'series', 'mediums'] as (keyof TagInput)[]).forEach(key => {
    const paramValues = q[key];
    const url = {
      taxonomies: '/taxonomy',
      series: '/series',
      mediums: '/medium',
    }

    if (paramValues) {
      paramValues.forEach(id => {
        tags[key].push({
          id,
          url: `${url[key]}/${id}`,
          title: filters[key].find(t => t.id.toString() === id)?.title || id,
        });
      });
    }
  });

  if (activeTagsContainer) activeTagsContainer.innerHTML = '';

  Object.entries(tags).forEach(([key, values]) => {
    values.forEach(({ id, url, title }) => {
      const tag = document.createElement('div');
      tag.className = `tag ${key} ${key}-${id} mono`;
      tag.innerHTML = `<a href="${url}">${title}</a>`;

      const closeButton = document.createElement('button');
      closeButton.ariaLabel = `Remove filter ${title}`;
      closeButton.className = 'close';
      closeButton.innerHTML = `
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M9.30176 1.09399C9.37793 1.01782 9.46257 0.969157 9.55566 0.947998C9.65299 0.922607 9.75033 0.922607 9.84766 0.947998C9.94499 0.969157 10.0317 1.01782 10.1079 1.09399C10.1799 1.16593 10.2285 1.25057 10.2539 1.3479C10.2793 1.44523 10.2793 1.54256 10.2539 1.63989C10.2285 1.73722 10.1799 1.82186 10.1079 1.8938L1.17676 10.825C1.10482 10.8969 1.02018 10.9456 0.922852 10.9709C0.825521 10.9963 0.72819 10.9963 0.630859 10.9709C0.533529 10.9456 0.446777 10.8969 0.370605 10.825C0.294434 10.753 0.243652 10.6684 0.218262 10.571C0.197103 10.4737 0.199219 10.3764 0.224609 10.2791C0.25 10.1817 0.298665 10.0971 0.370605 10.0251L9.30176 1.09399ZM10.1079 10.0251C10.1799 10.0971 10.2264 10.1817 10.2476 10.2791C10.2729 10.3764 10.2729 10.4737 10.2476 10.571C10.2264 10.6684 10.1799 10.753 10.1079 10.825C10.036 10.9011 9.94922 10.9498 9.84766 10.9709C9.75033 10.9963 9.65299 10.9963 9.55566 10.9709C9.45833 10.9456 9.3737 10.8969 9.30176 10.825L0.370605 1.8938C0.298665 1.82186 0.25 1.73722 0.224609 1.63989C0.203451 1.54256 0.203451 1.44523 0.224609 1.3479C0.25 1.25057 0.298665 1.16593 0.370605 1.09399C0.442546 1.01782 0.527181 0.969157 0.624512 0.947998C0.721842 0.922607 0.819173 0.922607 0.916504 0.947998C1.01807 0.969157 1.10482 1.01782 1.17676 1.09399L10.1079 10.0251Z" />
        </svg>
      `;

      closeButton.addEventListener('click', () => {
        const searchParams = new URLSearchParams(window.location.search);
        const paramValues = searchParams.get(key);

        if (paramValues) {
          const ids = paramValues.split(',').map(v => v.trim());
          const newIds = ids.filter(i => i !== id);
          if (newIds.length > 0) {
            searchParams.set(key, newIds.join(','));
          } else {
            searchParams.delete(key);
          }
          window.history.pushState(null, '', `?${searchParams.toString()}`);
        }
      });

      tag.appendChild(closeButton);
      activeTagsContainer?.appendChild(tag);
    });
  });
}


const renderQueryParams = (q: QueryParams) => {
  const emptyTags = (q.mediums?.length ?? 0) === 0 && (q.series?.length ?? 0) === 0 && (q.taxonomies?.length ?? 0) === 0
  const clearAll = emptyTags && !q.selectedId;

  if (q.selectedId && emptyTags) {
    const work = container?.querySelector(`[data-work][data-id="${q.selectedId}"]`)
    if (work) {
      updateParamsFromWork(work);
      return;
    }
  }

  works?.forEach(el => {
    const workTaxonomies = el.getAttribute('data-taxonomies')?.split(',') || [];
    const workSeries = el.getAttribute('data-series')?.split(',') || [];
    const workMediums = el.getAttribute('data-mediums')?.split(',') || [];
    const workId = el.getAttribute('data-id') || '';

    if (
      clearAll ||
      q.selectedId === workId ||
      q.taxonomies?.some(t => workTaxonomies.includes(t)) ||
      q.series?.some(s => workSeries.includes(s)) ||
      q.mediums?.some(m => workMediums.includes(m))
    ) {
      el.classList.remove('filtered');
    } else {
      el.classList.add('filtered');
    }

    if (q.selectedId && workId === q.selectedId) {
      el.classList.add('selected');
      if (q.expanded) {
        el.classList.add('expanded');
      } else {
        el.classList.remove('expanded');
      }
    } else {
      el.classList.remove('selected');
    }
  });

  (window as CustomWindow).pky?.layout();
}

const getQueryParams = (): QueryParams => {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id') || undefined;
  const expanded = searchParams.get('expanded') === 'true' ? true : false;
  const taxonomies = searchParams.get('taxonomies')?.split(',').map(t => t.trim()) || undefined;
  const series = searchParams.get('series')?.split(',').map(s => s.trim()) || undefined;
  const mediums = searchParams.get('mediums')?.split(',').map(m => m.trim()) || undefined;

  return {
    selectedId: id,
    expanded,
    taxonomies,
    series,
    mediums,
  }
}

window.addEventListener('popstate', (e) => {
  renderQueryParams(getQueryParams());
  renderTags(getQueryParams());
});

renderQueryParams(getQueryParams());
renderTags(getQueryParams());
