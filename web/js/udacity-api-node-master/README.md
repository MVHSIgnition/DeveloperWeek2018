# Unofficial Udacity API (for Node.js)

**by Ty-Lucas Kelley**

---

[![NPM](https://nodei.co/npm/udacity-api.png?compact=true)](https://nodei.co/npm/udacity-api/)
![build](https://travis-ci.org/tylucaskelley/udacity-api.svg?branch=master)

    ##  ##   #####     ####     #####   ######   ######   ##  ##
    ##  ##   ##   #   ##  ##   ##         ##       ##     ##  ##
    ##  ##   ##   #   ######   ##         ##       ##      ####
    ##  ##   ##   #   ##  ##   ##         ##       ##       ##
     ####    #####    ##  ##    #####   ######     ##       ##

This is an unofficial client library for interacting with Udacity courses and users.
It is made up of two parts:

* [Catalog](#catalog)
    * A wrapper for Udacity's public [Catalog API](http://udacity.com/public-api/v0/courses)
* [User](#user)
    * Log into your Udacity account, see user info, and check course progress

### Warning

Note that this is not an official Udacity product. They are allowed to change their internal
API at any time, and I will try my best to make sure this library gets updated as well.

In the end, be sure to use this only for personal purposes, not any serious application with
a lot of users.

### Installation

It's on [npm](https://www.npmjs.org/package/udacity-api)! Just install it from the terminal:

    $ npm install udacity-api

Then, you can include it in your application:

```js
var Catalog = require('udacity-api').Catalog;
var User = require('udacity-api').User;
```

### User

The `User` object can be used to view a user's account info and see their
progress in courses. It includes a lot of convenience functions.

#### User(email, password)

Create a new user.

*Example*

```js
var me = new User('me@example.com', 'password123');
```

#### account(cb)

Get a user's account information.

*Arguments*

* cb {function} - Callback function

*Example*

```js
me.account(function(err, data) {
    console.log(data);
});
```

#### key(cb)

Get a user's Udacity ID.

*Arguments*

* cb {function} - Callback function

*Example*

```js
me.key(function(err, data) {
    console.log(data);
});
```

#### name(cb)

Get a user's first and last name.

*Arguments*

* cb {function} - Callback function

*Example*

```js
me.name(function(err, data) {
    console.log(data);
});
```

#### nickname(cb)

Get a user's nickname.

*Arguments*

* cb {function} - Callback function

*Example*

```js
me.nickname(function(err, data) {
    console.log(data);
});
```

#### email(cb)

Get a user's email address.

*Arguments*

* cb {function} - Callback function

*Example*

```js
me.email(function(err, data) {
    console.log(data);
});
```

#### emailPreferences(cb)

Get a user's preferences for mailing lists and data sharing.

*Arguments*

* cb {function} - Callback function

*Returns*

An object like this:

```js
{
    employer_sharing: false,
    newsletter: false,
    course_emails: true,
    user_research: true
}
```

*Example*

```js
me.emailPreferences(function(err, data) {
    console.log(data);
});
```

#### sitePreferences(cb)

Get a user's preferences for website functionality (like video playback speed).

*Arguments*

* cb {function} - Callback function

*Returns*

An object like this:

```js
{
    auto_advance: false,
    video_quality: "normal",
    use_html5_player: true,
    playback_rate: 1
}
```

*Example*

```js
me.emailPreferences(function(err, data) {
    console.log(data);
});
```

#### enrollments(cb)

Get an array of all courses a user is a part of.

*Arguments*

* cb {function} - Callback function

*Example*

```js
me.enrollments(function(err, data) {
    console.log(data);
});
```

#### progress(id, cb)

Get information about progress in a course.

*Arguments*

* id {string} - Course key (ex. "cs101")
* cb {function} - Callback function

*Returns*

An object like this:

```js
{
    "key":"cs101",
    "title":"Intro to Computer Science",
    "quiz_count":221,
    "morsel_count":521,
    "completed":false,
    "quizzes_completed":1,
    "morsels_completed":3,
    "last_visited":"2014-11-27T01:02:29.517Z",
    "time_away_ms":9316178,
    "most_recent_url":"https://www.udacity.com/course/viewer#!/c-cs101/l-48299949/e-48709295/m-48700438",
    "current_lesson":{
        "key":"48299949",
        "quizzes_completed":1,
        "morsels_completed":3,
        "completed":false,
        "title":"Lesson 1: How to Get Started",
        "quiz_count":22,
        "morsel_count":64
    }
}
```

*Example*

```js
me.progress(function(err, data) {
    console.log(data);
});
```

#### clear()

Clear the cache.

*Example*

```js
me.clear();
```

### Catalog

The `Catalog` object can be used to filter data from Udacity's Catalog API.
It has a bunch of convenience functions:

#### Catalog()

Create a new catalog.

*Example*

```js
var cat = new Catalog();
```

#### catalog(cb)

Get all catalog data.

*Arguments*

* cb {function} - Callback function

*Example*

```js
var cat = new Catalog();

cat.catalog(function(err, data) {
    console.log(data);
});
```

#### courses(cb)

Get all courses.

*Arguments*

* cb {function} - Callback function

*Example*

```js
var cat = new Catalog();

cat.courses(function(err, data) {
    console.log(data);
});
```

#### course(id, cb)

Get one course.

*Arguments*

* id {string} - Course key
* cb {function} - Callback function

*Example*

```js
var cat = new Catalog();

cat.course('cs101', function(err, data) {
    console.log(data);
});
```

#### instructors(id, cb)

Get the instructor(s) for one course.

*Arguments*

* id {string} - Course key
* cb {function} - Callback function

*Example*

```js
var cat = new Catalog();

cat.instructors('cs101', function(err, data) {
    console.log(data);
});
```

#### tracks(cb)

Get all tracks.

*Arguments*

* cb {function} - Callback function

*Example*

```js
var cat = new Catalog();

cat.tracks(function(err, data) {
    console.log(data);
});
```

#### track(name, cb)

Get one track.

*Arguments*

* name {string} - Track name
* cb {function} - Callback function

*Example*

```js
var cat = new Catalog();

cat.track('Data Science', function(err, data) {
    console.log(data);
});
```

#### degrees(cb)

Get all nanodegrees.

*Arguments*

* cb {function} - Callback function

*Example*

```js
var cat = new Catalog();

cat.degrees(function(err, data) {
    console.log(data);
});
```

#### degree(id, cb)

Get one nanodegree.

*Arguments*

* id {string} - Nanodegree key

*Example*

```js
var cat = new Catalog();

cat.degree('nd001', function(err, data) {
    console.log(data);
});
```

#### clear()

Clear the cached catalog data.

*Example*

```js
var cat = new Catalog();

cat.clear();
```

### Contributing

I accept pull requests! Between school, work, and life I can only put in so much
time on this project, so all help is appreciated.

Check out TODO.md for some things I've been meaning to get done but haven't.