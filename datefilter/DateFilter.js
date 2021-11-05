class DateFilter {
  constructor(params) {
    this.init(params);
  }

  /* -------------------------------------------------------------------------- */
  /*                                    INIT                                    */
  /* -------------------------------------------------------------------------- */
  init(params) {
    this.isInitialized = false;
    this.params = params || {};

    // options
    this.filterBy = this.params.filterBy;
    this.filterTextDisplay = this.params.filterTextDisplay || 'month';
    this.groupBy = this.params.groupBy;
    this.groupTextDisplay = this.params.groupTextDisplay;
    this.insertContainer = document.querySelector(this.params.insertContainer);
    this.insertPosition = this.params.insertPosition || 'beforeend';

    // list
    this.list = document.querySelector(this.params.list);
    this.listItems = document.querySelectorAll(this.params.listItems);

    // dates
    this.dates = {
      all : [],
      uniques : [],
      groupUniques : [],
    }
    
    // filter
    this.filter = {
      isInitialized : false,
      id : 'ssks-date-filter',
      el : null,
      class : this.params.filter.class || '',
      wrapperClass : this.params.filter.wrapperClass || "",
    }
    
    // anchors
    
    // Build
    this.build_dates(this.listItems);
    this.build_filter();
    // this.init_on_mutate();
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
    const defaultOption = `<option value="all">Toutes les dates</option>`;
    
    // default option
    filterOptions.push(defaultOption);
    
    // Generated options
    this.dates.uniques.forEach(date => {
      // Build option value
      const optionValue = this.filterTextDisplay.map(key => {
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

    // const groups = [];
    // this.dates.groupUniques.forEach(group => {
    //   const optgroup = document.createElement('optgroup');
    //   optgroup.setAttribute('label', group[this.groupBy]);

    //   let sameGroup = true;
    //   this.dates.uniques.forEach(date => {
    //     if (group[this.groupBy] !== date[this.groupBy]) {
    //       sameGroup = false;
    //     }

    //     if (sameGroup) {
    //       console.log(date);
    //       // Build option value
    //       const optionValue = params.filterTextDisplay.map(key => {
    //         if (date[key]) return date[key];
    //       }).join(' ');
    //       // Generate option
    //       const option = /*html*/ `
    //         <option value="${date.id}">
    //           ${optionValue}
    //         </option>
    //       `;
    //       // Add to options
    //       optgroup.insertAdjacentHTML('beforeend', option);
    //     }
    //   });

    //   // const optgroup = /*html*/ `
    //   //   <optgroup label="${date[this.groupBy]}">
        
    //   //   </optgroup>
    //   // `;
    //   groups.push(optgroup);
      
    // });
    
    // filter.append(...groups);
    // console.log(groups);

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
  /*                                  EVENT WIP                                 */
  /* -------------------------------------------------------------------------- */
  is_listItem(el) {
    const arr = Array.from(this.listItems);
    return arr.includes(el);
  }

  init_on_mutate() {
    if (!this.list) return;
    let targetNode = this.list.parentElement;
    console.log(targetNode);

    let config = { childList: true, subtree: true };
    let requestIdCounter = 0; 
    let callback = mutationsList => {

      for(let mutation of mutationsList) {
        console.log(mutation.target, this.list, mutation.target == this.list);
        if (this.is_listItem(mutation.target) && mutation.addedNodes.length == 0) {
              requestIdCounter++;
              let requestId = requestIdCounter;
              requestAnimationFrame(()=> {
                  if(requestId!=requestIdCounter)return;
                  console.log('plop');
                  // this.update();
              });
          }
      }
    };
    
    // Créé une instance de l'observateur lié à la fonction de callback
    let observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
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
