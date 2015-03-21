"use scrict";

function shimProp(obj, propname, shim) {
  if (obj[propname] === undefined) {
    if (typeof(shim) != 'object') shim = {value: shim};

    Object.defineProperty(obj, propname, shim);
  }
}

shimProp(Element.prototype, 'scrollTopMax', {get: function() {
  return this.scrollHeight - this.clientHeight;
}});

shimProp(Element.prototype, 'scrollBottom', {get: function() {
  return this.scrollTopMax - this.scrollTop;
}});
