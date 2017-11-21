# Ustream JavaScript SDK
[![npm version](https://badge.fury.io/js/ustream-sdk.svg)](https://badge.fury.io/js/ustream-sdk)

JavaScript wrapper for Ustream's REST API.

## Installation

    npm install ustream-sdk

## Basic Usage
All methods that access API resources, such as `ustream.video.*` or `ustream.channel.*` will return a Promise.

```JavaScript
let Ustream = require('ustream-sdk')

// Set up instance using password authentication
let ustream = new Ustream({
    username: "...",
    password: "...",
    client_id: "...",
    client_secret: "...",
    type: "password"
})

ustream.video.get(videoId).then((video) => {
    // Use video
}).catch((err) => {
    // Handle error
})
```

### Paging Results
Some methods return data that is divided into many pages. These methods will return an object with helper methods
to allow for easy access to both your data and next pages.

```JavaScript
// Get list of channels
ustream.channel.list().then((pageableResult) => {
    // Access the list of channels
    let channels = pageableResult.data
    
    // Check if result set has a next page
    if (pageableResult.hasNextPage()) {
        // Retrieve the next page of channels
        pageableResult.next().then((nextPageResults) => {
            // Use next page's results
        })
    }
}).catch((err) => {
    console.warn(err)
})
```

| Method        | Returns                   | Description                                                                     |
|---------------|---------------------------|---------------------------------------------------------------------------------|
| next()        | Promise<PageableResult\>  | Retrieves the next page of results. Returns null if a next page does not exist. |
| data()        | array<Object\>            | Returns the data for a given page.                                              |
| hasNextPage() | boolean                   | If true, next() will return a new page of data. If false, no next page exists.  |

## Authentication API
Currently, only "password" authentication is supported. See the basic usage section for an example.

### Authentication Tokens
The SDK will refresh your authorization tokens automatically, so you can focus on the task at hand.

### Changing/Updating Authentication Credentials
If you choose to change your authentication workflow or swap out credentials after initializing Ustream, you can utilize the `setAuthCredentials` method.

```JavaScript
ustream.setAuthCredentials({
    type: "<new authentication workflow>",
    ...
})
```

## Video API

### Upload Video

```JavaScript
ustream.video.upload(channelId, file, opts)
```

| Parameter         | Type               | Description                |
|-------------------|--------------------|----------------------------|
| channelId         | int                | ID of an existing channel. |
| file.originalname | string             | Name of file.              |
| file.stream       | ReadStream         | File stream.               |
| opts.title        | string             | Title of video.            |
| opts.description  | string             | Description of video.      |
| opts.protect      | "public" "private" | Default is "private". If set to true, video will be published upon end of upload. |


### Video Upload Status

```JavaScript
ustream.video.getStatus(channelId, videoId)
```

| Parameter         | Type               | Description                |
|-------------------|--------------------|----------------------------|
| channelId         | int                | ID of an existing channel. |
| videoId           | int                | ID of an existing video.   |


### List Videos

```JavaScript
ustream.video.list(channelId, pageSize, page)
```
    
> Promise returns a Pageable result. See "Paging Results" section for details.

| Parameter  | Type | Description                                                      |
|------------|------|------------------------------------------------------------------|
| channelId  | int  | Id of a channel.                                                 |
| pageSize   | int  | (optional) Default: 100. The number of results to show per page. |
| page       | int  | (optional) Default: 1. The page to retrieve.                     |


### Get Video Details

```JavaScript
ustream.video.get(videoId)
```

| Parameter         | Type               | Description                |
|-------------------|--------------------|----------------------------|
| videoId           | int                | ID of an existing video.   |

### Delete Video

```JavaScript
ustream.video.remove(videoId)
```

| Parameter         | Type               | Description                |
|-------------------|--------------------|----------------------------|
| videoId           | int                | ID of an existing video.   |


## Channel API

### Get Channel

```JavaScript
ustream.channel.get(channelId, opts)
```

| Parameter         | Type               | Description                |
|-------------------|--------------------|----------------------------|
| channelId         | int                | ID of an existing channel. |
| opts.detail_level | string             | Default is null. If set to "minimal", the result set is limited to id, title, picture, owner and locks data. If the channel is protected, only minimal data can be retrieved without valid access token. |

## Create Channel

```JavaScript
ustream.channel.create(channelId, opts)
```

| Parameter         | Type               | Description                |
|-------------------|--------------------|----------------------------|
| channelId         | int                | ID of an existing channel. |
| opts.description  | string             | Description of channel.    |

## Edit Channel

```JavaScript
ustream.channel.edit(channelId, title, opts)
```

| Parameter         | Type               | Description                          |
|-------------------|--------------------|--------------------------------------|
| channelId         | int                | ID of an existing channel.           |
| title             | string             | Title of channel.                    |
| opts.description  | string             | Description of channel.              |
| opts.tags         | string             | Comma delimited list of channel tags |


## Delete Channel

```JavaScript
ustream.channel.remove(channelId)
```

| Parameter         | Type               | Description                |
--------------------|--------------------|-----------------------------
| channelId         | int                | ID of an existing channel. |

## List Channels

```JavaScript
ustream.channel.list(pageSize, page)
```
    
> Promise returns a Pageable result. See "Paging Results" section for details.

| Parameter | Type | Description                                                      |
|-----------|------|------------------------------------------------------------------|
| pageSize  | int  | (optional) Default: 100. The number of results to show per page. |
| page      | int  | (optional) Default: 1. The page to retrieve.                     |

## Check Password Protection Status

```JavaScript
ustream.channel.getPasswordProtectionStatus(channelId)
```

| Parameter         | Type               | Description                |
--------------------|--------------------|-----------------------------
| channelId         | int                | ID of an existing channel. |

## Enable Password Protection

```JavaScript
ustream.channel.enablePasswordProtection(channelId, password)
```

| Parameter         | Type               | Description                              |
|-------------------|--------------------|------------------------------------------|
| channelId         | int                | ID of an existing channel.               |
| password          | string             | The password used to access the channel. |

## Disable Password Protection

```JavaScript
ustream.channel.disablePasswordProtection(channelId)
```

| Parameter         | Type               | Description                |
--------------------|--------------------|-----------------------------
| channelId         | int                | ID of an existing channel. |

## Get Embed Lock Status

```JavaScript
ustream.channel.getEmbedLockStatus(channelId)
```

| Parameter         | Type               | Description                |
--------------------|--------------------|-----------------------------
| channelId         | int                | ID of an existing channel. |


## Enable/Disable Embed Lock

```JavaScript
ustream.channel.setEmbedLock(channelId, isEmbedLocked)
```

| Parameter         | Type               | Description                                                                 |
|-------------------|--------------------|-----------------------------------------------------------------------------|
| channelId         | int                | ID of an existing channel.                                                  |
| isEmbedLocked     | boolean            | Default is false. True to enable restricted embed access. False to disable. |

## Get Whitelisted URLs

```JavaScript
ustream.channel.getUrlWhiteList(channelId)
```

| Parameter         | Type               | Description                |
|-------------------|--------------------|----------------------------|
| channelId         | int                | ID of an existing channel. |

## Add URL to Whitelist

```JavaScript
ustream.channel.addUrlToWhiteList(channelId, url)
```

| Parameter         | Type               | Description                |
|-------------------|--------------------|----------------------------|
| channelId         | int                | ID of an existing channel. |
| url               | string             | URL to whitelisted domain. |


## Remove URLs from Whitelist
The API currently does not support removing a single URL from the whitelist. All URLs must be removed, then added.

```JavaScript
ustream.channel.emptyUrlWhiteList(channelId, url)
```

| Parameter         | Type               | Description                |
|-------------------|--------------------|----------------------------|
| channelId         | int                | ID of an existing channel. |
| url               | string             | URL to whitelisted domain. |

## Enable/Disable Content Sharing

```JavaScript
ustream.channel.setSharingControl(channelId, canShare)
```

| Parameter         | Type               | Description                                               |
|-------------------|--------------------|-----------------------------------------------------------|
| channelId         | int                | ID of an existing channel.                                |
| canShare          | boolean            | If true, users will be able to share a channel's content. |

## Change Branding Type

```JavaScript
ustream.channel.setBrandingType(channelId, type)
```
| Parameter         | Type               | Description                   |
|-------------------|--------------------|------------------------------|
| channelId         | int                | ID of an existing channel.    |
| type              | string             | The branding type.            |


# Testing
All tests are located in the `/test` directory. To execute the testing suite, or check for style guide violations,
run the following command.

    npm run test

# Issues & Contributing
Have a feature request or bug report? Create an entry in the issue tracker, and include as much detail as possible. I usually reply within 12 hours.

Code contributions must adhere to the [contribution guidelines](CONTRIBUTING.md).
