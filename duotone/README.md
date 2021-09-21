# Installation
```
ssks yarn add @supersoniks/duotone
```
# Init

```js
import Duotone from '@supersoniks/duotone';
const duotone = new Duotone({
  filters: [
    {
      id: 'duotone_default', 
      dark: '--duotone-default-dark', 
      light: '--duotone-default-light'
    },
  ]
});
```


# Options
| Property           | Type           | Default                         | Description                                                                                         |
|--------------------|----------------|---------------------------------|-----------------------------------------------------------------------------------------------------|
| id                 | string         | "ssks_duotone_container"        | The id of the svg element built in the parent filters template                                      |
| rootStyle          | computed style | getComputedStyle(document.body) | the DOM element to get css_vars from                                                                |
| filters            | Array          | []                              | An array of filter ojects                                                                           |
| $parentFilters     | DOM element    | null                            | SVG element that will get the filters appened to. Eg : document.querySelector('#ssks_duotone defs') |
| generateStyleSheet | Boolean        | true                            | Generate a style sheet for elements with the attribude "data-duotone"                               |


# Filter Options
| Property  | Type           | Default                         | Description                                |
|-----------|----------------|---------------------------------|--------------------------------------------|
| id        | string         | ""                              | The id of the filter                       |
| dark      | string         | ""                              | Define the dark tone, css custom property  |
| light     | string         | ""                              | Define the light tone, css custom property |
| rootStyle | computed style | getComputedStyle(document.body) | the DOM element to get css_vars from       |

# Methods
## addFilter
Add a filter to the DOM after a new Duotone has been initialized
```js
const duotone = new Duotone();
duotone.addFilter({
  id: 'green_duotone', 
  dark: '--bichro-red-dark', 
  light: '--bichro-red-light',
  rootStyle: getComputedStyle(document.querySelector('.site-header')),
});
```