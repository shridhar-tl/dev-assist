# Dev Assistant

Helps to manage storage and modify / control http(s) requests, tabs, user agents etc by configuring various filters and actions.

This is a browser extension which is currently available only for Chrome browser, which primarily provides capablity to Manage IndexedDB Storage and Request Handling of any sites you visit.

## Manage Storage:
Currently your chrome browser does not provide any out of box solution to edit / filter the data stored in IndexedDB. As a website developer or a visitor to any website which stores data for offline use, you may be sometimes in need to view / edit the existing data. As chrome doesn't provide you this option, it would be handy for you to use this extension.

Dev Assistant list out the items stored in IndexedDB and allows you to modify the data.

Though IndexedDB storage is convenient to store unstructured data like JSON, it is still more convenient to use SQL to query the data. Hence Dev Assistant provides you with an option to query and preview the data stored in IndexedDB either as table or as JSON tree itself.

## Request Handling:
This extension lets you to create multiple handlers each containing one or more filters and actions. Actions would be applied to request or tabs if the configured filters matches with the requests. You can set "and" / "or" options to match one or more filters to perform an action.

Their are multiple filters and actions available and more to be added soon. Some of them are listed below.

Actions:
* Block requests
* Modify urls and referrer url
* Modify query in url
* Modify the headers and cookies
* Modify the user agent
* Set, enable or disable proxy for specific requests matching the filters.
* Add custom JavaScript or CSS to any site.
* Close the tab


Available filters:
* Headers: Filters a request based on headers with various matching criteria including regex, wildcards, etc.
* Request type: Filter a request using http verbs like GET, POST, etc or type of request like JS, Styles, Images, etc.
* Host: Filter request based on host with various comparison options including regex, wildcards, etc
* Url & Referrer url: Lets you filter request based on word or phase in the url or using the protocol, host, port, path, etc.
* Query param: Lets you to filter request based on query params
* Day of week & Time of day: Lets you apply the filter only on a particular day of the week and between only the given time range. This is useful for parental controls.

Features overview:
- View or edit items from IndexedDB of any sites you visit
- Use SQL to filter data from IndexedDB
- Redirecting requests
- Blocking websites
- Control tabs
- Show notifications
- Enable or disable one or all handlers when needed
- Overcome CORS issue
- Sync your settings between browsers