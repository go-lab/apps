# Action statistics

This tool can be used for comparing tool usage among users of an ILS.

## Architecture

The app is bootstrapped and configured in `app/run.js`, where the main
application function, to be found in `app/app.js` is called. The action
statistics are fetched from the `ActorCentricLogStatistics` service on the
learning analytics server. The data is rendered using `app/action_bar_chart.js`,
which employs [nvd3](https://github.com/novus/nvd3) to render the chart.

## Tooling

Run `npm install` and then `gulp` to create the `gadget.xml` that is required
for use as an OpenSocial gadget.
