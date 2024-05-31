import * as React from 'react';
import * as PdfJs from 'pdfjs-dist';
import * as ReactDOM from 'react-dom';

var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

var useIntersectionObserver = function (props) {
    var containerRef = React.useRef(null);
    var once = props.once, threshold = props.threshold, onVisibilityChanged = props.onVisibilityChanged;
    useIsomorphicLayoutEffect(function () {
        var container = containerRef.current;
        if (!container) {
            return;
        }
        var intersectionTracker = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var isVisible = entry.isIntersecting;
                var ratio = entry.intersectionRatio;
                onVisibilityChanged({ isVisible: isVisible, ratio: ratio });
                if (isVisible && once) {
                    intersectionTracker.unobserve(container);
                    intersectionTracker.disconnect();
                }
            });
        }, {
            threshold: threshold || 0,
        });
        intersectionTracker.observe(container);
        return function () {
            intersectionTracker.unobserve(container);
            intersectionTracker.disconnect();
        };
    }, []);
    return containerRef;
};

var usePrevious = function (value) {
    var ref = React.useRef(value);
    React.useEffect(function () {
        ref.current = value;
    }, [value]);
    return ref.current;
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var useDebounceCallback = function (callback, wait) {
    var timeout = React.useRef();
    var cleanup = function () {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    };
    React.useEffect(function () {
        return function () { return cleanup(); };
    }, []);
    return React.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        cleanup();
        timeout.current = setTimeout(function () {
            callback.apply(void 0, args);
        }, wait);
    }, [callback, wait]);
};

var RESIZE_EVENT_OPTIONS = {
    capture: false,
    passive: true,
};
var ZERO_RECT$2 = {
    height: 0,
    width: 0,
};
var useWindowResize = function () {
    var _a = React.useState(ZERO_RECT$2), windowRect = _a[0], setWindowRect = _a[1];
    var handleResize = useDebounceCallback(function () {
        setWindowRect({
            height: window.innerHeight,
            width: window.innerWidth,
        });
    }, 100);
    useIsomorphicLayoutEffect(function () {
        window.addEventListener('resize', handleResize, RESIZE_EVENT_OPTIONS);
        return function () {
            window.removeEventListener('resize', handleResize, RESIZE_EVENT_OPTIONS);
        };
    }, []);
    return windowRect;
};

var FullScreenMode;
(function (FullScreenMode) {
    FullScreenMode["Normal"] = "Normal";
    FullScreenMode["Entering"] = "Entering";
    FullScreenMode["Entered"] = "Entered";
    FullScreenMode["Exitting"] = "Exitting";
    FullScreenMode["Exited"] = "Exited";
})(FullScreenMode || (FullScreenMode = {}));

var Api;
(function (Api) {
    Api[Api["ExitFullScreen"] = 0] = "ExitFullScreen";
    Api[Api["FullScreenChange"] = 1] = "FullScreenChange";
    Api[Api["FullScreenElement"] = 2] = "FullScreenElement";
    Api[Api["FullScreenEnabled"] = 3] = "FullScreenEnabled";
    Api[Api["RequestFullScreen"] = 4] = "RequestFullScreen";
})(Api || (Api = {}));
var defaultVendor = {
    ExitFullScreen: 'exitFullscreen',
    FullScreenChange: 'fullscreenchange',
    FullScreenElement: 'fullscreenElement',
    FullScreenEnabled: 'fullscreenEnabled',
    RequestFullScreen: 'requestFullscreen',
};
var webkitVendor = {
    ExitFullScreen: 'webkitExitFullscreen',
    FullScreenChange: 'webkitfullscreenchange',
    FullScreenElement: 'webkitFullscreenElement',
    FullScreenEnabled: 'webkitFullscreenEnabled',
    RequestFullScreen: 'webkitRequestFullscreen',
};
var msVendor = {
    ExitFullScreen: 'msExitFullscreen',
    FullScreenChange: 'msFullscreenChange',
    FullScreenElement: 'msFullscreenElement',
    FullScreenEnabled: 'msFullscreenEnabled',
    RequestFullScreen: 'msRequestFullscreen',
};
var isBrowser = typeof window !== 'undefined';
var vendor = isBrowser
    ? (Api.FullScreenEnabled in document && defaultVendor) ||
        (webkitVendor.FullScreenEnabled in document && webkitVendor) ||
        (msVendor.FullScreenEnabled in document && msVendor) ||
        defaultVendor
    : defaultVendor;
var isFullScreenEnabled = function () {
    return isBrowser && vendor.FullScreenEnabled in document && document[vendor.FullScreenEnabled] === true;
};
var addFullScreenChangeListener = function (handler) {
    if (isBrowser) {
        document.addEventListener(vendor.FullScreenChange, handler);
    }
};
var removeFullScreenChangeListener = function (handler) {
    if (isBrowser) {
        document.removeEventListener(vendor.FullScreenChange, handler);
    }
};
var exitFullScreen = function (element) {
    return isBrowser
        ?
            element[vendor.ExitFullScreen]()
        : Promise.resolve({});
};
var getFullScreenElement = function () {
    return isBrowser ? document[vendor.FullScreenElement] : null;
};
var requestFullScreen = function (element) {
    if (isBrowser) {
        element[vendor.RequestFullScreen]();
    }
};

var ZERO_RECT$1 = {
    height: 0,
    width: 0,
};
var EPSILON = 2;
var equal = function (a, b) { return Math.abs(a - b) <= EPSILON; };
var useFullScreen = function (_a) {
    var targetRef = _a.targetRef;
    var _b = React.useState(FullScreenMode.Normal), fullScreenMode = _b[0], setFullScreenMode = _b[1];
    var windowRect = useWindowResize();
    var _c = React.useState(ZERO_RECT$1), targetRect = _c[0], setTargetRect = _c[1];
    var windowSizeBeforeFullScreenRef = React.useRef(ZERO_RECT$1);
    var fullScreenSizeRef = React.useRef(ZERO_RECT$1);
    var _d = React.useState(targetRef.current), element = _d[0], setElement = _d[1];
    var fullScreenElementRef = React.useRef();
    useIsomorphicLayoutEffect(function () {
        if (targetRef.current !== element) {
            setElement(targetRef.current);
        }
    }, []);
    useIsomorphicLayoutEffect(function () {
        if (!element) {
            return;
        }
        var io = new ResizeObserver(function (entries) {
            entries.forEach(function (entry) {
                setTargetRect({
                    height: entry.target.clientHeight,
                    width: entry.target.clientWidth,
                });
            });
        });
        io.observe(element);
        return function () {
            io.unobserve(element);
            io.disconnect();
        };
    }, [element]);
    var closeOtherFullScreen = React.useCallback(function (target) {
        var currentFullScreenEle = getFullScreenElement();
        if (currentFullScreenEle && currentFullScreenEle !== target) {
            setFullScreenMode(FullScreenMode.Normal);
            return exitFullScreen(currentFullScreenEle);
        }
        return Promise.resolve();
    }, []);
    var enterFullScreenMode = React.useCallback(function (target) {
        if (!target || !isFullScreenEnabled()) {
            return;
        }
        setElement(target);
        closeOtherFullScreen(target).then(function () {
            fullScreenElementRef.current = target;
            setFullScreenMode(FullScreenMode.Entering);
            requestFullScreen(target);
        });
    }, []);
    var exitFullScreenMode = React.useCallback(function () {
        var currentFullScreenEle = getFullScreenElement();
        if (currentFullScreenEle) {
            setFullScreenMode(FullScreenMode.Exitting);
            exitFullScreen(document);
        }
    }, []);
    var handleFullScreenChange = React.useCallback(function () {
        if (!element) {
            return;
        }
        var currentFullScreenEle = getFullScreenElement();
        if (currentFullScreenEle !== element) {
            setFullScreenMode(FullScreenMode.Exitting);
        }
    }, [element]);
    React.useEffect(function () {
        switch (fullScreenMode) {
            case FullScreenMode.Entering:
                if (fullScreenElementRef.current) {
                    fullScreenElementRef.current.style.backgroundColor =
                        'var(--rpv-core__full-screen-target-background-color)';
                }
                windowSizeBeforeFullScreenRef.current = {
                    height: window.innerHeight,
                    width: window.innerWidth,
                };
                break;
            case FullScreenMode.Entered:
                break;
            case FullScreenMode.Exitting:
                if (fullScreenElementRef.current) {
                    fullScreenElementRef.current.style.backgroundColor = '';
                    fullScreenElementRef.current = null;
                }
                break;
            case FullScreenMode.Exited:
                setFullScreenMode(FullScreenMode.Normal);
                break;
        }
    }, [fullScreenMode]);
    React.useEffect(function () {
        if (fullScreenMode === FullScreenMode.Normal) {
            return;
        }
        if (fullScreenMode === FullScreenMode.Entering &&
            equal(windowRect.height, targetRect.height) &&
            equal(windowRect.width, targetRect.width) &&
            windowRect.height > 0 &&
            windowRect.width > 0 &&
            (fullScreenSizeRef.current.height === 0 || equal(windowRect.height, fullScreenSizeRef.current.height))) {
            fullScreenSizeRef.current = {
                height: window.innerHeight,
                width: window.innerWidth,
            };
            setFullScreenMode(FullScreenMode.Entered);
            return;
        }
        if (fullScreenMode === FullScreenMode.Exitting &&
            equal(windowSizeBeforeFullScreenRef.current.height, windowRect.height) &&
            equal(windowSizeBeforeFullScreenRef.current.width, windowRect.width) &&
            windowRect.height > 0 &&
            windowRect.width > 0) {
            setFullScreenMode(FullScreenMode.Exited);
        }
    }, [fullScreenMode, windowRect, targetRect]);
    React.useEffect(function () {
        addFullScreenChangeListener(handleFullScreenChange);
        return function () {
            removeFullScreenChangeListener(handleFullScreenChange);
        };
    }, [element]);
    return {
        enterFullScreenMode: enterFullScreenMode,
        exitFullScreenMode: exitFullScreenMode,
        fullScreenMode: fullScreenMode,
    };
};

var useAnimationFrame = function (callback, recurring, deps) {
    if (recurring === void 0) { recurring = false; }
    var callbackRef = React.useRef(callback);
    var idRef = React.useRef(-1);
    callbackRef.current = callback;
    var start = React.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        cancelAnimationFrame(idRef.current);
        idRef.current = requestAnimationFrame(function () {
            callback.apply(void 0, args);
            if (recurring) {
                start.apply(void 0, args);
            }
        });
    }, __spreadArray(__spreadArray([], deps, true), [recurring], false));
    var stop = React.useCallback(function () {
        cancelAnimationFrame(idRef.current);
    }, []);
    React.useEffect(function () { return function () { return stop(); }; }, []);
    return [start];
};

var PageRenderStatus;
(function (PageRenderStatus) {
    PageRenderStatus["NotRenderedYet"] = "NotRenderedYet";
    PageRenderStatus["Rendering"] = "Rendering";
    PageRenderStatus["Rendered"] = "Rendered";
})(PageRenderStatus || (PageRenderStatus = {}));
var OUT_OF_RANGE_VISIBILITY = -9999;
var useRenderQueue = function (_a) {
    var doc = _a.doc;
    var numPages = doc.numPages;
    var docId = doc.loadingTask.docId;
    var initialPageVisibilities = React.useMemo(function () {
        return Array(numPages)
            .fill(null)
            .map(function (_, pageIndex) { return ({
            pageIndex: pageIndex,
            renderStatus: PageRenderStatus.NotRenderedYet,
            visibility: OUT_OF_RANGE_VISIBILITY,
        }); });
    }, [docId]);
    var latestRef = React.useRef({
        currentRenderingPage: -1,
        startRange: 0,
        endRange: numPages - 1,
        visibilities: initialPageVisibilities,
    });
    var markNotRendered = function () {
        for (var i = 0; i < numPages; i++) {
            latestRef.current.visibilities[i].renderStatus = PageRenderStatus.NotRenderedYet;
        }
    };
    var markRendered = function (pageIndex) {
        latestRef.current.visibilities[pageIndex].renderStatus = PageRenderStatus.Rendered;
    };
    var markRendering = function (pageIndex) {
        if (latestRef.current.currentRenderingPage !== -1 &&
            latestRef.current.currentRenderingPage !== pageIndex &&
            latestRef.current.visibilities[latestRef.current.currentRenderingPage].renderStatus ===
                PageRenderStatus.Rendering) {
            latestRef.current.visibilities[latestRef.current.currentRenderingPage].renderStatus =
                PageRenderStatus.NotRenderedYet;
        }
        latestRef.current.visibilities[pageIndex].renderStatus = PageRenderStatus.Rendering;
        latestRef.current.currentRenderingPage = pageIndex;
    };
    var setRange = function (startIndex, endIndex) {
        latestRef.current.startRange = startIndex;
        latestRef.current.endRange = endIndex;
        for (var i = 0; i < numPages; i++) {
            if (i < startIndex || i > endIndex) {
                latestRef.current.visibilities[i].visibility = OUT_OF_RANGE_VISIBILITY;
                latestRef.current.visibilities[i].renderStatus = PageRenderStatus.NotRenderedYet;
            }
            else if (latestRef.current.visibilities[i].visibility === OUT_OF_RANGE_VISIBILITY) {
                latestRef.current.visibilities[i].visibility = -1;
            }
        }
    };
    var setOutOfRange = function (pageIndex) {
        setVisibility(pageIndex, OUT_OF_RANGE_VISIBILITY);
    };
    var setVisibility = function (pageIndex, visibility) {
        latestRef.current.visibilities[pageIndex].visibility = visibility;
    };
    var getHighestPriorityPage = function () {
        var visiblePages = latestRef.current.visibilities
            .slice(latestRef.current.startRange, latestRef.current.endRange + 1)
            .filter(function (item) { return item.visibility > OUT_OF_RANGE_VISIBILITY; });
        if (!visiblePages.length) {
            return -1;
        }
        var firstVisiblePage = visiblePages[0].pageIndex;
        var lastVisiblePage = visiblePages[visiblePages.length - 1].pageIndex;
        var numVisiblePages = visiblePages.length;
        var maxVisibilityPageIndex = -1;
        var maxVisibility = -1;
        for (var i = 0; i < numVisiblePages; i++) {
            if (visiblePages[i].renderStatus === PageRenderStatus.Rendering) {
                return -1;
            }
            if (visiblePages[i].renderStatus === PageRenderStatus.NotRenderedYet) {
                if (maxVisibilityPageIndex === -1 || visiblePages[i].visibility > maxVisibility) {
                    maxVisibilityPageIndex = visiblePages[i].pageIndex;
                    maxVisibility = visiblePages[i].visibility;
                }
            }
        }
        if (maxVisibilityPageIndex > -1) {
            return maxVisibilityPageIndex;
        }
        if (lastVisiblePage + 1 < numPages &&
            latestRef.current.visibilities[lastVisiblePage + 1].renderStatus !== PageRenderStatus.Rendered) {
            return lastVisiblePage + 1;
        }
        else if (firstVisiblePage - 1 >= 0 &&
            latestRef.current.visibilities[firstVisiblePage - 1].renderStatus !== PageRenderStatus.Rendered) {
            return firstVisiblePage - 1;
        }
        return -1;
    };
    var isInRange = function (pageIndex) {
        return pageIndex >= latestRef.current.startRange && pageIndex <= latestRef.current.endRange;
    };
    return {
        getHighestPriorityPage: getHighestPriorityPage,
        isInRange: isInRange,
        markNotRendered: markNotRendered,
        markRendered: markRendered,
        markRendering: markRendering,
        setOutOfRange: setOutOfRange,
        setRange: setRange,
        setVisibility: setVisibility,
    };
};

var useTrackResize = function (_a) {
    var targetRef = _a.targetRef, onResize = _a.onResize;
    useIsomorphicLayoutEffect(function () {
        var io = new ResizeObserver(function (entries) {
            entries.forEach(function (entry) {
                onResize(entry.target);
            });
        });
        var container = targetRef.current;
        if (!container) {
            return;
        }
        io.observe(container);
        return function () {
            io.unobserve(container);
        };
    }, []);
};

var AnnotationType;
(function (AnnotationType) {
    AnnotationType[AnnotationType["Text"] = 1] = "Text";
    AnnotationType[AnnotationType["Link"] = 2] = "Link";
    AnnotationType[AnnotationType["FreeText"] = 3] = "FreeText";
    AnnotationType[AnnotationType["Line"] = 4] = "Line";
    AnnotationType[AnnotationType["Square"] = 5] = "Square";
    AnnotationType[AnnotationType["Circle"] = 6] = "Circle";
    AnnotationType[AnnotationType["Polygon"] = 7] = "Polygon";
    AnnotationType[AnnotationType["Polyline"] = 8] = "Polyline";
    AnnotationType[AnnotationType["Highlight"] = 9] = "Highlight";
    AnnotationType[AnnotationType["Underline"] = 10] = "Underline";
    AnnotationType[AnnotationType["Squiggly"] = 11] = "Squiggly";
    AnnotationType[AnnotationType["StrikeOut"] = 12] = "StrikeOut";
    AnnotationType[AnnotationType["Stamp"] = 13] = "Stamp";
    AnnotationType[AnnotationType["Caret"] = 14] = "Caret";
    AnnotationType[AnnotationType["Ink"] = 15] = "Ink";
    AnnotationType[AnnotationType["Popup"] = 16] = "Popup";
    AnnotationType[AnnotationType["FileAttachment"] = 17] = "FileAttachment";
})(AnnotationType || (AnnotationType = {}));

var AnnotationBorderStyleType;
(function (AnnotationBorderStyleType) {
    AnnotationBorderStyleType[AnnotationBorderStyleType["Solid"] = 1] = "Solid";
    AnnotationBorderStyleType[AnnotationBorderStyleType["Dashed"] = 2] = "Dashed";
    AnnotationBorderStyleType[AnnotationBorderStyleType["Beveled"] = 3] = "Beveled";
    AnnotationBorderStyleType[AnnotationBorderStyleType["Inset"] = 4] = "Inset";
    AnnotationBorderStyleType[AnnotationBorderStyleType["Underline"] = 5] = "Underline";
})(AnnotationBorderStyleType || (AnnotationBorderStyleType = {}));

var TextDirection;
(function (TextDirection) {
    TextDirection["RightToLeft"] = "RTL";
    TextDirection["LeftToRight"] = "LTR";
})(TextDirection || (TextDirection = {}));
var ThemeContext = React.createContext({
    currentTheme: 'light',
    direction: TextDirection.LeftToRight,
    setCurrentTheme: function () { },
});

var classNames = function (classes) {
    var result = [];
    Object.keys(classes).forEach(function (clazz) {
        if (clazz && classes[clazz]) {
            result.push(clazz);
        }
    });
    return result.join(' ');
};

var dateRegex = new RegExp('^D:' +
    '(\\d{4})' +
    '(\\d{2})?' +
    '(\\d{2})?' +
    '(\\d{2})?' +
    '(\\d{2})?' +
    '(\\d{2})?' +
    '([Z|+|-])?' +
    '(\\d{2})?' +
    "'?" +
    '(\\d{2})?' +
    "'?");
var parse = function (value, min, max, defaultValue) {
    var parsed = parseInt(value, 10);
    return parsed >= min && parsed <= max ? parsed : defaultValue;
};
var convertDate = function (input) {
    var matches = dateRegex.exec(input);
    if (!matches) {
        return null;
    }
    var year = parseInt(matches[1], 10);
    var month = parse(matches[2], 1, 12, 1) - 1;
    var day = parse(matches[3], 1, 31, 1);
    var hour = parse(matches[4], 0, 23, 0);
    var minute = parse(matches[5], 0, 59, 0);
    var second = parse(matches[6], 0, 59, 0);
    var universalTimeRelation = matches[7] || 'Z';
    var offsetHour = parse(matches[8], 0, 23, 0);
    var offsetMinute = parse(matches[9], 0, 59, 0);
    switch (universalTimeRelation) {
        case '-':
            hour += offsetHour;
            minute += offsetMinute;
            break;
        case '+':
            hour -= offsetHour;
            minute -= offsetMinute;
            break;
    }
    return new Date(Date.UTC(year, month, day, hour, minute, second));
};

var getContents = function (annotation) {
    return annotation.contentsObj ? annotation.contentsObj.str : annotation.contents || '';
};

var getTitle = function (annotation) {
    return annotation.titleObj ? annotation.titleObj.str : annotation.title || '';
};

var PopupWrapper = function (_a) {
    var annotation = _a.annotation;
    var direction = React.useContext(ThemeContext).direction;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRtl = direction === TextDirection.RightToLeft;
    var containerRef = React.useRef();
    var dateStr = '';
    if (annotation.modificationDate) {
        var date = convertDate(annotation.modificationDate);
        dateStr = date ? "".concat(date.toLocaleDateString(), ", ").concat(date.toLocaleTimeString()) : '';
    }
    React.useLayoutEffect(function () {
        var containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        var annotationEle = document.querySelector("[data-annotation-id=\"".concat(annotation.id, "\"]"));
        if (!annotationEle) {
            return;
        }
        var ele = annotationEle;
        ele.style.zIndex += 1;
        return function () {
            ele.style.zIndex = "".concat(parseInt(ele.style.zIndex, 10) - 1);
        };
    }, []);
    return (React.createElement("div", { ref: containerRef, className: classNames({
            'rpv-core__annotation-popup-wrapper': true,
            'rpv-core__annotation-popup-wrapper--rtl': isRtl,
        }), style: {
            top: annotation.annotationType === AnnotationType.Popup ? '' : '100%',
        } },
        title && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: classNames({
                    'rpv-core__annotation-popup-title': true,
                    'rpv-core__annotation-popup-title--ltr': !isRtl,
                    'rpv-core__annotation-popup-title--rtl': isRtl,
                }) }, title),
            React.createElement("div", { className: "rpv-core__annotation-popup-date" }, dateStr))),
        contents && (React.createElement("div", { className: "rpv-core__annotation-popup-content" }, contents.split('\n').map(function (item, index) { return (React.createElement(React.Fragment, { key: index },
            item,
            React.createElement("br", null))); })))));
};

var ToggleStatus;
(function (ToggleStatus) {
    ToggleStatus["Close"] = "Close";
    ToggleStatus["Open"] = "Open";
    ToggleStatus["Toggle"] = "Toggle";
})(ToggleStatus || (ToggleStatus = {}));

var useToggle = function (isOpened) {
    var _a = React.useState(isOpened), opened = _a[0], setOpened = _a[1];
    var toggle = function (status) {
        switch (status) {
            case ToggleStatus.Close:
                setOpened(false);
                break;
            case ToggleStatus.Open:
                setOpened(true);
                break;
            case ToggleStatus.Toggle:
            default:
                setOpened(function (isOpened) { return !isOpened; });
                break;
        }
    };
    return { opened: opened, toggle: toggle };
};

var TogglePopupBy;
(function (TogglePopupBy) {
    TogglePopupBy["Click"] = "Click";
    TogglePopupBy["Hover"] = "Hover";
})(TogglePopupBy || (TogglePopupBy = {}));
var useTogglePopup = function () {
    var _a = useToggle(false), opened = _a.opened, toggle = _a.toggle;
    var _b = React.useState(TogglePopupBy.Hover), togglePopupBy = _b[0], setTooglePopupBy = _b[1];
    var toggleOnClick = function () {
        switch (togglePopupBy) {
            case TogglePopupBy.Click:
                opened && setTooglePopupBy(TogglePopupBy.Hover);
                toggle(ToggleStatus.Toggle);
                break;
            case TogglePopupBy.Hover:
                setTooglePopupBy(TogglePopupBy.Click);
                toggle(ToggleStatus.Open);
                break;
        }
    };
    var openOnHover = function () {
        togglePopupBy === TogglePopupBy.Hover && toggle(ToggleStatus.Open);
    };
    var closeOnHover = function () {
        togglePopupBy === TogglePopupBy.Hover && toggle(ToggleStatus.Close);
    };
    return {
        opened: opened,
        closeOnHover: closeOnHover,
        openOnHover: openOnHover,
        toggleOnClick: toggleOnClick,
    };
};

