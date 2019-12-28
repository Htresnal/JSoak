/**
 * JSoak v.0.2
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

        if (jsoak){
            if (jsoak.type == "field"){
                root[jsoak.name] = jsoak.value;
            } else if (jsoak.type == "folder"){
                root[jsoak.name] = {};
                newRoot = root[jsoak.name];
            }
        }

        JSoak_traverseChildren(settings, newRoot, $(this));
    });

    return result;
}

function JSoak_getElement(settings, root, $target){
    var result = null;

    if ($target.attr("jsoak-field")){
        // The element is a JSoak field
        var targetValue = $target.val();
        var fieldName = $target.attr("jsoak-field");

        result = {
            type: "field",
            name: fieldName,
            value: (targetValue)? settings.onGather(root, fieldName, targetValue) : settings.onGather(root, fieldName, $target.text())
        };
    } else if ($target.attr("jsoak-folder")){
        // The element is a JSoak folder
        result = {
            type: "folder",
            name: $target.attr("jsoak-folder")
        };
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