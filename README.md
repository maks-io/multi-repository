# Multi Repository

This is a prototype / proof of concept for an application, that allows its users to search multiple external sources at once and then link individual items/results together.

![Usage Demo](https://github.com/maks-io/multi-repository/blob/master/demo/usage-demo-1.gif "Usage Demo")

I have built this as part of a project at [TU Wien](https://www.tuwien.at/), therefore I wanna say thanks to [Andreas Rauber](https://informatics.tuwien.ac.at/people/andreas-rauber) and [Tomasz Miksa](https://informatics.tuwien.ac.at/people/tomasz-miksa) for supervising this.

## Demonstration Video / Screencast

A screencast I did can be found on youtube:
 
[Part 1/3](https://youtu.be/CmU5vkxWqTg):

[![Demonstration Screencast](http://img.youtube.com/vi/CmU5vkxWqTg/0.jpg)](http://www.youtube.com/watch?v=CmU5vkxWqTg "Multi Repository - Presentation/Screencast - Part 1/3")

[Part 2/3](https://youtu.be/wlOsTP60ZAg):

[![Demonstration Screencast](http://img.youtube.com/vi/wlOsTP60ZAg/0.jpg)](http://www.youtube.com/watch?v=wlOsTP60ZAg "Multi Repository - Presentation/Screencast - Part 2/3")

[Part 3/3](https://youtu.be/RkooAp8vNG8):

[![Demonstration Screencast](http://img.youtube.com/vi/RkooAp8vNG8/0.jpg)](http://www.youtube.com/watch?v=RkooAp8vNG8 "Multi Repository - Presentation/Screencast - Part 3/3")

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

Links can be created when the app is in `EDIT_LINKS` mode. To get there, first search for certain terms and then click on the link tag of one of the resulting items, in its lower left corner.
The app will then allow to add new or remove existing links to other items.
The user can search for new search terms while being in this mode.

For testing and demonstration purposes I also created some links manually, via the helper files `server/src/data/links.json` and `server/src/data/load-sample-data.js`.
More information on how to use them in the section [Usage](#usage).

## Usage

The following steps are necessary to use this application:

1. Create a [Ontotext GraphDB](https://www.ontotext.com/products/graphdb/) instance you have read and write access to.
2. Create a `.env` environment file.
   It must contain the following variables:

```
GRAPHDB_BASE_URL={YOUR_GRAPHDB_INSTANCE_BASE_URL}
GRAPHDB_REPOSITORY_NAME={YOUR_GRAPHDB_INSTANCE_REPOSITORY_NAME}
TOKEN_GITLAB_PROJECT={YOUR_GITLAB_API_ACCESS_TOKEN} // optional, see below
TOKEN_GITLAB_PERSON={YOUR_GITLAB_API_ACCESS_TOKEN} // optional, see below
...
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

6. If you want to change existing links or add new ones manually you can do so by modifying `server/src/data/links.json` accordingly.
   Afterwards you need to `cd` into `server/` and run `yarn resample`.
   All existing links in the database will be deleted and be replaced by those defined in the json file.

   However, since the newest version it is also possible to create links directly with the user interface.

## Modifying the set of available resources

The last changes made the code base way more generic and now allows to easily add new or remove existing external apis/resources.

To do so, modify the `externalApiConfig` object (contained in the file `server/src/external-apis.js`) accordingly.

The following describes the structure of the configuration:

```
const externalApiConfig = {
  [PLATFORM_1]: {
    [TYPE_1]: {
      LOGO_URL: "",
      FALLBACK_AVATAR: "",
      SEARCH_BY_TERM: {
        QUERY: {
          URL: ""
        },
        RESULT: {
          PATH: "",
          TRANSFORM_FUNCTION: result => ({ ... }),
          STRUCTURE: {
            id: "",
            title: "",
            avatar: "",
            originalSourceUrl: ""
          }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL: ""
        },
        RESULT: {
          PATH: "",
          TRANSFORM_FUNCTION: result => ({ ... }),
          STRUCTURE: {
            id: "",
            title: "",
            avatar: "",
            originalSourceUrl: ""
          }
        }
      }
    },
    [TYPE_2]: {
      ...
    }
  },
  [PLATFORM_2]: {
    ...
  }
}
```

| name                                           | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | required                           | example                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PLATFORM                                       | A resource is always described by two levels. `PLATFORM` is the first one - and you can name it whatever you want, just make sure it's unique.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | yes                                | `GITHUB`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| TYPE                                           | This is the second level for defining a resource. You can also name it whatever you want - but make sure it's unique within the `PLATFORM`.<br />The number of `TYPE`s eventually makes up your total number of resources.<br />Imagine having one `PLATFORM` called `GITHUB` and two `TYPES` called `USERS` and `REPOS` -> you end up with two resources.                                                                                                                                                                                                                                                                                                                                                   | yes                                | `USER`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| LOGO_URL                                       | This is the path to a logo for the given `PLATFORM`-`TYPE` combination. This prop must be inside the `TYPE` object.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | no                                 | `some-url-to-a-image.png`                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| FALLBACK_AVATAR                                | In case you decide that your resource should display some kind of avatar (with the `avatar` prop described below), this will allow to set a fallback icon that will be displayed in case some items don't provide any avatar.<br />The `FALLBACK_AVATAR` needs to be a valid icon value from the [ant design icon set](https://ant.design/components/icon/).                                                                                                                                                                                                                                                                                                                                                 | no                                 | `UserOutlined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| SEARCH_BY_TERM<br/><br/>and<br/><br/>GET_BY_ID | Every resource you define needs to provide two API endpoints: one for searching items via text search, and one for directly accessing single items via some kind of id.<br/>`SEARCH_BY_TERM` is responsible for the text search, `GET_BY_ID` for the single retrieval - and they both share the following sub props.                                                                                                                                                                                                                                                                                                                                                                                         | yes                                | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| QUERY                                          | The first sub prop of `SEARCH_BY_TERM` and `GET_BY_ID` describes the API endpoint, that will be used. For now, it only needs exactly one sub prop called `URL`, which defines this endpoint's location.<br/>In case of `SEARCH_BY_TERM` you need to embed the string `[SEARCH_TERM]` within the URL accordingly - this will automatically be replaced on-the-fly by the Multi Repository.<br />The same goes for the counterpart `GET_BY_ID`, where you must embed the string `[ID]`.<br/>In case you need to use certain access tokens within the URL, you can also embed `[TOKEN]`, which will automatically be replaced by `[PLATFORM]_[TYPE]_[TOKEN]`, if you provide it accordingly in the `.env` file. | yes                                | `https://my-api.com/search` <br/>`?token=[TOKEN]`<br/>`&searchterm=[SEARCH_TERM]`<br/><br/>or<br/><br/>`https://my-api.com/get-by-id` <br/>`?token=[TOKEN]`<br/>`&id=[ID]`                                                                                                                                                                                                                                                                                                                |
| RESULT                                         | The counterpart to `QUERY` defines how the result(s) will be processed. It needs the following sub props.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | yes                                | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| PATH                                           | In case the API endpoint has your result(s) nested deeper (not directly in the root), you can define its location here (use dot notation for defining the path).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | no                                 | `fruits.apples` in case the endpoint returns an object like this:<br />`{ fruits: { apples: [ YOUR_DESIRED_RESULT(S) ] } }`                                                                                                                                                                                                                                                                                                                                                               |
| TRANSFORM_FUNCTION                             | In case you want to transform the retrieved result(s) in any way, you can define a function to do so. Please note that it does not matter if you are defining this for `SEARCH_BY_TERM` or `GET_BY_ID` - in both cases this function accepts always 1 (!) result, and returns 1 transformed result. In case of multiple results the Multi Repository maps it.<br/>Make sure, that - IF you are using this function - you end up with at least the following properties: `id`, `title` and `originalSourceUrl`. You can name them differently if you like, since the final mapping will happen in the next step (see `STRUCTURE`), but make sure you provide those from a semantic point of view.             | no                                 | `(result) => ({ id: result.id, title: result.name.toLowerCase(), originalSourceUrl: result.webUrl })`                                                                                                                                                                                                                                                                                                                                                                                     |
| STRUCTURE                                      | The final property defines how results will finally look like. It is important that each resulting item has at least `id`, `title` and `originalSourceUrl` defined - their values describe the path to those properties from the preceding state (which can be the direct retrieval from the API endpoint's result OR after the transformation via a `TRANSFORM_FUNCTION`). Optionally you can also provide a prop `avatar` if you want to display pictures. If certain items lack this prop you can still define `FALLBACK_AVATAR` (described above) to catch those cases.                                                                                                                                  | yes (except for sub prop `avatar`) | In the most basic case (if the result is already properly formatted before this step), it could look like this:<br/> `{ id: "id", title: "name", avatar: "avatar", originalSourceUrl: "originalSourceUrl" }`<br/><br/>Another example would be, if the calling of an endpoint returns `{ identifier: '123', name: 'my-doc', urls: { main: 'qwer' } }`<br/>In that case you would define your `STRUCTURE` like this: `{ id: 'identifier', title: 'name', originalSourceUrl: 'urls.main' }` |

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

- **1:1 linking for users/people** - it is currently possible to link one github user to multiple tiss people.
  We could therefore link the github user of `Bernhard Gößwein` to his tiss entry, but also to the tiss entry of some completely different person, at the same time.
  This is just an example, this also goes for other platforms.
- **List users as one unit** - since some result columns represent people, it could be nice to display linked people of different platforms as one unique card.
  Example: take `Bernhard Gößwein` again - we could display his tiss entry, his GitLab user as well as his GitHub user inside one single card, for instance.
- The **property `identifier`**, that is being used across both applications, should be assigned/created as soon as possible - meaning after results come back from the external apis, in search step 1.
- Maybe **hide the source tags** - they currently show if an object was found in step 1 or in step 2 of the search.
  This is helpful during development - but maybe not needed for end users.
- **Transitive relation logic** - currently the server only considers the search results of step 1, when looking for corresponding links.
  Any object, that gets added during step 2 (individual fetching because not included in results of step 1) does not have its links checked, for now.