var Annotation = function (_a) {
    var annotation = _a.annotation, children = _a.children, ignoreBorder = _a.ignoreBorder, hasPopup = _a.hasPopup, isRenderable = _a.isRenderable, page = _a.page, viewport = _a.viewport;
    var rect = annotation.rect;
    var _b = useTogglePopup(), closeOnHover = _b.closeOnHover, opened = _b.opened, openOnHover = _b.openOnHover, toggleOnClick = _b.toggleOnClick;
    var normalizeRect = function (r) { return [
        Math.min(r[0], r[2]),
        Math.min(r[1], r[3]),
        Math.max(r[0], r[2]),
        Math.max(r[1], r[3]),
    ]; };
    var bound = normalizeRect([
        rect[0],
        page.view[3] + page.view[1] - rect[1],
        rect[2],
        page.view[3] + page.view[1] - rect[3],
    ]);
    var width = rect[2] - rect[0];
    var height = rect[3] - rect[1];
    var styles = {
        borderColor: '',
        borderRadius: '',
        borderStyle: '',
        borderWidth: '',
    };
    if (!ignoreBorder && annotation.borderStyle.width > 0) {
        switch (annotation.borderStyle.style) {
            case AnnotationBorderStyleType.Dashed:
                styles.borderStyle = 'dashed';
                break;
            case AnnotationBorderStyleType.Solid:
                styles.borderStyle = 'solid';
                break;
            case AnnotationBorderStyleType.Underline:
                styles = Object.assign({
                    borderBottomStyle: 'solid',
                }, styles);
                break;
            case AnnotationBorderStyleType.Beveled:
            case AnnotationBorderStyleType.Inset:
        }
        var borderWidth = annotation.borderStyle.width;
        styles.borderWidth = "".concat(borderWidth, "px");
        if (annotation.borderStyle.style !== AnnotationBorderStyleType.Underline) {
            width = width - 2 * borderWidth;
            height = height - 2 * borderWidth;
        }
        var _c = annotation.borderStyle, horizontalCornerRadius = _c.horizontalCornerRadius, verticalCornerRadius = _c.verticalCornerRadius;
        if (horizontalCornerRadius > 0 || verticalCornerRadius > 0) {
            styles.borderRadius = "".concat(horizontalCornerRadius, "px / ").concat(verticalCornerRadius, "px");
        }
        annotation.color
            ? (styles.borderColor = "rgb(".concat(annotation.color[0] | 0, ", ").concat(annotation.color[1] | 0, ", ").concat(annotation.color[2] | 0, ")"))
            :
                (styles.borderWidth = '0');
    }
    return (React.createElement(React.Fragment, null, isRenderable &&
        children({
            popup: {
                opened: opened,
                closeOnHover: closeOnHover,
                openOnHover: openOnHover,
                toggleOnClick: toggleOnClick,
            },
            slot: {
                attrs: {
                    style: Object.assign({
                        height: "".concat(height, "px"),
                        left: "".concat(bound[0], "px"),
                        top: "".concat(bound[1], "px"),
                        transform: "matrix(".concat(viewport.transform.join(','), ")"),
                        transformOrigin: "-".concat(bound[0], "px -").concat(bound[1], "px"),
                        width: "".concat(width, "px"),
                    }, styles),
                },
                children: React.createElement(React.Fragment, null, hasPopup && opened && React.createElement(PopupWrapper, { annotation: annotation })),
            },
        })));
};

var Caret = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--caret", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }), props.slot.children)); }));
};

var Circle = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    var rect = annotation.rect;
    var width = rect[2] - rect[0];
    var height = rect[3] - rect[1];
    var borderWidth = annotation.borderStyle.width;
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--circle", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }),
        React.createElement("svg", { height: "".concat(height, "px"), preserveAspectRatio: "none", version: "1.1", viewBox: "0 0 ".concat(width, " ").concat(height), width: "".concat(width, "px") },
            React.createElement("circle", { cy: height / 2, fill: "none", rx: width / 2 - borderWidth / 2, ry: height / 2 - borderWidth / 2, stroke: "transparent", strokeWidth: borderWidth || 1 })),
        props.slot.children)); }));
};

var getFileName = function (url) {
    var str = url.split('/').pop();
    return str ? str.split('#')[0].split('?')[0] : url;
};

var downloadFile = function (url, data) {
    var blobUrl = typeof data === 'string' ? '' : URL.createObjectURL(new Blob([data], { type: '' }));
    var link = document.createElement('a');
    link.style.display = 'none';
    link.href = blobUrl || url;
    link.setAttribute('download', getFileName(url));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
    }
};

var FileAttachment = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var hasPopup = annotation.hasPopup === false && (!!title || !!contents);
    var doubleClick = function () {
        var file = annotation.file;
        file && downloadFile(file.filename, file.content);
    };
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: true, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--file-attachment", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onDoubleClick: doubleClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }), props.slot.children)); }));
};

var FreeText = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--free-text", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }), props.slot.children)); }));
};

var Popup = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(title || contents);
    var ignoredParents = ['Circle', 'Ink', 'Line', 'Polygon', 'PolyLine', 'Square'];
    var hasPopup = !annotation.parentType || ignoredParents.indexOf(annotation.parentType) !== -1;
    useIsomorphicLayoutEffect(function () {
        if (!annotation.parentId) {
            return;
        }
        var parent = document.querySelector("[data-annotation-id=\"".concat(annotation.parentId, "\"]"));
        var container = document.querySelector("[data-annotation-id=\"".concat(annotation.id, "\"]"));
        if (!parent || !container) {
            return;
        }
        var left = parseFloat(parent.style.left);
        var top = parseFloat(parent.style.top) + parseFloat(parent.style.height);
        container.style.left = "".concat(left, "px");
        container.style.top = "".concat(top, "px");
        container.style.transformOrigin = "-".concat(left, "px -").concat(top, "px");
    }, []);
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: false, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--popup", "data-annotation-id": annotation.id }),
        React.createElement(PopupWrapper, { annotation: annotation }))); }));
};

var Highlight = function (_a) {
    var annotation = _a.annotation, childAnnotation = _a.childAnnotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    var hasQuadPoints = annotation.quadPoints && annotation.quadPoints.length > 0;
    if (hasQuadPoints) {
        var annotations = annotation.quadPoints.map(function (quadPoint) {
            return Object.assign({}, annotation, {
                rect: [quadPoint[2].x, quadPoint[2].y, quadPoint[1].x, quadPoint[1].y],
                quadPoints: [],
            });
        });
        return (React.createElement(React.Fragment, null, annotations.map(function (ann, index) { return (React.createElement(Highlight, { key: index, annotation: ann, childAnnotation: childAnnotation, page: page, viewport: viewport })); })));
    }
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement(React.Fragment, null,
        React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--highlight", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }), props.slot.children),
        childAnnotation &&
            childAnnotation.annotationType === AnnotationType.Popup &&
            props.popup.opened && React.createElement(Popup, { annotation: childAnnotation, page: page, viewport: viewport }))); }));
};

var Ink = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    var rect = annotation.rect;
    var width = rect[2] - rect[0];
    var height = rect[3] - rect[1];
    var borderWidth = annotation.borderStyle.width;
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--ink", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }),
        annotation.inkLists && annotation.inkLists.length && (React.createElement("svg", { height: "".concat(height, "px"), preserveAspectRatio: "none", version: "1.1", viewBox: "0 0 ".concat(width, " ").concat(height), width: "".concat(width, "px") }, annotation.inkLists.map(function (inkList, index) { return (React.createElement("polyline", { key: index, fill: "none", stroke: "transparent", strokeWidth: borderWidth || 1, points: inkList.map(function (item) { return "".concat(item.x - rect[0], ",").concat(rect[3] - item.y); }).join(' ') })); }))),
        props.slot.children)); }));
};

var Line = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    var rect = annotation.rect;
    var width = rect[2] - rect[0];
    var height = rect[3] - rect[1];
    var borderWidth = annotation.borderStyle.width;
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--line", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }),
        React.createElement("svg", { height: "".concat(height, "px"), preserveAspectRatio: "none", version: "1.1", viewBox: "0 0 ".concat(width, " ").concat(height), width: "".concat(width, "px") },
            React.createElement("line", { stroke: "transparent", strokeWidth: borderWidth || 1, x1: rect[2] - annotation.lineCoordinates[0], x2: rect[2] - annotation.lineCoordinates[2], y1: rect[3] - annotation.lineCoordinates[1], y2: rect[3] - annotation.lineCoordinates[3] })),
        props.slot.children)); }));
};

var SpecialZoomLevel;
(function (SpecialZoomLevel) {
    SpecialZoomLevel["ActualSize"] = "ActualSize";
    SpecialZoomLevel["PageFit"] = "PageFit";
    SpecialZoomLevel["PageWidth"] = "PageWidth";
})(SpecialZoomLevel || (SpecialZoomLevel = {}));

var normalizeDestination = function (pageIndex, destArray) {
    switch (destArray[1].name) {
        case 'XYZ':
            return {
                bottomOffset: function (_, viewportHeight) {
                    return destArray[3] === null ? viewportHeight : destArray[3];
                },
                leftOffset: function (_, __) { return (destArray[2] === null ? 0 : destArray[2]); },
                pageIndex: pageIndex,
                scaleTo: destArray[4],
            };
        case 'Fit':
        case 'FitB':
            return {
                bottomOffset: 0,
                leftOffset: 0,
                pageIndex: pageIndex,
                scaleTo: SpecialZoomLevel.PageFit,
            };
        case 'FitH':
        case 'FitBH':
            return {
                bottomOffset: destArray[2],
                leftOffset: 0,
                pageIndex: pageIndex,
                scaleTo: SpecialZoomLevel.PageWidth,
            };
        default:
            return {
                bottomOffset: 0,
                leftOffset: 0,
                pageIndex: pageIndex,
                scaleTo: 1,
            };
    }
};
var pageOutlinesMap = new Map();
var pagesMap = new Map();
var generateRefKey = function (doc, outline) {
    return "".concat(doc.loadingTask.docId, "___").concat(outline.num, "R").concat(outline.gen === 0 ? '' : outline.gen);
};
var getPageIndex = function (doc, outline) {
    var key = generateRefKey(doc, outline);
    return pageOutlinesMap.has(key) ? pageOutlinesMap.get(key) : null;
};
var cacheOutlineRef = function (doc, outline, pageIndex) {
    pageOutlinesMap.set(generateRefKey(doc, outline), pageIndex);
};
var clearPagesCache = function () {
    pageOutlinesMap.clear();
    pagesMap.clear();
};
var getPage = function (doc, pageIndex) {
    if (!doc) {
        return Promise.reject('The document is not loaded yet');
    }
    var pageKey = "".concat(doc.loadingTask.docId, "___").concat(pageIndex);
    var page = pagesMap.get(pageKey);
    if (page) {
        return Promise.resolve(page);
    }
    return new Promise(function (resolve, _) {
        doc.getPage(pageIndex + 1).then(function (page) {
            pagesMap.set(pageKey, page);
            if (page.ref) {
                cacheOutlineRef(doc, page.ref, pageIndex);
            }
            resolve(page);
        });
    });
};
var getDestination = function (doc, dest) {
    return new Promise(function (res) {
        new Promise(function (resolve) {
            if (typeof dest === 'string') {
                doc.getDestination(dest).then(function (destArray) {
                    resolve(destArray);
                });
            }
            else {
                resolve(dest);
            }
        }).then(function (destArray) {
            if ('object' === typeof destArray[0] && destArray[0] !== null) {
                var outlineRef_1 = destArray[0];
                var pageIndex = getPageIndex(doc, outlineRef_1);
                if (pageIndex === null) {
                    doc.getPageIndex(outlineRef_1).then(function (pageIndex) {
                        cacheOutlineRef(doc, outlineRef_1, pageIndex);
                        getDestination(doc, dest).then(function (result) { return res(result); });
                    });
                }
                else {
                    res(normalizeDestination(pageIndex, destArray));
                }
            }
            else {
                var target = normalizeDestination(destArray[0], destArray);
                res(target);
            }
        });
    });
};

var INVALID_PROTOCOL = /^([^\w]*)(javascript|data|vbscript)/im;
var HTML_ENTITIES = /&#(\w+)(^\w|;)?/g;
var CTRL_CHARS = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
var URL_SCHEME = /^([^:]+):/gm;
var decodeHtmlEntities = function (str) { return str.replace(HTML_ENTITIES, function (_, dec) { return String.fromCharCode(dec); }); };
var sanitizeUrl = function (url, defaultUrl) {
    if (defaultUrl === void 0) { defaultUrl = 'about:blank'; }
    var result = decodeHtmlEntities(url || '')
        .replace(CTRL_CHARS, '')
        .trim();
    if (!result) {
        return defaultUrl;
    }
    var firstChar = result[0];
    if (firstChar === '.' || firstChar === '/') {
        return result;
    }
    var parsedUrlScheme = result.match(URL_SCHEME);
    if (!parsedUrlScheme) {
        return result;
    }
    var scheme = parsedUrlScheme[0];
    return INVALID_PROTOCOL.test(scheme) ? defaultUrl : result;
};

var Link = function (_a) {
    var _b;
    var annotation = _a.annotation, annotationContainerRef = _a.annotationContainerRef, doc = _a.doc, outlines = _a.outlines, page = _a.page, pageIndex = _a.pageIndex, scale = _a.scale, viewport = _a.viewport, onExecuteNamedAction = _a.onExecuteNamedAction, onJumpFromLinkAnnotation = _a.onJumpFromLinkAnnotation, onJumpToDest = _a.onJumpToDest;
    var elementRef = React.useRef();
    var title = outlines && outlines.length && annotation.dest && typeof annotation.dest === 'string'
        ? (_b = outlines.find(function (item) { return item.dest === annotation.dest; })) === null || _b === void 0 ? void 0 : _b.title
        : '';
    var link = function (e) {
        e.preventDefault();
        annotation.action
            ? onExecuteNamedAction(annotation.action)
            : getDestination(doc, annotation.dest).then(function (target) {
                var element = elementRef.current;
                var annotationContainer = annotationContainerRef.current;
                if (element && annotationContainer) {
                    var linkRect = element.getBoundingClientRect();
                    annotationContainer.style.setProperty('height', '100%');
                    annotationContainer.style.setProperty('width', '100%');
                    var annotationLayerRect = annotationContainer.getBoundingClientRect();
                    annotationContainer.style.removeProperty('height');
                    annotationContainer.style.removeProperty('width');
                    var leftOffset = (linkRect.left - annotationLayerRect.left) / scale;
                    var bottomOffset = (annotationLayerRect.bottom - linkRect.bottom + linkRect.height) / scale;
                    onJumpFromLinkAnnotation({
                        bottomOffset: bottomOffset,
                        label: title,
                        leftOffset: leftOffset,
                        pageIndex: pageIndex,
                    });
                }
                onJumpToDest(target);
            });
    };
    var isRenderable = !!(annotation.url || annotation.dest || annotation.action || annotation.unsafeUrl);
    var attrs = {};
    if (annotation.url || annotation.unsafeUrl) {
        var targetUrl = sanitizeUrl(annotation.url || annotation.unsafeUrl, '');
        if (targetUrl) {
            attrs = {
                'data-target': 'external',
                href: targetUrl,
                rel: 'noopener noreferrer nofollow',
                target: annotation.newWindow ? '_blank' : '',
                title: targetUrl,
            };
        }
        else {
            isRenderable = false;
        }
    }
    else {
        attrs = {
            href: '',
            'data-annotation-link': annotation.id,
            onClick: link,
        };
    }
    if (title) {
        attrs = Object.assign({}, attrs, {
            title: title,
            'aria-label': title,
        });
    }
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: false, ignoreBorder: false, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--link", "data-annotation-id": annotation.id, "data-testid": "core__annotation--link-".concat(annotation.id) }),
        React.createElement("a", __assign({ ref: elementRef }, attrs)))); }));
};

var Polygon = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    var rect = annotation.rect;
    var width = rect[2] - rect[0];
    var height = rect[3] - rect[1];
    var borderWidth = annotation.borderStyle.width;
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--polygon", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }),
        annotation.vertices && annotation.vertices.length && (React.createElement("svg", { height: "".concat(height, "px"), preserveAspectRatio: "none", version: "1.1", viewBox: "0 0 ".concat(width, " ").concat(height), width: "".concat(width, "px") },
            React.createElement("polygon", { fill: "none", stroke: "transparent", strokeWidth: borderWidth || 1, points: annotation.vertices
                    .map(function (item) { return "".concat(item.x - rect[0], ",").concat(rect[3] - item.y); })
                    .join(' ') }))),
        props.slot.children)); }));
};

var Polyline = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    var rect = annotation.rect;
    var width = rect[2] - rect[0];
    var height = rect[3] - rect[1];
    var borderWidth = annotation.borderStyle.width;
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--polyline", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }),
        annotation.vertices && annotation.vertices.length && (React.createElement("svg", { height: "".concat(height, "px"), preserveAspectRatio: "none", version: "1.1", viewBox: "0 0 ".concat(width, " ").concat(height), width: "".concat(width, "px") },
            React.createElement("polyline", { fill: "none", stroke: "transparent", strokeWidth: borderWidth || 1, points: annotation.vertices
                    .map(function (item) { return "".concat(item.x - rect[0], ",").concat(rect[3] - item.y); })
                    .join(' ') }))),
        props.slot.children)); }));
};

var Square = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    var rect = annotation.rect;
    var width = rect[2] - rect[0];
    var height = rect[3] - rect[1];
    var borderWidth = annotation.borderStyle.width;
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--square", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }),
        React.createElement("svg", { height: "".concat(height, "px"), preserveAspectRatio: "none", version: "1.1", viewBox: "0 0 ".concat(width, " ").concat(height), width: "".concat(width, "px") },
            React.createElement("rect", { height: height - borderWidth, fill: "none", stroke: "transparent", strokeWidth: borderWidth || 1, x: borderWidth / 2, y: borderWidth / 2, width: width - borderWidth })),
        props.slot.children)); }));
};

var Squiggly = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--squiggly", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }), props.slot.children)); }));
};

var Stamp = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--stamp", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }), props.slot.children)); }));
};

var StrikeOut = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--strike-out", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }), props.slot.children)); }));
};

var Icon = function (_a) {
    var children = _a.children, _b = _a.ignoreDirection, ignoreDirection = _b === void 0 ? false : _b, _c = _a.size, size = _c === void 0 ? 24 : _c;
    var direction = React.useContext(ThemeContext).direction;
    var isRtl = !ignoreDirection && direction === TextDirection.RightToLeft;
    var width = "".concat(size || 24, "px");
    return (React.createElement("svg", { "aria-hidden": "true", className: classNames({
            'rpv-core__icon': true,
            'rpv-core__icon--rtl': isRtl,
        }), focusable: "false", height: width, viewBox: "0 0 24 24", width: width }, children));
};

var CheckIcon = function () { return (React.createElement(Icon, { size: 16 },
    React.createElement("path", { d: "M23.5,0.499l-16.5,23l-6.5-6.5" }))); };

var CommentIcon = function () { return (React.createElement(Icon, { size: 16 },
    React.createElement("path", { d: "M.5,16.5a1,1,0,0,0,1,1h2v4l4-4h15a1,1,0,0,0,1-1V3.5a1,1,0,0,0-1-1H1.5a1,1,0,0,0-1,1Z" }),
    React.createElement("path", { d: "M7.25,9.75A.25.25,0,1,1,7,10a.25.25,0,0,1,.25-.25" }),
    React.createElement("path", { d: "M12,9.75a.25.25,0,1,1-.25.25A.25.25,0,0,1,12,9.75" }),
    React.createElement("path", { d: "M16.75,9.75a.25.25,0,1,1-.25.25.25.25,0,0,1,.25-.25" }))); };

var HelpIcon = function () { return (React.createElement(Icon, { size: 16 },
    React.createElement("path", { d: "M0.500 12.001 A11.500 11.500 0 1 0 23.500 12.001 A11.500 11.500 0 1 0 0.500 12.001 Z" }),
    React.createElement("path", { d: "M6.000 12.001 A6.000 6.000 0 1 0 18.000 12.001 A6.000 6.000 0 1 0 6.000 12.001 Z" }),
    React.createElement("path", { d: "M21.423 5.406L17.415 9.414" }),
    React.createElement("path", { d: "M14.587 6.585L18.607 2.565" }),
    React.createElement("path", { d: "M5.405 21.424L9.413 17.416" }),
    React.createElement("path", { d: "M6.585 14.588L2.577 18.596" }),
    React.createElement("path", { d: "M18.602 21.419L14.595 17.412" }),
    React.createElement("path", { d: "M17.419 14.58L21.428 18.589" }),
    React.createElement("path", { d: "M2.582 5.399L6.588 9.406" }),
    React.createElement("path", { d: "M9.421 6.581L5.412 2.572" }))); };

var KeyIcon = function () { return (React.createElement(Icon, { size: 16 },
    React.createElement("path", { d: "M4.000 18.500 A1.500 1.500 0 1 0 7.000 18.500 A1.500 1.500 0 1 0 4.000 18.500 Z" }),
    React.createElement("path", { d: "M20.5.5l-9.782,9.783a7,7,0,1,0,3,3L17,10h1.5V8.5L19,8h1.5V6.5L21,6h1.5V4.5l1-1V.5Z" }))); };

var NoteIcon = function () { return (React.createElement(Icon, { size: 16 },
    React.createElement("path", { d: "M2.000 2.500 L22.000 2.500 L22.000 23.500 L2.000 23.500 Z" }),
    React.createElement("path", { d: "M6 4.5L6 0.5" }),
    React.createElement("path", { d: "M18 4.5L18 0.5" }),
    React.createElement("path", { d: "M10 4.5L10 0.5" }),
    React.createElement("path", { d: "M14 4.5L14 0.5" }))); };

var ParagraphIcon = function () { return (React.createElement(Icon, { size: 16 },
    React.createElement("path", { d: "M17.5 0.498L17.5 23.498" }),
    React.createElement("path", { d: "M10.5 0.498L10.5 23.498" }),
    React.createElement("path", { d: "M23.5.5H6.5a6,6,0,0,0,0,12h4" }))); };

var TriangleIcon = function () { return (React.createElement(Icon, { size: 16 },
    React.createElement("path", { d: "M2.5 22.995L12 6.005 21.5 22.995 2.5 22.995z" }))); };

var Text = function (_a) {
    var annotation = _a.annotation, childAnnotation = _a.childAnnotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    var name = annotation.name ? annotation.name.toLowerCase() : '';
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: false, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement(React.Fragment, null,
        React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--text", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }),
            name && (React.createElement("div", { className: "rpv-core__annotation-text-icon" },
                name === 'check' && React.createElement(CheckIcon, null),
                name === 'comment' && React.createElement(CommentIcon, null),
                name === 'help' && React.createElement(HelpIcon, null),
                name === 'insert' && React.createElement(TriangleIcon, null),
                name === 'key' && React.createElement(KeyIcon, null),
                name === 'note' && React.createElement(NoteIcon, null),
                (name === 'newparagraph' || name === 'paragraph') && React.createElement(ParagraphIcon, null))),
            props.slot.children),
        childAnnotation &&
            childAnnotation.annotationType === AnnotationType.Popup &&
            props.popup.opened && React.createElement(Popup, { annotation: childAnnotation, page: page, viewport: viewport }))); }));
};

