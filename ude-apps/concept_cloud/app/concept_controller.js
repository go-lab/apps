(function (conceptCloud) {
    conceptCloud.ConceptController = ConceptController;

    function ConceptController() {
        var storageHandler = conceptCloud.cacheStorageHandler;
        var metadataHandler = conceptCloud.cacheMetadataHandler;
        var conceptCloudResourceId;

        var conceptClouds = [];

        // Options
        var graphic;

        var dummyConceptClouds = [{"data":{"general":{"§mass":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§time":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§luminous intensity":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}}},"user":{"Kristina@578f60a3bb3adbac665c6660":{"content":{"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":1,"flashy":true,"fancy":false}}}},"metadata":{"timestamp":"2016-07-20T11:30:00.434Z","ils":{"structure":{"id":"578f6043bb3adbac665c64b7","url":"http://graasp.eu/spaces/578f6043bb3adbac665c64b7","displayName":"test284657729474.2","phases":[{"id":"578f6043bb3adbac665c64bd","type":"Orientation","displayName":"Orientation","visibilityLevel":"public","apps":[{"id":"578f6057bb3adbac665c655a","displayName":"Concept Mapper","url":"http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6043bb3adbac665c64c2","type":"Conceptualisation","displayName":"Conceptualisation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64c7","type":"Investigation","displayName":"Investigation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64cc","type":"Conclusion","displayName":"Conclusion","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64d1","type":"Discussion","displayName":"Discussion","visibilityLevel":"public","apps":[{"id":"578f607dbb3adbac665c6597","displayName":"CC dev Server","url":"http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml","itemType":"Application","appType":"WidgetGadget","configuration":{"metadata":{"actor":{"displayName":"Kristina Angenendt","id":"5405e202da3a95cf9050e8fc","objectType":"graasp_editor"},"target":{"displayName":"","id":"cd3ee549-4356-411a-84ad-856f7032e902","objectType":"configuration"},"id":"578f607dbb3adbac665c6597_configuration","published":"2016-07-20T11:29:08.211Z"},"content":{"reflection":{"value":false},"timeOffset":{"value":"120000"},"analytics":{"value":false},"evolution":{"value":true},"environmentHandlerOptions":{"notificationServer":null,"cache":false}}}}]}],"apps":[]},"apps":["Concept Mapper@578f6057bb3adbac665c655a","CC dev Server@578f607dbb3adbac665c6597"],"phases":["Orientation@578f6043bb3adbac665c64bd","Conceptualisation@578f6043bb3adbac665c64c2","Investigation@578f6044bb3adbac665c64c7","Conclusion@578f6044bb3adbac665c64cc","Discussion@578f6044bb3adbac665c64d1"],"phasesWithApps":["Orientation@578f6043bb3adbac665c64bd","Discussion@578f6044bb3adbac665c64d1"]},"generated":1469014204138,"dataSource":"cache"},"graphic":{"svg":"{\"objects\":[{\"type\":\"path-group\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":748,\"height\":650,\"fill\":\"\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"paths\":[{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":35.32,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,262,353],\"skewX\":0,\"skewY\":0,\"text\":\"mass\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":31.39,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,250,326],\"skewX\":0,\"skewY\":0,\"text\":\"time\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":130.98,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,361,303],\"skewX\":0,\"skewY\":0,\"text\":\"luminous intensity\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"}]}],\"background\":\"\"}","generated":1469014204637}},{"data":{"general":{"§mass":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§time":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§luminous intensity":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§sommer!":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}}},"user":{"Kristina@578f60a3bb3adbac665c6660":{"content":{"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.75,"flashy":false,"fancy":false}},"Timm@578f6218bb3adbac665c6dbf":{"content":{"§sommer!":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.25,"flashy":true,"fancy":false}}}},"metadata":{"timestamp":"2016-07-20T11:36:10.982Z","ils":{"structure":{"id":"578f6043bb3adbac665c64b7","url":"http://graasp.eu/spaces/578f6043bb3adbac665c64b7","displayName":"test284657729474.2","phases":[{"id":"578f6043bb3adbac665c64bd","type":"Orientation","displayName":"Orientation","visibilityLevel":"public","apps":[{"id":"578f6057bb3adbac665c655a","displayName":"Concept Mapper","url":"http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6043bb3adbac665c64c2","type":"Conceptualisation","displayName":"Conceptualisation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64c7","type":"Investigation","displayName":"Investigation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64cc","type":"Conclusion","displayName":"Conclusion","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64d1","type":"Discussion","displayName":"Discussion","visibilityLevel":"public","apps":[{"id":"578f607dbb3adbac665c6597","displayName":"CC dev Server","url":"http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml","itemType":"Application","appType":"WidgetGadget","configuration":{"metadata":{"actor":{"displayName":"Kristina Angenendt","id":"5405e202da3a95cf9050e8fc","objectType":"graasp_editor"},"target":{"displayName":"","id":"cd3ee549-4356-411a-84ad-856f7032e902","objectType":"configuration"},"id":"578f607dbb3adbac665c6597_configuration","published":"2016-07-20T11:29:08.211Z"},"content":{"reflection":{"value":false},"timeOffset":{"value":"120000"},"analytics":{"value":false},"evolution":{"value":true},"environmentHandlerOptions":{"notificationServer":null,"cache":false}}}}]}],"apps":[]},"apps":["Concept Mapper@578f6057bb3adbac665c655a","CC dev Server@578f607dbb3adbac665c6597"],"phases":["Orientation@578f6043bb3adbac665c64bd","Conceptualisation@578f6043bb3adbac665c64c2","Investigation@578f6044bb3adbac665c64c7","Conclusion@578f6044bb3adbac665c64cc","Discussion@578f6044bb3adbac665c64d1"],"phasesWithApps":["Orientation@578f6043bb3adbac665c64bd","Discussion@578f6044bb3adbac665c64d1"]},"generated":1469014579002,"dataSource":"cache"},"graphic":{"svg":"{\"objects\":[{\"type\":\"path-group\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":748,\"height\":650,\"fill\":\"\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"paths\":[{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":35.32,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,188,370],\"skewX\":0,\"skewY\":0,\"text\":\"mass\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":31.39,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,250,387],\"skewX\":0,\"skewY\":0,\"text\":\"time\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":130.98,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,356,347],\"skewX\":0,\"skewY\":0,\"text\":\"luminous intensity\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":62.78,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,289,415],\"skewX\":0,\"skewY\":0,\"text\":\"sommer!\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"}]}],\"background\":\"\"}","generated":1469014579541}},{"data":{"general":{"§mass":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§time":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§luminous intensity":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§sommer!":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}}},"user":{"Kristina@578f60a3bb3adbac665c6660":{"content":{"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.75,"flashy":true,"fancy":false}},"Timm@578f6218bb3adbac665c6dbf":{"content":{"§sommer!":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.75,"flashy":false,"fancy":false}}}},"metadata":{"timestamp":"2016-07-20T17:32:45.580Z","ils":{"structure":{"id":"578f6043bb3adbac665c64b7","url":"http://graasp.eu/spaces/578f6043bb3adbac665c64b7","displayName":"test284657729474.2","phases":[{"id":"578f6043bb3adbac665c64bd","type":"Orientation","displayName":"Orientation","visibilityLevel":"public","apps":[{"id":"578f6057bb3adbac665c655a","displayName":"Concept Mapper","url":"http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6043bb3adbac665c64c2","type":"Conceptualisation","displayName":"Conceptualisation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64c7","type":"Investigation","displayName":"Investigation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64cc","type":"Conclusion","displayName":"Conclusion","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64d1","type":"Discussion","displayName":"Discussion","visibilityLevel":"public","apps":[{"id":"578f607dbb3adbac665c6597","displayName":"CC dev Server","url":"http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml","itemType":"Application","appType":"WidgetGadget","configuration":{"metadata":{"actor":{"displayName":"Kristina Angenendt","id":"5405e202da3a95cf9050e8fc","objectType":"graasp_editor"},"target":{"displayName":"","id":"cd3ee549-4356-411a-84ad-856f7032e902","objectType":"configuration"},"id":"578f607dbb3adbac665c6597_configuration","published":"2016-07-20T11:29:08.211Z"},"content":{"reflection":{"value":false},"timeOffset":{"value":"120000"},"analytics":{"value":false},"evolution":{"value":true},"environmentHandlerOptions":{"notificationServer":null,"cache":false}}}}]}],"apps":[]},"apps":["Concept Mapper@578f6057bb3adbac665c655a","CC dev Server@578f607dbb3adbac665c6597"],"phases":["Orientation@578f6043bb3adbac665c64bd","Conceptualisation@578f6043bb3adbac665c64c2","Investigation@578f6044bb3adbac665c64c7","Conclusion@578f6044bb3adbac665c64cc","Discussion@578f6044bb3adbac665c64d1"],"phasesWithApps":["Orientation@578f6043bb3adbac665c64bd","Discussion@578f6044bb3adbac665c64d1"]},"generated":1469035977289,"dataSource":"cache"},"graphic":{"svg":"{\"objects\":[{\"type\":\"path-group\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":748,\"height\":650,\"fill\":\"\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"paths\":[{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":50.94,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,458,256],\"skewX\":0,\"skewY\":0,\"text\":\"time\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":212.57,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,303,264],\"skewX\":0,\"skewY\":0,\"text\":\"luminous intensity\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":35.32,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,261,303],\"skewX\":0,\"skewY\":0,\"text\":\"mass\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":62.78,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,428,299],\"skewX\":0,\"skewY\":0,\"text\":\"sommer!\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"}]}],\"background\":\"\"}","generated":1469035977782}},{"data":{"general":{"§mass":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§time":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§luminous intensity":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§sommer!":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§winter?":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}}},"user":{"Kristina@578f60a3bb3adbac665c6660":{"content":{"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.6,"flashy":false,"fancy":false}},"Timm@578f6218bb3adbac665c6dbf":{"content":{"§sommer!":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§winter?":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.4,"flashy":true,"fancy":false}}}},"metadata":{"timestamp":"2016-07-20T17:37:18.450Z","ils":{"structure":{"id":"578f6043bb3adbac665c64b7","url":"http://graasp.eu/spaces/578f6043bb3adbac665c64b7","displayName":"test284657729474.2","phases":[{"id":"578f6043bb3adbac665c64bd","type":"Orientation","displayName":"Orientation","visibilityLevel":"public","apps":[{"id":"578f6057bb3adbac665c655a","displayName":"Concept Mapper","url":"http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6043bb3adbac665c64c2","type":"Conceptualisation","displayName":"Conceptualisation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64c7","type":"Investigation","displayName":"Investigation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64cc","type":"Conclusion","displayName":"Conclusion","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64d1","type":"Discussion","displayName":"Discussion","visibilityLevel":"public","apps":[{"id":"578f607dbb3adbac665c6597","displayName":"CC dev Server","url":"http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml","itemType":"Application","appType":"WidgetGadget","configuration":{"metadata":{"actor":{"displayName":"Kristina Angenendt","id":"5405e202da3a95cf9050e8fc","objectType":"graasp_editor"},"target":{"displayName":"","id":"cd3ee549-4356-411a-84ad-856f7032e902","objectType":"configuration"},"id":"578f607dbb3adbac665c6597_configuration","published":"2016-07-20T11:29:08.211Z"},"content":{"reflection":{"value":false},"timeOffset":{"value":"120000"},"analytics":{"value":false},"evolution":{"value":true},"environmentHandlerOptions":{"notificationServer":null,"cache":false}}}}]}],"apps":[]},"apps":["Concept Mapper@578f6057bb3adbac665c655a","CC dev Server@578f607dbb3adbac665c6597"],"phases":["Orientation@578f6043bb3adbac665c64bd","Conceptualisation@578f6043bb3adbac665c64c2","Investigation@578f6044bb3adbac665c64c7","Conclusion@578f6044bb3adbac665c64cc","Discussion@578f6044bb3adbac665c64d1"],"phasesWithApps":["Orientation@578f6043bb3adbac665c64bd","Discussion@578f6044bb3adbac665c64d1"]},"generated":1469036243688,"dataSource":"cache"},"graphic":{"svg":"{\"objects\":[{\"type\":\"path-group\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":748,\"height\":650,\"fill\":\"\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"paths\":[{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":35.32,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,535,363],\"skewX\":0,\"skewY\":0,\"text\":\"mass\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":31.39,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,473,390],\"skewX\":0,\"skewY\":0,\"text\":\"time\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":130.98,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,506,418],\"skewX\":0,\"skewY\":0,\"text\":\"luminous intensity\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":62.78,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,379,343],\"skewX\":0,\"skewY\":0,\"text\":\"sommer!\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":52.95,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,300,344],\"skewX\":0,\"skewY\":0,\"text\":\"winter?\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"}]}],\"background\":\"\"}","generated":1469036243947}},{"data":{"general":{"§mass":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§time":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§luminous intensity":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§sommer!":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§winter?":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}}},"user":{"Kristina@578f60a3bb3adbac665c6660":{"content":{"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.6,"flashy":false,"fancy":false}},"Timm@578f6218bb3adbac665c6dbf":{"content":{"§sommer!":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§winter?":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.4,"flashy":true,"fancy":false}}}},"metadata":{"timestamp":"2016-07-20T17:37:18.450Z","ils":{"structure":{"id":"578f6043bb3adbac665c64b7","url":"http://graasp.eu/spaces/578f6043bb3adbac665c64b7","displayName":"test284657729474.2","phases":[{"id":"578f6043bb3adbac665c64bd","type":"Orientation","displayName":"Orientation","visibilityLevel":"public","apps":[{"id":"578f6057bb3adbac665c655a","displayName":"Concept Mapper","url":"http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6043bb3adbac665c64c2","type":"Conceptualisation","displayName":"Conceptualisation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64c7","type":"Investigation","displayName":"Investigation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64cc","type":"Conclusion","displayName":"Conclusion","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64d1","type":"Discussion","displayName":"Discussion","visibilityLevel":"public","apps":[{"id":"578f607dbb3adbac665c6597","displayName":"CC dev Server","url":"http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml","itemType":"Application","appType":"WidgetGadget","configuration":{"metadata":{"actor":{"displayName":"Kristina Angenendt","id":"5405e202da3a95cf9050e8fc","objectType":"graasp_editor"},"target":{"displayName":"","id":"cd3ee549-4356-411a-84ad-856f7032e902","objectType":"configuration"},"id":"578f607dbb3adbac665c6597_configuration","published":"2016-07-20T11:29:08.211Z"},"content":{"reflection":{"value":false},"timeOffset":{"value":"120000"},"analytics":{"value":false},"evolution":{"value":true},"environmentHandlerOptions":{"notificationServer":null,"cache":false}}}}]}],"apps":[]},"apps":["Concept Mapper@578f6057bb3adbac665c655a","CC dev Server@578f607dbb3adbac665c6597"],"phases":["Orientation@578f6043bb3adbac665c64bd","Conceptualisation@578f6043bb3adbac665c64c2","Investigation@578f6044bb3adbac665c64c7","Conclusion@578f6044bb3adbac665c64cc","Discussion@578f6044bb3adbac665c64d1"],"phasesWithApps":["Orientation@578f6043bb3adbac665c64bd","Discussion@578f6044bb3adbac665c64d1"]},"generated":1469036701882,"dataSource":"cache"},"graphic":{"svg":"{\"objects\":[{\"type\":\"path-group\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":748,\"height\":650,\"fill\":\"\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"paths\":[{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":35.32,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,418,349],\"skewX\":0,\"skewY\":0,\"text\":\"mass\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":31.39,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,355,351],\"skewX\":0,\"skewY\":0,\"text\":\"time\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":130.98,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,524,322],\"skewX\":0,\"skewY\":0,\"text\":\"luminous intensity\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":62.78,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,445,377],\"skewX\":0,\"skewY\":0,\"text\":\"sommer!\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":52.95,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,376,295],\"skewX\":0,\"skewY\":0,\"text\":\"winter?\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"}]}],\"background\":\"\"}","generated":1469036702324}},{"data":{"general":{"§mass":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§time":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§luminous intensity":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§sommer!":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§winter?":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}}},"user":{"Kristina@578f60a3bb3adbac665c6660":{"content":{"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.6,"flashy":false,"fancy":false}},"Timm@578f6218bb3adbac665c6dbf":{"content":{"§sommer!":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§winter?":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.4,"flashy":true,"fancy":false}}}},"metadata":{"timestamp":"2016-07-20T17:37:18.450Z","ils":{"structure":{"id":"578f6043bb3adbac665c64b7","url":"http://graasp.eu/spaces/578f6043bb3adbac665c64b7","displayName":"test284657729474.2","phases":[{"id":"578f6043bb3adbac665c64bd","type":"Orientation","displayName":"Orientation","visibilityLevel":"public","apps":[{"id":"578f6057bb3adbac665c655a","displayName":"Concept Mapper","url":"http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6043bb3adbac665c64c2","type":"Conceptualisation","displayName":"Conceptualisation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64c7","type":"Investigation","displayName":"Investigation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64cc","type":"Conclusion","displayName":"Conclusion","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64d1","type":"Discussion","displayName":"Discussion","visibilityLevel":"public","apps":[{"id":"578f607dbb3adbac665c6597","displayName":"CC dev Server","url":"http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml","itemType":"Application","appType":"WidgetGadget","configuration":{"metadata":{"actor":{"displayName":"Kristina Angenendt","id":"5405e202da3a95cf9050e8fc","objectType":"graasp_editor"},"target":{"displayName":"","id":"cd3ee549-4356-411a-84ad-856f7032e902","objectType":"configuration"},"id":"578f607dbb3adbac665c6597_configuration","published":"2016-07-20T11:29:08.211Z"},"content":{"reflection":{"value":false},"timeOffset":{"value":"120000"},"analytics":{"value":false},"evolution":{"value":true},"environmentHandlerOptions":{"notificationServer":null,"cache":false}}}}]}],"apps":[]},"apps":["Concept Mapper@578f6057bb3adbac665c655a"],"phases":["Orientation@578f6043bb3adbac665c64bd","Conceptualisation@578f6043bb3adbac665c64c2","Investigation@578f6044bb3adbac665c64c7","Conclusion@578f6044bb3adbac665c64cc","Discussion@578f6044bb3adbac665c64d1"],"phasesWithApps":["Orientation@578f6043bb3adbac665c64bd","Discussion@578f6044bb3adbac665c64d1"]},"generated":1469087521160,"dataSource":"cache"},"graphic":{"svg":"{\"objects\":[{\"type\":\"path-group\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":622,\"height\":650,\"fill\":\"\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"paths\":[{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":35.32,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,158,473],\"skewX\":0,\"skewY\":0,\"text\":\"mass\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":31.39,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,181,447],\"skewX\":0,\"skewY\":0,\"text\":\"time\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":130.98,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,285,424],\"skewX\":0,\"skewY\":0,\"text\":\"luminous intensity\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":62.78,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,402,396],\"skewX\":0,\"skewY\":0,\"text\":\"sommer!\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":52.95,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,271,402],\"skewX\":0,\"skewY\":0,\"text\":\"winter?\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"}]}],\"background\":\"\"}","generated":1469087522055}},{"data":{"general":{"§mass":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§time":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§luminous intensity":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§sommer!":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§winter?":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}}},"user":{"Kristina@578f60a3bb3adbac665c6660":{"content":{"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.6,"flashy":false,"fancy":false}},"Timm@578f6218bb3adbac665c6dbf":{"content":{"§sommer!":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§winter?":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.4,"flashy":true,"fancy":false}}}},"metadata":{"timestamp":"2016-07-20T17:37:18.450Z","ils":{"structure":{"id":"578f6043bb3adbac665c64b7","url":"http://graasp.eu/spaces/578f6043bb3adbac665c64b7","displayName":"test284657729474.2","phases":[{"id":"578f6043bb3adbac665c64bd","type":"Orientation","displayName":"Orientation","visibilityLevel":"public","apps":[{"id":"578f6057bb3adbac665c655a","displayName":"Concept Mapper","url":"http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6043bb3adbac665c64c2","type":"Conceptualisation","displayName":"Conceptualisation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64c7","type":"Investigation","displayName":"Investigation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64cc","type":"Conclusion","displayName":"Conclusion","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64d1","type":"Discussion","displayName":"Discussion","visibilityLevel":"public","apps":[{"id":"578f607dbb3adbac665c6597","displayName":"CC dev Server","url":"http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml","itemType":"Application","appType":"WidgetGadget","configuration":{"metadata":{"actor":{"displayName":"Kristina Angenendt","id":"5405e202da3a95cf9050e8fc","objectType":"graasp_editor"},"target":{"displayName":"","id":"cd3ee549-4356-411a-84ad-856f7032e902","objectType":"configuration"},"id":"578f607dbb3adbac665c6597_configuration","published":"2016-07-20T11:29:08.211Z"},"content":{"reflection":{"value":false},"timeOffset":{"value":"120000"},"analytics":{"value":false},"evolution":{"value":true},"environmentHandlerOptions":{"notificationServer":null,"cache":false}}}}]}],"apps":[]},"apps":["Concept Mapper@578f6057bb3adbac665c655a"],"phases":["Orientation@578f6043bb3adbac665c64bd","Conceptualisation@578f6043bb3adbac665c64c2","Investigation@578f6044bb3adbac665c64c7","Conclusion@578f6044bb3adbac665c64cc","Discussion@578f6044bb3adbac665c64d1"],"phasesWithApps":["Orientation@578f6043bb3adbac665c64bd"]},"generated":1469088415427,"dataSource":"cache"},"graphic":{"svg":"{\"objects\":[{\"type\":\"path-group\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":622,\"height\":650,\"fill\":\"\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"paths\":[{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":35.32,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,329,435],\"skewX\":0,\"skewY\":0,\"text\":\"mass\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":31.39,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,319,408],\"skewX\":0,\"skewY\":0,\"text\":\"time\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":130.98,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,415,382],\"skewX\":0,\"skewY\":0,\"text\":\"luminous intensity\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":62.78,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,417,401],\"skewX\":0,\"skewY\":0,\"text\":\"sommer!\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":52.95,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,263,359],\"skewX\":0,\"skewY\":0,\"text\":\"winter?\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"}]}],\"background\":\"\"}","generated":1469088415648}},{"data":{"general":{"§mass":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§time":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§luminous intensity":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§sommer!":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}},"Investigation@578f6044bb3adbac665c64c7":{"frequency":1,"Hypothesis Scratchpad@5790843293c5ef98b7bd4f6f":{"frequency":1}}},"§winter?":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§thermodynamic temperature":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}}},"user":{"Kristina@578f60a3bb3adbac665c6660":{"content":{"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.5,"flashy":true,"fancy":false}},"Timm@578f6218bb3adbac665c6dbf":{"content":{"§sommer!":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}},"Investigation@578f6044bb3adbac665c64c7":{"Hypothesis Scratchpad@5790843293c5ef98b7bd4f6f":{"verb":"Something"}}},"§winter?":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§thermodynamic temperature":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":1,"flashy":false,"fancy":false}}}},"metadata":{"timestamp":"2016-07-21T08:14:14.552Z","ils":{"structure":{"id":"578f6043bb3adbac665c64b7","url":"http://graasp.eu/spaces/578f6043bb3adbac665c64b7","displayName":"test284657729474.2","phases":[{"id":"578f6043bb3adbac665c64bd","type":"Orientation","displayName":"Orientation","visibilityLevel":"public","apps":[{"id":"578f6057bb3adbac665c655a","displayName":"Concept Mapper","url":"http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6043bb3adbac665c64c2","type":"Conceptualisation","displayName":"Conceptualisation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64c7","type":"Investigation","displayName":"Investigation","visibilityLevel":"public","apps":[{"id":"5790843293c5ef98b7bd4f6f","displayName":"Hypothesis Scratchpad","url":"http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6044bb3adbac665c64cc","type":"Conclusion","displayName":"Conclusion","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64d1","type":"Discussion","displayName":"Discussion","visibilityLevel":"public","apps":[{"id":"578f607dbb3adbac665c6597","displayName":"CC dev Server","url":"http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml","itemType":"Application","appType":"WidgetGadget","configuration":{"metadata":{"actor":{"displayName":"Kristina Angenendt","id":"5405e202da3a95cf9050e8fc","objectType":"graasp_editor"},"target":{"displayName":"","id":"cd3ee549-4356-411a-84ad-856f7032e902","objectType":"configuration"},"id":"578f607dbb3adbac665c6597_configuration","published":"2016-07-20T11:29:08.211Z"},"content":{"reflection":{"value":false},"timeOffset":{"value":"120000"},"analytics":{"value":false},"evolution":{"value":true},"environmentHandlerOptions":{"notificationServer":null,"cache":false}}}}]}],"apps":[]},"apps":["Concept Mapper@578f6057bb3adbac665c655a","Hypothesis Scratchpad@5790843293c5ef98b7bd4f6f"],"phases":["Orientation@578f6043bb3adbac665c64bd","Conceptualisation@578f6043bb3adbac665c64c2","Investigation@578f6044bb3adbac665c64c7","Conclusion@578f6044bb3adbac665c64cc","Discussion@578f6044bb3adbac665c64d1"],"phasesWithApps":["Orientation@578f6043bb3adbac665c64bd","Investigation@578f6044bb3adbac665c64c7"]},"generated":1469088861484,"dataSource":"cache"},"graphic":{"svg":"{\"objects\":[{\"type\":\"path-group\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":748,\"height\":650,\"fill\":\"\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"paths\":[{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":57.32,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,406,480],\"skewX\":0,\"skewY\":0,\"text\":\"mass\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":50.94,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,434,453],\"skewX\":0,\"skewY\":0,\"text\":\"time\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":212.57,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,531,401],\"skewX\":0,\"skewY\":0,\"text\":\"luminous intensity\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":62.78,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,466,361],\"skewX\":0,\"skewY\":0,\"text\":\"sommer!\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":52.95,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,328,366],\"skewX\":0,\"skewY\":0,\"text\":\"winter?\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":199.57,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,569,333],\"skewX\":0,\"skewY\":0,\"text\":\"thermodynamic temperature\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"}]}],\"background\":\"\"}","generated":1469088861723}},{"data":{"general":{"§mass":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§time":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§luminous intensity":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§sommer!":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}},"Investigation@578f6044bb3adbac665c64c7":{"frequency":1,"Hypothesis Scratchpad@5790843293c5ef98b7bd4f6f":{"frequency":1}}},"§winter?":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§thermodynamic temperature":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}}},"user":{"Kristina@578f60a3bb3adbac665c6660":{"content":{"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.5,"flashy":true,"fancy":false}},"Timm@578f6218bb3adbac665c6dbf":{"content":{"§sommer!":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}},"Investigation@578f6044bb3adbac665c64c7":{"Hypothesis Scratchpad@5790843293c5ef98b7bd4f6f":{"verb":"Something"}}},"§winter?":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§thermodynamic temperature":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":1,"flashy":false,"fancy":false}}}},"metadata":{"timestamp":"2016-07-21T08:14:14.552Z","ils":{"structure":{"id":"578f6043bb3adbac665c64b7","url":"http://graasp.eu/spaces/578f6043bb3adbac665c64b7","displayName":"test284657729474.2","phases":[{"id":"578f6043bb3adbac665c64bd","type":"Orientation","displayName":"Orientation","visibilityLevel":"public","apps":[{"id":"578f6057bb3adbac665c655a","displayName":"Concept Mapper","url":"http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6043bb3adbac665c64c2","type":"Conceptualisation","displayName":"Conceptualisation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64c7","type":"Investigation","displayName":"Investigation","visibilityLevel":"public","apps":[{"id":"5790843293c5ef98b7bd4f6f","displayName":"Hypothesis Scratchpad","url":"http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6044bb3adbac665c64cc","type":"Conclusion","displayName":"Conclusion","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64d1","type":"Discussion","displayName":"Discussion","visibilityLevel":"public","apps":[{"id":"578f607dbb3adbac665c6597","displayName":"CC dev Server","url":"http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml","itemType":"Application","appType":"WidgetGadget","configuration":{"metadata":{"actor":{"displayName":"Timm Kleemann","id":"552d2b25ab247ab4c5dc6506","objectType":"graasp_editor"},"target":{"displayName":"conceptCloud","id":"8dbb93fa-4da3-4726-9526-008912626eba","objectType":"configuration"},"id":"578f607dbb3adbac665c6597_configuration","published":"2016-07-21T08:17:03.032Z"},"content":{"defaultTitle":{},"reflection":{"value":true},"timeOffset":{"value":120000},"id":"578f607dbb3adbac665c6597_configuration"}}}]}],"apps":[]},"apps":["Concept Mapper@578f6057bb3adbac665c655a","Hypothesis Scratchpad@5790843293c5ef98b7bd4f6f"],"phases":["Orientation@578f6043bb3adbac665c64bd","Conceptualisation@578f6043bb3adbac665c64c2","Investigation@578f6044bb3adbac665c64c7","Conclusion@578f6044bb3adbac665c64cc","Discussion@578f6044bb3adbac665c64d1"],"phasesWithApps":["Orientation@578f6043bb3adbac665c64bd","Investigation@578f6044bb3adbac665c64c7"]},"generated":1469089067290,"dataSource":"cache"},"graphic":{"svg":"{\"objects\":[{\"type\":\"path-group\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":622,\"height\":650,\"fill\":\"\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"paths\":[{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":57.32,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,396,225],\"skewX\":0,\"skewY\":0,\"text\":\"mass\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":50.94,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,306,277],\"skewX\":0,\"skewY\":0,\"text\":\"time\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":212.57,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,232,246],\"skewX\":0,\"skewY\":0,\"text\":\"luminous intensity\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":62.78,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,408,254],\"skewX\":0,\"skewY\":0,\"text\":\"sommer!\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":52.95,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,341,199],\"skewX\":0,\"skewY\":0,\"text\":\"winter?\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":199.57,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,351,319],\"skewX\":0,\"skewY\":0,\"text\":\"thermodynamic temperature\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"}]}],\"background\":\"\"}","generated":1469089067715}},{"data":{"general":{"§mass":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§time":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§luminous intensity":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§sommer!":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}},"Investigation@578f6044bb3adbac665c64c7":{"frequency":1,"Hypothesis Scratchpad@5790843293c5ef98b7bd4f6f":{"frequency":1}}},"§winter?":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§thermodynamic temperature":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}}},"user":{"Kristina@578f60a3bb3adbac665c6660":{"content":{"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.5,"flashy":true,"fancy":false}},"Timm@578f6218bb3adbac665c6dbf":{"content":{"§sommer!":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}},"Investigation@578f6044bb3adbac665c64c7":{"Hypothesis Scratchpad@5790843293c5ef98b7bd4f6f":{"verb":"Something"}}},"§winter?":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§thermodynamic temperature":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":1,"flashy":false,"fancy":false}}}},"metadata":{"timestamp":"2016-07-21T08:14:14.552Z","ils":{"structure":{"id":"578f6043bb3adbac665c64b7","url":"http://graasp.eu/spaces/578f6043bb3adbac665c64b7","displayName":"test284657729474.2","phases":[{"id":"578f6043bb3adbac665c64bd","type":"Orientation","displayName":"Orientation","visibilityLevel":"public","apps":[{"id":"578f6057bb3adbac665c655a","displayName":"Concept Mapper","url":"http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6043bb3adbac665c64c2","type":"Conceptualisation","displayName":"Conceptualisation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64c7","type":"Investigation","displayName":"Investigation","visibilityLevel":"public","apps":[{"id":"5790843293c5ef98b7bd4f6f","displayName":"Hypothesis Scratchpad","url":"http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6044bb3adbac665c64cc","type":"Conclusion","displayName":"Conclusion","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64d1","type":"Discussion","displayName":"Discussion","visibilityLevel":"public","apps":[{"id":"578f607dbb3adbac665c6597","displayName":"CC dev Server","url":"http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml","itemType":"Application","appType":"WidgetGadget","configuration":{"metadata":{"actor":{"displayName":"Timm Kleemann","id":"552d2b25ab247ab4c5dc6506","objectType":"graasp_editor"},"target":{"displayName":"conceptCloud","id":"8dbb93fa-4da3-4726-9526-008912626eba","objectType":"configuration"},"id":"578f607dbb3adbac665c6597_configuration","published":"2016-07-21T08:17:03.032Z"},"content":{"defaultTitle":{},"reflection":{"value":true},"timeOffset":{"value":120000},"id":"578f607dbb3adbac665c6597_configuration"}}}]}],"apps":[]},"apps":["Concept Mapper@578f6057bb3adbac665c655a","Hypothesis Scratchpad@5790843293c5ef98b7bd4f6f"],"phases":["Orientation@578f6043bb3adbac665c64bd","Conceptualisation@578f6043bb3adbac665c64c2","Investigation@578f6044bb3adbac665c64c7","Conclusion@578f6044bb3adbac665c64cc","Discussion@578f6044bb3adbac665c64d1"],"phasesWithApps":["Orientation@578f6043bb3adbac665c64bd","Investigation@578f6044bb3adbac665c64c7"]},"generated":1469090652245,"dataSource":"cache"},"graphic":{"svg":"{\"objects\":[{\"type\":\"path-group\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":622,\"height\":650,\"fill\":\"\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"paths\":[{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":57.32,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,254,212],\"skewX\":0,\"skewY\":0,\"text\":\"mass\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":50.94,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,343,268],\"skewX\":0,\"skewY\":0,\"text\":\"time\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":212.57,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,209,323],\"skewX\":0,\"skewY\":0,\"text\":\"luminous intensity\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":62.78,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,177,292],\"skewX\":0,\"skewY\":0,\"text\":\"sommer!\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":52.95,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,266,342],\"skewX\":0,\"skewY\":0,\"text\":\"winter?\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":199.57,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,254,370],\"skewX\":0,\"skewY\":0,\"text\":\"thermodynamic temperature\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"}]}],\"background\":\"\"}","generated":1469090652549}},{"data":{"general":{"§mass":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§time":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§luminous intensity":{"frequency":2,"Orientation@578f6043bb3adbac665c64bd":{"frequency":2,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":2}}},"§sommer!":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}},"Investigation@578f6044bb3adbac665c64c7":{"frequency":1,"Hypothesis Scratchpad@5790843293c5ef98b7bd4f6f":{"frequency":1}}},"§winter?":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}},"§thermodynamic temperature":{"frequency":1,"Orientation@578f6043bb3adbac665c64bd":{"frequency":1,"Concept Mapper@578f6057bb3adbac665c655a":{"frequency":1}}}},"user":{"Kristina@578f60a3bb3adbac665c6660":{"content":{"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":0.5,"flashy":true,"fancy":false}},"Timm@578f6218bb3adbac665c6dbf":{"content":{"§sommer!":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}},"Investigation@578f6044bb3adbac665c64c7":{"Hypothesis Scratchpad@5790843293c5ef98b7bd4f6f":{"verb":"Something"}}},"§winter?":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§thermodynamic temperature":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§luminous intensity":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§time":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}},"§mass":{"Orientation@578f6043bb3adbac665c64bd":{"Concept Mapper@578f6057bb3adbac665c655a":{"verb":"Something"}}}},"metacontent":{"conceptScore":1,"flashy":false,"fancy":false}}}},"metadata":{"timestamp":"2016-07-21T08:14:14.552Z","ils":{"structure":{"id":"578f6043bb3adbac665c64b7","url":"http://graasp.eu/spaces/578f6043bb3adbac665c64b7","displayName":"test284657729474.2","phases":[{"id":"578f6043bb3adbac665c64bd","type":"Orientation","displayName":"Orientation","visibilityLevel":"public","apps":[{"id":"578f6057bb3adbac665c655a","displayName":"Concept Mapper","url":"http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6043bb3adbac665c64c2","type":"Conceptualisation","displayName":"Conceptualisation","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64c7","type":"Investigation","displayName":"Investigation","visibilityLevel":"public","apps":[{"id":"5790843293c5ef98b7bd4f6f","displayName":"Hypothesis Scratchpad","url":"http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml","itemType":"Application","appType":"WidgetGadget"}]},{"id":"578f6044bb3adbac665c64cc","type":"Conclusion","displayName":"Conclusion","visibilityLevel":"public","apps":[]},{"id":"578f6044bb3adbac665c64d1","type":"Discussion","displayName":"Discussion","visibilityLevel":"public","apps":[{"id":"578f607dbb3adbac665c6597","displayName":"CC dev Server","url":"http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml","itemType":"Application","appType":"WidgetGadget","configuration":{"metadata":{"actor":{"displayName":"Timm Kleemann","id":"552d2b25ab247ab4c5dc6506","objectType":"graasp_editor"},"target":{"displayName":"conceptCloud","id":"8dbb93fa-4da3-4726-9526-008912626eba","objectType":"configuration"},"id":"578f607dbb3adbac665c6597_configuration","published":"2016-07-21T08:17:03.032Z"},"content":{"defaultTitle":{},"reflection":{"value":true},"timeOffset":{"value":120000},"id":"578f607dbb3adbac665c6597_configuration"}}}]}],"apps":[]},"apps":["Concept Mapper@578f6057bb3adbac665c655a","Hypothesis Scratchpad@5790843293c5ef98b7bd4f6f"],"phases":["Orientation@578f6043bb3adbac665c64bd","Conceptualisation@578f6043bb3adbac665c64c2","Investigation@578f6044bb3adbac665c64c7","Conclusion@578f6044bb3adbac665c64cc","Discussion@578f6044bb3adbac665c64d1"],"phasesWithApps":["Orientation@578f6043bb3adbac665c64bd","Investigation@578f6044bb3adbac665c64c7"]},"generated":1469090898123,"dataSource":"cache"},"graphic":{"svg":"{\"objects\":[{\"type\":\"path-group\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":622,\"height\":650,\"fill\":\"\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":null,\"skewX\":0,\"skewY\":0,\"paths\":[{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":57.32,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,173,234],\"skewX\":0,\"skewY\":0,\"text\":\"mass\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":50.94,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,254,286],\"skewX\":0,\"skewY\":0,\"text\":\"time\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-8.74,\"width\":212.57,\"height\":32.39,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,445,329],\"skewX\":0,\"skewY\":0,\"text\":\"luminous intensity\",\"fontSize\":28.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":62.78,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,171,197],\"skewX\":0,\"skewY\":0,\"text\":\"sommer!\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":52.95,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,188,301],\"skewX\":0,\"skewY\":0,\"text\":\"winter?\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"},{\"type\":\"text\",\"originX\":\"center\",\"originY\":\"top\",\"left\":0,\"top\":-5.61,\"width\":199.57,\"height\":19.96,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":10,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"clipTo\":null,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"globalCompositeOperation\":\"source-over\",\"transformMatrix\":[1,0,0,1,307,372],\"skewX\":0,\"skewY\":0,\"text\":\"thermodynamic temperature\",\"fontSize\":17.6667,\"fontWeight\":\"normal\",\"fontFamily\":\"\\\"Avant Garde\\\"\",\"fontStyle\":\"\",\"lineHeight\":1.16,\"textDecoration\":\"\",\"textAlign\":\"left\",\"textBackgroundColor\":\"\"}]}],\"background\":\"\"}","generated":1469090898559}}];

        var dummyData = [
            {
                "metadata": {
                    "id": "657e5f32-8764-42d3-cf0b-cc77ee38b21d",
                    "published": "2016-06-13T11:30:25.661Z",
                    "actor": {
                        "objectType": "html_student",
                        "id": "timm@http://localhost:63342/",
                        "displayName": "Timm"
                    },
                    "target": {
                        "objectType": "conceptClouds",
                        "displayName": "ConceptClouds",
                        "id": "71f47da7-fd71-4676-a4df-2f9436066be9"
                    },
                    "generator": {
                        "objectType": "application",
                        "url": "http://localhost:63342/golab/trunk/client/tools/concept_cloud/index.html?storageServer=local",
                        "id": "conceptCloud@http://localhost:63342/golab/trunk/client/tools/concept_cloud/index.html",
                        "displayName": "conceptCloud"
                    },
                    "provider": {
                        "objectType": "ils",
                        "url": "http://localhost:63342/golab/trunk/client/tools/concept_cloud/index.html?storageServer=local",
                        "id": "http://localhost:63342/",
                        "inquiryPhase": "unknown",
                        "inquiryPhaseId": "unknown",
                        "inquiryPhaseName": "unknown",
                        "displayName": "[Timm] Go Lab ConceptCloud"
                    }
                },
                "content": {
                    "metadata": {
                        "published": "2016-06-13T11:30:25.658Z",
                        "target": {
                            "objectType": "conceptCloudData",
                            "displayName": "ConceptClouds"
                        }
                    },
                    "conceptClouds": [
                        {
                            "data": {
                                "general": {
                                    "§jupiter": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§mars": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§collapse gaseous nebula": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§helium nuclear fusion": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§helium trace": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stellar core": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§energy process": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§binary multi-star systems": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§interaction significant impact": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§star cluster galaxy": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stable orbits.": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stars important civilizations": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§heavenly sphere": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§celestial navigation": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§ancient astronomers": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§religious practices": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§the moon": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§constellations asterisms": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    }
                                },
                                "user": {
                                    "timm@http://localhost:63342/": {
                                        "content": {
                                            "§erde": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§pluto": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§saturn": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§galaxis": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§moon": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§sky": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§solar system": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§luminous sphere plasma": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§thermonuclear fusion hydrogen": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§radiates outer space": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§energy traverses": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§star shines": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§helium core": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§portion life": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the sun": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§than": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the earth": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            }
                                        },
                                        "metacontent": {
                                            "conceptScore": 0.40476190476190477,
                                            "flashy": true,
                                            "fancy": false
                                        }
                                    },
                                    "Kevin@569384117ec4757d0b005941": {
                                        "content": {
                                            "§neptun": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§sun": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                },
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§venus": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§moon": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§earth": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                },
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§mercury": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§planet": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§thermonuclear fusion hydrogen": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§radiates outer space": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§energy traverses": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§star shines": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§helium core": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§portion life": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§star": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§saturn": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§jupiter": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§mars": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§collapse gaseous nebula": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§helium nuclear fusion": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§helium trace": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§stellar core": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§energy process": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            }
                                        },
                                        "metacontent": {
                                            "conceptScore": 0.5238095238095238,
                                            "flashy": false,
                                            "fancy": true
                                        }
                                    },
                                    "Mandy@569387127ec4757d0b006f3e": {
                                        "content": {
                                            "§star": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§pluto": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§sun": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§jupiter": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§earth": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§saturn": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§planet": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§binary multi-star systems": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§interaction significant impact": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§star cluster galaxy": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§stable orbits.": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§stars important civilizations": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§heavenly sphere": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§celestial navigation": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§ancient astronomers": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§religious practices": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the sun": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the earth": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the moon": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            }
                                        },
                                        "metacontent": {
                                            "conceptScore": 0.4523809523809524,
                                            "flashy": false,
                                            "fancy": false
                                        }
                                    },
                                    "Test@56939d2f6bf9876e27a2655c": {
                                        "content": {
                                            "§pluto": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    },
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                },
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                },
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§constellations asterisms": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            }
                                        },
                                        "metacontent": {
                                            "conceptScore": 0.047619047619047616,
                                            "flashy": true,
                                            "fancy": false
                                        }
                                    }
                                }
                            },
                            "metadata": {
                                "timestamp": "2016-06-13T12:01:29.936Z",
                                "ils": {
                                    "structure": {
                                        "id": "56937d5c7ec4757d0bffc0d1",
                                        "url": "http://graasp.eu/spaces/9",
                                        "displayName": "DummyILSStructure",
                                        "phases": [
                                            {
                                                "id": "56937d5d7ec4757d0bffc0e9",
                                                "type": "Vault",
                                                "displayName": "Orientation",
                                                "apps": [
                                                    {
                                                        "id": "56937d987ec4757d0bffc1ea",
                                                        "displayName": "Wiki App",
                                                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    },
                                                    {
                                                        "id": "56937da87ec4757d0bffc224",
                                                        "displayName": "Concept Mapper",
                                                        "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0ee",
                                                "type": "Vault",
                                                "displayName": "Conceptualisation",
                                                "apps": [
                                                    {
                                                        "id": "56937f397ec4757d0bffe924",
                                                        "displayName": "Wiki App",
                                                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0f3",
                                                "type": "Vault",
                                                "displayName": "Investigation",
                                                "apps": [
                                                    {
                                                        "id": "569381277ec4757d0b001fb8",
                                                        "displayName": "Hypothesis Scratchpad",
                                                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0f8",
                                                "type": "Vault",
                                                "displayName": "Conclusion",
                                                "apps": []
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0fd",
                                                "type": "Vault",
                                                "displayName": "Discussion",
                                                "apps": [
                                                    {
                                                        "id": "5694ce939379a211a432d7a2",
                                                        "displayName": "Concept Cloud",
                                                        "url": "http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            }
                                        ],
                                        "apps": []
                                    },
                                    "apps": [
                                        "Wiki App@56937d987ec4757d0bffc1ea",
                                        "Concept Mapper@56937da87ec4757d0bffc224",
                                        "Wiki App@56937f397ec4757d0bffe924",
                                        "Hypothesis Scratchpad@569381277ec4757d0b001fb8",
                                        "Concept Cloud@5694ce939379a211a432d7a2"
                                    ],
                                    "phases": [
                                        "Orientation@56937d5d7ec4757d0bffc0e9",
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee",
                                        "Investigation@56937d5d7ec4757d0bffc0f3",
                                        "Conclusion@56937d5d7ec4757d0bffc0f8",
                                        "Discussion@56937d5d7ec4757d0bffc0fd"
                                    ],
                                    "phasesWithApps": [
                                        "Orientation@56937d5d7ec4757d0bffc0e9",
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee",
                                        "Investigation@56937d5d7ec4757d0bffc0f3",
                                        "Discussion@56937d5d7ec4757d0bffc0fd"
                                    ]
                                },
                                "generated": "2016-06-13T12:01:33.735Z"
                            }
                        },
                        {
                            "data": {
                                "general": {
                                    "§sun": {
                                        "frequency": 2,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        },
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§venus": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§earth": {
                                        "frequency": 2,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        },
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§mercury": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§planet": {
                                        "frequency": 2,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        }
                                    },
                                    "§star": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§jupiter": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§mars": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§collapse gaseous nebula": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§helium nuclear fusion": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§helium trace": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stellar core": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§energy process": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§binary multi-star systems": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§interaction significant impact": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§star cluster galaxy": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stable orbits.": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stars important civilizations": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§heavenly sphere": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§celestial navigation": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§ancient astronomers": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§religious practices": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§the moon": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§constellations asterisms": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    }
                                },
                                "user": {
                                    "timm@http://localhost:63342/": {
                                        "content": {
                                            "§erde": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§pluto": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§saturn": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§galaxis": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§moon": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§sky": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§solar system": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§luminous sphere plasma": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§thermonuclear fusion hydrogen": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§radiates outer space": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§energy traverses": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§star shines": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§helium core": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§portion life": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the sun": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§than": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the earth": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            }
                                        },
                                        "metacontent": {
                                            "conceptScore": 0.40476190476190477,
                                            "flashy": true,
                                            "fancy": false
                                        }
                                    },
                                    "Kevin@569384117ec4757d0b005941": {
                                        "content": {
                                            "§neptun": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§sun": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                },
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§venus": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§moon": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§earth": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                },
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§mercury": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§planet": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§thermonuclear fusion hydrogen": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§radiates outer space": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§energy traverses": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§star shines": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§helium core": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§portion life": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§star": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§saturn": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§jupiter": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§mars": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§collapse gaseous nebula": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§helium nuclear fusion": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§helium trace": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§stellar core": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§energy process": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            }
                                        },
                                        "metacontent": {
                                            "conceptScore": 0.5238095238095238,
                                            "flashy": false,
                                            "fancy": true
                                        }
                                    },
                                    "Mandy@569387127ec4757d0b006f3e": {
                                        "content": {
                                            "§star": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§pluto": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§sun": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§jupiter": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§earth": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§saturn": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§planet": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§binary multi-star systems": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§interaction significant impact": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§star cluster galaxy": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§stable orbits.": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§stars important civilizations": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§heavenly sphere": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§celestial navigation": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§ancient astronomers": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§religious practices": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the sun": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the earth": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the moon": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            }
                                        },
                                        "metacontent": {
                                            "conceptScore": 0.4523809523809524,
                                            "flashy": false,
                                            "fancy": false
                                        }
                                    },
                                    "Test@56939d2f6bf9876e27a2655c": {
                                        "content": {
                                            "§pluto": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    },
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                },
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                },
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§constellations asterisms": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            }
                                        },
                                        "metacontent": {
                                            "conceptScore": 0.047619047619047616,
                                            "flashy": true,
                                            "fancy": false
                                        }
                                    }
                                }
                            },
                            "metadata": {
                                "timestamp": "2016-06-13T12:05:29.936Z",
                                "ils": {
                                    "structure": {
                                        "id": "56937d5c7ec4757d0bffc0d1",
                                        "url": "http://graasp.eu/spaces/9",
                                        "displayName": "DummyILSStructure",
                                        "phases": [
                                            {
                                                "id": "56937d5d7ec4757d0bffc0e9",
                                                "type": "Vault",
                                                "displayName": "Orientation",
                                                "apps": [
                                                    {
                                                        "id": "56937d987ec4757d0bffc1ea",
                                                        "displayName": "Wiki App",
                                                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    },
                                                    {
                                                        "id": "56937da87ec4757d0bffc224",
                                                        "displayName": "Concept Mapper",
                                                        "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0ee",
                                                "type": "Vault",
                                                "displayName": "Conceptualisation",
                                                "apps": [
                                                    {
                                                        "id": "56937f397ec4757d0bffe924",
                                                        "displayName": "Wiki App",
                                                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0f3",
                                                "type": "Vault",
                                                "displayName": "Investigation",
                                                "apps": [
                                                    {
                                                        "id": "569381277ec4757d0b001fb8",
                                                        "displayName": "Hypothesis Scratchpad",
                                                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0f8",
                                                "type": "Vault",
                                                "displayName": "Conclusion",
                                                "apps": []
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0fd",
                                                "type": "Vault",
                                                "displayName": "Discussion",
                                                "apps": [
                                                    {
                                                        "id": "5694ce939379a211a432d7a2",
                                                        "displayName": "Concept Cloud",
                                                        "url": "http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            }
                                        ],
                                        "apps": []
                                    },
                                    "apps": [
                                        "Wiki App@56937d987ec4757d0bffc1ea",
                                        "Concept Mapper@56937da87ec4757d0bffc224",
                                        "Wiki App@56937f397ec4757d0bffe924",
                                        "Hypothesis Scratchpad@569381277ec4757d0b001fb8",
                                        "Concept Cloud@5694ce939379a211a432d7a2"
                                    ],
                                    "phases": [
                                        "Orientation@56937d5d7ec4757d0bffc0e9",
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee",
                                        "Investigation@56937d5d7ec4757d0bffc0f3",
                                        "Conclusion@56937d5d7ec4757d0bffc0f8",
                                        "Discussion@56937d5d7ec4757d0bffc0fd"
                                    ],
                                    "phasesWithApps": [
                                        "Orientation@56937d5d7ec4757d0bffc0e9",
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee",
                                        "Investigation@56937d5d7ec4757d0bffc0f3",
                                        "Discussion@56937d5d7ec4757d0bffc0fd"
                                    ]
                                },
                                "generated": "2016-06-13T12:05:28.702Z"
                            }
                        },
                        {
                            "data": {
                                "general": {
                                    "§helium core": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§portion life": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§the sun": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 2,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 2
                                            }
                                        }
                                    },
                                    "§than": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§the earth": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 2,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 2
                                            }
                                        }
                                    },
                                    "§neptun": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§sun": {
                                        "frequency": 2,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        },
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§venus": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§earth": {
                                        "frequency": 2,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        },
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§mercury": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§planet": {
                                        "frequency": 2,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        }
                                    },
                                    "§star": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§jupiter": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§mars": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§collapse gaseous nebula": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§helium nuclear fusion": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§helium trace": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stellar core": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§energy process": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§binary multi-star systems": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§interaction significant impact": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§star cluster galaxy": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stable orbits.": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stars important civilizations": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§heavenly sphere": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§celestial navigation": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§ancient astronomers": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§religious practices": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§the moon": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§constellations asterisms": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    }
                                },
                                "user": {
                                    "timm@http://localhost:63342/": {
                                        "content": {
                                            "§erde": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§pluto": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§saturn": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§galaxis": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§moon": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§sky": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§solar system": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§luminous sphere plasma": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§thermonuclear fusion hydrogen": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§radiates outer space": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§energy traverses": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§star shines": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§helium core": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§portion life": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the sun": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§than": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the earth": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            }
                                        },
                                        "metacontent": {
                                            "conceptScore": 0.40476190476190477,
                                            "flashy": true,
                                            "fancy": false
                                        }
                                    },
                                    "Kevin@569384117ec4757d0b005941": {
                                        "content": {
                                            "§neptun": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§sun": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                },
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§venus": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§moon": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§earth": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                },
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§mercury": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§planet": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§thermonuclear fusion hydrogen": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§radiates outer space": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§energy traverses": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§star shines": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§helium core": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§portion life": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§star": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§saturn": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§jupiter": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§mars": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§collapse gaseous nebula": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§helium nuclear fusion": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§helium trace": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§stellar core": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§energy process": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            }
                                        },
                                        "metacontent": {
                                            "conceptScore": 0.5238095238095238,
                                            "flashy": false,
                                            "fancy": true
                                        }
                                    },
                                    "Mandy@569387127ec4757d0b006f3e": {
                                        "content": {
                                            "§star": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§pluto": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§sun": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§jupiter": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§earth": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§saturn": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§planet": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§binary multi-star systems": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§interaction significant impact": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§star cluster galaxy": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§stable orbits.": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§stars important civilizations": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§heavenly sphere": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§celestial navigation": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§ancient astronomers": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§religious practices": {
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the sun": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the earth": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§the moon": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            }
                                        },
                                        "metacontent": {
                                            "conceptScore": 0.4523809523809524,
                                            "flashy": false,
                                            "fancy": false
                                        }
                                    },
                                    "Test@56939d2f6bf9876e27a2655c": {
                                        "content": {
                                            "§pluto": {
                                                "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                    "Concept Mapper@56937da87ec4757d0bffc224": {
                                                        "verb": "Something"
                                                    },
                                                    "Wiki App@56937d987ec4757d0bffc1ea": {
                                                        "verb": "Something"
                                                    }
                                                },
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                },
                                                "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                    "Wiki App@56937f397ec4757d0bffe924": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            },
                                            "§constellations asterisms": {
                                                "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                    "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                        "verb": "Something"
                                                    }
                                                }
                                            }
                                        },
                                        "metacontent": {
                                            "conceptScore": 0.047619047619047616,
                                            "flashy": true,
                                            "fancy": false
                                        }
                                    }
                                }
                            },
                            "metadata": {
                                "timestamp": "2016-06-13T12:09:29.936Z",
                                "ils": {
                                    "structure": {
                                        "id": "56937d5c7ec4757d0bffc0d1",
                                        "url": "http://graasp.eu/spaces/9",
                                        "displayName": "DummyILSStructure",
                                        "phases": [
                                            {
                                                "id": "56937d5d7ec4757d0bffc0e9",
                                                "type": "Vault",
                                                "displayName": "Orientation",
                                                "apps": [
                                                    {
                                                        "id": "56937d987ec4757d0bffc1ea",
                                                        "displayName": "Wiki App",
                                                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    },
                                                    {
                                                        "id": "56937da87ec4757d0bffc224",
                                                        "displayName": "Concept Mapper",
                                                        "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0ee",
                                                "type": "Vault",
                                                "displayName": "Conceptualisation",
                                                "apps": [
                                                    {
                                                        "id": "56937f397ec4757d0bffe924",
                                                        "displayName": "Wiki App",
                                                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0f3",
                                                "type": "Vault",
                                                "displayName": "Investigation",
                                                "apps": [
                                                    {
                                                        "id": "569381277ec4757d0b001fb8",
                                                        "displayName": "Hypothesis Scratchpad",
                                                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0f8",
                                                "type": "Vault",
                                                "displayName": "Conclusion",
                                                "apps": []
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0fd",
                                                "type": "Vault",
                                                "displayName": "Discussion",
                                                "apps": [
                                                    {
                                                        "id": "5694ce939379a211a432d7a2",
                                                        "displayName": "Concept Cloud",
                                                        "url": "http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            }
                                        ],
                                        "apps": []
                                    },
                                    "apps": [
                                        "Wiki App@56937d987ec4757d0bffc1ea",
                                        "Concept Mapper@56937da87ec4757d0bffc224",
                                        "Wiki App@56937f397ec4757d0bffe924",
                                        "Hypothesis Scratchpad@569381277ec4757d0b001fb8",
                                        "Concept Cloud@5694ce939379a211a432d7a2"
                                    ],
                                    "phases": [
                                        "Orientation@56937d5d7ec4757d0bffc0e9",
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee",
                                        "Investigation@56937d5d7ec4757d0bffc0f3",
                                        "Conclusion@56937d5d7ec4757d0bffc0f8",
                                        "Discussion@56937d5d7ec4757d0bffc0fd"
                                    ],
                                    "phasesWithApps": [
                                        "Orientation@56937d5d7ec4757d0bffc0e9",
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee",
                                        "Investigation@56937d5d7ec4757d0bffc0f3",
                                        "Discussion@56937d5d7ec4757d0bffc0fd"
                                    ]
                                },
                                "generated": "2016-06-13T12:09:56.237Z"
                            }
                        },
                        {
                            "data": {
                                "general": {
                                    "§luminous sphere plasma": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§thermonuclear fusion hydrogen": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§radiates outer space": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§energy traverses": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§star shines": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§helium core": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§portion life": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§the sun": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 2,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 2
                                            }
                                        }
                                    },
                                    "§than": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§the earth": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 2,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 2
                                            }
                                        }
                                    },
                                    "§neptun": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§sun": {
                                        "frequency": 2,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        },
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§venus": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§earth": {
                                        "frequency": 2,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        },
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§mercury": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§planet": {
                                        "frequency": 2,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        }
                                    },
                                    "§star": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§jupiter": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§mars": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§collapse gaseous nebula": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§helium nuclear fusion": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§helium trace": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stellar core": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§energy process": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§binary multi-star systems": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§interaction significant impact": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§star cluster galaxy": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stable orbits.": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stars important civilizations": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§heavenly sphere": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§celestial navigation": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§ancient astronomers": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§religious practices": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§the moon": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§constellations asterisms": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    }
                                },
                                "user": {
                                    "content": {
                                        "§erde": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§pluto": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§saturn": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§galaxis": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§moon": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§sky": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§solar system": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§luminous sphere plasma": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Wiki App@56937d987ec4757d0bffc1ea": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§thermonuclear fusion hydrogen": {
                                            "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                "Wiki App@56937f397ec4757d0bffe924": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§radiates outer space": {
                                            "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                "Wiki App@56937f397ec4757d0bffe924": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§energy traverses": {
                                            "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                "Wiki App@56937f397ec4757d0bffe924": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§star shines": {
                                            "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                "Wiki App@56937f397ec4757d0bffe924": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§helium core": {
                                            "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                "Wiki App@56937f397ec4757d0bffe924": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§portion life": {
                                            "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                "Wiki App@56937f397ec4757d0bffe924": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§the sun": {
                                            "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§than": {
                                            "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§the earth": {
                                            "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                    "verb": "Something"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "metadata": {
                                "timestamp": "2016-06-13T12:14:00.247Z",
                                "ils": {
                                    "structure": {
                                        "id": "56937d5c7ec4757d0bffc0d1",
                                        "url": "http://graasp.eu/spaces/9",
                                        "displayName": "DummyILSStructure",
                                        "phases": [
                                            {
                                                "id": "56937d5d7ec4757d0bffc0e9",
                                                "type": "Vault",
                                                "displayName": "Orientation",
                                                "apps": [
                                                    {
                                                        "id": "56937d987ec4757d0bffc1ea",
                                                        "displayName": "Wiki App",
                                                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    },
                                                    {
                                                        "id": "56937da87ec4757d0bffc224",
                                                        "displayName": "Concept Mapper",
                                                        "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0ee",
                                                "type": "Vault",
                                                "displayName": "Conceptualisation",
                                                "apps": [
                                                    {
                                                        "id": "56937f397ec4757d0bffe924",
                                                        "displayName": "Wiki App",
                                                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0f3",
                                                "type": "Vault",
                                                "displayName": "Investigation",
                                                "apps": [
                                                    {
                                                        "id": "569381277ec4757d0b001fb8",
                                                        "displayName": "Hypothesis Scratchpad",
                                                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0f8",
                                                "type": "Vault",
                                                "displayName": "Conclusion",
                                                "apps": []
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0fd",
                                                "type": "Vault",
                                                "displayName": "Discussion",
                                                "apps": [
                                                    {
                                                        "id": "5694ce939379a211a432d7a2",
                                                        "displayName": "Concept Cloud",
                                                        "url": "http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            }
                                        ],
                                        "apps": []
                                    },
                                    "apps": [
                                        "Wiki App@56937d987ec4757d0bffc1ea",
                                        "Concept Mapper@56937da87ec4757d0bffc224",
                                        "Wiki App@56937f397ec4757d0bffe924",
                                        "Hypothesis Scratchpad@569381277ec4757d0b001fb8",
                                        "Concept Cloud@5694ce939379a211a432d7a2"
                                    ],
                                    "phases": [
                                        "Orientation@56937d5d7ec4757d0bffc0e9",
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee",
                                        "Investigation@56937d5d7ec4757d0bffc0f3",
                                        "Conclusion@56937d5d7ec4757d0bffc0f8",
                                        "Discussion@56937d5d7ec4757d0bffc0fd"
                                    ],
                                    "phasesWithApps": [
                                        "Orientation@56937d5d7ec4757d0bffc0e9",
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee",
                                        "Investigation@56937d5d7ec4757d0bffc0f3",
                                        "Discussion@56937d5d7ec4757d0bffc0fd"
                                    ]
                                },
                                "generated": "2016-06-13T12:14:22.091Z"
                            }
                        },
                        {
                            "data": {
                                "general": {
                                    "§erde": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§pluto": {
                                        "frequency": 3,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 3,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 3
                                            },
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        },
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        },
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§saturn": {
                                        "frequency": 3,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        },
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§galaxis": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§moon": {
                                        "frequency": 2,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        }
                                    },
                                    "§sky": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§solar system": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§luminous sphere plasma": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§thermonuclear fusion hydrogen": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§radiates outer space": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§energy traverses": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§star shines": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§helium core": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§portion life": {
                                        "frequency": 2,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§the sun": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 2,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 2
                                            }
                                        }
                                    },
                                    "§than": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§the earth": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 2,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 2
                                            }
                                        }
                                    },
                                    "§neptun": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§sun": {
                                        "frequency": 2,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        },
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§venus": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§earth": {
                                        "frequency": 2,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        },
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§mercury": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§planet": {
                                        "frequency": 2,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 2,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 2
                                            }
                                        }
                                    },
                                    "§star": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§jupiter": {
                                        "frequency": 2,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        },
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Concept Mapper@56937da87ec4757d0bffc224": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§mars": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§collapse gaseous nebula": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§helium nuclear fusion": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§helium trace": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stellar core": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§energy process": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§binary multi-star systems": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§interaction significant impact": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§star cluster galaxy": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stable orbits.": {
                                        "frequency": 1,
                                        "Orientation@56937d5d7ec4757d0bffc0e9": {
                                            "frequency": 1,
                                            "Wiki App@56937d987ec4757d0bffc1ea": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§stars important civilizations": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§heavenly sphere": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§celestial navigation": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§ancient astronomers": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§religious practices": {
                                        "frequency": 1,
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                            "frequency": 1,
                                            "Wiki App@56937f397ec4757d0bffe924": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§the moon": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    },
                                    "§constellations asterisms": {
                                        "frequency": 1,
                                        "Investigation@56937d5d7ec4757d0bffc0f3": {
                                            "frequency": 1,
                                            "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                "frequency": 1
                                            }
                                        }
                                    }
                                },
                                "user": {
                                    "content": {
                                        "§erde": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§pluto": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§saturn": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§galaxis": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§moon": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§sky": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§solar system": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Concept Mapper@56937da87ec4757d0bffc224": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§luminous sphere plasma": {
                                            "Orientation@56937d5d7ec4757d0bffc0e9": {
                                                "Wiki App@56937d987ec4757d0bffc1ea": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§thermonuclear fusion hydrogen": {
                                            "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                "Wiki App@56937f397ec4757d0bffe924": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§radiates outer space": {
                                            "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                "Wiki App@56937f397ec4757d0bffe924": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§energy traverses": {
                                            "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                "Wiki App@56937f397ec4757d0bffe924": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§star shines": {
                                            "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                "Wiki App@56937f397ec4757d0bffe924": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§helium core": {
                                            "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                "Wiki App@56937f397ec4757d0bffe924": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§portion life": {
                                            "Conceptualisation@56937d5d7ec4757d0bffc0ee": {
                                                "Wiki App@56937f397ec4757d0bffe924": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§the sun": {
                                            "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§than": {
                                            "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                    "verb": "Something"
                                                }
                                            }
                                        },
                                        "§the earth": {
                                            "Investigation@56937d5d7ec4757d0bffc0f3": {
                                                "Hypothesis Scratchpad@569381277ec4757d0b001fb8": {
                                                    "verb": "Something"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "metadata": {
                                "timestamp": "2016-06-13T12:18:53.076Z",
                                "ils": {
                                    "structure": {
                                        "id": "56937d5c7ec4757d0bffc0d1",
                                        "url": "http://graasp.eu/spaces/9",
                                        "displayName": "DummyILSStructure",
                                        "phases": [
                                            {
                                                "id": "56937d5d7ec4757d0bffc0e9",
                                                "type": "Vault",
                                                "displayName": "Orientation",
                                                "apps": [
                                                    {
                                                        "id": "56937d987ec4757d0bffc1ea",
                                                        "displayName": "Wiki App",
                                                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    },
                                                    {
                                                        "id": "56937da87ec4757d0bffc224",
                                                        "displayName": "Concept Mapper",
                                                        "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0ee",
                                                "type": "Vault",
                                                "displayName": "Conceptualisation",
                                                "apps": [
                                                    {
                                                        "id": "56937f397ec4757d0bffe924",
                                                        "displayName": "Wiki App",
                                                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0f3",
                                                "type": "Vault",
                                                "displayName": "Investigation",
                                                "apps": [
                                                    {
                                                        "id": "569381277ec4757d0b001fb8",
                                                        "displayName": "Hypothesis Scratchpad",
                                                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0f8",
                                                "type": "Vault",
                                                "displayName": "Conclusion",
                                                "apps": []
                                            },
                                            {
                                                "id": "56937d5d7ec4757d0bffc0fd",
                                                "type": "Vault",
                                                "displayName": "Discussion",
                                                "apps": [
                                                    {
                                                        "id": "5694ce939379a211a432d7a2",
                                                        "displayName": "Concept Cloud",
                                                        "url": "http://golab-dev.collide.info/client/tools/concept_cloud/gadget.xml",
                                                        "itemType": "Application",
                                                        "appType": "WidgetGadget"
                                                    }
                                                ]
                                            }
                                        ],
                                        "apps": []
                                    },
                                    "apps": [
                                        "Wiki App@56937d987ec4757d0bffc1ea",
                                        "Concept Mapper@56937da87ec4757d0bffc224",
                                        "Wiki App@56937f397ec4757d0bffe924",
                                        "Hypothesis Scratchpad@569381277ec4757d0b001fb8",
                                        "Concept Cloud@5694ce939379a211a432d7a2"
                                    ],
                                    "phases": [
                                        "Orientation@56937d5d7ec4757d0bffc0e9",
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee",
                                        "Investigation@56937d5d7ec4757d0bffc0f3",
                                        "Conclusion@56937d5d7ec4757d0bffc0f8",
                                        "Discussion@56937d5d7ec4757d0bffc0fd"
                                    ],
                                    "phasesWithApps": [
                                        "Orientation@56937d5d7ec4757d0bffc0e9",
                                        "Conceptualisation@56937d5d7ec4757d0bffc0ee",
                                        "Investigation@56937d5d7ec4757d0bffc0f3",
                                        "Discussion@56937d5d7ec4757d0bffc0fd"
                                    ]
                                },
                                "generated": "2016-06-13T12:18:25.254Z"
                            }
                        }
                    ]
                }
            }
        ];

        var now = Date.now();

        return {
            saveConceptCloud: saveConceptCloud,
            loadConceptClouds: loadConceptClouds,
            loadLatestConceptCloud: loadLatestConceptCloud,
            svgToJson: svgToJson
        };

        // Save conceptCloud and conceptCloud graphic
        function saveConceptCloud(conceptCloud, conceptCloudGraphic, callback) {

            getNow(function (dateNow) {
                conceptCloud.metadata.dataSource = "cache";
                conceptCloud.graphic = {};
                conceptCloud.graphic = {
                    "svg": conceptCloudGraphic,
                    "generated": dateNow
                };

                storageHandler.readLatestResource("conceptCloudCache", function (error, object) {
                    if (error) {
                        console.warn(error);
                        conceptCloud.errorHandler.handleError(error, languageHandler.getMessage('err_could_not_read_resource'));
                    } else {
                        console.log(object);

                        if (object != null) {
                            // resource is available, update resource
                            console.log("[ConceptCloud] Resource is available, update resource with id " + object.metadata.id);
                            conceptCloudResourceId = object.metadata.id;
                            conceptClouds = object.content.conceptClouds;
                            conceptClouds.push(conceptCloud);


                            var content = {
                                "metadata": {
                                    "published": dateNow,
                                    "target": {
                                        "objectType": "conceptCloudData",
                                        "displayName": "ConceptClouds"
                                    }
                                },
                                "conceptClouds": conceptClouds
                            };

                            console.log(content);

                            // Update Resource
                            console.log("[ConceptCloud] Update resourceID " + conceptCloudResourceId);
                            storageHandler.updateResource(conceptCloudResourceId, content, function (error, object) {
                                if (error) {
                                    console.warn(error);
                                    conceptCloud.errorHandler.handleError(error, languageHandler.getMessage('err_could_not_update_resource'));
                                }
                                console.log("[ConceptCloud] Update resourceID " + conceptCloudResourceId + " - SUCCESS!");
                            });
                        } else {
                            // no resource available, create new resource
                            console.log("[ConceptCloud] No resource available, create new resource");
                            conceptClouds.push(conceptCloud);

                            var content = {
                                "metadata": {
                                    "published": dateNow,
                                    "target": {
                                        "objectType": "conceptCloudData",
                                        "displayName": "ConceptClouds"
                                    }
                                },
                                "conceptClouds": conceptClouds

                            };
                            storageHandler.createResource(content, function (error, object) {
                                console.log('[ConceptCloud] Build Empty ConceptCloudData Object');
                                console.log(conceptCloud);
                                if (error) {
                                    console.warn(error);
                                    conceptCloud.errorHandler.handleError(error, languageHandler.getMessage('err_could_not_create_resource'));
                                }
                                console.log(object);
                                conceptCloudResourceId = object.metadata.id;
                                console.log("[ConceptCloud] Resource with resourceId " + conceptCloudResourceId + " created.");
                            });
                        }
                    }
                    callback();
                });
            });
        }

        // return the array of all saved ConceptClouds
        function loadConceptClouds(callback) {

            if (metadataHandler.getContext() === 'preview' || metadataHandler.getContext() === 'standalone') {
                // Load Dummy Data
                console.log("[ConceptCloud] load dummy ConceptClouds");
                callback(dummyConceptClouds, "Ok");
            } else {
                storageHandler.readLatestResource("conceptCloudCache", function (error, object) {
                    if (error) {
                        console.warn(error);
                        conceptCloud.errorHandler.handleError(error, languageHandler.getMessage('err_could_not_load_cache'));
                    } else {
                        if (object != null) {
                            console.log(object);
                            console.log("[ConceptCloud] loaded resourceID " + object.metadata.id);
                            callback(object.content.conceptClouds, "Ok");
                        } else {
                            callback(null, "no-cache");
                        }

                    }
                });
            }
        }

        // return only the latest saved ConceptCloud
        function loadLatestConceptCloud(callback) {

            storageHandler.readLatestResource("conceptCloudCache", function (error, object) {
                if (error) {
                    console.warn(error);
                    conceptCloud.errorHandler.handleError(error, languageHandler.getMessage('err_could_not_load_cache'));
                } else {
                    console.log(object);

                    if (object != null) {
                        conceptClouds = object.content.conceptClouds;

                        console.log("[ConceptCloud] loaded resourceID " + object.metadata.id);

                        // check if conceptCloud data is older than specified in the configurations
                        var timeOffset = conceptCloud.timeOffset; // 1 min = 60000ms

                        getNow(function (dateNow) {

                            console.log("[ConceptCloud] Offset: " + timeOffset + "ms");

                            // Sort by date - most recent date comes first!
                            conceptClouds.sort(function (a, b) {
                                a = new Date(a.metadata.generated);
                                b = new Date(b.metadata.generated);
                                return a > b ? -1 : a < b ? 1 : 0;
                            });

                            // Check for offset
                            if ((dateNow - conceptClouds[0].metadata.generated) >= timeOffset) {
                                console.log('[ConceptCloud] Precalculated conceptCloud is outdated. Try to retrieve fresh conceptCloud data!');
                                callback(conceptClouds[0], "outdated");
                            } else {
                                console.log('[ConceptCloud] Using precalculated conceptCloud...');
                                console.log('[ConceptCloud] Latest ConceptCloud: ');
                                console.log(conceptClouds[0]);
                                callback(conceptClouds[0], "ok");
                            }

                        });


                    } else {
                        callback(null, "no-cache");
                    }
                }
            });
        }

        function getNow(callback) {
            now = Date.now();
            callback(now);
        }
    }

    function svgToJson(svgObject, callback) {
        var canvas = new fabric.Canvas('current_tagCloud');

        fabric.loadSVGFromString(svgObject, function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            canvas.add(obj).renderAll();
            var jsonObject = JSON.stringify(canvas.toDatalessJSON());
            callback(jsonObject);
        });
    }


})(golab.tools.conceptCloud);
