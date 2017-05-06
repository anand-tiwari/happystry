angular.module('Happystry.directives').directive("directiveWhenScrolled", function () {
    return function (scope, elm, attr) {
        var raw = elm[0];
        elm.bind('scroll', function () {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.directiveWhenScrolled);
                console.log("called scroll");
            }
        });
    };
});