var Underline = function (_a) {
    var annotation = _a.annotation, page = _a.page, viewport = _a.viewport;
    var hasPopup = annotation.hasPopup === false;
    var title = getTitle(annotation);
    var contents = getContents(annotation);
    var isRenderable = !!(annotation.hasPopup || title || contents);
    return (React.createElement(Annotation, { annotation: annotation, hasPopup: hasPopup, ignoreBorder: true, isRenderable: isRenderable, page: page, viewport: viewport }, function (props) { return (React.createElement("div", __assign({}, props.slot.attrs, { className: "rpv-core__annotation rpv-core__annotation--underline", "data-annotation-id": annotation.id, onClick: props.popup.toggleOnClick, onMouseEnter: props.popup.openOnHover, onMouseLeave: props.popup.closeOnHover }), props.slot.children)); }));
};

var AnnotationLayerBody = function (_a) {
    var annotations = _a.annotations, doc = _a.doc, outlines = _a.outlines, page = _a.page, pageIndex = _a.pageIndex, plugins = _a.plugins, rotation = _a.rotation, scale = _a.scale, onExecuteNamedAction = _a.onExecuteNamedAction, onJumpFromLinkAnnotation = _a.onJumpFromLinkAnnotation, onJumpToDest = _a.onJumpToDest;
    var containerRef = React.useRef();
    var viewport = page.getViewport({ rotation: rotation, scale: scale });
    var clonedViewPort = viewport.clone({ dontFlip: true });
    var filterAnnotations = annotations.filter(function (annotation) { return !annotation.parentId; });
    useIsomorphicLayoutEffect(function () {
        var container = containerRef.current;
        if (!container) {
            return;
        }
        var renderProps = {
            annotations: filterAnnotations,
            container: container,
            pageIndex: pageIndex,
            rotation: rotation,
            scale: scale,
        };
        var handleRenderAnnotationLayer = function (plugin) {
            if (plugin.dependencies) {
                plugin.dependencies.forEach(function (dep) {
                    handleRenderAnnotationLayer(dep);
                });
            }
            if (plugin.onAnnotationLayerRender) {
                plugin.onAnnotationLayerRender(renderProps);
            }
        };
        plugins.forEach(function (plugin) {
            handleRenderAnnotationLayer(plugin);
        });
    }, []);
    return (React.createElement("div", { ref: containerRef, className: "rpv-core__annotation-layer", "data-testid": "core__annotation-layer-".concat(pageIndex) }, filterAnnotations.map(function (annotation) {
        var childAnnotation = annotations.find(function (item) { return item.parentId === annotation.id; });
        switch (annotation.annotationType) {
            case AnnotationType.Caret:
                return (React.createElement(Caret, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Circle:
                return (React.createElement(Circle, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.FileAttachment:
                return (React.createElement(FileAttachment, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.FreeText:
                return (React.createElement(FreeText, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Highlight:
                return (React.createElement(Highlight, { key: annotation.id, annotation: annotation, childAnnotation: childAnnotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Ink:
                return (React.createElement(Ink, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Line:
                return (React.createElement(Line, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Link:
                return (React.createElement(Link, { key: annotation.id, annotation: annotation, annotationContainerRef: containerRef, doc: doc, outlines: outlines, page: page, pageIndex: pageIndex, scale: scale, viewport: clonedViewPort, onExecuteNamedAction: onExecuteNamedAction, onJumpFromLinkAnnotation: onJumpFromLinkAnnotation, onJumpToDest: onJumpToDest }));
            case AnnotationType.Polygon:
                return (React.createElement(Polygon, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Polyline:
                return (React.createElement(Polyline, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Popup:
                return (React.createElement(Popup, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Square:
                return (React.createElement(Square, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Squiggly:
                return (React.createElement(Squiggly, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Stamp:
                return (React.createElement(Stamp, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.StrikeOut:
                return (React.createElement(StrikeOut, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Text:
                return (React.createElement(Text, { key: annotation.id, annotation: annotation, childAnnotation: childAnnotation, page: page, viewport: clonedViewPort }));
            case AnnotationType.Underline:
                return (React.createElement(Underline, { key: annotation.id, annotation: annotation, page: page, viewport: clonedViewPort }));
            default:
                return React.createElement(React.Fragment, { key: annotation.id });
        }
    })));
};

var useIsMounted = function () {
    var isMountedRef = React.useRef(false);
    React.useEffect(function () {
        isMountedRef.current = true;
        return function () {
            isMountedRef.current = false;
        };
    }, []);
    return isMountedRef;
};

var useSafeState = function (initialState) {
    var _a = React.useState(initialState), state = _a[0], setState = _a[1];
    var useIsMountedRef = useIsMounted();
    var setSafeState = React.useCallback(function (newState) {
        if (useIsMountedRef.current) {
            setState(newState);
        }
    }, [useIsMountedRef.current]);
    return [state, setSafeState];
};

var AnnotationLoader = function (_a) {
    var page = _a.page, renderAnnotations = _a.renderAnnotations;
    var _b = useSafeState({
        loading: true,
        annotations: [],
    }), status = _b[0], setStatus = _b[1];
    React.useEffect(function () {
        page.getAnnotations({ intent: 'display' }).then(function (result) {
            setStatus({
                loading: false,
                annotations: result,
            });
        });
    }, []);
    return status.loading ? React.createElement(React.Fragment, null) : renderAnnotations(status.annotations);
};

var AnnotationLayer = function (_a) {
    var doc = _a.doc, outlines = _a.outlines, page = _a.page, pageIndex = _a.pageIndex, plugins = _a.plugins, rotation = _a.rotation, scale = _a.scale, onExecuteNamedAction = _a.onExecuteNamedAction, onJumpFromLinkAnnotation = _a.onJumpFromLinkAnnotation, onJumpToDest = _a.onJumpToDest;
    var renderAnnotations = function (annotations) { return (React.createElement(AnnotationLayerBody, { annotations: annotations, doc: doc, outlines: outlines, page: page, pageIndex: pageIndex, plugins: plugins, rotation: rotation, scale: scale, onExecuteNamedAction: onExecuteNamedAction, onJumpFromLinkAnnotation: onJumpFromLinkAnnotation, onJumpToDest: onJumpToDest })); };
    return React.createElement(AnnotationLoader, { page: page, renderAnnotations: renderAnnotations });
};

var Spinner = function (_a) {
    var _b = _a.size, size = _b === void 0 ? '4rem' : _b, testId = _a.testId;
    var _c = React.useState(false), visible = _c[0], setVisible = _c[1];
    var attrs = testId ? { 'data-testid': testId } : {};
    var handleVisibilityChanged = function (params) {
        setVisible(params.isVisible);
    };
    var containerRef = useIntersectionObserver({
        onVisibilityChanged: handleVisibilityChanged,
    });
    return (React.createElement("div", __assign({}, attrs, { className: classNames({
            'rpv-core__spinner': true,
            'rpv-core__spinner--animating': visible,
        }), ref: containerRef, style: { height: size, width: size } })));
};

var ViewMode;
(function (ViewMode) {
    ViewMode["DualPage"] = "DualPage";
    ViewMode["DualPageWithCover"] = "DualPageWithCover";
    ViewMode["SinglePage"] = "SinglePage";
})(ViewMode || (ViewMode = {}));

var LayerRenderStatus;
(function (LayerRenderStatus) {
    LayerRenderStatus[LayerRenderStatus["PreRender"] = 0] = "PreRender";
    LayerRenderStatus[LayerRenderStatus["DidRender"] = 1] = "DidRender";
})(LayerRenderStatus || (LayerRenderStatus = {}));

var floatToRatio = function (x, limit) {
    var _a, _b;
    if (Math.floor(x) === x) {
        return [x, 1];
    }
    var y = 1 / x;
    if (y > limit) {
        return [1, limit];
    }
    if (Math.floor(y) === y) {
        return [1, y];
    }
    var value = x > 1 ? y : x;
    var a = 0;
    var b = 1;
    var c = 1;
    var d = 1;
    while (true) {
        var numerator = a + c;
        var denominator = b + d;
        if (denominator > limit) {
            break;
        }
        value <= numerator / denominator ? (_a = [numerator, denominator], c = _a[0], d = _a[1], _a) : (_b = [numerator, denominator], a = _b[0], b = _b[1], _b);
    }
    var middle = (a / b + c / d) / 2;
    return value < middle ? (value === x ? [a, b] : [b, a]) : value === x ? [c, d] : [d, c];
};

var roundToDivide = function (a, b) {
    var remainder = a % b;
    return remainder === 0 ? a : Math.floor(a - remainder);
};

var MAX_CANVAS_SIZE = 4096 * 4096;
var CanvasLayer = function (_a) {
    var canvasLayerRef = _a.canvasLayerRef, height = _a.height, page = _a.page, pageIndex = _a.pageIndex, plugins = _a.plugins, rotation = _a.rotation, scale = _a.scale, width = _a.width, onRenderCanvasCompleted = _a.onRenderCanvasCompleted;
    var renderTask = React.useRef();
    useIsomorphicLayoutEffect(function () {
        var task = renderTask.current;
        if (task) {
            task.cancel();
        }
        var canvasEle = canvasLayerRef.current;
        canvasEle.removeAttribute('data-testid');
        var preRenderProps = {
            ele: canvasEle,
            pageIndex: pageIndex,
            rotation: rotation,
            scale: scale,
            status: LayerRenderStatus.PreRender,
        };
        var handlePreRenderCanvasLayer = function (plugin) {
            if (plugin.dependencies) {
                plugin.dependencies.forEach(function (dep) { return handlePreRenderCanvasLayer(dep); });
            }
            if (plugin.onCanvasLayerRender) {
                plugin.onCanvasLayerRender(preRenderProps);
            }
        };
        plugins.forEach(function (plugin) { return handlePreRenderCanvasLayer(plugin); });
        var viewport = page.getViewport({
            rotation: rotation,
            scale: scale,
        });
        var outputScale = window.devicePixelRatio || 1;
        var maxScale = Math.sqrt(MAX_CANVAS_SIZE / (viewport.width * viewport.height));
        var shouldScaleByCSS = outputScale > maxScale;
        shouldScaleByCSS ? (canvasEle.style.transform = "scale(1, 1)") : canvasEle.style.removeProperty('transform');
        var possibleScale = Math.min(maxScale, outputScale);
        var _a = floatToRatio(possibleScale, 8), x = _a[0], y = _a[1];
        canvasEle.width = roundToDivide(viewport.width * possibleScale, x);
        canvasEle.height = roundToDivide(viewport.height * possibleScale, x);
        canvasEle.style.width = "".concat(roundToDivide(viewport.width, y), "px");
        canvasEle.style.height = "".concat(roundToDivide(viewport.height, y), "px");
        canvasEle.hidden = true;
        var canvasContext = canvasEle.getContext('2d', { alpha: false });
        var transform = shouldScaleByCSS || outputScale !== 1 ? [possibleScale, 0, 0, possibleScale, 0, 0] : null;
        renderTask.current = page.render({ canvasContext: canvasContext, transform: transform, viewport: viewport });
        renderTask.current.promise.then(function () {
            canvasEle.hidden = false;
            canvasEle.setAttribute('data-testid', "core__canvas-layer-".concat(pageIndex));
            var didRenderProps = {
                ele: canvasEle,
                pageIndex: pageIndex,
                rotation: rotation,
                scale: scale,
                status: LayerRenderStatus.DidRender,
            };
            var handleDidRenderCanvasLayer = function (plugin) {
                if (plugin.dependencies) {
                    plugin.dependencies.forEach(function (dep) { return handleDidRenderCanvasLayer(dep); });
                }
                if (plugin.onCanvasLayerRender) {
                    plugin.onCanvasLayerRender(didRenderProps);
                }
            };
            plugins.forEach(function (plugin) { return handleDidRenderCanvasLayer(plugin); });
            onRenderCanvasCompleted();
        }, function () {
            onRenderCanvasCompleted();
        });
        return function () {
            if (canvasEle) {
                canvasEle.width = 0;
                canvasEle.height = 0;
            }
        };
    }, []);
    return (React.createElement("div", { className: "rpv-core__canvas-layer", style: {
            height: "".concat(height, "px"),
            width: "".concat(width, "px"),
        } },
        React.createElement("canvas", { ref: canvasLayerRef })));
};

var PdfJsApiContext = React.createContext({});

var SvgLayer = function (_a) {
    var height = _a.height, page = _a.page, rotation = _a.rotation, scale = _a.scale, width = _a.width;
    var pdfJsApiProvider = React.useContext(PdfJsApiContext).pdfJsApiProvider;
    var containerRef = React.useRef();
    var empty = function () {
        var containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        containerEle.innerHTML = '';
    };
    useIsomorphicLayoutEffect(function () {
        var containerEle = containerRef.current;
        var viewport = page.getViewport({ rotation: rotation, scale: scale });
        page.getOperatorList().then(function (operatorList) {
            empty();
            var graphic = new pdfJsApiProvider.SVGGraphics(page.commonObjs, page.objs);
            graphic.getSVG(operatorList, viewport).then(function (svg) {
                svg.style.height = "".concat(height, "px");
                svg.style.width = "".concat(width, "px");
                containerEle.appendChild(svg);
            });
        });
    }, []);
    return React.createElement("div", { className: "rpv-core__svg-layer", ref: containerRef });
};

var TextLayer = function (_a) {
    var containerRef = _a.containerRef, page = _a.page, pageIndex = _a.pageIndex, plugins = _a.plugins, rotation = _a.rotation, scale = _a.scale, onRenderTextCompleted = _a.onRenderTextCompleted;
    var pdfJsApiProvider = React.useContext(PdfJsApiContext).pdfJsApiProvider;
    var renderTask = React.useRef();
    var empty = function () {
        var containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        var spans = [].slice.call(containerEle.querySelectorAll('.rpv-core__text-layer-text'));
        spans.forEach(function (span) { return containerEle.removeChild(span); });
        var breaks = [].slice.call(containerEle.querySelectorAll('br[role="presentation"]'));
        breaks.forEach(function (br) { return containerEle.removeChild(br); });
    };
    useIsomorphicLayoutEffect(function () {
        var task = renderTask.current;
        if (task) {
            task.cancel();
        }
        var containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        containerEle.removeAttribute('data-testid');
        var viewport = page.getViewport({ rotation: rotation, scale: scale });
        var preRenderProps = {
            ele: containerEle,
            pageIndex: pageIndex,
            scale: scale,
            status: LayerRenderStatus.PreRender,
        };
        var handlePreRenderTextLayer = function (plugin) {
            if (plugin.dependencies) {
                plugin.dependencies.forEach(function (dep) { return handlePreRenderTextLayer(dep); });
            }
            if (plugin.onTextLayerRender) {
                plugin.onTextLayerRender(preRenderProps);
            }
        };
        plugins.forEach(function (plugin) { return handlePreRenderTextLayer(plugin); });
        page.getTextContent().then(function (textContent) {
            empty();
            containerEle.style.setProperty('--scale-factor', "".concat(scale));
            renderTask.current = pdfJsApiProvider.renderTextLayer({
                container: containerEle,
                textContent: textContent,
                textContentSource: textContent,
                viewport: viewport,
            });
            renderTask.current.promise.then(function () {
                containerEle.setAttribute('data-testid', "core__text-layer-".concat(pageIndex));
                var spans = [].slice.call(containerEle.children);
                spans.forEach(function (span) {
                    if (!span.classList.contains('rpv-core__text-layer-text--not')) {
                        span.classList.add('rpv-core__text-layer-text');
                    }
                });
                var didRenderProps = {
                    ele: containerEle,
                    pageIndex: pageIndex,
                    scale: scale,
                    status: LayerRenderStatus.DidRender,
                };
                var handleDidRenderTextLayer = function (plugin) {
                    if (plugin.dependencies) {
                        plugin.dependencies.forEach(function (dep) { return handleDidRenderTextLayer(dep); });
                    }
                    if (plugin.onTextLayerRender) {
                        plugin.onTextLayerRender(didRenderProps);
                    }
                };
                plugins.forEach(function (plugin) { return handleDidRenderTextLayer(plugin); });
                onRenderTextCompleted();
            }, function () {
                containerEle.removeAttribute('data-testid');
                onRenderTextCompleted();
            });
        });
        return function () {
            var _a;
            empty();
            (_a = renderTask.current) === null || _a === void 0 ? void 0 : _a.cancel();
        };
    }, []);
    return React.createElement("div", { className: "rpv-core__text-layer", ref: containerRef });
};

var PageLayer = function (_a) {
    var doc = _a.doc, measureRef = _a.measureRef, outlines = _a.outlines, pageIndex = _a.pageIndex, pageRotation = _a.pageRotation, pageSize = _a.pageSize, plugins = _a.plugins, renderPage = _a.renderPage, renderQueueKey = _a.renderQueueKey, rotation = _a.rotation, scale = _a.scale, shouldRender = _a.shouldRender, viewMode = _a.viewMode, onExecuteNamedAction = _a.onExecuteNamedAction, onJumpFromLinkAnnotation = _a.onJumpFromLinkAnnotation, onJumpToDest = _a.onJumpToDest, onRenderCompleted = _a.onRenderCompleted, onRotatePage = _a.onRotatePage;
    var isMountedRef = useIsMounted();
    var _b = useSafeState(null), page = _b[0], setPage = _b[1];
    var _c = useSafeState(false), canvasLayerRendered = _c[0], setCanvasLayerRendered = _c[1];
    var _d = useSafeState(false), textLayerRendered = _d[0], setTextLayerRendered = _d[1];
    var canvasLayerRef = React.useRef();
    var textLayerRef = React.useRef();
    var isVertical = Math.abs(rotation + pageRotation) % 180 === 0;
    var scaledWidth = pageSize.pageWidth * scale;
    var scaledHeight = pageSize.pageHeight * scale;
    var w = isVertical ? scaledWidth : scaledHeight;
    var h = isVertical ? scaledHeight : scaledWidth;
    var rotationValue = (pageSize.rotation + rotation + pageRotation) % 360;
    var renderQueueKeyRef = React.useRef(0);
    var determinePageInstance = function () {
        getPage(doc, pageIndex).then(function (pdfPage) {
            renderQueueKeyRef.current = renderQueueKey;
            setPage(pdfPage);
        });
    };
    var defaultPageRenderer = function (props) { return (React.createElement(React.Fragment, null,
        props.canvasLayer.children,
        props.textLayer.children,
        props.annotationLayer.children)); };
    var renderPageLayer = renderPage || defaultPageRenderer;
    var handleRenderCanvasCompleted = function () {
        setCanvasLayerRendered(true);
    };
    var handleRenderTextCompleted = function () {
        setTextLayerRendered(true);
    };
    var renderPluginsLayer = function (plugins) {
        return plugins.map(function (plugin, idx) { return (React.createElement(React.Fragment, { key: idx },
            plugin.dependencies && renderPluginsLayer(plugin.dependencies),
            plugin.renderPageLayer &&
                plugin.renderPageLayer({
                    canvasLayerRef: canvasLayerRef,
                    canvasLayerRendered: canvasLayerRendered,
                    doc: doc,
                    height: h,
                    pageIndex: pageIndex,
                    rotation: rotationValue,
                    scale: scale,
                    textLayerRef: textLayerRef,
                    textLayerRendered: textLayerRendered,
                    width: w,
                }))); });
    };
    React.useEffect(function () {
        setPage(null);
        setCanvasLayerRendered(false);
        setTextLayerRendered(false);
    }, [pageRotation, rotation, scale]);
    React.useEffect(function () {
        if (shouldRender && isMountedRef.current && !page) {
            determinePageInstance();
        }
    }, [shouldRender, page]);
    React.useEffect(function () {
        if (canvasLayerRendered && textLayerRendered) {
            if (renderQueueKey !== renderQueueKeyRef.current) {
                setPage(null);
                setCanvasLayerRendered(false);
                setTextLayerRendered(false);
            }
            else {
                onRenderCompleted(pageIndex);
            }
        }
    }, [canvasLayerRendered, textLayerRendered]);
    return (React.createElement("div", { className: classNames({
            'rpv-core__page-layer': true,
            'rpv-core__page-layer--dual': viewMode === ViewMode.DualPage,
            'rpv-core__page-layer--dual-cover': viewMode === ViewMode.DualPageWithCover,
            'rpv-core__page-layer--single': viewMode === ViewMode.SinglePage,
        }), "data-testid": "core__page-layer-".concat(pageIndex), ref: measureRef, style: {
            height: "".concat(h, "px"),
            width: "".concat(w, "px"),
        } }, !page ? (React.createElement(Spinner, { testId: "core__page-layer-loading-".concat(pageIndex) })) : (React.createElement(React.Fragment, null,
        renderPageLayer({
            annotationLayer: {
                attrs: {},
                children: (React.createElement(AnnotationLayer, { doc: doc, outlines: outlines, page: page, pageIndex: pageIndex, plugins: plugins, rotation: rotationValue, scale: scale, onExecuteNamedAction: onExecuteNamedAction, onJumpFromLinkAnnotation: onJumpFromLinkAnnotation, onJumpToDest: onJumpToDest })),
            },
            canvasLayer: {
                attrs: {},
                children: (React.createElement(CanvasLayer, { canvasLayerRef: canvasLayerRef, height: h, page: page, pageIndex: pageIndex, plugins: plugins, rotation: rotationValue, scale: scale, width: w, onRenderCanvasCompleted: handleRenderCanvasCompleted })),
            },
            canvasLayerRendered: canvasLayerRendered,
            doc: doc,
            height: h,
            pageIndex: pageIndex,
            rotation: rotationValue,
            scale: scale,
            svgLayer: {
                attrs: {},
                children: (React.createElement(SvgLayer, { height: h, page: page, rotation: rotationValue, scale: scale, width: w })),
            },
            textLayer: {
                attrs: {},
                children: (React.createElement(TextLayer, { containerRef: textLayerRef, page: page, pageIndex: pageIndex, plugins: plugins, rotation: rotationValue, scale: scale, onRenderTextCompleted: handleRenderTextCompleted })),
            },
            textLayerRendered: textLayerRendered,
            width: w,
            markRendered: onRenderCompleted,
            onRotatePage: function (direction) { return onRotatePage(pageIndex, direction); },
        }),
        renderPluginsLayer(plugins)))));
};

var core = {
	askingPassword: {
		requirePasswordToOpen: "This document requires a password to open",
		submit: "Submit"
	},
	wrongPassword: {
		tryAgain: "The password is wrong. Please try again"
	},
	pageLabel: "Page {{pageIndex}}"
};
var enUs = {
	core: core
};

var DefaultLocalization = enUs;
var LocalizationContext = React.createContext({
    l10n: DefaultLocalization,
    setL10n: function () { },
});

var RotateDirection;
(function (RotateDirection) {
    RotateDirection["Backward"] = "Backward";
    RotateDirection["Forward"] = "Forward";
})(RotateDirection || (RotateDirection = {}));

var ScrollMode;
(function (ScrollMode) {
    ScrollMode["Page"] = "Page";
    ScrollMode["Horizontal"] = "Horizontal";
    ScrollMode["Vertical"] = "Vertical";
    ScrollMode["Wrapped"] = "Wrapped";
})(ScrollMode || (ScrollMode = {}));

var chunk = function (arr, size) {
    return arr.reduce(function (acc, e, i) { return (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc); }, []);
};

var getFileExt = function (url) {
    var str = url.split(/\./).pop();
    return str ? str.toLowerCase() : '';
};

var rectReducer = function (state, action) {
    var rect = action.rect;
    return state.height !== rect.height || state.width !== rect.width ? rect : state;
};
var useMeasureRect = function (_a) {
    var elementRef = _a.elementRef;
    var _b = React.useState(elementRef.current), element = _b[0], setElement = _b[1];
    var initializedRectRef = React.useRef(false);
    var _c = React.useReducer(rectReducer, { height: 0, width: 0 }), rect = _c[0], dispatch = _c[1];
    useIsomorphicLayoutEffect(function () {
        if (elementRef.current !== element) {
            setElement(elementRef.current);
        }
    });
    useIsomorphicLayoutEffect(function () {
        if (element && !initializedRectRef.current) {
            initializedRectRef.current = true;
            var _a = element.getBoundingClientRect(), height = _a.height, width = _a.width;
            dispatch({
                rect: { height: height, width: width },
            });
        }
    }, [element]);
    React.useEffect(function () {
        if (!element) {
            return;
        }
        var tracker = new ResizeObserver(function (entries, __) {
            entries.forEach(function (entry) {
                if (entry.target === element) {
                    var _a = entry.contentRect, height = _a.height, width = _a.width;
                    dispatch({
                        rect: { height: height, width: width },
                    });
                }
            });
        });
        tracker.observe(element);
        return function () {
            tracker.unobserve(element);
        };
    }, [element]);
    return rect;
};

var ScrollDirection;
(function (ScrollDirection) {
    ScrollDirection["Horizontal"] = "Horizontal";
    ScrollDirection["Vertical"] = "Vertical";
    ScrollDirection["Both"] = "Both";
})(ScrollDirection || (ScrollDirection = {}));

var easeOutQuart = function (t) { return 1 - Math.pow(1 - t, 4); };

var EPS = 0.0001;
var smoothScroll = function (ele, scrollDirection, targetPosition, duration, easing, onReachTarget) {
    if (easing === void 0) { easing = function (t) { return t; }; }
    if (onReachTarget === void 0) { onReachTarget = function () { }; }
    var top = 0;
    var left = 0;
    var reachTarget = false;
    switch (scrollDirection) {
        case ScrollDirection.Horizontal:
            left = ele.scrollLeft;
            top = 0;
            break;
        case ScrollDirection.Both:
            left = ele.scrollLeft;
            top = ele.scrollTop;
            break;
        case ScrollDirection.Vertical:
        default:
            left = 0;
            top = ele.scrollTop;
            break;
    }
    var markTargetReached = function () {
        if (!reachTarget) {
            reachTarget = true;
            ele.scrollLeft = targetPosition.left;
            ele.scrollTop = targetPosition.top;
            onReachTarget();
        }
    };
    if (Math.abs(top - targetPosition.top) <= EPS && scrollDirection === ScrollDirection.Vertical) {
        markTargetReached();
        return;
    }
    if (Math.abs(left - targetPosition.left) <= EPS && scrollDirection === ScrollDirection.Horizontal) {
        markTargetReached();
        return;
    }
    var startTime = -1;
    var requestId;
    var offset = {
        left: left - targetPosition.left,
        top: top - targetPosition.top,
    };
    var loop = function (currentTime) {
        if (startTime === -1) {
            startTime = currentTime;
        }
        var time = currentTime - startTime;
        var percent = Math.min(time / duration, 1);
        var easedPercent = easing(percent);
        var updatePosition = {
            left: left - offset.left * easedPercent,
            top: top - offset.top * easedPercent,
        };
        switch (scrollDirection) {
            case ScrollDirection.Horizontal:
                ele.scrollLeft = updatePosition.left;
                break;
            case ScrollDirection.Both:
                ele.scrollLeft = updatePosition.left;
                ele.scrollTop = updatePosition.top;
                break;
            case ScrollDirection.Vertical:
            default:
                ele.scrollTop = updatePosition.top;
                break;
        }
        if (Math.abs(updatePosition.top - targetPosition.top) <= EPS &&
            Math.abs(updatePosition.left - targetPosition.left) <= EPS &&
            !reachTarget) {
            window.cancelAnimationFrame(requestId);
            markTargetReached();
        }
        if (time < duration) {
            requestId = window.requestAnimationFrame(loop);
        }
        else {
            window.cancelAnimationFrame(requestId);
        }
    };
    requestId = window.requestAnimationFrame(loop);
};

var ZERO_OFFSET$6 = {
    left: 0,
    top: 0,
};
var SCROLL_EVENT_OPTIONS = {
    capture: false,
    passive: true,
};
var SCROLL_DURATION = 400;
var useScroll = function (_a) {
    var elementRef = _a.elementRef, enableSmoothScroll = _a.enableSmoothScroll, isRtl = _a.isRtl, scrollDirection = _a.scrollDirection, onSmoothScroll = _a.onSmoothScroll;
    var _b = React.useState(ZERO_OFFSET$6), scrollOffset = _b[0], setScrollOffset = _b[1];
    var _c = React.useState(elementRef.current), element = _c[0], setElement = _c[1];
    var factor = isRtl ? -1 : 1;
    var latestRef = React.useRef(scrollDirection);
    latestRef.current = scrollDirection;
    var latestOffsetRef = React.useRef(ZERO_OFFSET$6);
    var isSmoothScrollingDoneRef = React.useRef(true);
    var handleSmoothScrollingComplete = React.useCallback(function () {
        isSmoothScrollingDoneRef.current = true;
        if (enableSmoothScroll) {
            setScrollOffset(latestOffsetRef.current);
        }
        onSmoothScroll(false);
    }, []);
    var handleScroll = React.useCallback(function () {
        if (!element) {
            return;
        }
        switch (latestRef.current) {
            case ScrollDirection.Horizontal:
                latestOffsetRef.current = {
                    left: factor * element.scrollLeft,
                    top: 0,
                };
                break;
            case ScrollDirection.Both:
                latestOffsetRef.current = {
                    left: factor * element.scrollLeft,
                    top: element.scrollTop,
                };
                break;
            case ScrollDirection.Vertical:
            default:
                latestOffsetRef.current = {
                    left: 0,
                    top: element.scrollTop,
                };
                break;
        }
        if (!enableSmoothScroll || isSmoothScrollingDoneRef.current) {
            setScrollOffset(latestOffsetRef.current);
        }
    }, [element]);
    useIsomorphicLayoutEffect(function () {
        setElement(elementRef.current);
    });
    useIsomorphicLayoutEffect(function () {
        if (!element) {
            return;
        }
        element.addEventListener('scroll', handleScroll, SCROLL_EVENT_OPTIONS);
        return function () {
            element.removeEventListener('scroll', handleScroll, SCROLL_EVENT_OPTIONS);
        };
    }, [element]);
    var scrollTo = React.useCallback(function (targetPosition, withSmoothScroll) {
        var ele = elementRef.current;
        if (!ele) {
            return Promise.resolve();
        }
        var updatePosition = {
            left: 0,
            top: 0,
        };
        switch (latestRef.current) {
            case ScrollDirection.Horizontal:
                updatePosition.left = factor * targetPosition.left;
                break;
            case ScrollDirection.Both:
                updatePosition.left = factor * targetPosition.left;
                updatePosition.top = targetPosition.top;
                break;
            case ScrollDirection.Vertical:
            default:
                updatePosition.top = targetPosition.top;
                break;
        }
        if (withSmoothScroll) {
            isSmoothScrollingDoneRef.current = false;
            onSmoothScroll(true);
            return new Promise(function (resolve, _) {
                smoothScroll(ele, latestRef.current, updatePosition, SCROLL_DURATION, easeOutQuart, function () {
                    handleSmoothScrollingComplete();
                    resolve();
                });
            });
        }
        return new Promise(function (resolve, _) {
            switch (latestRef.current) {
                case ScrollDirection.Horizontal:
                    ele.scrollLeft = updatePosition.left;
                    break;
                case ScrollDirection.Both:
                    ele.scrollLeft = updatePosition.left;
                    ele.scrollTop = updatePosition.top;
                    break;
                case ScrollDirection.Vertical:
                default:
                    ele.scrollTop = updatePosition.top;
                    break;
            }
            resolve();
        });
    }, [elementRef.current]);
    return {
        scrollOffset: scrollOffset,
        scrollTo: scrollTo,
    };
};

var clamp = function (min, max, value) { return Math.max(min, Math.min(value, max)); };

var indexOfMax = function (arr) { return arr.reduce(function (prev, curr, i, a) { return (curr > a[prev] ? i : prev); }, 0); };

var buildContainerStyles = function (totalSize, scrollMode) {
    switch (scrollMode) {
        case ScrollMode.Horizontal:
            return {
                position: 'relative',
                height: '100%',
                width: "".concat(totalSize.width, "px"),
            };
        case ScrollMode.Vertical:
        default:
            return {
                position: 'relative',
                height: "".concat(totalSize.height, "px"),
                width: '100%',
            };
    }
};

var buildItemContainerStyles = function (item, parentRect, scrollMode) {
    return scrollMode !== ScrollMode.Page
        ? {}
        : {
            height: "".concat(parentRect.height, "px"),
            width: '100%',
            position: 'absolute',
            top: 0,
            transform: "translateY(".concat(item.start.top, "px)"),
        };
};

var hasDifferentSizes = function (sizes) {
    var numberOfItems = sizes.length;
    if (numberOfItems === 1) {
        return false;
    }
    for (var i = 1; i < numberOfItems; i++) {
        if (sizes[i].height !== sizes[0].height || sizes[i].width !== sizes[0].width) {
            return true;
        }
    }
    return false;
};
var getMinWidthOfCover = function (sizes, viewMode) {
    if (viewMode !== ViewMode.DualPageWithCover) {
        return 0;
    }
    if (!hasDifferentSizes(sizes)) {
        return 2 * sizes[0].width;
    }
    var chunkWidths = chunk(sizes.slice(1), 2).map(function (eachChunk) {
        return eachChunk.length === 2 ? eachChunk[0].width + eachChunk[1].width : eachChunk[0].width;
    });
    var widths = [sizes[0].width].concat(chunkWidths);
    return Math.max.apply(Math, widths);
};
var buildItemStyles = function (item, isRtl, sizes, viewMode, scrollMode) {
    var _a, _b, _c, _d, _e, _f, _g;
    var sideProperty = isRtl ? 'right' : 'left';
    var factor = isRtl ? -1 : 1;
    var numberOfItems = sizes.length;
    var left = item.start.left * factor;
    var _h = item.size, height = _h.height, width = _h.width;
    if (viewMode === ViewMode.DualPageWithCover) {
        var transformTop = scrollMode === ScrollMode.Page ? 0 : item.start.top;
        if (item.index === 0 || (numberOfItems % 2 === 0 && item.index === numberOfItems - 1)) {
            return _a = {
                    height: "".concat(height, "px"),
                    minWidth: "".concat(getMinWidthOfCover(sizes, viewMode), "px"),
                    width: '100%'
                },
                _a[sideProperty] = 0,
                _a.position = 'absolute',
                _a.top = 0,
                _a.transform = "translate(".concat(left, "px, ").concat(transformTop, "px)"),
                _a;
        }
        return _b = {
                height: "".concat(height, "px"),
                width: "".concat(width, "px")
            },
            _b[sideProperty] = 0,
            _b.position = 'absolute',
            _b.top = 0,
            _b.transform = "translate(".concat(left, "px, ").concat(transformTop, "px)"),
            _b;
    }
    if (viewMode === ViewMode.DualPage) {
        return _c = {
                height: "".concat(height, "px"),
                width: "".concat(width, "px")
            },
            _c[sideProperty] = 0,
            _c.position = 'absolute',
            _c.top = 0,
            _c.transform = "translate(".concat(left, "px, ").concat(scrollMode === ScrollMode.Page ? 0 : item.start.top, "px)"),
            _c;
    }
    switch (scrollMode) {
        case ScrollMode.Horizontal:
            return _d = {
                    height: '100%',
                    width: "".concat(width, "px")
                },
                _d[sideProperty] = 0,
                _d.position = 'absolute',
                _d.top = 0,
                _d.transform = "translateX(".concat(left, "px)"),
                _d;
        case ScrollMode.Page:
            return _e = {
                    height: "".concat(height, "px"),
                    width: "".concat(width, "px")
                },
                _e[sideProperty] = 0,
                _e.position = 'absolute',
                _e.top = 0,
                _e;
        case ScrollMode.Wrapped:
            return _f = {
                    height: "".concat(height, "px"),
                    width: "".concat(width, "px")
                },
                _f[sideProperty] = 0,
                _f.position = 'absolute',
                _f.top = 0,
                _f.transform = "translate(".concat(left, "px, ").concat(item.start.top, "px)"),
                _f;
        case ScrollMode.Vertical:
        default:
            return _g = {
                    height: "".concat(height, "px"),
                    width: '100%'
                },
                _g[sideProperty] = 0,
                _g.position = 'absolute',
                _g.top = 0,
                _g.transform = "translateY(".concat(item.start.top, "px)"),
                _g;
    }
};

var findNearest = function (low, high, value, getItemValue) {
    while (low <= high) {
        var middle = ((low + high) / 2) | 0;
        var currentValue = getItemValue(middle);
        if (currentValue < value) {
            low = middle + 1;
        }
        else if (currentValue > value) {
            high = middle - 1;
        }
        else {
            return middle;
        }
    }
    return low > 0 ? low - 1 : 0;
};

var calculateRange = function (scrollDirection, measurements, outerSize, scrollOffset) {
    var currentOffset = 0;
    switch (scrollDirection) {
        case ScrollDirection.Horizontal:
            currentOffset = scrollOffset.left;
            break;
        case ScrollDirection.Vertical:
        default:
            currentOffset = scrollOffset.top;
            break;
    }
    var size = measurements.length - 1;
    var getOffset = function (index) {
        switch (scrollDirection) {
            case ScrollDirection.Horizontal:
                return measurements[index].start.left;
            case ScrollDirection.Both:
            case ScrollDirection.Vertical:
            default:
                return measurements[index].start.top;
        }
    };
    var start = findNearest(0, size, currentOffset, getOffset);
    if (scrollDirection === ScrollDirection.Both) {
        var startTop = measurements[start].start.top;
        while (start - 1 >= 0 &&
            measurements[start - 1].start.top === startTop &&
            measurements[start - 1].start.left >= scrollOffset.left) {
            start--;
        }
    }
    var end = start;
    while (end <= size) {
        var topLeftCorner = {
            top: measurements[end].start.top - scrollOffset.top,
            left: measurements[end].start.left - scrollOffset.left,
        };
        var visibleSize = {
            height: outerSize.height - topLeftCorner.top,
            width: outerSize.width - topLeftCorner.left,
        };
        if (scrollDirection === ScrollDirection.Horizontal && visibleSize.width < 0) {
            break;
        }
        if (scrollDirection === ScrollDirection.Vertical && visibleSize.height < 0) {
            break;
        }
        if (scrollDirection === ScrollDirection.Both && (visibleSize.width < 0 || visibleSize.height < 0)) {
            break;
        }
        end++;
    }
    return {
        start: start,
        end: end,
    };
};

var ZERO_OFFSET$5 = {
    left: 0,
    top: 0,
};
var measure = function (numberOfItems, parentRect, sizes, scrollMode) {
    var measurements = [];
    var totalWidth = 0;
    var firstOfRow = {
        left: 0,
        top: 0,
    };
    var maxHeight = 0;
    var start = ZERO_OFFSET$5;
    for (var i = 0; i < numberOfItems; i++) {
        var size = sizes[i];
        if (i === 0) {
            totalWidth = size.width;
            firstOfRow = {
                left: 0,
                top: 0,
            };
            maxHeight = size.height;
        }
        else {
            switch (scrollMode) {
                case ScrollMode.Wrapped:
                    totalWidth += size.width;
                    if (totalWidth < parentRect.width) {
                        start = {
                            left: measurements[i - 1].end.left,
                            top: firstOfRow.top,
                        };
                        maxHeight = Math.max(maxHeight, size.height);
                    }
                    else {
                        totalWidth = size.width;
                        start = {
                            left: firstOfRow.left,
                            top: firstOfRow.top + maxHeight,
                        };
                        firstOfRow = {
                            left: start.left,
                            top: start.top,
                        };
                        maxHeight = size.height;
                    }
                    break;
                case ScrollMode.Horizontal:
                case ScrollMode.Vertical:
                default:
                    start = measurements[i - 1].end;
                    break;
            }
        }
        var end = {
            left: start.left + size.width,
            top: start.top + size.height,
        };
        measurements[i] = {
            index: i,
            start: start,
            size: size,
            end: end,
            visibility: -1,
        };
    }
    return measurements;
};

var ZERO_OFFSET$4 = {
    left: 0,
    top: 0,
};
var measureDualPage = function (numberOfItems, parentRect, sizes, scrollMode) {
    var measurements = [];
    var top = 0;
    var maxHeight = 0;
    var start = ZERO_OFFSET$4;
    for (var i = 0; i < numberOfItems; i++) {
        var size = {
            height: scrollMode === ScrollMode.Page ? Math.max(parentRect.height, sizes[i].height) : sizes[i].height,
            width: Math.max(parentRect.width / 2, sizes[i].width),
        };
        if (scrollMode === ScrollMode.Page) {
            start = {
                left: i % 2 === 0 ? 0 : size.width,
                top: Math.floor(i / 2) * size.height,
            };
        }
        else {
            if (i % 2 === 0) {
                top = top + maxHeight;
                start = {
                    left: 0,
                    top: top,
                };
                maxHeight = i === numberOfItems - 1 ? sizes[i].height : Math.max(sizes[i].height, sizes[i + 1].height);
            }
            else {
                start = {
                    left: measurements[i - 1].end.left,
                    top: top,
                };
            }
        }
        var end = {
            left: start.left + size.width,
            top: start.top + size.height,
        };
        measurements[i] = {
            index: i,
            start: start,
            size: size,
            end: end,
            visibility: -1,
        };
    }
    return measurements;
};

var ZERO_OFFSET$3 = {
    left: 0,
    top: 0,
};
var measureDualPageWithCover = function (numberOfItems, parentRect, sizes, scrollMode) {
    var measurements = [];
    var top = 0;
    var maxHeight = 0;
    var start = ZERO_OFFSET$3;
    for (var i = 0; i < numberOfItems; i++) {
        var size = i === 0
            ? {
                height: scrollMode === ScrollMode.Page
                    ? Math.max(parentRect.height, sizes[i].height)
                    : sizes[i].height,
                width: scrollMode === ScrollMode.Page ? Math.max(parentRect.width, sizes[i].width) : sizes[i].width,
            }
            : {
                height: scrollMode === ScrollMode.Page
                    ? Math.max(parentRect.height, sizes[i].height)
                    : sizes[i].height,
                width: Math.max(parentRect.width / 2, sizes[i].width),
            };
        if (scrollMode === ScrollMode.Page) {
            start =
                i === 0
                    ? ZERO_OFFSET$3
                    : {
                        left: i % 2 === 0 ? size.width : 0,
                        top: Math.floor((i - 1) / 2) * size.height + measurements[0].end.top,
                    };
        }
        else {
            if (i === 0) {
                start = ZERO_OFFSET$3;
                top = sizes[0].height;
                maxHeight = 0;
            }
            else if (i % 2 === 1) {
                top = top + maxHeight;
                start = {
                    left: 0,
                    top: top,
                };
                maxHeight = i === numberOfItems - 1 ? sizes[i].height : Math.max(sizes[i].height, sizes[i + 1].height);
            }
            else {
                start = {
                    left: measurements[i - 1].end.left,
                    top: top,
                };
            }
        }
        var end = {
            left: start.left + size.width,
            top: start.top + size.height,
        };
        measurements[i] = {
            index: i,
            start: start,
            size: size,
            end: end,
            visibility: -1,
        };
    }
    return measurements;
};

var ZERO_OFFSET$2 = {
    left: 0,
    top: 0,
};
var measureSinglePage = function (numberOfItems, parentRect, sizes) {
    var measurements = [];
    for (var i = 0; i < numberOfItems; i++) {
        var size = {
            height: Math.max(parentRect.height, sizes[i].height),
            width: Math.max(parentRect.width, sizes[i].width),
        };
        var start = i === 0 ? ZERO_OFFSET$2 : measurements[i - 1].end;
        var end = {
            left: start.left + size.width,
            top: start.top + size.height,
        };
        measurements[i] = {
            index: i,
            start: start,
            size: size,
            end: end,
            visibility: -1,
        };
    }
    return measurements;
};

var ZERO_RECT = {
    height: 0,
    width: 0,
};
var ZERO_OFFSET$1 = {
    left: 0,
    top: 0,
};
var COMPARE_EPSILON = 0.000000000001;
var VIRTUAL_INDEX_ATTR = 'data-virtual-index';
var IO_THRESHOLD = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
var useVirtual = function (_a) {
    var enableSmoothScroll = _a.enableSmoothScroll, isRtl = _a.isRtl, numberOfItems = _a.numberOfItems, parentRef = _a.parentRef, setRenderRange = _a.setRenderRange, sizes = _a.sizes, scrollMode = _a.scrollMode, viewMode = _a.viewMode, onVisibilityChanged = _a.onVisibilityChanged;
    var _b = React.useState(false), isSmoothScrolling = _b[0], setSmoothScrolling = _b[1];
    var onSmoothScroll = React.useCallback(function (isSmoothScrolling) { return setSmoothScrolling(isSmoothScrolling); }, []);
    var scrollModeRef = React.useRef(scrollMode);
    scrollModeRef.current = scrollMode;
    var viewModeRef = React.useRef(viewMode);
    viewModeRef.current = viewMode;
    var scrollDirection = scrollMode === ScrollMode.Wrapped || viewMode === ViewMode.DualPageWithCover || viewMode === ViewMode.DualPage
        ? ScrollDirection.Both
        : scrollMode === ScrollMode.Horizontal
            ? ScrollDirection.Horizontal
            : ScrollDirection.Vertical;
    var _c = useScroll({
        elementRef: parentRef,
        enableSmoothScroll: enableSmoothScroll,
        isRtl: isRtl,
        scrollDirection: scrollDirection,
        onSmoothScroll: onSmoothScroll,
    }), scrollOffset = _c.scrollOffset, scrollTo = _c.scrollTo;
    var parentRect = useMeasureRect({
        elementRef: parentRef,
    });
    var latestRef = React.useRef({
        scrollOffset: ZERO_OFFSET$1,
        measurements: [],
    });
    latestRef.current.scrollOffset = scrollOffset;
    var defaultVisibilities = React.useMemo(function () { return Array(numberOfItems).fill(-1); }, []);
    var _d = React.useState(defaultVisibilities), visibilities = _d[0], setVisibilities = _d[1];
    var intersectionTracker = React.useMemo(function () {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var ratio = entry.isIntersecting ? entry.intersectionRatio : -1;
                var target = entry.target;
                var indexAttribute = target.getAttribute(VIRTUAL_INDEX_ATTR);
                if (!indexAttribute) {
                    return;
                }
                var index = parseInt(indexAttribute, 10);
                if (0 <= index && index < numberOfItems) {
                    onVisibilityChanged(index, ratio);
                    setVisibilities(function (old) {
                        old[index] = ratio;
                        return __spreadArray([], old, true);
                    });
                }
            });
        }, {
            threshold: IO_THRESHOLD,
        });
        return io;
    }, []);
    var measurements = React.useMemo(function () {
        if (scrollMode === ScrollMode.Page && viewMode === ViewMode.SinglePage) {
            return measureSinglePage(numberOfItems, parentRect, sizes);
        }
        if (viewMode === ViewMode.DualPageWithCover) {
            return measureDualPageWithCover(numberOfItems, parentRect, sizes, scrollMode);
        }
        if (viewMode === ViewMode.DualPage) {
            return measureDualPage(numberOfItems, parentRect, sizes, scrollMode);
        }
        return measure(numberOfItems, parentRect, sizes, scrollMode);
    }, [scrollMode, sizes, viewMode, parentRect]);
    var totalSize = measurements[numberOfItems - 1]
        ? {
            height: measurements[numberOfItems - 1].end.top,
            width: measurements[numberOfItems - 1].end.left,
        }
        : ZERO_RECT;
    latestRef.current.measurements = measurements;
    var _e = React.useMemo(function () {
        var _a = calculateRange(scrollDirection, measurements, parentRect, scrollOffset), start = _a.start, end = _a.end;
        var visiblePageVisibilities = visibilities.slice(clamp(0, numberOfItems, start), clamp(0, numberOfItems, end));
        var maxVisbilityItem = start + indexOfMax(visiblePageVisibilities);
        maxVisbilityItem = clamp(0, numberOfItems - 1, maxVisbilityItem);
        var maxVisbilityIndex = maxVisbilityItem;
        var _b = setRenderRange({
            endPage: end,
            numPages: numberOfItems,
            startPage: start,
        }), startPage = _b.startPage, endPage = _b.endPage;
        startPage = Math.max(startPage, 0);
        endPage = Math.min(endPage, numberOfItems - 1);
        switch (viewMode) {
            case ViewMode.DualPageWithCover:
                if (maxVisbilityItem > 0) {
                    maxVisbilityIndex = maxVisbilityItem % 2 === 1 ? maxVisbilityItem : maxVisbilityItem - 1;
                }
                startPage = startPage === 0 ? 0 : startPage % 2 === 1 ? startPage : startPage - 1;
                endPage = endPage % 2 === 1 ? endPage - 1 : endPage;
                if (numberOfItems - endPage <= 2) {
                    endPage = numberOfItems - 1;
                }
                break;
            case ViewMode.DualPage:
                maxVisbilityIndex = maxVisbilityItem % 2 === 0 ? maxVisbilityItem : maxVisbilityItem - 1;
                startPage = startPage % 2 === 0 ? startPage : startPage - 1;
                endPage = endPage % 2 === 1 ? endPage : endPage - 1;
                break;
            case ViewMode.SinglePage:
            default:
                maxVisbilityIndex = maxVisbilityItem;
                break;
        }
        return {
            startPage: startPage,
            endPage: endPage,
            maxVisbilityIndex: maxVisbilityIndex,
        };
    }, [measurements, parentRect, scrollOffset, viewMode, visibilities]), startPage = _e.startPage, endPage = _e.endPage, maxVisbilityIndex = _e.maxVisbilityIndex;
    var virtualItems = React.useMemo(function () {
        var virtualItems = [];
        var _loop_1 = function (i) {
            var item = measurements[i];
            var virtualItem = __assign(__assign({}, item), { visibility: visibilities[i] !== undefined ? visibilities[i] : -1, measureRef: function (ele) {
                    if (!ele) {
                        return;
                    }
                    ele.setAttribute(VIRTUAL_INDEX_ATTR, "".concat(i));
                    intersectionTracker.observe(ele);
                } });
            virtualItems.push(virtualItem);
        };
        for (var i = startPage; i <= endPage; i++) {
            _loop_1(i);
        }
        return virtualItems;
    }, [startPage, endPage, visibilities, measurements]);
    var scrollToItem = React.useCallback(function (index, offset) {
        var measurements = latestRef.current.measurements;
        var normalizedIndex = clamp(0, numberOfItems - 1, index);
        var measurement = measurements[normalizedIndex];
        var withOffset = scrollModeRef.current === ScrollMode.Page ? ZERO_OFFSET$1 : offset;
        return measurement
            ? scrollTo({
                left: withOffset.left + measurement.start.left,
                top: withOffset.top + measurement.start.top,
            }, enableSmoothScroll)
            : Promise.resolve();
    }, [scrollTo, enableSmoothScroll]);
    var scrollToSmallestItemAbove = React.useCallback(function (index, offset) {
        var measurements = latestRef.current.measurements;
        var start = measurements[index].start;
        var nextItem = measurements.find(function (item) { return item.start.top - start.top > COMPARE_EPSILON; });
        if (!nextItem) {
            return Promise.resolve();
        }
        var nextIndex = nextItem.index;
        switch (viewModeRef.current) {
            case ViewMode.DualPage:
                nextIndex = nextIndex % 2 === 0 ? nextIndex : nextIndex + 1;
                break;
            case ViewMode.DualPageWithCover:
                nextIndex = nextIndex % 2 === 1 ? nextIndex : nextIndex + 1;
                break;
        }
        return scrollToItem(nextIndex, offset);
    }, []);
    var scrollToBiggestItemBelow = React.useCallback(function (index, offset) {
        var measurements = latestRef.current.measurements;
        var start = measurements[index].start;
        var prevIndex = index;
        var found = false;
        for (var i = numberOfItems - 1; i >= 0; i--) {
            if (start.top - measurements[i].start.top > COMPARE_EPSILON) {
                found = true;
                prevIndex = measurements[i].index;
                break;
            }
        }
        if (!found) {
            return Promise.resolve();
        }
        switch (viewModeRef.current) {
            case ViewMode.DualPage:
                prevIndex = prevIndex % 2 === 0 ? prevIndex : prevIndex - 1;
                break;
            case ViewMode.DualPageWithCover:
                prevIndex = prevIndex % 2 === 0 ? prevIndex - 1 : prevIndex;
                break;
        }
        if (prevIndex === index) {
            prevIndex = index - 1;
        }
        return scrollToItem(prevIndex, offset);
    }, []);
    var scrollToNextItem = React.useCallback(function (index, offset) {
        if (viewModeRef.current === ViewMode.DualPageWithCover || viewModeRef.current === ViewMode.DualPage) {
            return scrollToSmallestItemAbove(index, offset);
        }
        switch (scrollModeRef.current) {
            case ScrollMode.Wrapped:
                return scrollToSmallestItemAbove(index, offset);
            case ScrollMode.Horizontal:
            case ScrollMode.Vertical:
            default:
                return scrollToItem(index + 1, offset);
        }
    }, []);
    var scrollToPreviousItem = React.useCallback(function (index, offset) {
        if (viewModeRef.current === ViewMode.DualPageWithCover || viewModeRef.current === ViewMode.DualPage) {
            return scrollToBiggestItemBelow(index, offset);
        }
        switch (scrollModeRef.current) {
            case ScrollMode.Wrapped:
                return scrollToBiggestItemBelow(index, offset);
            case ScrollMode.Horizontal:
            case ScrollMode.Vertical:
            default:
                return scrollToItem(index - 1, offset);
        }
    }, []);
    var getContainerStyles = React.useCallback(function () { return buildContainerStyles(totalSize, scrollModeRef.current); }, [totalSize]);
    var getItemContainerStyles = React.useCallback(function (item) { return buildItemContainerStyles(item, parentRect, scrollModeRef.current); }, [parentRect]);
    var getItemStyles = React.useCallback(function (item) { return buildItemStyles(item, isRtl, sizes, viewModeRef.current, scrollModeRef.current); }, [isRtl, sizes]);
    var zoom = React.useCallback(function (scale, index) {
        var _a = latestRef.current, measurements = _a.measurements, scrollOffset = _a.scrollOffset;
        var normalizedIndex = clamp(0, numberOfItems - 1, index);
        var measurement = measurements[normalizedIndex];
        if (measurement) {
            var updateOffset = scrollModeRef.current === ScrollMode.Page
                ? {
                    left: measurement.start.left,
                    top: measurement.start.top,
                }
                : {
                    left: scrollOffset.left * scale,
                    top: scrollOffset.top * scale,
                };
            return scrollTo(updateOffset, false);
        }
        return Promise.resolve();
    }, []);
    React.useEffect(function () {
        return function () {
            intersectionTracker.disconnect();
        };
    }, []);
    return {
        boundingClientRect: parentRect,
        isSmoothScrolling: isSmoothScrolling,
        startPage: startPage,
        endPage: endPage,
        maxVisbilityIndex: maxVisbilityIndex,
        virtualItems: virtualItems,
        getContainerStyles: getContainerStyles,
        getItemContainerStyles: getItemContainerStyles,
        getItemStyles: getItemStyles,
        scrollToItem: scrollToItem,
        scrollToNextItem: scrollToNextItem,
        scrollToPreviousItem: scrollToPreviousItem,
        zoom: zoom,
    };
};

var SCROLL_BAR_WIDTH = 17;
var PAGE_PADDING = 8;
var calculateScale = function (container, pageHeight, pageWidth, scale, viewMode, numPages) {
    var w = pageWidth;
    switch (true) {
        case viewMode === ViewMode.DualPageWithCover && numPages >= 3:
        case viewMode === ViewMode.DualPage && numPages >= 3:
            w = 2 * pageWidth;
            break;
        default:
            w = pageWidth;
            break;
    }
    switch (scale) {
        case SpecialZoomLevel.ActualSize:
            return 1;
        case SpecialZoomLevel.PageFit:
            return Math.min((container.clientWidth - SCROLL_BAR_WIDTH) / w, (container.clientHeight - 2 * PAGE_PADDING) / pageHeight);
        case SpecialZoomLevel.PageWidth:
            return (container.clientWidth - SCROLL_BAR_WIDTH) / w;
    }
};

var useQueue = function (maxLength) {
    var queueRef = React.useRef([]);
    var dequeue = function () {
        var queue = queueRef.current;
        var size = queue.length;
        if (size === 0) {
            return null;
        }
        var firstItem = queue.shift();
        queueRef.current = queue;
        return firstItem || null;
    };
    var enqueue = function (item) {
        var queue = queueRef.current;
        if (queue.length + 1 > maxLength) {
            queue.pop();
        }
        queueRef.current = [item].concat(queue);
    };
    var map = function (transformer) {
        return queueRef.current.map(function (item) { return transformer(item); });
    };
    React.useEffect(function () {
        return function () {
            queueRef.current = [];
        };
    }, []);
    return {
        dequeue: dequeue,
        enqueue: enqueue,
        map: map,
    };
};

var useStack = function (maxLength) {
    var stackRef = React.useRef([]);
    var map = function (transformer) {
        return stackRef.current.map(function (item) { return transformer(item); });
    };
    var pop = function () {
        var stack = stackRef.current;
        var size = stack.length;
        if (size === 0) {
            return null;
        }
        var lastItem = stack.pop();
        stackRef.current = stack;
        return lastItem;
    };
    var push = function (item) {
        var stack = stackRef.current;
        if (stack.length + 1 > maxLength) {
            stack.shift();
        }
        stack.push(item);
        stackRef.current = stack;
    };
    React.useEffect(function () {
        return function () {
            stackRef.current = [];
        };
    }, []);
    return {
        push: push,
        map: map,
        pop: pop,
    };
};

var MAX_QUEUE_LENGTH = 50;
var useDestination = function (_a) {
    var getCurrentPage = _a.getCurrentPage;
    var previousDestinations = useStack(MAX_QUEUE_LENGTH);
    var nextDestinations = useQueue(MAX_QUEUE_LENGTH);
    var getNextDestination = function () {
        var nextDest = nextDestinations.dequeue();
        if (nextDest) {
            previousDestinations.push(nextDest);
        }
        if (nextDest && nextDest.pageIndex === getCurrentPage()) {
            return getNextDestination();
        }
        return nextDest;
    };
    var getPreviousDestination = function () {
        var prevDest = previousDestinations.pop();
        if (prevDest) {
            nextDestinations.enqueue(prevDest);
        }
        if (prevDest && prevDest.pageIndex === getCurrentPage()) {
            return getPreviousDestination();
        }
        return prevDest;
    };
    var markVisitedDestination = React.useCallback(function (destination) {
        previousDestinations.push(destination);
    }, []);
    return {
        getNextDestination: getNextDestination,
        getPreviousDestination: getPreviousDestination,
        markVisitedDestination: markVisitedDestination,
    };
};

var flaternSingleOutline = function (outline) {
    var result = [];
    if (outline.items && outline.items.length > 0) {
        result = result.concat(flaternOutlines(outline.items));
    }
    return result;
};
var flaternOutlines = function (outlines) {
    var result = [];
    outlines.map(function (outline) {
        result = result.concat(outline).concat(flaternSingleOutline(outline));
    });
    return result;
};
var useOutlines = function (doc) {
    var _a = useSafeState([]), outlines = _a[0], setOutlines = _a[1];
    React.useEffect(function () {
        doc.getOutline().then(function (result) {
            if (result !== null) {
                var items = flaternOutlines(result);
                setOutlines(items);
            }
        });
    }, []);
    return outlines;
};

var DEFAULT_PAGE_LAYOUT = {
    buildPageStyles: function () { return ({}); },
    transformSize: function (_a) {
        var size = _a.size;
        return size;
    },
};
var ZERO_OFFSET = {
    left: 0,
    top: 0,
};
var Inner = function (_a) {
    var currentFile = _a.currentFile, defaultScale = _a.defaultScale, doc = _a.doc, enableSmoothScroll = _a.enableSmoothScroll, estimatedPageSizes = _a.estimatedPageSizes, initialPage = _a.initialPage, initialRotation = _a.initialRotation, initialScale = _a.initialScale, initialScrollMode = _a.initialScrollMode, initialViewMode = _a.initialViewMode, pageLayout = _a.pageLayout, plugins = _a.plugins, renderPage = _a.renderPage, setRenderRange = _a.setRenderRange, viewerState = _a.viewerState, onDocumentLoad = _a.onDocumentLoad, onOpenFile = _a.onOpenFile, onPageChange = _a.onPageChange, onRotate = _a.onRotate, onRotatePage = _a.onRotatePage, onZoom = _a.onZoom;
    var numPages = doc.numPages;
    var docId = doc.loadingTask.docId;
    var l10n = React.useContext(LocalizationContext).l10n;
    var themeContext = React.useContext(ThemeContext);
    var isRtl = themeContext.direction === TextDirection.RightToLeft;
    var containerRef = React.useRef();
    var pagesRef = React.useRef();
    var destinationManager = useDestination({
        getCurrentPage: function () { return stateRef.current.pageIndex; },
    });
    var _b = React.useState(false), pagesRotationChanged = _b[0], setPagesRotationChanged = _b[1];
    var outlines = useOutlines(doc);
    var stateRef = React.useRef(viewerState);
    var keepSpecialZoomLevelRef = React.useRef(typeof defaultScale === 'string' ? defaultScale : null);
    var forceTargetPageRef = React.useRef({
        targetPage: -1,
        zoomRatio: 1,
    });
    var forceTargetZoomRef = React.useRef(-1);
    var forceTargetInitialPageRef = React.useRef(initialPage);
    var fullScreen = useFullScreen({
        targetRef: pagesRef,
    });
    var _c = React.useState(-1), renderPageIndex = _c[0], setRenderPageIndex = _c[1];
    var _d = React.useState(0), renderQueueKey = _d[0], setRenderQueueKey = _d[1];
    var renderQueue = useRenderQueue({ doc: doc });
    React.useEffect(function () {
        return function () {
            clearPagesCache();
        };
    }, [docId]);
    var layoutBuilder = React.useMemo(function () { return Object.assign({}, DEFAULT_PAGE_LAYOUT, pageLayout); }, []);
    var _e = React.useState(false), areSizesCalculated = _e[0], setSizesCalculated = _e[1];
    var _f = React.useState(estimatedPageSizes), pageSizes = _f[0], setPageSizes = _f[1];
    var _g = React.useState(0), currentPage = _g[0], setCurrentPage = _g[1];
    var _h = React.useState(new Map()), pagesRotation = _h[0], setPagesRotation = _h[1];
    var _j = React.useState(initialRotation), rotation = _j[0], setRotation = _j[1];
    var _k = React.useState(initialScale), scale = _k[0], setScale = _k[1];
    var _l = React.useState(initialScrollMode), scrollMode = _l[0], setScrollMode = _l[1];
    var _m = React.useState(initialViewMode), viewMode = _m[0], setViewMode = _m[1];
    var sizes = React.useMemo(function () {
        return Array(numPages)
            .fill(0)
            .map(function (_, pageIndex) {
            var pageHeight = pageSizes[pageIndex].pageHeight;
            var pageWidth = pageSizes[pageIndex].pageWidth;
            var rect = Math.abs(rotation) % 180 === 0
                ? {
                    height: pageHeight,
                    width: pageWidth,
                }
                : {
                    height: pageWidth,
                    width: pageHeight,
                };
            var pageRect = {
                height: rect.height * scale,
                width: rect.width * scale,
            };
            return layoutBuilder.transformSize({ numPages: numPages, pageIndex: pageIndex, size: pageRect });
        });
    }, [rotation, scale, pageSizes]);
    var handleVisibilityChanged = React.useCallback(function (pageIndex, visibility) {
        renderQueue.setVisibility(pageIndex, visibility);
    }, []);
    var virtualizer = useVirtual({
        enableSmoothScroll: enableSmoothScroll,
        isRtl: isRtl,
        numberOfItems: numPages,
        parentRef: pagesRef,
        scrollMode: scrollMode,
        setRenderRange: setRenderRange,
        sizes: sizes,
        viewMode: viewMode,
        onVisibilityChanged: handleVisibilityChanged,
    });
    var handlePagesResize = useDebounceCallback(function () {
        if (!keepSpecialZoomLevelRef.current ||
            stateRef.current.fullScreenMode !== FullScreenMode.Normal ||
            (initialPage > 0 && forceTargetInitialPageRef.current === initialPage)) {
            return;
        }
        zoom(keepSpecialZoomLevelRef.current);
    }, 200);
    useTrackResize({
        targetRef: pagesRef,
        onResize: handlePagesResize,
    });
    var setViewerState = function (viewerState) {
        var newState = viewerState;
        var transformState = function (plugin) {
            if (plugin.dependencies) {
                plugin.dependencies.forEach(function (dep) { return transformState(dep); });
            }
            if (plugin.onViewerStateChange) {
                newState = plugin.onViewerStateChange(newState);
            }
        };
        plugins.forEach(function (plugin) { return transformState(plugin); });
        stateRef.current = newState;
    };
    var getPagesContainer = function () { return pagesRef.current; };
    var getViewerState = function () { return stateRef.current; };
    var jumpToDestination = React.useCallback(function (destination) {
        destinationManager.markVisitedDestination(destination);
        return handleJumpToDestination(destination);
    }, []);
    var jumpToNextDestination = React.useCallback(function () {
        var nextDestination = destinationManager.getNextDestination();
        return nextDestination ? handleJumpToDestination(nextDestination) : Promise.resolve();
    }, []);
    var jumpToPreviousDestination = React.useCallback(function () {
        var lastDestination = destinationManager.getPreviousDestination();
        return lastDestination ? handleJumpToDestination(lastDestination) : Promise.resolve();
    }, []);
    var jumpToNextPage = React.useCallback(function () { return virtualizer.scrollToNextItem(stateRef.current.pageIndex, ZERO_OFFSET); }, []);
    var jumpToPage = React.useCallback(function (pageIndex) {
        return 0 <= pageIndex && pageIndex < numPages
            ? new Promise(function (resolve) {
                virtualizer.scrollToItem(pageIndex, ZERO_OFFSET).then(function () {
                    setRenderPageIndex(pageIndex);
                    resolve();
                });
            })
            : Promise.resolve();
    }, []);
    var jumpToPreviousPage = React.useCallback(function () { return virtualizer.scrollToPreviousItem(stateRef.current.pageIndex, ZERO_OFFSET); }, []);
    var openFile = React.useCallback(function (file) {
        if (getFileExt(file.name).toLowerCase() !== 'pdf') {
            return;
        }
        new Promise(function (resolve) {
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function () {
                var bytes = new Uint8Array(reader.result);
                resolve(bytes);
            };
        }).then(function (data) {
            onOpenFile(file.name, data);
        });
    }, [onOpenFile]);
    var rotate = React.useCallback(function (direction) {
        var rotation = stateRef.current.rotation;
        var degrees = direction === RotateDirection.Backward ? -90 : 90;
        var updateRotation = rotation === 360 || rotation === -360 ? degrees : rotation + degrees;
        renderQueue.markNotRendered();
        setRotation(updateRotation);
        setViewerState(__assign(__assign({}, stateRef.current), { rotation: updateRotation }));
        onRotate({ direction: direction, doc: doc, rotation: updateRotation });
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
    }, []);
    var rotatePage = React.useCallback(function (pageIndex, direction) {
        var degrees = direction === RotateDirection.Backward ? -90 : 90;
        var rotations = stateRef.current.pagesRotation;
        var currentPageRotation = rotations.has(pageIndex) ? rotations.get(pageIndex) : initialRotation;
        var finalRotation = currentPageRotation + degrees;
        var updateRotations = rotations.set(pageIndex, finalRotation);
        setPagesRotationChanged(function (value) { return !value; });
        setPagesRotation(updateRotations);
        setViewerState(__assign(__assign({}, stateRef.current), { pagesRotation: updateRotations, rotatedPage: pageIndex }));
        onRotatePage({
            direction: direction,
            doc: doc,
            pageIndex: pageIndex,
            rotation: finalRotation,
        });
        renderQueue.markRendering(pageIndex);
        setRenderPageIndex(pageIndex);
    }, []);
    var switchScrollMode = React.useCallback(function (newScrollMode) {
        renderQueue.markNotRendered();
        setScrollMode(newScrollMode);
        setViewerState(__assign(__assign({}, stateRef.current), { scrollMode: newScrollMode }));
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
    }, []);
    var switchViewMode = React.useCallback(function (newViewMode) {
        renderQueue.markNotRendered();
        setViewMode(newViewMode);
        setViewerState(__assign(__assign({}, stateRef.current), { viewMode: newViewMode }));
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
    }, []);
    var zoom = React.useCallback(function (newScale) {
        var pagesEle = pagesRef.current;
        var currentPage = stateRef.current.pageIndex;
        if (currentPage < 0 || currentPage >= numPages) {
            return;
        }
        var currentPageHeight = pageSizes[currentPage].pageHeight;
        var currentPageWidth = pageSizes[currentPage].pageWidth;
        var updateScale = pagesEle
            ? typeof newScale === 'string'
                ? calculateScale(pagesEle, currentPageHeight, currentPageWidth, newScale, stateRef.current.viewMode, numPages)
                : newScale
            : 1;
        keepSpecialZoomLevelRef.current = typeof newScale === 'string' ? newScale : null;
        if (updateScale === stateRef.current.scale) {
            return;
        }
        setRenderQueueKey(function (key) { return key + 1; });
        renderQueue.markNotRendered();
        var previousScale = stateRef.current.scale;
        setViewerState(__assign(__assign({}, stateRef.current), { scale: updateScale }));
        setScale(updateScale);
        onZoom({ doc: doc, scale: updateScale });
        forceTargetPageRef.current = {
            targetPage: currentPage,
            zoomRatio: updateScale / previousScale,
        };
    }, []);
    var enterFullScreenMode = React.useCallback(function (target) {
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
        fullScreen.enterFullScreenMode(target);
    }, []);
    var exitFullScreenMode = React.useCallback(function () {
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
        fullScreen.exitFullScreenMode();
    }, []);
    React.useEffect(function () {
        setViewerState(__assign(__assign({}, stateRef.current), { fullScreenMode: fullScreen.fullScreenMode }));
    }, [fullScreen.fullScreenMode]);
    var handlePageRenderCompleted = React.useCallback(function (pageIndex) {
        renderQueue.markRendered(pageIndex);
        if (areSizesCalculated) {
            return;
        }
        var queryPageSizes = Array(doc.numPages)
            .fill(0)
            .map(function (_, i) {
            return new Promise(function (resolvePageSize) {
                getPage(doc, i).then(function (pdfPage) {
                    var viewport = pdfPage.getViewport({ scale: 1 });
                    resolvePageSize({
                        pageHeight: viewport.height,
                        pageWidth: viewport.width,
                        rotation: viewport.rotation,
                    });
                });
            });
        });
        Promise.all(queryPageSizes).then(function (pageSizes) {
            setSizesCalculated(true);
            setPageSizes(pageSizes);
            if (initialPage !== 0) {
                jumpToPage(initialPage);
            }
        });
    }, [areSizesCalculated]);
    var handleJumpFromLinkAnnotation = React.useCallback(function (destination) {
        destinationManager.markVisitedDestination(destination);
    }, []);
    var handleJumpToDestination = React.useCallback(function (destination) {
        var pageIndex = destination.pageIndex, bottomOffset = destination.bottomOffset, leftOffset = destination.leftOffset, scaleTo = destination.scaleTo;
        var pagesContainer = pagesRef.current;
        var currentState = stateRef.current;
        if (!pagesContainer || !currentState) {
            return Promise.resolve();
        }
        return new Promise(function (resolve, _) {
            getPage(doc, pageIndex).then(function (page) {
                var viewport = page.getViewport({ scale: 1 });
                var top = 0;
                var bottom = (typeof bottomOffset === 'function'
                    ? bottomOffset(viewport.width, viewport.height)
                    : bottomOffset) || 0;
                var left = (typeof leftOffset === 'function' ? leftOffset(viewport.width, viewport.height) : leftOffset) ||
                    0;
                var updateScale = currentState.scale;
                switch (scaleTo) {
                    case SpecialZoomLevel.PageFit:
                        top = 0;
                        left = 0;
                        zoom(SpecialZoomLevel.PageFit);
                        break;
                    case SpecialZoomLevel.PageWidth:
                        updateScale = calculateScale(pagesContainer, pageSizes[pageIndex].pageHeight, pageSizes[pageIndex].pageWidth, SpecialZoomLevel.PageWidth, viewMode, numPages);
                        top = (viewport.height - bottom) * updateScale;
                        left = left * updateScale;
                        zoom(updateScale);
                        break;
                    default:
                        top = (viewport.height - bottom) * updateScale;
                        left = left * updateScale;
                        break;
                }
                switch (currentState.scrollMode) {
                    case ScrollMode.Horizontal:
                        virtualizer.scrollToItem(pageIndex, { left: left, top: 0 }).then(function () {
                            resolve();
                        });
                        break;
                    case ScrollMode.Vertical:
                    default:
                        virtualizer.scrollToItem(pageIndex, { left: 0, top: top }).then(function () {
                            resolve();
                        });
                        break;
                }
            });
        });
    }, [pageSizes]);
    React.useEffect(function () {
        var pluginMethods = {
            enterFullScreenMode: enterFullScreenMode,
            exitFullScreenMode: exitFullScreenMode,
            getPagesContainer: getPagesContainer,
            getViewerState: getViewerState,
            jumpToDestination: jumpToDestination,
            jumpToNextDestination: jumpToNextDestination,
            jumpToPreviousDestination: jumpToPreviousDestination,
            jumpToNextPage: jumpToNextPage,
            jumpToPreviousPage: jumpToPreviousPage,
            jumpToPage: jumpToPage,
            openFile: openFile,
            rotate: rotate,
            rotatePage: rotatePage,
            setViewerState: setViewerState,
            switchScrollMode: switchScrollMode,
            switchViewMode: switchViewMode,
            zoom: zoom,
        };
        var installPlugin = function (plugin) {
            if (plugin.dependencies) {
                plugin.dependencies.forEach(function (dep) { return installPlugin(dep); });
            }
            if (plugin.install) {
                plugin.install(pluginMethods);
            }
        };
        var uninstallPlugin = function (plugin) {
            if (plugin.dependencies) {
                plugin.dependencies.forEach(function (dep) { return uninstallPlugin(dep); });
            }
            if (plugin.uninstall) {
                plugin.uninstall(pluginMethods);
            }
        };
        plugins.forEach(function (plugin) { return installPlugin(plugin); });
        return function () {
            plugins.forEach(function (plugin) { return uninstallPlugin(plugin); });
        };
    }, [docId]);
    React.useEffect(function () {
        var documentLoadProps = { doc: doc, file: currentFile };
        onDocumentLoad(documentLoadProps);
        var handleDocumentLoad = function (plugin) {
            if (plugin.dependencies) {
                plugin.dependencies.forEach(function (dep) { return handleDocumentLoad(dep); });
            }
            if (plugin.onDocumentLoad) {
                plugin.onDocumentLoad(documentLoadProps);
            }
        };
        plugins.forEach(function (plugin) { return handleDocumentLoad(plugin); });
    }, [docId]);
    React.useEffect(function () {
        if (fullScreen.fullScreenMode === FullScreenMode.Entered && keepSpecialZoomLevelRef.current) {
            forceTargetZoomRef.current = stateRef.current.pageIndex;
            zoom(keepSpecialZoomLevelRef.current);
        }
    }, [fullScreen.fullScreenMode]);
    var executeNamedAction = function (action) {
        var previousPage = currentPage - 1;
        var nextPage = currentPage + 1;
        switch (action) {
            case 'FirstPage':
                jumpToPage(0);
                break;
            case 'LastPage':
                jumpToPage(numPages - 1);
                break;
            case 'NextPage':
                nextPage < numPages && jumpToPage(nextPage);
                break;
            case 'PrevPage':
                previousPage >= 0 && jumpToPage(previousPage);
                break;
        }
    };
    React.useEffect(function () {
        if (fullScreen.fullScreenMode === FullScreenMode.Entering ||
            fullScreen.fullScreenMode === FullScreenMode.Exitting ||
            virtualizer.isSmoothScrolling) {
            return;
        }
        var startPage = virtualizer.startPage, endPage = virtualizer.endPage, maxVisbilityIndex = virtualizer.maxVisbilityIndex;
        var updateCurrentPage = maxVisbilityIndex;
        var isFullScreen = fullScreen.fullScreenMode === FullScreenMode.Entered;
        if (isFullScreen &&
            updateCurrentPage !== forceTargetPageRef.current.targetPage &&
            forceTargetPageRef.current.targetPage > -1) {
            return;
        }
        if (isFullScreen && updateCurrentPage !== forceTargetZoomRef.current && forceTargetZoomRef.current > -1) {
            return;
        }
        var previousCurrentPage = stateRef.current.pageIndex;
        setCurrentPage(updateCurrentPage);
        setViewerState(__assign(__assign({}, stateRef.current), { pageIndex: updateCurrentPage }));
        if (updateCurrentPage !== previousCurrentPage && !virtualizer.isSmoothScrolling) {
            onPageChange({ currentPage: updateCurrentPage, doc: doc });
        }
        renderQueue.setRange(startPage, endPage);
    }, [
        virtualizer.startPage,
        virtualizer.endPage,
        virtualizer.isSmoothScrolling,
        virtualizer.maxVisbilityIndex,
        fullScreen.fullScreenMode,
        pagesRotationChanged,
        rotation,
        scale,
    ]);
    var renderNextPageInQueue = useAnimationFrame(function () {
        if (stateRef.current.fullScreenMode === FullScreenMode.Entering ||
            stateRef.current.fullScreenMode === FullScreenMode.Exitting) {
            return;
        }
        var _a = forceTargetPageRef.current, targetPage = _a.targetPage, zoomRatio = _a.zoomRatio;
        if (targetPage !== -1) {
            var promise = zoomRatio === 1
                ?
                    jumpToPage(targetPage)
                :
                    virtualizer.zoom(zoomRatio, targetPage);
            promise.then(function () {
                forceTargetPageRef.current = {
                    targetPage: -1,
                    zoomRatio: 1,
                };
            });
            return;
        }
        var nextPage = renderQueue.getHighestPriorityPage();
        if (nextPage > -1 && renderQueue.isInRange(nextPage)) {
            renderQueue.markRendering(nextPage);
            setRenderPageIndex(nextPage);
        }
    }, true, [])[0];
    React.useEffect(function () {
        renderNextPageInQueue();
    }, []);
    var renderViewer = function () {
        var virtualItems = virtualizer.virtualItems;
        var chunks = [];
        switch (viewMode) {
            case ViewMode.DualPage:
                chunks = chunk(virtualItems, 2);
                break;
            case ViewMode.DualPageWithCover:
                if (virtualItems.length) {
                    chunks =
                        virtualItems[0].index === 0
                            ? [[virtualItems[0]]].concat(chunk(virtualItems.slice(1), 2))
                            : chunk(virtualItems, 2);
                }
                break;
            case ViewMode.SinglePage:
            default:
                chunks = chunk(virtualItems, 1);
                break;
        }
        var pageLabel = l10n && l10n.core ? l10n.core.pageLabel : 'Page {{pageIndex}}';
        var slot = {
            attrs: {
                className: 'rpv-core__inner-container',
                'data-testid': 'core__inner-container',
                ref: containerRef,
                style: {
                    height: '100%',
                },
            },
            children: React.createElement(React.Fragment, null),
            subSlot: {
                attrs: {
                    'data-testid': 'core__inner-pages',
                    className: classNames({
                        'rpv-core__inner-pages': true,
                        'rpv-core__inner-pages--horizontal': scrollMode === ScrollMode.Horizontal,
                        'rpv-core__inner-pages--rtl': isRtl,
                        'rpv-core__inner-pages--single': scrollMode === ScrollMode.Page,
                        'rpv-core__inner-pages--vertical': scrollMode === ScrollMode.Vertical,
                        'rpv-core__inner-pages--wrapped': scrollMode === ScrollMode.Wrapped,
                    }),
                    ref: pagesRef,
                    style: {
                        height: '100%',
                        position: 'relative',
                    },
                },
                children: (React.createElement("div", { "data-testid": "core__inner-current-page-".concat(currentPage), style: Object.assign({
                        '--scale-factor': scale,
                    }, virtualizer.getContainerStyles()) }, chunks.map(function (items) { return (React.createElement("div", { className: classNames({
                        'rpv-core__inner-page-container': true,
                        'rpv-core__inner-page-container--single': scrollMode === ScrollMode.Page,
                    }), style: virtualizer.getItemContainerStyles(items[0]), key: "".concat(items[0].index, "-").concat(viewMode, "-").concat(scrollMode) }, items.map(function (item) {
                    var isCover = viewMode === ViewMode.DualPageWithCover &&
                        (item.index === 0 || (numPages % 2 === 0 && item.index === numPages - 1));
                    return (React.createElement("div", { "aria-label": pageLabel.replace('{{pageIndex}}', "".concat(item.index + 1)), className: classNames({
                            'rpv-core__inner-page': true,
                            'rpv-core__inner-page--dual-even': viewMode === ViewMode.DualPage && item.index % 2 === 0,
                            'rpv-core__inner-page--dual-odd': viewMode === ViewMode.DualPage && item.index % 2 === 1,
                            'rpv-core__inner-page--dual-cover': isCover,
                            'rpv-core__inner-page--dual-cover-even': viewMode === ViewMode.DualPageWithCover &&
                                !isCover &&
                                item.index % 2 === 0,
                            'rpv-core__inner-page--dual-cover-odd': viewMode === ViewMode.DualPageWithCover &&
                                !isCover &&
                                item.index % 2 === 1,
                            'rpv-core__inner-page--single': viewMode === ViewMode.SinglePage && scrollMode === ScrollMode.Page,
                        }), role: "region", key: "".concat(item.index, "-").concat(viewMode), style: Object.assign({}, virtualizer.getItemStyles(item), layoutBuilder.buildPageStyles({
                            numPages: numPages,
                            pageIndex: item.index,
                            scrollMode: scrollMode,
                            viewMode: viewMode,
                        })) },
                        React.createElement(PageLayer, { doc: doc, measureRef: item.measureRef, outlines: outlines, pageIndex: item.index, pageRotation: pagesRotation.has(item.index) ? pagesRotation.get(item.index) : 0, pageSize: pageSizes[item.index], plugins: plugins, renderPage: renderPage, renderQueueKey: renderQueueKey, rotation: rotation, scale: scale, shouldRender: renderPageIndex === item.index, viewMode: viewMode, onExecuteNamedAction: executeNamedAction, onJumpFromLinkAnnotation: handleJumpFromLinkAnnotation, onJumpToDest: jumpToDestination, onRenderCompleted: handlePageRenderCompleted, onRotatePage: rotatePage })));
                }))); }))),
            },
        };
        var renderViewerProps = {
            containerRef: containerRef,
            doc: doc,
            pagesContainerRef: pagesRef,
            pagesRotation: pagesRotation,
            pageSizes: pageSizes,
            rotation: rotation,
            slot: slot,
            themeContext: themeContext,
            jumpToPage: jumpToPage,
            openFile: openFile,
            rotate: rotate,
            rotatePage: rotatePage,
            switchScrollMode: switchScrollMode,
            switchViewMode: switchViewMode,
            zoom: zoom,
        };
        var transformSlot = function (plugin) {
            if (plugin.dependencies) {
                plugin.dependencies.forEach(function (dep) { return transformSlot(dep); });
            }
            if (plugin.renderViewer) {
                slot = plugin.renderViewer(__assign(__assign({}, renderViewerProps), { slot: slot }));
            }
        };
        plugins.forEach(function (plugin) { return transformSlot(plugin); });
        return slot;
    };
    var renderSlot = React.useCallback(function (slot) { return (React.createElement("div", __assign({}, slot.attrs, { style: slot.attrs && slot.attrs.style ? slot.attrs.style : {} }),
        slot.children,
        slot.subSlot && renderSlot(slot.subSlot))); }, []);
    return renderSlot(renderViewer());
};

var LEVELS = [
    0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.4, 2.7, 3.0, 3.3, 3.7, 4.1, 4.6,
    5.1, 5.7, 6.3, 7.0, 7.7, 8.5, 9.4, 10,
];
var decrease = function (currentLevel) {
    var found = LEVELS.findIndex(function (item) { return item >= currentLevel; });
    return found === -1 || found === 0 ? currentLevel : LEVELS[found - 1];
};

var RESERVE_HEIGHT = 45;
var RESERVE_WIDTH = 45;
var PageSizeCalculator = function (_a) {
    var defaultScale = _a.defaultScale, doc = _a.doc, render = _a.render, scrollMode = _a.scrollMode, viewMode = _a.viewMode;
    var pagesRef = React.useRef();
    var _b = React.useState({
        estimatedPageSizes: [],
        scale: 0,
    }), state = _b[0], setState = _b[1];
    React.useLayoutEffect(function () {
        getPage(doc, 0).then(function (pdfPage) {
            var viewport = pdfPage.getViewport({ scale: 1 });
            var pagesEle = pagesRef.current;
            if (!pagesEle) {
                return;
            }
            var w = viewport.width;
            var h = viewport.height;
            var parentEle = pagesEle.parentElement;
            var scaleWidth = (parentEle.clientWidth - RESERVE_WIDTH) / w;
            var scaleHeight = (parentEle.clientHeight - RESERVE_HEIGHT) / h;
            var scaled = scaleWidth;
            switch (scrollMode) {
                case ScrollMode.Horizontal:
                    scaled = Math.min(scaleWidth, scaleHeight);
                    break;
                case ScrollMode.Vertical:
                default:
                    scaled = scaleWidth;
                    break;
            }
            var scale = defaultScale
                ? typeof defaultScale === 'string'
                    ? calculateScale(parentEle, h, w, defaultScale, viewMode, doc.numPages)
                    : defaultScale
                : decrease(scaled);
            var estimatedPageSizes = Array(doc.numPages)
                .fill(0)
                .map(function (_) { return ({
                pageHeight: viewport.height,
                pageWidth: viewport.width,
                rotation: viewport.rotation,
            }); });
            setState({ estimatedPageSizes: estimatedPageSizes, scale: scale });
        });
    }, [doc.loadingTask.docId]);
    return state.estimatedPageSizes.length === 0 || state.scale === 0 ? (React.createElement("div", { className: "rpv-core__page-size-calculator", "data-testid": "core__page-size-calculating", ref: pagesRef },
        React.createElement(Spinner, null))) : (render(state.estimatedPageSizes, state.scale));
};

var PasswordStatus;
(function (PasswordStatus) {
    PasswordStatus["RequiredPassword"] = "RequiredPassword";
    PasswordStatus["WrongPassword"] = "WrongPassword";
})(PasswordStatus || (PasswordStatus = {}));

var LoadingStatus = (function () {
    function LoadingStatus() {
    }
    return LoadingStatus;
}());

var AskForPasswordState = (function (_super) {
    __extends(AskForPasswordState, _super);
    function AskForPasswordState(verifyPassword, passwordStatus) {
        var _this = _super.call(this) || this;
        _this.verifyPassword = verifyPassword;
        _this.passwordStatus = passwordStatus;
        return _this;
    }
    return AskForPasswordState;
}(LoadingStatus));

var PrimaryButton = function (_a) {
    var children = _a.children, testId = _a.testId, onClick = _a.onClick;
    var direction = React.useContext(ThemeContext).direction;
    var isRtl = direction === TextDirection.RightToLeft;
    var attrs = testId ? { 'data-testid': testId } : {};
    return (React.createElement("button", __assign({ className: classNames({
            'rpv-core__primary-button': true,
            'rpv-core__primary-button--rtl': isRtl,
        }), type: "button", onClick: onClick }, attrs), children));
};

var TextBox = function (_a) {
    var _b = _a.ariaLabel, ariaLabel = _b === void 0 ? '' : _b, _c = _a.autoFocus, autoFocus = _c === void 0 ? false : _c, _d = _a.placeholder, placeholder = _d === void 0 ? '' : _d, testId = _a.testId, _e = _a.type, type = _e === void 0 ? 'text' : _e, _f = _a.value, value = _f === void 0 ? '' : _f, onChange = _a.onChange, _g = _a.onKeyDown, onKeyDown = _g === void 0 ? function () { } : _g;
    var direction = React.useContext(ThemeContext).direction;
    var textboxRef = React.useRef();
    var isRtl = direction === TextDirection.RightToLeft;
    var attrs = {
        ref: textboxRef,
        'data-testid': '',
        'aria-label': ariaLabel,
        className: classNames({
            'rpv-core__textbox': true,
            'rpv-core__textbox--rtl': isRtl,
        }),
        placeholder: placeholder,
        value: value,
        onChange: function (e) { return onChange(e.target.value); },
        onKeyDown: onKeyDown,
    };
    if (testId) {
        attrs['data-testid'] = testId;
    }
    useIsomorphicLayoutEffect(function () {
        if (autoFocus) {
            var textboxEle = textboxRef.current;
            if (textboxEle) {
                var x = window.scrollX;
                var y = window.scrollY;
                textboxEle.focus();
                window.scrollTo(x, y);
            }
        }
    }, []);
    return type === 'text' ? React.createElement("input", __assign({ type: "text" }, attrs)) : React.createElement("input", __assign({ type: "password" }, attrs));
};

var AskingPassword = function (_a) {
    var passwordStatus = _a.passwordStatus, renderProtectedView = _a.renderProtectedView, verifyPassword = _a.verifyPassword, onDocumentAskPassword = _a.onDocumentAskPassword;
    var l10n = React.useContext(LocalizationContext).l10n;
    var _b = React.useState(''), password = _b[0], setPassword = _b[1];
    var direction = React.useContext(ThemeContext).direction;
    var isRtl = direction === TextDirection.RightToLeft;
    var submit = function () { return verifyPassword(password); };
    var handleKeyDown = function (e) {
        if (e.key === 'Enter') {
            submit();
        }
    };
    React.useEffect(function () {
        if (onDocumentAskPassword) {
            onDocumentAskPassword({
                verifyPassword: verifyPassword,
            });
        }
    }, []);
    if (renderProtectedView) {
        return renderProtectedView({
            passwordStatus: passwordStatus,
            verifyPassword: verifyPassword,
        });
    }
    return (React.createElement("div", { className: "rpv-core__asking-password-wrapper" },
        React.createElement("div", { className: classNames({
                'rpv-core__asking-password': true,
                'rpv-core__asking-password--rtl': isRtl,
            }) },
            React.createElement("div", { className: "rpv-core__asking-password-message" },
                passwordStatus === PasswordStatus.RequiredPassword &&
                    l10n.core.askingPassword
                        .requirePasswordToOpen,
                passwordStatus === PasswordStatus.WrongPassword &&
                    l10n.core.wrongPassword.tryAgain),
            React.createElement("div", { className: "rpv-core__asking-password-body" },
                React.createElement("div", { className: classNames({
                        'rpv-core__asking-password-input': true,
                        'rpv-core__asking-password-input--ltr': !isRtl,
                        'rpv-core__asking-password-input--rtl': isRtl,
                    }) },
                    React.createElement(TextBox, { testId: "core__asking-password-input", type: "password", value: password, onChange: setPassword, onKeyDown: handleKeyDown })),
                React.createElement(PrimaryButton, { onClick: submit }, l10n.core.askingPassword.submit)))));
};

var CompletedState = (function (_super) {
    __extends(CompletedState, _super);
    function CompletedState(doc) {
        var _this = _super.call(this) || this;
        _this.doc = doc;
        return _this;
    }
    return CompletedState;
}(LoadingStatus));

var FailureState = (function (_super) {
    __extends(FailureState, _super);
    function FailureState(error) {
        var _this = _super.call(this) || this;
        _this.error = error;
        return _this;
    }
    return FailureState;
}(LoadingStatus));

var LoadingState = (function (_super) {
    __extends(LoadingState, _super);
    function LoadingState(percentages) {
        var _this = _super.call(this) || this;
        _this.percentages = percentages;
        return _this;
    }
    return LoadingState;
}(LoadingStatus));

var DocumentLoader = function (_a) {
    var characterMap = _a.characterMap, file = _a.file, httpHeaders = _a.httpHeaders, render = _a.render, renderError = _a.renderError, renderLoader = _a.renderLoader, renderProtectedView = _a.renderProtectedView, transformGetDocumentParams = _a.transformGetDocumentParams, withCredentials = _a.withCredentials, onDocumentAskPassword = _a.onDocumentAskPassword;
    var pdfJsApiProvider = React.useContext(PdfJsApiContext).pdfJsApiProvider;
    var direction = React.useContext(ThemeContext).direction;
    var isRtl = direction === TextDirection.RightToLeft;
    var _b = useSafeState(new LoadingState(0)), status = _b[0], setStatus = _b[1];
    var docRef = React.useRef('');
    React.useEffect(function () {
        docRef.current = '';
        setStatus(new LoadingState(0));
        var worker = new pdfJsApiProvider.PDFWorker({ name: "PDFWorker_".concat(Date.now()) });
        var params = Object.assign({
            httpHeaders: httpHeaders,
            withCredentials: withCredentials,
            worker: worker,
        }, 'string' === typeof file ? { url: file } : { data: file }, characterMap
            ? {
                cMapUrl: characterMap.url,
                cMapPacked: characterMap.isCompressed,
            }
            : {});
        var transformParams = transformGetDocumentParams ? transformGetDocumentParams(params) : params;
        var loadingTask = pdfJsApiProvider.getDocument(transformParams);
        loadingTask.onPassword = function (verifyPassword, reason) {
            switch (reason) {
                case pdfJsApiProvider.PasswordResponses.NEED_PASSWORD:
                    setStatus(new AskForPasswordState(verifyPassword, PasswordStatus.RequiredPassword));
                    break;
                case pdfJsApiProvider.PasswordResponses.INCORRECT_PASSWORD:
                    setStatus(new AskForPasswordState(verifyPassword, PasswordStatus.WrongPassword));
                    break;
            }
        };
        loadingTask.onProgress = function (progress) {
            var loaded = progress.total > 0
                ?
                    Math.min(100, (100 * progress.loaded) / progress.total)
                : 100;
            if (docRef.current === '') {
                setStatus(new LoadingState(loaded));
            }
        };
        loadingTask.promise.then(function (doc) {
            docRef.current = doc.loadingTask.docId;
            setStatus(new CompletedState(doc));
        }, function (err) {
            return !worker.destroyed &&
                setStatus(new FailureState({
                    message: err.message || 'Cannot load document',
                    name: err.name,
                }));
        });
        return function () {
            loadingTask.destroy();
            worker.destroy();
        };
    }, [file]);
    if (status instanceof AskForPasswordState) {
        return (React.createElement(AskingPassword, { passwordStatus: status.passwordStatus, renderProtectedView: renderProtectedView, verifyPassword: status.verifyPassword, onDocumentAskPassword: onDocumentAskPassword }));
    }
    if (status instanceof CompletedState) {
        return render(status.doc);
    }
    if (status instanceof FailureState) {
        return renderError ? (renderError(status.error)) : (React.createElement("div", { className: classNames({
                'rpv-core__doc-error': true,
                'rpv-core__doc-error--rtl': isRtl,
            }) },
            React.createElement("div", { className: "rpv-core__doc-error-text" }, status.error.message)));
    }
    return (React.createElement("div", { "data-testid": "core__doc-loading", className: classNames({
            'rpv-core__doc-loading': true,
            'rpv-core__doc-loading--rtl': isRtl,
        }) }, renderLoader ? renderLoader(status.percentages) : React.createElement(Spinner, null)));
};

var StackContext = React.createContext({
    currentIndex: 0,
    decreaseNumStacks: function () { },
    increaseNumStacks: function () { },
    numStacks: 0,
});

var isDarkMode = function () {
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

var DARK_THEME = {
    name: 'dark',
    colors: {
        primary: '117, 130, 255',
        primaryContent: '5, 6, 23',
        secondary: '255, 113, 207',
        secondaryContent: '25, 2, 17',
        accent: '0, 199, 181',
        accentContent: '0, 14, 12',
        neutral: '42, 50, 60',
        neutralContent: '166, 173, 187',
        base: '29, 35, 42',
        baseDarker: '25, 30, 36',
        baseMoreDarker: '21, 25, 30',
        baseContent: '166, 173, 187',
        error: '255, 111, 112',
        errorContent: '0, 0, 0',
    },
    radius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
    },
};

var LIGHT_THEME = {
    name: 'light',
    colors: {
        primary: '73, 30, 255',
        primaryContent: '212, 219, 255',
        secondary: '255, 65, 199',
        secondaryContent: '255, 249, 252',
        accent: '0, 207, 189',
        accentContent: '0, 16, 13',
        neutral: '43, 52, 64',
        neutralContent: '215, 221, 228',
        base: '255, 255, 255',
        baseDarker: '242, 242, 242',
        baseMoreDarker: '210, 210, 210',
        baseContent: '31, 41, 55',
        error: '255, 111, 112',
        errorContent: '0, 0, 0',
    },
    radius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
    },
};

var THEME_ATTR = 'data-rpv-theme';
var useTheme = function (theme) {
    var addStyles = React.useCallback(function () {
        var root = document.documentElement;
        root.setAttribute(THEME_ATTR, theme.name);
        if (document.head.querySelector("style[".concat(THEME_ATTR, "=\"").concat(theme.name, "\"]"))) {
            return;
        }
        var styleEle = document.createElement('style');
        styleEle.setAttribute(THEME_ATTR, theme.name);
        document.head.appendChild(styleEle);
        styleEle.textContent = "\n:root[".concat(THEME_ATTR, "=\"").concat(theme.name, "\"] {\n    --rpv-color-primary: ").concat(theme.colors.primary, ";\n    --rpv-color-primary-content: ").concat(theme.colors.primaryContent, ";\n    --rpv-color-secondary: ").concat(theme.colors.secondary, ";\n    --rpv-color-secondary-content: ").concat(theme.colors.secondaryContent, ";\n    --rpv-color-accent: ").concat(theme.colors.accent, ";\n    --rpv-color-accent-content: ").concat(theme.colors.accentContent, ";\n    --rpv-color-neutral: ").concat(theme.colors.neutral, ";\n    --rpv-color-neutral-content: ").concat(theme.colors.neutralContent, ";\n    --rpv-color-base: ").concat(theme.colors.base, ";\n    --rpv-color-base-darker: ").concat(theme.colors.baseDarker, ";\n    --rpv-color-base-more-darker: ").concat(theme.colors.baseMoreDarker, ";\n    --rpv-color-base-content: ").concat(theme.colors.baseContent, ";\n    --rpv-color-error: ").concat(theme.colors.error, ";\n    --rpv-color-error-content: ").concat(theme.colors.errorContent, ";\n    --rpv-radius-sm: ").concat(theme.radius.sm, ";\n    --rpv-radius-md: ").concat(theme.radius.md, ";\n    --rpv-radius-lg: ").concat(theme.radius.lg, ";\n}");
    }, [theme]);
    var removeStyles = React.useCallback(function () {
        var styleEle = document.head.querySelector("style[".concat(THEME_ATTR, "=\"").concat(theme.name, "\"]"));
        if (styleEle) {
            document.head.removeChild(styleEle);
        }
    }, [theme]);
    React.useEffect(function () {
        addStyles();
        return function () {
            removeStyles();
        };
    }, [theme]);
};

var withTheme = function (theme, onSwitchTheme) {
    var initialTheme = React.useMemo(function () { return (theme === 'auto' ? (isDarkMode() ? 'dark' : 'light') : theme); }, []);
    var _a = React.useState(initialTheme), currentTheme = _a[0], setCurrentTheme = _a[1];
    var prevTheme = usePrevious(currentTheme);
    useTheme(currentTheme === 'light' ? LIGHT_THEME : DARK_THEME);
    React.useEffect(function () {
        if (theme !== 'auto') {
            return;
        }
        var media = window.matchMedia('(prefers-color-scheme: dark)');
        var handler = function (e) {
            setCurrentTheme(e.matches ? 'dark' : 'light');
        };
        media.addEventListener('change', handler);
        return function () { return media.removeEventListener('change', handler); };
    }, []);
    React.useEffect(function () {
        if (currentTheme !== prevTheme) {
            onSwitchTheme && onSwitchTheme(currentTheme);
        }
    }, [currentTheme]);
    React.useEffect(function () {
        if (theme !== currentTheme) {
            setCurrentTheme(theme);
        }
    }, [theme]);
    return {
        currentTheme: currentTheme,
        setCurrentTheme: setCurrentTheme,
    };
};

var isSameUrl = function (a, b) {
    var typeA = typeof a;
    var typeB = typeof b;
    if (typeA === 'string' && typeB === 'string' && a === b) {
        return true;
    }
    if (typeA === 'object' && typeB === 'object') {
        return a.length === b.length && a.every(function (v, i) { return v === b[i]; });
    }
    return false;
};

var NUM_OVERSCAN_PAGES = 3;
var DEFAULT_RENDER_RANGE = function (visiblePagesRange) {
    return {
        startPage: visiblePagesRange.startPage - NUM_OVERSCAN_PAGES,
        endPage: visiblePagesRange.endPage + NUM_OVERSCAN_PAGES,
    };
};
var Viewer = function (_a) {
    var characterMap = _a.characterMap, defaultScale = _a.defaultScale, _b = _a.enableSmoothScroll, enableSmoothScroll = _b === void 0 ? true : _b, fileUrl = _a.fileUrl, _c = _a.httpHeaders, httpHeaders = _c === void 0 ? {} : _c, _d = _a.initialPage, initialPage = _d === void 0 ? 0 : _d, pageLayout = _a.pageLayout, _e = _a.initialRotation, initialRotation = _e === void 0 ? 0 : _e, localization = _a.localization, _f = _a.plugins, plugins = _f === void 0 ? [] : _f, renderError = _a.renderError, renderLoader = _a.renderLoader, renderPage = _a.renderPage, renderProtectedView = _a.renderProtectedView, _g = _a.scrollMode, scrollMode = _g === void 0 ? ScrollMode.Vertical : _g, _h = _a.setRenderRange, setRenderRange = _h === void 0 ? DEFAULT_RENDER_RANGE : _h, transformGetDocumentParams = _a.transformGetDocumentParams, _j = _a.theme, theme = _j === void 0 ? {
        direction: TextDirection.LeftToRight,
        theme: 'light',
    } : _j, _k = _a.viewMode, viewMode = _k === void 0 ? ViewMode.SinglePage : _k, _l = _a.withCredentials, withCredentials = _l === void 0 ? false : _l, onDocumentAskPassword = _a.onDocumentAskPassword, _m = _a.onDocumentLoad, onDocumentLoad = _m === void 0 ? function () {
    } : _m, _o = _a.onPageChange, onPageChange = _o === void 0 ? function () {
    } : _o, _p = _a.onRotate, onRotate = _p === void 0 ? function () {
    } : _p, _q = _a.onRotatePage, onRotatePage = _q === void 0 ? function () {
    } : _q, _r = _a.onSwitchTheme, onSwitchTheme = _r === void 0 ? function () {
    } : _r, _s = _a.onZoom, onZoom = _s === void 0 ? function () {
    } : _s;
    var _t = React.useState({
        data: fileUrl,
        name: typeof fileUrl === 'string' ? fileUrl : '',
        shouldLoad: false,
    }), file = _t[0], setFile = _t[1];
    var openFile = function (fileName, data) {
        setFile({
            data: data,
            name: fileName,
            shouldLoad: true,
        });
    };
    var _u = React.useState(false), visible = _u[0], setVisible = _u[1];
    var prevFile = usePrevious(file);
    React.useEffect(function () {
        if (!isSameUrl(prevFile.data, fileUrl)) {
            setFile({
                data: fileUrl,
                name: typeof fileUrl === 'string' ? fileUrl : '',
                shouldLoad: visible,
            });
        }
    }, [fileUrl, visible]);
    var visibilityChanged = function (params) {
        setVisible(params.isVisible);
        if (params.isVisible) {
            setFile(function (currentFile) { return Object.assign({}, currentFile, { shouldLoad: true }); });
        }
    };
    var containerRef = useIntersectionObserver({
        onVisibilityChanged: visibilityChanged,
    });
    var themeProps = typeof theme === 'string' ? { direction: TextDirection.LeftToRight, theme: theme } : theme;
    var themeStr = themeProps.theme || 'light';
    var _v = React.useState(localization || DefaultLocalization), l10n = _v[0], setL10n = _v[1];
    var localizationContext = { l10n: l10n, setL10n: setL10n };
    var themeContext = Object.assign({}, { direction: themeProps.direction }, withTheme(themeStr, onSwitchTheme));
    var _w = React.useState(0), numStacks = _w[0], setNumStacks = _w[1];
    var increaseNumStacks = function () { return setNumStacks(function (v) { return v + 1; }); };
    var decreaseNumStacks = function () { return setNumStacks(function (v) { return v - 1; }); };
    React.useEffect(function () {
        if (localization) {
            setL10n(localization);
        }
    }, [localization]);
    return (React.createElement(StackContext.Provider, { value: { currentIndex: 0, increaseNumStacks: increaseNumStacks, decreaseNumStacks: decreaseNumStacks, numStacks: numStacks } },
        React.createElement(LocalizationContext.Provider, { value: localizationContext },
            React.createElement(ThemeContext.Provider, { value: themeContext },
                React.createElement("div", { ref: containerRef, className: "rpv-core__viewer", "data-testid": "core__viewer", style: {
                        height: '100%',
                        width: '100%',
                    } }, file.shouldLoad && (React.createElement(DocumentLoader, { characterMap: characterMap, file: file.data, httpHeaders: httpHeaders, render: function (doc) { return (React.createElement(PageSizeCalculator, { defaultScale: defaultScale, doc: doc, render: function (estimatedPageSizes, initialScale) { return (React.createElement(Inner, { currentFile: {
                                data: file.data,
                                name: file.name,
                            }, defaultScale: defaultScale, doc: doc, enableSmoothScroll: enableSmoothScroll, estimatedPageSizes: estimatedPageSizes, initialPage: initialPage, initialRotation: initialRotation, initialScale: initialScale, initialScrollMode: scrollMode, initialViewMode: viewMode, pageLayout: pageLayout, plugins: plugins, renderPage: renderPage, setRenderRange: setRenderRange, viewerState: {
                                file: file,
                                fullScreenMode: FullScreenMode.Normal,
                                pageIndex: -1,
                                pageHeight: estimatedPageSizes[0].pageHeight,
                                pageWidth: estimatedPageSizes[0].pageWidth,
                                pagesRotation: new Map(),
                                rotation: initialRotation,
                                scale: initialScale,
                                scrollMode: scrollMode,
                                viewMode: viewMode,
                            }, onDocumentLoad: onDocumentLoad, onOpenFile: openFile, onPageChange: onPageChange, onRotate: onRotate, onRotatePage: onRotatePage, onZoom: onZoom })); }, scrollMode: scrollMode, viewMode: viewMode })); }, renderError: renderError, renderLoader: renderLoader, renderProtectedView: renderProtectedView, transformGetDocumentParams: transformGetDocumentParams, withCredentials: withCredentials, onDocumentAskPassword: onDocumentAskPassword })))))));
};

var Worker = function (_a) {
    var children = _a.children, workerUrl = _a.workerUrl;
    var apiProvider = PdfJs;
    apiProvider.GlobalWorkerOptions.workerSrc = workerUrl;
    return React.createElement(PdfJsApiContext.Provider, { value: { pdfJsApiProvider: apiProvider } }, children);
};

var Button = function (_a) {
    var children = _a.children, testId = _a.testId, onClick = _a.onClick;
    var direction = React.useContext(ThemeContext).direction;
    var isRtl = direction === TextDirection.RightToLeft;
    var attrs = testId ? { 'data-testid': testId } : {};
    return (React.createElement("button", __assign({ className: classNames({
            'rpv-core__button': true,
            'rpv-core__button--rtl': isRtl,
        }), type: "button", onClick: onClick }, attrs), children));
};

var LazyRender = function (_a) {
    var attrs = _a.attrs, children = _a.children, testId = _a.testId;
    var _b = React.useState(false), visible = _b[0], setVisible = _b[1];
    var containerAttrs = testId ? __assign(__assign({}, attrs), { 'data-testid': testId }) : attrs;
    var handleVisibilityChanged = function (params) {
        if (params.isVisible) {
            setVisible(true);
        }
    };
    var containerRef = useIntersectionObserver({
        once: true,
        onVisibilityChanged: handleVisibilityChanged,
    });
    return (React.createElement("div", __assign({ ref: containerRef }, containerAttrs), visible && children));
};

var Menu = function (_a) {
    var children = _a.children;
    var containerRef = React.useRef();
    var visibleMenuItemsRef = React.useRef([]);
    var direction = React.useContext(ThemeContext).direction;
    var isRtl = direction === TextDirection.RightToLeft;
    var handleKeyDown = function (e) {
        var container = containerRef.current;
        if (!container) {
            return;
        }
        switch (e.key) {
            case 'Tab':
                e.preventDefault();
                break;
            case 'ArrowDown':
                e.preventDefault();
                moveToItem(function (_, currentIndex) { return currentIndex + 1; });
                break;
            case 'ArrowUp':
                e.preventDefault();
                moveToItem(function (_, currentIndex) { return currentIndex - 1; });
                break;
            case 'End':
                e.preventDefault();
                moveToItem(function (items, _) { return items.length - 1; });
                break;
            case 'Home':
                e.preventDefault();
                moveToItem(function (_, __) { return 0; });
                break;
        }
    };
    var moveToItem = function (getNextItem) {
        var container = containerRef.current;
        if (!container) {
            return;
        }
        var items = visibleMenuItemsRef.current;
        var currentIndex = items.findIndex(function (item) { return item.getAttribute('tabindex') === '0'; });
        var targetIndex = Math.min(items.length - 1, Math.max(0, getNextItem(items, currentIndex)));
        if (currentIndex >= 0 && currentIndex <= items.length - 1) {
            items[currentIndex].setAttribute('tabindex', '-1');
        }
        items[targetIndex].setAttribute('tabindex', '0');
        items[targetIndex].focus();
    };
    var findVisibleItems = function (container) {
        var visibleItems = [];
        container.querySelectorAll('.rpv-core__menu-item[role="menuitem"]').forEach(function (item) {
            if (item instanceof HTMLElement) {
                var parent_1 = item.parentElement;
                if (parent_1 === container) {
                    visibleItems.push(item);
                }
                else {
                    if (window.getComputedStyle(parent_1).display !== 'none') {
                        visibleItems.push(item);
                    }
                }
            }
        });
        return visibleItems;
    };
    useIsomorphicLayoutEffect(function () {
        var container = containerRef.current;
        if (!container) {
            return;
        }
        var visibleItems = findVisibleItems(container);
        visibleMenuItemsRef.current = visibleItems;
    }, []);
    useIsomorphicLayoutEffect(function () {
        document.addEventListener('keydown', handleKeyDown);
        return function () {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    return (React.createElement("div", { ref: containerRef, "aria-orientation": "vertical", className: classNames({
            'rpv-core__menu': true,
            'rpv-core__menu--rtl': isRtl,
        }), role: "menu", tabIndex: 0 }, children));
};

var MenuDivider = function () { return (React.createElement("div", { "aria-orientation": "horizontal", className: "rpv-core__menu-divider", role: "separator" })); };

var MenuItem = function (_a) {
    var _b = _a.checked, checked = _b === void 0 ? false : _b, children = _a.children, _c = _a.icon, icon = _c === void 0 ? null : _c, _d = _a.isDisabled, isDisabled = _d === void 0 ? false : _d, testId = _a.testId, onClick = _a.onClick;
    var direction = React.useContext(ThemeContext).direction;
    var isRtl = direction === TextDirection.RightToLeft;
    var attrs = testId ? { 'data-testid': testId } : {};
    return (React.createElement("button", __assign({ className: classNames({
            'rpv-core__menu-item': true,
            'rpv-core__menu-item--disabled': isDisabled,
            'rpv-core__menu-item--ltr': !isRtl,
            'rpv-core__menu-item--rtl': isRtl,
        }), role: "menuitem", tabIndex: -1, type: "button", onClick: onClick }, attrs),
        React.createElement("div", { className: classNames({
                'rpv-core__menu-item-icon': true,
                'rpv-core__menu-item-icon--ltr': !isRtl,
                'rpv-core__menu-item-icon--rtl': isRtl,
            }) }, icon),
        React.createElement("div", { className: classNames({
                'rpv-core__menu-item-label': true,
                'rpv-core__menu-item-label--ltr': !isRtl,
                'rpv-core__menu-item-label--rtl': isRtl,
            }) }, children),
        React.createElement("div", { className: classNames({
                'rpv-core__menu-item-check': true,
                'rpv-core__menu-item-check--ltr': !isRtl,
                'rpv-core__menu-item-check--rtl': isRtl,
            }) }, checked && React.createElement(CheckIcon, null))));
};

var MinimalButton = function (_a) {
    var _b = _a.ariaLabel, ariaLabel = _b === void 0 ? '' : _b, _c = _a.ariaKeyShortcuts, ariaKeyShortcuts = _c === void 0 ? '' : _c, children = _a.children, _d = _a.isDisabled, isDisabled = _d === void 0 ? false : _d, _e = _a.isSelected, isSelected = _e === void 0 ? false : _e, testId = _a.testId, onClick = _a.onClick;
    var direction = React.useContext(ThemeContext).direction;
    var isRtl = direction === TextDirection.RightToLeft;
    var attrs = testId ? { 'data-testid': testId } : {};
    return (React.createElement("button", __assign({ "aria-label": ariaLabel }, (ariaKeyShortcuts && { 'aria-keyshortcuts': ariaKeyShortcuts }), (isDisabled && { 'aria-disabled': true }), { className: classNames({
            'rpv-core__minimal-button': true,
            'rpv-core__minimal-button--disabled': isDisabled,
            'rpv-core__minimal-button--rtl': isRtl,
            'rpv-core__minimal-button--selected': isSelected,
        }), type: "button", onClick: onClick }, attrs), children));
};

var ProgressBar = function (_a) {
    var progress = _a.progress;
    var direction = React.useContext(ThemeContext).direction;
    var isRtl = direction === TextDirection.RightToLeft;
    return (React.createElement("div", { className: classNames({
            'rpv-core__progress-bar': true,
            'rpv-core__progress-bar--rtl': isRtl,
        }) },
        React.createElement("div", { className: "rpv-core__progress-bar-progress", style: { width: "".concat(progress, "%") } },
            progress,
            "%")));
};

var Separator = function () { return React.createElement("div", { className: "rpv-core__separator" }); };

var Splitter = function (_a) {
    var constrain = _a.constrain;
    var direction = React.useContext(ThemeContext).direction;
    var isRtl = direction === TextDirection.RightToLeft;
    var resizerRef = React.useRef();
    var leftSideRef = React.useRef();
    var rightSideRef = React.useRef();
    var xRef = React.useRef(0);
    var yRef = React.useRef(0);
    var leftWidthRef = React.useRef(0);
    var resizerWidthRef = React.useRef(0);
    var eventOptions = {
        capture: true,
    };
    var handleMouseMove = function (e) {
        var resizerEle = resizerRef.current;
        var leftSide = leftSideRef.current;
        var rightSide = rightSideRef.current;
        if (!resizerEle || !leftSide || !rightSide) {
            return;
        }
        var resizerWidth = resizerWidthRef.current;
        var dx = e.clientX - xRef.current;
        var firstHalfSize = leftWidthRef.current + (isRtl ? -dx : dx);
        var containerWidth = resizerEle.parentElement.getBoundingClientRect().width;
        var firstHalfPercentage = (firstHalfSize * 100) / containerWidth;
        resizerEle.classList.add('rpv-core__splitter--resizing');
        if (constrain) {
            var secondHalfSize = containerWidth - firstHalfSize - resizerWidth;
            var secondHalfPercentage = (secondHalfSize * 100) / containerWidth;
            if (!constrain({ firstHalfPercentage: firstHalfPercentage, firstHalfSize: firstHalfSize, secondHalfPercentage: secondHalfPercentage, secondHalfSize: secondHalfSize })) {
                return;
            }
        }
        leftSide.style.width = "".concat(firstHalfPercentage, "%");
        document.body.classList.add('rpv-core__splitter-body--resizing');
        leftSide.classList.add('rpv-core__splitter-sibling--resizing');
        rightSide.classList.add('rpv-core__splitter-sibling--resizing');
    };
    var handleMouseUp = function (e) {
        var resizerEle = resizerRef.current;
        var leftSide = leftSideRef.current;
        var rightSide = rightSideRef.current;
        if (!resizerEle || !leftSide || !rightSide) {
            return;
        }
        document.body.classList.remove('rpv-core__splitter-body--resizing');
        resizerEle.classList.remove('rpv-core__splitter--resizing');
        leftSide.classList.remove('rpv-core__splitter-sibling--resizing');
        rightSide.classList.remove('rpv-core__splitter-sibling--resizing');
        document.removeEventListener('mousemove', handleMouseMove, eventOptions);
        document.removeEventListener('mouseup', handleMouseUp, eventOptions);
    };
    var handleMouseDown = function (e) {
        var leftSide = leftSideRef.current;
        if (!leftSide) {
            return;
        }
        xRef.current = e.clientX;
        yRef.current = e.clientY;
        leftWidthRef.current = leftSide.getBoundingClientRect().width;
        document.addEventListener('mousemove', handleMouseMove, eventOptions);
        document.addEventListener('mouseup', handleMouseUp, eventOptions);
    };
    React.useEffect(function () {
        var resizerEle = resizerRef.current;
        if (!resizerEle) {
            return;
        }
        resizerWidthRef.current = resizerEle.getBoundingClientRect().width;
        leftSideRef.current = resizerEle.previousElementSibling;
        rightSideRef.current = resizerEle.nextElementSibling;
    }, []);
    return React.createElement("div", { ref: resizerRef, className: "rpv-core__splitter", onMouseDown: handleMouseDown });
};

var id = 0;
var uniqueId = function () { return id++; };

var useLockScroll = function () {
    React.useEffect(function () {
        var originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return function () {
            document.body.style.overflow = originalStyle;
        };
    }, []);
};

var mergeRefs = function (refs) {
    return function (value) {
        refs.forEach(function (ref) {
            if (typeof ref === 'function') {
                ref(value);
            }
            else if (ref != null) {
                ref.current = value;
            }
        });
    };
};

var useClickOutsideStack = function (closeOnClickOutside, onClickOutside) {
    var stackContext = React.useContext(StackContext);
    var _a = React.useState(), ele = _a[0], setEle = _a[1];
    var ref = React.useCallback(function (ele) {
        setEle(ele);
    }, []);
    var handleClickDocument = React.useCallback(function (e) {
        if (!ele || stackContext.currentIndex !== stackContext.numStacks) {
            return;
        }
        var clickedTarget = e.target;
        if (clickedTarget instanceof Element && clickedTarget.shadowRoot) {
            var paths = e.composedPath();
            if (paths.length > 0 && !ele.contains(paths[0])) {
                onClickOutside();
            }
        }
        else if (!ele.contains(clickedTarget)) {
            onClickOutside();
        }
    }, [ele, stackContext.currentIndex, stackContext.numStacks]);
    React.useEffect(function () {
        if (!closeOnClickOutside || !ele) {
            return;
        }
        var eventOptions = {
            capture: true,
        };
        document.addEventListener('click', handleClickDocument, eventOptions);
        return function () {
            document.removeEventListener('click', handleClickDocument, eventOptions);
        };
    }, [ele, stackContext.currentIndex, stackContext.numStacks]);
    return [ref];
};

var useEscapeStack = function (handler) {
    var stackContext = React.useContext(StackContext);
    var keyUpHandler = React.useCallback(function (e) {
        if (e.key === 'Escape' && stackContext.currentIndex === stackContext.numStacks) {
            handler();
        }
    }, [stackContext.currentIndex, stackContext.numStacks]);
    React.useEffect(function () {
        document.addEventListener('keyup', keyUpHandler);
        return function () {
            document.removeEventListener('keyup', keyUpHandler);
        };
    }, [stackContext.currentIndex, stackContext.numStacks]);
};

var ModalBody = function (_a) {
    var ariaControlsSuffix = _a.ariaControlsSuffix, children = _a.children, closeOnClickOutside = _a.closeOnClickOutside, closeOnEscape = _a.closeOnEscape, onClose = _a.onClose;
    var direction = React.useContext(ThemeContext).direction;
    var isRtl = direction === TextDirection.RightToLeft;
    var contentRef = React.useRef();
    var contentCallbackRef = useClickOutsideStack(closeOnClickOutside, onClose)[0];
    var mergedContentRef = mergeRefs([contentRef, contentCallbackRef]);
    useLockScroll();
    useEscapeStack(function () {
        if (closeOnEscape) {
            onClose();
        }
    });
    useIsomorphicLayoutEffect(function () {
        var contentEle = contentRef.current;
        if (!contentEle) {
            return;
        }
        var maxHeight = document.body.clientHeight * 0.75;
        if (contentEle.getBoundingClientRect().height >= maxHeight) {
            contentEle.style.overflow = 'auto';
            contentEle.style.maxHeight = "".concat(maxHeight, "px");
        }
    }, []);
    return (React.createElement("div", { "aria-modal": "true", className: classNames({
            'rpv-core__modal-body': true,
            'rpv-core__modal-body--rtl': isRtl,
        }), id: "rpv-core__modal-body-".concat(ariaControlsSuffix), ref: mergedContentRef, role: "dialog", tabIndex: -1 }, children));
};

var ModalOverlay = function (_a) {
    var children = _a.children;
    return React.createElement("div", { className: "rpv-core__modal-overlay" }, children);
};

var Stack = function (_a) {
    var children = _a.children;
    var _b = React.useContext(StackContext), currentIndex = _b.currentIndex, increaseNumStacks = _b.increaseNumStacks, decreaseNumStacks = _b.decreaseNumStacks, numStacks = _b.numStacks;
    React.useEffect(function () {
        increaseNumStacks();
        return function () {
            decreaseNumStacks();
        };
    }, []);
    return ReactDOM.createPortal(React.createElement(StackContext.Provider, { value: {
            currentIndex: currentIndex + 1,
            decreaseNumStacks: decreaseNumStacks,
            increaseNumStacks: increaseNumStacks,
            numStacks: numStacks,
        } }, children), document.body);
};

var Modal = function (_a) {
    var ariaControlsSuffix = _a.ariaControlsSuffix, closeOnClickOutside = _a.closeOnClickOutside, closeOnEscape = _a.closeOnEscape, content = _a.content, _b = _a.isOpened, isOpened = _b === void 0 ? false : _b, target = _a.target;
    var controlsSuffix = ariaControlsSuffix || "".concat(uniqueId());
    var _c = useToggle(isOpened), opened = _c.opened, toggle = _c.toggle;
    var renderTarget = function (toggle, opened) { return (React.createElement("div", { "aria-expanded": opened ? 'true' : 'false', "aria-haspopup": "dialog", "aria-controls": "rpv-core__modal-body-".concat(controlsSuffix) }, target(toggle, opened))); };
    var renderContent = function (toggle) { return (React.createElement(ModalOverlay, null,
        React.createElement(ModalBody, { ariaControlsSuffix: controlsSuffix, closeOnClickOutside: closeOnClickOutside, closeOnEscape: closeOnEscape, onClose: toggle }, content(toggle)))); };
    return (React.createElement(React.Fragment, null,
        target && renderTarget(toggle, opened),
        opened && React.createElement(Stack, null, renderContent(toggle))));
};

var Position;
(function (Position) {
    Position["TopLeft"] = "TOP_LEFT";
    Position["TopCenter"] = "TOP_CENTER";
    Position["TopRight"] = "TOP_RIGHT";
    Position["RightTop"] = "RIGHT_TOP";
    Position["RightCenter"] = "RIGHT_CENTER";
    Position["RightBottom"] = "RIGHT_BOTTOM";
    Position["BottomLeft"] = "BOTTOM_LEFT";
    Position["BottomCenter"] = "BOTTOM_CENTER";
    Position["BottomRight"] = "BOTTOM_RIGHT";
    Position["LeftTop"] = "LEFT_TOP";
    Position["LeftCenter"] = "LEFT_CENTER";
    Position["LeftBottom"] = "LEFT_BOTTOM";
})(Position || (Position = {}));

var Arrow = function (_a) {
    var _b;
    var customClassName = _a.customClassName, position = _a.position;
    return (React.createElement("div", { className: classNames((_b = {
                'rpv-core__arrow': true,
                'rpv-core__arrow--tl': position === Position.TopLeft,
                'rpv-core__arrow--tc': position === Position.TopCenter,
                'rpv-core__arrow--tr': position === Position.TopRight,
                'rpv-core__arrow--rt': position === Position.RightTop,
                'rpv-core__arrow--rc': position === Position.RightCenter,
                'rpv-core__arrow--rb': position === Position.RightBottom,
                'rpv-core__arrow--bl': position === Position.BottomLeft,
                'rpv-core__arrow--bc': position === Position.BottomCenter,
                'rpv-core__arrow--br': position === Position.BottomRight,
                'rpv-core__arrow--lt': position === Position.LeftTop,
                'rpv-core__arrow--lc': position === Position.LeftCenter,
                'rpv-core__arrow--lb': position === Position.LeftBottom
            },
            _b["".concat(customClassName)] = customClassName !== '',
            _b)) }));
};

var PopoverBody = React.forwardRef(function (props, ref) {
    var ariaControlsSuffix = props.ariaControlsSuffix, children = props.children, closeOnClickOutside = props.closeOnClickOutside, position = props.position, onClose = props.onClose;
    var innerRef = React.useRef();
    var direction = React.useContext(ThemeContext).direction;
    var isRtl = direction === TextDirection.RightToLeft;
    var contentRef = useClickOutsideStack(closeOnClickOutside, onClose)[0];
    var mergedContentRef = mergeRefs([ref, contentRef]);
    useIsomorphicLayoutEffect(function () {
        var innerContentEle = innerRef.current;
        if (!innerContentEle) {
            return;
        }
        var maxHeight = document.body.clientHeight * 0.75;
        if (innerContentEle.getBoundingClientRect().height >= maxHeight) {
            innerContentEle.style.overflow = 'auto';
            innerContentEle.style.maxHeight = "".concat(maxHeight, "px");
        }
    }, []);
    var innerId = "rpv-core__popover-body-inner-".concat(ariaControlsSuffix);
    return (React.createElement("div", { "aria-describedby": innerId, className: classNames({
            'rpv-core__popover-body': true,
            'rpv-core__popover-body--rtl': isRtl,
        }), id: "rpv-core__popover-body-".concat(ariaControlsSuffix), ref: mergedContentRef, role: "dialog", tabIndex: -1 },
        React.createElement(Arrow, { customClassName: "rpv-core__popover-body-arrow", position: position }),
        React.createElement("div", { id: innerId, ref: innerRef }, children)));
});
PopoverBody.displayName = 'PopoverBody';

var PopoverOverlay = function (_a) {
    var children = _a.children, closeOnEscape = _a.closeOnEscape, onClose = _a.onClose;
    var containerRef = React.useRef();
    useEscapeStack(function () {
        if (closeOnEscape) {
            onClose();
        }
    });
    return (React.createElement("div", { className: "rpv-core__popover-overlay", ref: containerRef }, children));
};

var AVAILABLE_POSITIONS = [
    Position.TopLeft,
    Position.TopCenter,
    Position.TopRight,
    Position.RightTop,
    Position.RightCenter,
    Position.RightBottom,
    Position.BottomLeft,
    Position.BottomCenter,
    Position.BottomRight,
    Position.LeftTop,
    Position.LeftCenter,
    Position.LeftBottom,
];
var isIntersection = function (a, b) {
    return b.right >= a.left && b.left <= a.right && b.top <= a.bottom && b.bottom >= a.top;
};
var union = function (a, b) {
    var left = Math.max(a.left, b.left);
    var top = Math.max(a.top, b.top);
    var right = Math.min(a.right, b.right);
    var bottom = Math.min(a.bottom, b.bottom);
    return new DOMRect(left, top, right - left, bottom - top);
};
var calculateArea = function (rect) { return rect.width * rect.height; };
var distance = function (a, b) { return Math.abs(a.left - b.left) + Math.abs(a.top - b.top); };
var calculateOffset = function (referenceRect, targetRect, position, offset) {
    var top = 0;
    var left = 0;
    switch (position) {
        case Position.TopLeft:
            top = referenceRect.top - targetRect.height - offset;
            left = referenceRect.left;
            break;
        case Position.TopCenter:
            top = referenceRect.top - targetRect.height - offset;
            left = referenceRect.left + referenceRect.width / 2 - targetRect.width / 2;
            break;
        case Position.TopRight:
            top = referenceRect.top - targetRect.height - offset;
            left = referenceRect.left + referenceRect.width - targetRect.width;
            break;
        case Position.RightTop:
            top = referenceRect.top;
            left = referenceRect.left + referenceRect.width + offset;
            break;
        case Position.RightCenter:
            top = referenceRect.top + referenceRect.height / 2 - targetRect.height / 2;
            left = referenceRect.left + referenceRect.width + offset;
            break;
        case Position.RightBottom:
            top = referenceRect.top + referenceRect.height - targetRect.height;
            left = referenceRect.left + referenceRect.width + offset;
            break;
        case Position.BottomLeft:
            top = referenceRect.top + referenceRect.height + offset;
            left = referenceRect.left;
            break;
        case Position.BottomCenter:
            top = referenceRect.top + referenceRect.height + offset;
            left = referenceRect.left + referenceRect.width / 2 - targetRect.width / 2;
            break;
        case Position.BottomRight:
            top = referenceRect.top + referenceRect.height + offset;
            left = referenceRect.left + referenceRect.width - targetRect.width;
            break;
        case Position.LeftTop:
            top = referenceRect.top;
            left = referenceRect.left - targetRect.width - offset;
            break;
        case Position.LeftCenter:
            top = referenceRect.top + referenceRect.height / 2 - targetRect.height / 2;
            left = referenceRect.left - targetRect.width - offset;
            break;
        case Position.LeftBottom:
            top = referenceRect.top + referenceRect.height - targetRect.height;
            left = referenceRect.left - targetRect.width - offset;
            break;
    }
    return { top: top, left: left };
};
var determineBestPosition = function (referenceRect, targetRect, containerRect, position, offset) {
    if (!isIntersection(referenceRect, containerRect)) {
        return {
            position: position,
        };
    }
    var desiredOffset = calculateOffset(referenceRect, targetRect, position, offset);
    var availableOffsets = AVAILABLE_POSITIONS.map(function (pos) { return ({
        offset: calculateOffset(referenceRect, targetRect, pos, offset),
        position: pos,
    }); });
    var notOverflowOffsets = availableOffsets.filter(function (_a) {
        var offset = _a.offset;
        var rect = new DOMRect(offset.left, offset.top, targetRect.width, targetRect.height);
        return isIntersection(rect, containerRect);
    });
    var sortedDistances = notOverflowOffsets.sort(function (a, b) {
        var x = new DOMRect(b.offset.left, b.offset.top, targetRect.width, targetRect.height);
        var y = new DOMRect(a.offset.left, a.offset.top, targetRect.width, targetRect.height);
        return (calculateArea(union(x, containerRect)) - calculateArea(union(y, containerRect)) ||
            distance(a.offset, desiredOffset) - distance(b.offset, desiredOffset));
    });
    if (sortedDistances.length === 0) {
        return {
            position: position,
        };
    }
    var bestPlacement = sortedDistances[0];
    var shortestDistanceRect = new DOMRect(bestPlacement.offset.left, bestPlacement.offset.top, targetRect.width, targetRect.height);
    var rect = new DOMRect(Math.round(clamp(shortestDistanceRect.left, containerRect.left, containerRect.right - shortestDistanceRect.width)), Math.round(clamp(shortestDistanceRect.top, containerRect.top, containerRect.bottom - shortestDistanceRect.height)), shortestDistanceRect.width, shortestDistanceRect.height);
    return {
        position: bestPlacement.position,
        rect: rect,
    };
};

var areRectsEqual = function (a, b) {
    return ['top', 'left', 'width', 'height'].every(function (key) { return a[key] === b[key]; });
};
var Portal = function (_a) {
    var children = _a.children, _b = _a.offset, offset = _b === void 0 ? 0 : _b, position = _a.position, referenceRef = _a.referenceRef;
    var EMPTY_DOM_RECT = new DOMRect();
    var _c = React.useState(), ele = _c[0], setEle = _c[1];
    var _d = React.useState(position), updatedPosition = _d[0], setUpdatedPosition = _d[1];
    var targetRef = React.useCallback(function (ele) {
        setEle(ele);
    }, []);
    var prevBoundingRectsRef = React.useRef([]);
    var start = useAnimationFrame(function () {
        if (!ele || !referenceRef.current) {
            return;
        }
        var referenceRect = referenceRef.current.getBoundingClientRect();
        var targetRect = ele.getBoundingClientRect();
        var containerRect = new DOMRect(0, 0, window.innerWidth, window.innerHeight);
        var rects = [referenceRect, targetRect, containerRect];
        if (rects.some(function (rect, i) { return !areRectsEqual(rect, prevBoundingRectsRef.current[i] || EMPTY_DOM_RECT); })) {
            prevBoundingRectsRef.current = rects;
            var updatedPlacement = determineBestPosition(referenceRect, targetRect, containerRect, position, offset);
            if (updatedPlacement.rect) {
                ele.style.transform = "translate(".concat(updatedPlacement.rect.left, "px, ").concat(updatedPlacement.rect.top, "px)");
                setUpdatedPosition(updatedPlacement.position);
            }
        }
    }, true, [ele])[0];
    React.useEffect(function () {
        if (ele) {
            start();
        }
    }, [ele]);
    return React.createElement(Stack, null, children({ position: updatedPosition, ref: targetRef }));
};

var Popover = function (_a) {
    var _b = _a.ariaHasPopup, ariaHasPopup = _b === void 0 ? 'dialog' : _b, ariaControlsSuffix = _a.ariaControlsSuffix, closeOnClickOutside = _a.closeOnClickOutside, closeOnEscape = _a.closeOnEscape, content = _a.content, _c = _a.lockScroll, lockScroll = _c === void 0 ? true : _c, position = _a.position, target = _a.target;
    var _d = useToggle(false), opened = _d.opened, toggle = _d.toggle;
    var targetRef = React.useRef();
    var controlsSuffix = React.useMemo(function () { return ariaControlsSuffix || "".concat(uniqueId()); }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { ref: targetRef, "aria-expanded": opened ? 'true' : 'false', "aria-haspopup": ariaHasPopup, "aria-controls": "rpv-core__popver-body-".concat(controlsSuffix) }, target(toggle, opened)),
        opened && (React.createElement(Portal, { offset: 8, position: position, referenceRef: targetRef }, function (_a) {
            var updatedPosition = _a.position, ref = _a.ref;
            var popoverBody = (React.createElement(PopoverBody, { ariaControlsSuffix: controlsSuffix, closeOnClickOutside: closeOnClickOutside, position: updatedPosition, ref: ref, onClose: toggle }, content(toggle)));
            return lockScroll ? (React.createElement(PopoverOverlay, { closeOnEscape: closeOnEscape, onClose: toggle }, popoverBody)) : (popoverBody);
        }))));
};

var TooltipBody = React.forwardRef(function (props, ref) {
    var ariaControlsSuffix = props.ariaControlsSuffix, children = props.children, closeOnEscape = props.closeOnEscape, position = props.position, onClose = props.onClose;
    var direction = React.useContext(ThemeContext).direction;
    var isRtl = direction === TextDirection.RightToLeft;
    useEscapeStack(function () {
        if (closeOnEscape) {
            onClose();
        }
    });
    return (React.createElement("div", { className: classNames({
            'rpv-core__tooltip-body': true,
            'rpv-core__tooltip-body--rtl': isRtl,
        }), id: "rpv-core__tooltip-body-".concat(ariaControlsSuffix), ref: ref, role: "tooltip" },
        React.createElement(Arrow, { customClassName: "rpv-core__tooltip-body-arrow", position: position }),
        React.createElement("div", { className: "rpv-core__tooltip-body-content" }, children)));
});
TooltipBody.displayName = 'TooltipBody';

var Tooltip = function (_a) {
    var ariaControlsSuffix = _a.ariaControlsSuffix, content = _a.content, position = _a.position, target = _a.target;
    var _b = useToggle(false), opened = _b.opened, toggle = _b.toggle;
    var targetRef = React.useRef();
    var contentRef = React.useRef();
    var controlsSuffix = React.useMemo(function () { return ariaControlsSuffix || "".concat(uniqueId()); }, []);
    var open = function () {
        toggle(ToggleStatus.Open);
    };
    var close = function () {
        toggle(ToggleStatus.Close);
    };
    var onBlur = function (e) {
        var shouldHideTooltip = e.relatedTarget instanceof HTMLElement &&
            e.currentTarget.parentElement &&
            e.currentTarget.parentElement.contains(e.relatedTarget);
        if (shouldHideTooltip) {
            if (contentRef.current) {
                contentRef.current.style.display = 'none';
            }
        }
        else {
            close();
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { ref: targetRef, "aria-describedby": "rpv-core__tooltip-body-".concat(controlsSuffix), onBlur: onBlur, onFocus: open, onMouseEnter: open, onMouseLeave: close }, target),
        opened && (React.createElement(Portal, { offset: 8, position: position, referenceRef: targetRef }, function (_a) {
            var updatedPosition = _a.position, ref = _a.ref;
            return (React.createElement(TooltipBody, { ariaControlsSuffix: controlsSuffix, closeOnEscape: true, position: updatedPosition, ref: ref, onClose: close }, content()));
        }))));
};

function createStore(initialState) {
    var state = initialState || {};
    var listeners = {};
    var update = function (key, data) {
        var _a;
        state = __assign(__assign({}, state), (_a = {}, _a[key] = data, _a));
        (listeners[key] || []).forEach(function (handler) { return handler(state[key]); });
    };
    var get = function (key) { return state[key]; };
    return {
        subscribe: function (key, handler) {
            listeners[key] = (listeners[key] || []).concat(handler);
        },
        unsubscribe: function (key, handler) {
            listeners[key] = (listeners[key] || []).filter(function (f) { return f !== handler; });
        },
        update: function (key, data) {
            update(key, data);
        },
        updateCurrentValue: function (key, updater) {
            var currentValue = get(key);
            if (currentValue !== undefined) {
                update(key, updater(currentValue));
            }
        },
        get: function (key) {
            return get(key);
        },
    };
}

var PageMode;
(function (PageMode) {
    PageMode["Attachments"] = "UseAttachments";
    PageMode["Bookmarks"] = "UseOutlines";
    PageMode["ContentGroup"] = "UseOC";
    PageMode["Default"] = "UserNone";
    PageMode["FullScreen"] = "FullScreen";
    PageMode["Thumbnails"] = "UseThumbs";
})(PageMode || (PageMode = {}));

var isMac = function () { return (typeof window !== 'undefined' ? /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) : false); };

export { AnnotationType, Button, DARK_THEME, FullScreenMode, Icon, LIGHT_THEME, LayerRenderStatus, LazyRender, LocalizationContext, Menu, MenuDivider, MenuItem, MinimalButton, Modal, PageMode, PasswordStatus, PdfJsApiContext, Popover, Position, PrimaryButton, ProgressBar, RotateDirection, ScrollMode, Separator, SpecialZoomLevel, Spinner, Splitter, TextBox, TextDirection, ThemeContext, ToggleStatus, Tooltip, ViewMode, Viewer, Worker, chunk, classNames, createStore, getDestination, getPage, isFullScreenEnabled, isMac, mergeRefs, useDebounceCallback, useIntersectionObserver, useIsMounted, useIsomorphicLayoutEffect, usePrevious, useRenderQueue, useSafeState };
