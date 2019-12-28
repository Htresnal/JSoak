# JSoak
## Version 0.1
Converts DOM elements with specific attributes attached, into a JS object structure.
JavaScript + JQuery library for data extraction.

## Requirements
JQuery version 3.4.1 or any other compatible version

## Installation
Just include the script to your page:
```html
<script type="text/javascript" src="jsoak-v.0.1.js"></script>
```

## Usage
JSoak allows to collect data off the DOM elements, keeping their original structure, or modifying it slightly. Currently, JSoak uses two types of elements: **jsoak-field** and **jsoak-folder**. The values of those attributes will be used as JS field names.

JSoak fields are the elements with an accessible value attribute( $(elem).val() ), or with a .text() value, if the value attribute is not present, then text value is used.
```html
<input jsoak-field="new-field" value="value" />
```
*Result:*
```json
{
    "new-field": "value"
}
```

JSoak folders are considered root elements to other fields and folders, if they are inside. Only the elements with included attributes are considered part of the JSoak structure.
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

To begin parsing of your DOM structure, you need to call JSoak method.
There are 2 ways to launch the method:
```js
var result = JSoak("#jsoak-root");
// OR
};
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
    The function's return value is applied to the result JS object's field.


For an in-use example, you may want to take a look at:
[use-example.html](https://github.com/Htresnal/JSoak/blob/master/use-example.html)

## Gotchas
1. The parsing process of multiple **jsoak-field** or **jsoak-folder** elements of the same name will cause the previous ones to be overwritten(only if they are in the same folder).
2. Be careful when passing a selector for multiple elements to the JSoak method - only the first element will be parsed.
3. Keep in mind, that this script's search depth is not only infinite, but also checks EVERY child element. You may not want to use it on elements with too many children. 


## Work in progress
- Fix possible problem with passing a non-string, non-settings objects to the JSoak. May not be recognized as valid elements.
- Add array recognizing(jsoak-array)
- More checks for misuse.
- Search depth limiting, including specifying the depth searching methods, like: Depth from root, and depth from the last valid JSoak element.
- Remove JQuery function calls, and replace with pure JavaScript.

# Changelog
v.0.1:
- Alpha features. Initial commit.
v.0.2:
- Removed erroneous usage of multiple selector targets