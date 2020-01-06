/**
 * JSoak v.0.3
 * 
 * License: MIT,
 * Author: Htresnal
 * Git link: https://github.com/Htresnal/JSoak
 */

function JSoak_traverseChildren(settings, root, $rootElem){
    var result = true;
    var children = $rootElem.children();

    $.each(children, function(){
        var jsoak = JSoak_getElement(settings, root, $(this));
        var newRoot = root;

        var isInArray = Array.isArray(root);

        if (jsoak){
            if (isInArray){
                if (jsoak.type == "folder"){
                    newRoot = {};
                    root.push(newRoot);
                }
                if (jsoak.type == "array"){
                    newRoot = [];
                    root.push(newRoot);
                }
            } else {
                if (jsoak.type == "field"){
                    root[jsoak.name] = jsoak.value;
                } else if (jsoak.type == "folder"){
                    newRoot = {};
                    root[jsoak.name] = newRoot;
                } else if (jsoak.type == "array"){
                    newRoot = [];
                    root[jsoak.name] = newRoot;
                }
            }
        }

        if (isInArray){
            if (jsoak){
                if (jsoak.type == "folder" || jsoak.type == "array"){
                    JSoak_traverseChildren(settings, newRoot, $(this));
                }
            }
        } else {
            JSoak_traverseChildren(settings, newRoot, $(this));
        }
    });

    return result;
}

function JSoak_getElement(settings, root, $target){
    var result = null;

    if ($target[0].hasAttribute("jsoak-field")){
        // The element is a JSoak field
        var targetValue = $target.val();
        var fieldName = $target.attr("jsoak-field");

        var value = (targetValue)? settings.onGather(root, fieldName, targetValue) : settings.onGather(root, fieldName, $target.text());

        if (value !== undefined){
            var resultObj = {
                type: "field",
                name: fieldName,
                value: value
            };
    
            if(resultObj.name){
                result = resultObj;
            }
        }
    } else if ($target[0].hasAttribute("jsoak-folder")){
        // The element is a JSoak folder
        var isInArray = Array.isArray(root);

        var resultObj = {
            type: "folder",
            name: $target.attr("jsoak-folder")
        };

        if(resultObj.name || isInArray){
            result = resultObj;
        }
    } else if ($target[0].hasAttribute("jsoak-array")){
        // The element is a JSoak array
        var isInArray = Array.isArray(root);

        var resultObj = {
            type: "array",
            name: $target.attr("jsoak-array")
        }

        if(resultObj.name || isInArray){
            result = resultObj;
        }
    }

    return result;
}

function JSoak(inSettings){
    // SETUP
    var settings = {
        depth: inSettings.depth || 70,
        target: inSettings.target || undefined,
        onGather: inSettings.onGather || function(root, fieldName, value){ return value; }
    };

    if (typeof(inSettings) == "string"){
        settings.target = inSettings;
    }

    var $target = null;
    if (settings.target){
        var $tempTarget = $(settings.target);
        if ($tempTarget.length > 0){
            $target = $($tempTarget[0]);
        }
    }

    if (!$target){
        console.error("Need a root element to gather JS object structure!");
        return false;
    }

    //BUILD
    var structure = {};
    var result = JSoak_traverseChildren(settings, structure, $target);

    if (!result){
        console.error("Error happened during JSoaking a structure. No result returned.");
        return false;
    }

    //RETURN
    return structure;
}