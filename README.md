# JSoak
## Version 0.3
Converts DOM elements into a JS object structure using specific attributes as flags for data collection.
JavaScript + JQuery library.

## Requirements
JQuery version 3.4.1 or any other compatible version

## Installation
Just include the script to your page:
```html
<script type="text/javascript" src="jsoak-v.0.3.js"></script>
```

## Usage
JSoak allows to collect data off the DOM elements, keeping their original structure, or modifying it slightly. JSoak uses three types of elements: **jsoak-field**, **jsoak-folder** and **jsoak-array**. The values of the attributes will be used as JS field names.

JSoak fields copy the DOM element's value using .val(), or .text(), if value attribute is not present.
```html
<input jsoak-field="new-field" value="value" />
```
*Result:*
```json
{
  "new-field": "value"
}
```

JSoak folders are considered root elements to fields and folders inside it. Only the elements with jsoak-* attributes are considered part of the JSoak structure.
```html
<div jsoak-folder="parent-folder">
    <div class="second-div">
        <div jsoak-field="child-field">Text value here</div>
    </div>
</div>
```
*Result:*
```json
{
  "parent-folder": {
    "child-field": "Text value here"
  }
}
```

JSoak array forms a JS array, using **jsoak-folder** and **jsoak-array** elements for array entries. Keep in mind, that you are only allowed to place array entry elements at the root level of the JSoak array. Folder names are ignored.
```html
<div jsoak-array="array">
    <div jsoak-folder>
        <div jsoak-field="field">value</div>
    </div>
    <div jsoak-folder>
        <div jsoak-field="field">value</div>
    </div>
    <div jsoak-folder>
        <div jsoak-field="field">value</div>
    </div>
</div>
```

*Result:*
```json
{
  "array": [
    {
      "field": "value"
    },
    {
      "field": "value"
    },
    {
      "field": "value"
    }
  ]
}
```


To begin parsing of your DOM structure, you need to call JSoak method:
```js
var result = JSoak("#jsoak-root");
// OR
var result = JSoak({
    target: "#jsoak-root",
    onGather: function(root, fieldName, value){
        return $.trim(value);
    }
});
```
The result will be a JS object, or a null, if the parsing process has failed for some reason. 
Available custom settings:
"target" - JQuery selector string(or a DOM element reference) to the target element.
"onGather" - This function is called every time a jsoak-field is parsed, allowing you to tune the process to your needs. The function receives 3 arguments: 
1. Current root's JS object(the result object, not DOM object), 
2. Current JSoak field's name, 
3. Field's result value.

The function's return value is applied to the result JS object's field. If the function's return value is *undefined*, then field is skipped.


For an in-use example, you may want to take a look at:
[use-example.html](https://github.com/Htresnal/JSoak/blob/master/use-example.html)

## Gotchas
1. The parsing process of multiple JSoak elements of the same name will cause previous ones to be overwritten(but only if on the same folder level).
2. Be careful when passing a selector for multiple elements to the JSoak method - only the first element will be parsed.
3. Keep in mind, that this script's search depth is not only infinite, but also checks EVERY child element. You may not want to use it on elements with too many children.
4. **jsoak-array** only considers its direct children, marked as JSoak folders or JSoak arrays. Any element that is not marked will be ignored.


## Work in progress
- Fix possible problem with passing a non-string, non-settings objects to the JSoak. May not be recognized as valid elements.
- More checks for misuse.
- Search depth limiting, including specifying the depth searching methods, like: Depth from root, and depth from the last valid JSoak element.
- Remove JQuery function calls, and replace with pure JavaScript.

# Changelog
v.0.1:
- Alpha features. Initial commit.

v.0.2:
- Removed erroneous usage of multiple selector targets

v.0.3:
- Added **jsoak-array**
- Improved onGather: Returning *undefined*, now causes field to be skipped.