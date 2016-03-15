Rise of the High Boilerplate Framework: A Look at Falcor and Relay
=====

**TL;DR:** Frameworks like [Falcor](https://netflix.github.io/falcor/) and [Relay](https://facebook.github.io/relay/) solve some hard problems but come at the cost of requiring a lot of boilerplate. Perhaps the boilerplate is a necessity, but this likely has implications for developer uptake.

There’s no shortage of JavaScript fatigue articles of course.

> I'm fatigued by JavaScript fatigue articles
> — James Kyle (@thejameskyle) [December 27, 2015](https://twitter.com/thejameskyle/status/680949037516718085)

```
// 1. We needs some data, which is truncated for this example
var model = new falcor.Model({
  cache: {
    events: [
      {
        name: "ng-conf",
        description: "The worlds best Angular Conference",
        location: $ref('locationsById[1]')
      },
      ...
    ]
  }
});

// 2. We need a data source route
app.use('/model.json', falcorExpress.dataSourceRoute(function(req, res) {
  return new Router([
    {
      // Our route needs to match a pattern of integers that
      // are used as eventIds
      route: "events[{integers:eventIds}]['name', 'description']",
      get: function(pathSet) {

        var results = [];

        // Above we specified an eventIds identifier that is an
        // array of ids which we can loop over
        pathSet.eventIds.forEach(function(eventId) {

          // Next, an array of key names that map is held at pathSet[2]
          pathSet[2].map(function(key) {

            // We find the event the cooresponds to the current eventId
            var eventRecord = eventsData.events[eventId];

            // Finally we push a path/value object onto
            // the results array
            results.push({
              path: ['events', eventId, key],
              value: eventRecord[key]
            });
          });
        });

        return results;
      }
    }
  ]);
}));
```
