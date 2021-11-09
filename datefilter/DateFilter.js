class DateFilter {
  constructor(params) {
    this.defaultLibs = this.defaultLibs();
    this.defaultOptions = this.defaultOptions();
    this.init(params);
  }
  
  /* -------------------------------------------------------------------------- */
  /*                                    INIT                                    */
  /* -------------------------------------------------------------------------- */
  defaultLibs() {
    const libs = {
      fr: {
        toutes_les_dates: "Toutes les dates",
        toutes_les_periodes: "Toutes les périodes",
      },
      en: {
        toutes_les_dates: "All dates",
        toutes_les_periodes: "All periods",
      },
    }
    return libs;
  }

  defaultOptions() {
    const options = {
      // Mandatory
      list: '',
      listItems: '',
      insertContainer: '',
      // Optional
      insertPosition: 'beforeend',
      filterBy: 'month',
      groupBy :  '',
      filter: {
        id: 'ssks-date-filter',
        class: '',
        wrapperClass: '',
        textDisplay: ['month', 'year'],
        defaultText: this.getLib('toutes_les_periodes'),
        groupTextDisplay: '',
      }
    }
    return options;
  }

  init(options) {

    const params = this.deepMergeObj(this.defaultOptions, options)

    this.isInitialized = false;
    this.params = params || {};

    // options
    this.filterBy = this.params.filterBy;
    this.groupBy = this.params.groupBy;
    this.insertContainer = document.querySelector(this.params.insertContainer);
    this.insertPosition = this.params.insertPosition;

    // list
    this.list = document.querySelector(this.params.list);
    this.listItems = document.querySelectorAll(this.params.listItems);

    // dates
    this.dates = {
      all: [],
      uniques: [],
      groupUniques: [],
    }

    // filter
    this.filter = {
      isInitialized: false,
      id: this.params.filter.id,
      el: null,
      class: this.params.filter.class,
      wrapperClass: this.params.filter.wrapperClass,
      textDisplay: this.params.filter.textDisplay,
      defaultText: this.params.filter.defaultText,
      groupTextDisplay: this.params.filter.groupTextDisplay,
    }

    // anchors

    // Build
    this.build_dates(this.listItems);
    this.build_filter();
  }


  /* -------------------------------------------------------------------------- */
  /*                                    UTILS                                   */
  /* -------------------------------------------------------------------------- */
  get_datesUniques(param) {
    let current_param = "";
    return this.dates.all.filter(el => {
      if (current_param !== el[param]) {
        current_param = el[param];
        return el;
      }
    });
  }
  
  deepMergeObj(t, s) {
    const o = Object;
    const a = o.assign; 
    const clone_t = {...t};

    for (const k of o.keys(s)) {
      if (s[k] instanceof o) {
        a(s[k], this.deepMergeObj(clone_t[k], s[k])); 
      } 
    }
    return a(clone_t || {}, s), clone_t
  }

  getLib(lib, lang) {
    const currentLang = lang || document.documentElement.getAttribute('lang');
    if (this.defaultLibs[currentLang]) {
      return this.defaultLibs[currentLang][lib] || "";
    } else {
      return '';
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                    DATES                                   */
  /* -------------------------------------------------------------------------- */
  build_dates(items) {
    const dates_all = [];
    items.forEach((item, index) => {
      const date = {
        id: `date-filter-item-${index}`,
        dayName: item.querySelector('[data-day-name]')?.dataset.dayName ?? '',
        dayNameShort: item.querySelector('[data-day-name-short]')?.dataset.dayNameShort ?? '',
        day: item.querySelector('[data-day]')?.dataset.day ?? '',
        month: item.querySelector('[data-month]')?.dataset.month ?? '',
        monthShort: item.querySelector('[data-month-short]')?.dataset.monthShort ?? '',
        year: item.querySelector('[data-year]')?.dataset.year ?? '',
      }
      dates_all.push(date);
      item.dataset.dateFilterAnchorId = date.id;
    });

    this.dates.all = dates_all;
    this.dates.uniques = this.get_datesUniques(this.filterBy);
    this.dates.groupUniques = this.get_datesUniques(this.groupBy);
  }

  update_dates() {
    this.listItems = document.querySelectorAll(this.params.listItems);
    this.build_dates(this.listItems);
  }


  /* -------------------------------------------------------------------------- */
  /*                                   FILTER                                   */
  /* -------------------------------------------------------------------------- */
  build_filter() {
    const filter = /*html*/`
      <div class="${this.filter.wrapperClass}">
        <select id="${this.filter.id}" class="${this.filter.class}" data-autosubmit="false"></select>
      </div>
    `;

    // insert filter to html
    if (this.insertContainer) {
      this.insertContainer.insertAdjacentHTML(this.insertPosition, filter);
      this.filter.el = document.querySelector(`#${this.filter.id}`);
      this.filter.isInitialized = true;
      this.handle_filter_change();
      this.update_filter();
    }
  }

  handle_filter_change() {
    const filter = this.filter.el;
    filter.addEventListener('change', e => {
      const value = e.currentTarget.value;
      if (value !== 'all') {
        location.hash = "";
        location.hash = "#" + value;
        filter.value = 'all';
      }
    });
  }

  update_filter() {
    this.filter.el = document.querySelector(`#${this.filter.id}`);
    const filter = this.filter.el;
    // const dates = this.dates.uniques;
    const filterOptions = [];
    const defaultOption = `<option value="all">${this.filter.defaultText}</option>`;

    // default option
    filterOptions.push(defaultOption);

    // Generated options
    this.dates.uniques.forEach(date => {
      // Build option value
      const optionValue = this.filter.textDisplay.map(key => {
        if (date[key]) return date[key];
      }).join(' ');
      // Generate option
      const option = /*html*/ `
        <option value="${date.id}">
          ${optionValue}
        </option>
      `;
      // Add to options
      filterOptions.push(option);
    });

    // // Add options to filter
    filter.innerHTML = filterOptions.join(' ');
  }


  /* -------------------------------------------------------------------------- */
  /*                                   ANCHORS                                  */
  /* -------------------------------------------------------------------------- */
  build_anchors() {
    // Remove anchors
    document.querySelectorAll('[data-date-filter-anchor-item]').forEach(el => el.remove())

    // Create anchors
    this.dates.uniques.forEach(date => {
      const id = date.id;
      const listItem = document.querySelector(`[data-date-filter-anchor-id="${id}"]`);
      const anchorBody = /*html*/`
      <span id="${id}" data-date-filter-anchor-item></span>
      `;
      listItem.insertAdjacentHTML('afterbegin', anchorBody);
    });
  }

  update_anchors() {
    this.build_anchors();
  }


  /* -------------------------------------------------------------------------- */
  /*                                   UPDATES                                  */
  /* -------------------------------------------------------------------------- */
  update() {
    if (!this.filter.isInitialized) return;
    this.update_dates();
    this.update_filter();
    this.update_anchors();
  }

}

export default DateFilter;
