# Multi Repository

This is a prototype / proof of concept for an application, that allows its users to search multiple external sources at once and then link individual items/results together.

![Usage Demo](https://github.com/maks-io/multi-repository/blob/master/demo/usage-demo-1.gif "Usage Demo")

I have built this as part of a project at [TU Wien](https://www.tuwien.at/), therefore I wanna say thanks to [Andreas Rauber](https://informatics.tuwien.ac.at/people/andreas-rauber) and [Tomasz Miksa](https://informatics.tuwien.ac.at/people/tomasz-miksa) for supervising this.

## Demonstration Video / Screencast

An introduction screencast I did [can be found on youtube](https://youtu.be/CmU5vkxWqTg):

[![Demonstration Screencast](http://img.youtube.com/vi/CmU5vkxWqTg/0.jpg)](http://www.youtube.com/watch?v=CmU5vkxWqTg "Multi Repository - Presentation/Screencast")

## Features

### Search

The app is built with react and features a simple UI with one text input field.

#### Step 1 - Searching individual Platforms / Sources

Typing into this input field automatically triggers a text search on the following platforms:

- [TISS](https://tiss.tuwien.ac.at/)
- [reposiTUm](https://repositum.tuwien.ac.at/)
- [Invenio](https://invenio-software.org/)
- [GitLab](https://gitlab.com)
- [GitHub](https://github.com)

After those platform searches have completed, the results are being displayed in the UI.

#### Step 2 - Linking search results + fetching missing resources

As soon as Step 1 is done the application automatically continues with the linking procedure.
The results of the first step are being compared with existing links in our database.
If corresponding links are found, there are two options:

1. both Resources have already been fetched in the first step -> the app will mark them accordingly
2. the second resource of a given link is not yet collected -> this triggers additional fetching of those missing resources, before again marking them

After all links are resolved, the result is being displayed in the UI - and the search is complete.

### Linking

For now, the linking of objects (users, papers, etc.) is not possible via the UI. This application is supposed to be a proof of concept and I considered the UI linking to be of lower priority.

For testing and demonstration purposes I created links manually, via the helper files `server/src/data/links.json` and `server/src/data/load-sample-data.js`.
More information on how to use them in the section [Usage](#usage).

Of course, a final production ready app would probably include such a mechanism.
That is why I added it in the [Improvements](#improvements) list.

## Usage

The following steps are necessary to use this application:

1. Create a mongo database you have read and write access to. I used [mlab.com](https://mlab.com/), for instance.
   Remember the database url, as well as the necessary user name and password.
2. Create a `.env` environment file.
   It must contain the following variables:

```
DB_NAME={YOUR_DATABASE_URL_MENTIONED_ABOVE}
DB_USERNAME={YOUR_DATABASE_USER_NAME_MENTIONED_ABOVE}
DB_PASSWORD={YOUR_DATABASE_PASSWORD_MENTIONED_ABOVE}
GITLAB_TOKEN={YOUR_GITLAB_API_ACCESS_TOKEN}
INVENIO_TOKEN={YOUR_INVENIO_API_ACCESS_TOKEN}
```

3. Now the necessary dependencies need to be installed.
   I suggest using `yarn`, but you can also use `npm` of course.<br />
   The dependencies of the root folder are not mandatory, but can be useful for developers.
   I suggest installing them anyways.
   Besides that, you must install the server and webclient dependencies.<br />
   To do so `cd` into the `server/` directory and run the command `yarn`, afterwards do the same inside the `webclient/` directory.

4. You are now ready to run both, the server and the webclient.
   I'd suggest opening two terminals in the root folder.
   Run `yarn server` in the first, and `yarn webclient` in the second one.
   This will start up both applications.
   The webclient should automatically open in your web browser - otherwise just manually enter the corresponding address, that is being displayed in the webclient terminal window.

5. You are now ready to use the app(s).
   Type any search term into the input field and wait for results.

6. If you want to change existing links or add new ones you can do so by modifying `server/src/data/links.json` accordingly.
   Afterwards you need to `cd` into `server/` and run `yarn resample`.
   All existing links in the database will be deleted and be replaced by those defined in the json file.

## Known bugs

- Proper **error handling** is missing at the moment.
  When calling the apis of the external resources, it may be that one or more calls fail - in that case the webclient / UI gets stuck, and the application needs to be reloaded.
  Crashes can also occur on our server side during the search step 2.
  This leads to a similar outcome.
- **Pagination** is being ignored for now.
  This means, that some external resources return too many results for certain search terms, while others only respond with small amounts of data (page size of 20 for example).
  Searching for `Bernhard Gößwein` for instance leads to some sources responding with the most suitable object at the very first index.
  However, if you choose the more generic search term `Bernhard`, the previously mentioned `Bernhard Gößwein` doesn't even occur in some search results, because there simply are to many results in total.
- **Search Flexibility** - different external platforms implement their text search in different ways.
  A search for `Gößwein` leads to some platforms also responding with results corresponding to strings like `goesswein`, while others only return those objects with the exact same strings as the given ones.

## Improvements

The following is a mixture of important improvements and nice-to-have features.

- **Linking via UI** - as mentioned above, the current prototype does not allow the user to link items via the user interface.
- **1:1 linking for users/people** - it is currently possible to link one github user to multiple tiss people.
  We could therefore link the github user of `Bernhard Gößwein` to his tiss entry, but also to the tiss entry of some completely different person, at the same time.
  This is just an example, this also goes for other platforms.
- **List users as one unit** - since some result columns represent people, it could be nice to display linked people of different platforms as one unique card.
  Example: take `Bernhard Gößwein` again - we could display his tiss entry, his GitLab user as well as his GitHub user inside one single card, for instance.
- The **property `identifier`**, that is being used across both applications, should be assigned/created as soon as possible - meaning after results come back from the external apis, in search step 1.
- There is some **code redundancy** in server and webclient.
Appropriate tools (like [lerna](https://github.com/lerna/lerna)) would allow us to use code sharing mechanisms.
- Maybe **hide the source tags** - they currently show if an object was found in step 1 or in step 2 of the search.
This is helpful during development - but maybe not needed for end users.
- **Transitive relation logic** - currently the server only considers the search results of step 1, when looking for corresponding links.
Any object, that gets added during step 2 (individual fetching because not included in results of step 1) does not have its links checked, for now.
