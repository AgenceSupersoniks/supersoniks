import {setProperty, colorToArray, convertToDuoToneMatrix} from './utils';


class Duotone {
  constructor(options) {
    this.init = this.init(options);
    this.isInitialized = false;
  }
  
  init(options = {}) {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // set properties
    this.id = setProperty(options.id, 'ssks_duotone_container'); // The id of the svg element built in the parent filters template
    this.rootStyle = setProperty(options.rootStyle, getComputedStyle(document.body)); // the HTML element to get css_vars from
    this.filters = setProperty(options.filters, []); // An array of filter ojects
    this.$parentFilters = setProperty(options.$parentFilters, null); // element HTML, exemple : document.querySelector('#ssks_duotone defs')
    this.generateStyleSheet = setProperty(options.generateStyleSheet, true) // Boolean : create a style sheet for elements with the attribude "data-duotone"


    // Generate and append a basic parent filters template to the body if no "$parentFilters" have been set
    if (!this.$parentFilters) {
      this.generate_parentFilters_template();
    }

    // Add filters to the parent filters template
    this.buildFilters();

  }

  generate_parentFilters_template() {
    const template = `<div style="border: 0;
                                  clip: rect(0 0 0 0);
                                  height: 1px;
                                  margin: -1px;
                                  overflow: hidden;
                                  padding: 0;
                                  position: absolute;
                                  width: 1px;" 
                            aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" style="color-interpolation-filters:sRGB;" id="${this.id}">
                          <defs></defs>
                        </svg>
                      <div>`;

    // Append the parent filters template to the body
    document.body.insertAdjacentHTML('beforeend', template);

    // Set the $parentFilters which will recieve the filters
    this.$parentFilters = document.querySelector(`#${this.id} defs`);
  }

  generateFilter(filter) {
    // set params
    const id = filter.id;
    const dark = filter.dark;
    const light = filter.light;
    const rootStyle = filter.rootStyle || this.rootStyle;
    
    // set color matrix
    const colorLight = colorToArray(light, rootStyle);
    const colorDark = colorToArray(dark, rootStyle);
    const matrix = convertToDuoToneMatrix(colorLight, colorDark);
    
    // generate filter
    const generatedFilter = `<filter id="${id}">
                              <feColorMatrix type="matrix" values="${matrix}"/></filter>
                            </filter>`;
    return generatedFilter;
  }

  buildFilters() {
    // Generate and concatenate every filters
    const filters = this.filters.reduce((template, filter) => template + this.generateFilter(filter), '');

    // append filters to the parent filters template
    this.$parentFilters.innerHTML = filters;
    this.updateStyleSheet();
  }

  addFilter(filter) {
    // if the filter (id) already exist overwrite it
    let is_filter_in_array = false;
    this.filters.forEach((item, i) => {
      if (item.id === filter.id) {
        this.filters[i] = filter;
        is_filter_in_array = true;
        return
      }
    });
    
    // otherwise add it to the array
    if (!is_filter_in_array) {
      this.filters.push(filter);
    }

    // Rebuild the filters
    this.buildFilters();
  }

  updateStyleSheet() {
    
    if (this.generateStyleSheet) {

      if (document.styleSheets.length < 1) {
        let sheet = document.createElement('style');
        document.querySelector('head').appendChild(sheet);
      }
      let styleSheet = document.styleSheets[document.styleSheets.length - 1];

      this.filters.forEach(filter => {
        styleSheet.insertRule(`[data-duotone="${filter.id}"] {filter: url(#${filter.id})} `, styleSheet.cssRules.length);
      });

    }
  }

}

export default Duotone;