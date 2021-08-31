function setProperty(value, defaultValue) {
  return (typeof value !== 'undefined') ? value : defaultValue;
}


/* -------------------------------------------------------------------------- */
/*                                COLOR UTILS                                 */
/* -------------------------------------------------------------------------- */
function hexToArray(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  if (hex.length < 7 ) {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  }
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0,0,0];
}

function rgbToArray(str){
  let match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
  return match ? [ match[1], match[2], match[3] ] : [];
}

function colorToArray(css_var, rootStyle = getComputedStyle(document.body)) {
  let color = rootStyle.getPropertyValue(css_var).replace(/\s/g, '');
  if (String(color).indexOf('rgb') > -1) {
    return rgbToArray( color );
  } else {
    return hexToArray( color );
  }
}

function convertToDuoToneMatrix(color1, color2) {
  var value = [];
  value = value.concat([color1[0]/256 - color2[0]/256, 0, 0, 0, color2[0]/256]);
  value = value.concat([color1[1]/256 - color2[1]/256, 0, 0, 0, color2[1]/256]);
  value = value.concat([color1[2]/256 - color2[2]/256, 0, 0, 0, color2[2]/256]);
  value = value.concat([0, 0, 0, 1, 0]);
  return value.join(' ')
}

export {setProperty, hexToArray, rgbToArray, colorToArray, convertToDuoToneMatrix};