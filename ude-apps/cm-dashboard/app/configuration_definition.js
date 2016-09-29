window.golab = window.golab || {};
window.golab.tools = window.golab.tools || {};
window.golab.tools.configurationDefinition = window.golab.tools.configurationDefinition || {};

window.golab.tools.configurationDefinition.cmdashboard = {
    showAnnotations: {
        label: "Show annotations",
        description: "Show annotations in the ui that describe which underlying mechanims are used.",
        type: "boolean",
        value: "true",
        configurable: "true"
    },
    environmentHandlerOptions:{
        notificationServer:null,
        cache: false
    }
};

