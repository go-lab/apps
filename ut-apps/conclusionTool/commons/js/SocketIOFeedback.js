var SocketIOFeedback=function(){function n(n,t){var c=io.connect(n);c.on(t.toString(),function(n){o(n)})}function o(n){console.log(n),window.alert(JSON.stringify(n))}var t=function(){};return t.prototype={constructor:t,connect:n},t}();