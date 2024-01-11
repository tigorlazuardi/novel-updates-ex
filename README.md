# Novel Updates EX
Web Extension for NovelUpdates

Enhances the experience for browsing the [Novel Updates](https://www.novelupdates.com/) website.

## Version

0.0.1-alpha

## Features

Currently, on version 0.0.1-alpha, the only available feature is handling home page.

### Home Enhancement

#### Release List

Release List now shows the Series Cover and description, also multiple chapter release for one Series are also consolidated.

Essentially, it turns the Homepage Release List from this:

![Screenshot_20240111_100534](https://github.com/tigorlazuardi/novel-updates-ex/assets/49936087/c4c9e7f0-3166-4bac-aed6-bb75645dffaf)

To this:

![Screenshot_20240111_100641](https://github.com/tigorlazuardi/novel-updates-ex/assets/49936087/4ca47d64-244a-451c-b2c8-181f4a37ce45)

So you can "Judge a Book by It's Cover" better (or in this case, Series).

Care has been taken to reduce the load on NovelUpdates servers. Metadata is cached, but not the images.
Since the images came from a Content Delivery Network, there will be no affect on the server load. Fetching metadata, however, will
put a load on NovelUpdates' database. So that's the one that will be cached instead.

So why not cache the image as well? It reqruires additional permission from the user, and thus require more audit review.
It will be considered if there's more request for it.

##### Why not using the Series Finder?

Release List is the first page being opened, meaning higher chance of discovery new works.

Release List also shows **Active** series being translated. It means more potential chapters from the series since there is a person or a team
behind the project.
