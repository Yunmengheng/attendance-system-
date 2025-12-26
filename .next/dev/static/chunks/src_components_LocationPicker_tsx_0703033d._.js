(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/LocationPicker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LocationPicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function LocationPicker({ initialLat, initialLng, onLocationSelect }) {
    _s();
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const markerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [selectedLocation, setSelectedLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LocationPicker.useEffect": ()=>{
            if (!containerRef.current) return;
            // Fix Leaflet default icon issue - create custom icon
            const customIcon = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [
                    25,
                    41
                ],
                iconAnchor: [
                    12,
                    41
                ],
                popupAnchor: [
                    1,
                    -34
                ],
                shadowSize: [
                    41,
                    41
                ]
            });
            // Create map instance
            const center = initialLat && initialLng ? [
                initialLat,
                initialLng
            ] : [
                40.7128,
                -74.0060
            ];
            const map = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].map(containerRef.current).setView(center, initialLat && initialLng ? 15 : 4);
            // Add tile layer
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(map);
            // Add click handler
            map.on('click', {
                "LocationPicker.useEffect": (e)=>{
                    const { lat, lng } = e.latlng;
                    // Remove old marker if exists
                    if (markerRef.current) {
                        markerRef.current.remove();
                    }
                    // Add new marker with custom icon
                    markerRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].marker([
                        lat,
                        lng
                    ], {
                        icon: customIcon
                    }).addTo(map).bindPopup(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`).openPopup();
                    // Update state
                    setSelectedLocation({
                        lat,
                        lng
                    });
                    // Call callback
                    onLocationSelect(lat, lng);
                }
            }["LocationPicker.useEffect"]);
            // Try to get user's location
            map.locate({
                setView: false,
                maxZoom: 15,
                timeout: 30000,
                enableHighAccuracy: false
            });
            map.on('locationfound', {
                "LocationPicker.useEffect": (e)=>{
                    if (!markerRef.current) {
                        markerRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].marker(e.latlng, {
                            icon: customIcon
                        }).addTo(map).bindPopup('Your current location').openPopup();
                        map.flyTo(e.latlng, 15);
                        setSelectedLocation({
                            lat: e.latlng.lat,
                            lng: e.latlng.lng
                        });
                        onLocationSelect(e.latlng.lat, e.latlng.lng);
                    }
                }
            }["LocationPicker.useEffect"]);
            // Handle location errors silently (user can still click on map)
            map.on('locationerror', {
                "LocationPicker.useEffect": ()=>{
                // Do nothing - user can manually select location by clicking
                }
            }["LocationPicker.useEffect"]);
            mapRef.current = map;
            setIsLoading(false);
            // Cleanup function
            return ({
                "LocationPicker.useEffect": ()=>{
                    if (markerRef.current) {
                        markerRef.current.remove();
                        markerRef.current = null;
                    }
                    if (mapRef.current) {
                        mapRef.current.remove();
                        mapRef.current = null;
                    }
                }
            })["LocationPicker.useEffect"];
        }
    }["LocationPicker.useEffect"], []); // Empty dependency array - only run once
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-secondary/50 rounded-lg flex items-center justify-center z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground",
                    children: "Loading map..."
                }, void 0, false, {
                    fileName: "[project]/src/components/LocationPicker.tsx",
                    lineNumber: 114,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/LocationPicker.tsx",
                lineNumber: 113,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: containerRef,
                className: "h-96 rounded-lg overflow-hidden border border-border relative",
                style: {
                    height: '384px',
                    width: '100%'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/LocationPicker.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-center space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: "Click anywhere on the map to set the location"
                    }, void 0, false, {
                        fileName: "[project]/src/components/LocationPicker.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    selectedLocation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-primary font-medium",
                        children: [
                            "Selected: ",
                            selectedLocation.lat.toFixed(6),
                            ", ",
                            selectedLocation.lng.toFixed(6)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/LocationPicker.tsx",
                        lineNumber: 127,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/LocationPicker.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/LocationPicker.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_s(LocationPicker, "IEAPcz9q/7AauQnOp/RkB9+kuQQ=");
_c = LocationPicker;
var _c;
__turbopack_context__.k.register(_c, "LocationPicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/LocationPicker.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/LocationPicker.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_LocationPicker_tsx_0703033d._.js.map