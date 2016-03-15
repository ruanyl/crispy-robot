Secure Your React and Redux App with JWT Authentication
========

There are many benefits to using unidirectional data flow in single page applications. Perhaps the biggest is that as applications become larger, it is easier to reason about how data affects the app's states and views. Although patterns and libraries like Flux have been popularized by React, we certainly aren't limited to using the two together. It's now common to see unidirectional data flow patterns in other frameworks, such as [AngularJS](https://github.com/christianalfoni/flux-angular).

#### What is Redux and What Does it Solve?

JavaScript applications are, in a lot of ways, large collections of data and state. Any good application will need a way for its state to be changed at some point, and this is where Redux comes in. Built by [Dan Abramov](https://twitter.com/dan_abramov), Redux is essentially a state container for JavaScript apps that describes the state of the application as a single object. Further, Redux provides an opinionated pattern and toolset for making changes to the state of the app.

![image](https://cdn.auth0.com/blog/redux-auth/redux-auth-1.png)

Here's our dependencies in package.json:

```
...

  "dependencies": {
    "react": "^0.14.3",
    "react-dom": "^0.14.3",
    "react-redux": "^4.0.4",
    "redux": "^3.0.5",
    "redux-thunk": "^0.1.0"
  },
  "devDependencies": {
    "babel-core": "^5.6.18",
    "babel-loader": "^5.1.4",
    "babel-plugin-react-transform": "^1.1.0",
    "express": "^4.13.3",
    "webpack": "^1.9.11",
    "webpack-dev-middleware": "^1.2.0",
    "webpack-hot-middleware": "^2.2.0"
  }

...
```
