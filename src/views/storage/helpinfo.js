import React from 'react';
import { allowedFuncInQuery } from '../../content-scripts/shared';

export const idbInfoMessage = (<div className="usage-info">
    <strong>Purpose:</strong><br />
    If you are a website developer who use IndexedDB to store the offline data or
    if you are a visitor to any of the site which stores some data for offline usage in IndexedDB,
    you can use this page to query any data stored in any of the websites you currently have opened in your browser.<br />
    Unlike the browsers developer tools (F12), Dev Assistant not just provides the way to view the data,
    it also provides a convenient way to edit the data stored.<br />
    Additionally, Dev Assistant also provides an out of box solution to use SQL and query the data from IndexedDB.
    <br /><br />
    <strong>How to use?</strong><br />
    <ol>
        <li>If you want to edit the objects stored in IndexedDB of any site you visited or you are developing, open the site in another tab.</li>
        <li>Once the site has completely loaded or if you have it already opened, expand the appropriate site from the tree towards the left side of this page.</li>
        <li>Once you expand the tree node, you will see the list of IndexedDB's stored for that site.</li>
        <li>You can expand the IndexedDB tree node again to see the list of tables.</li>
        <li>Select the appropriate table you want to view or edit. Once the table is selected, you will see the list of items loaded in this space.</li>
        <li>You can navigate throught the list and edit any of the object properties by double clicking on the property. Then to end the editing click '<strong>Ctrl + Enter</strong>' key.</li>
        <li>All the updated rows would be highlighted.</li>
        <li>Once all the items in the current page is updated, click on the "<span className="fa fa-check" /> Save" button on bottom right corner of the page.</li>
    </ol>
    <br /><br />
    <strong>How to use SQL for filtering records?</strong><br />
    Though document storage is convenient to store unstructured data like JSON, it is still more convenient to use SQL language to query the data.<br />
    Hence Dev Assistant provides you with an option to query and preview the data stored in IndexedDB either as table or as JSON tree itself.<br />
    <ol>
        <li>To query the data, follow the steps mentioned above untill you select a Database or a Table.</li>
        <li>Once a Database or Table is selected, the query pane towards bottom left side, below the tree, gets enabled to provide you an option to change the query.</li>
        <li>You can type any simple select statements with list of property names and a where condition. You can also view inner level properties by using "." notation.</li>
        <li>You can use alias name for the column if you wish to use a different name for column while viewing it in table.</li>
        <li>If you wish to see entire data as JSON tree, use '*' along with any other specific column.</li>
        <li>Once you are done providing the query, press '<strong>Ctrl + Enter</strong>' key to execute the query and see the result.</li>
        <li>In case of syntax error, same would be shown in this section.</li>
    </ol>

    <strong>Functions supported in SQL:</strong><br />
    Here are the list of functions supported in SQL at this point. This space would be updated as and when new functions are added. You can also request for a function if you are in need of any:<br />
    <br />
    <strong>Note:</strong> Though the property names and comparison of value are case sensitive similar to javascript, function names are not case sensitive. You can feel free to use pascal, lower or upper case function names
    <ul>
        <li>
            <strong>getType: </strong>
            This would return the datatype of the value passed. Expected outputs are 'object', 'array', 'datetime', 'number', 'string', 'null', 'undefined'
            <ul>
                <li><strong>value (any): </strong> The value for which you would like to get the type.</li>
            </ul>
            <strong>Usecase: </strong> Assume you want to take the list of records where you want the data is stored as wrong type like
            datetime or number getting stored as string by accidental ".toString()" call, or null / undefined getting stored as string due to some concatinations, etc.<br />
            <ul>
                <li>getType() returns {'"' + allowedFuncInQuery.gettype() + '"'}</li>
                <li>getType(null) returns {'"' + allowedFuncInQuery.gettype(null) + '"'}</li>
                <li>getType(new Date()) returns {'"' + allowedFuncInQuery.gettype(new Date()) + '"'}</li>
                <li>getType('123456') returns {'"' + allowedFuncInQuery.gettype('123456') + '"'}</li>
                <li>getType(123456) returns {'"' + allowedFuncInQuery.gettype(123456) + '"'}</li>
            </ul>
            <hr />
        </li>
        <li>
            <strong>now: </strong>
            Returns the current date time object. This can be directly used in your query for date comparisons.<br />
            <strong>Example output:  now()</strong> returns <strong>{new Date(allowedFuncInQuery.now()).toString()}</strong>
            <hr />
        </li>
        <li>
            <strong>today: </strong>
            Returns the current date object without current time, that is basically the beginning of the day. This can be directly used in your query for date comparisons.
            <ul>
                <li><strong>endOfDay (boolean): </strong> Defaults  to false. If true is passed, then end of the day would be returned.</li>
            </ul>
            <strong>Example Usecase: </strong> This would be specifically useful to pull the records created or updated today.
            <ul>
                <li>today() returns {new Date(allowedFuncInQuery.today()).toString()}</li>
                <li>today(true) returns {new Date(allowedFuncInQuery.today(true)).toString()}</li>
            </ul>
            <hr />
        </li>
        <li>
            <strong>getDate: </strong>
            <ul>
                <li><strong>value: </strong> Any date string or a pattern</li>
                <li><strong>dayStart: </strong> if true is passed, then start of the day of given date and if false is passed, end of the day of given date.</li>
            </ul>
            <strong>Example Usecase: </strong> This would be specifically useful for date comparison or pattern based date comparison.
            <ul>
                <li>getDate('10-Jan-2050', false) returns {new Date(allowedFuncInQuery.getdate('10-Jan-2050', false)).toString()}</li>
                <li>getDate('+1w', true) or getDate('+1weeks', true) returns {new Date(allowedFuncInQuery.getdate('+1w', true)).toString()}</li>
                <li>getDate('-2M',false) or getDate('-2months',false) returns {new Date(allowedFuncInQuery.getdate('-2M', false)).toString()}</li>
                <li>getDate('+1Q') or getDate('+1quarters') returns {new Date(allowedFuncInQuery.getdate('+1q')).toString()}</li>
                <li>getDate('-1y') or getDate('-1year') returns {new Date(allowedFuncInQuery.getdate('-1y')).toString()}</li>
                <li>Other supported durations are: d=days, h=hours, m=minutes, s=seconds and ms=milliseconds</li>
            </ul>
            <hr />
        </li>
        <li>
            <strong>lcase: </strong>
            Converts the given string to lower case string.
            This would be particularly useful to do case insensitive filtering.
            If any data other than string is passed, then same data is returned without change.
            <ul>
                <li><strong>str: </strong> The string to be converted</li>
            </ul>
            <hr />
        </li>
        <li>
            <strong>ucase: </strong>
            Converts the given string to upper case string.
            This would be particularly useful to do case insensitive filtering.
            If any data other than string is passed, then same data is returned without change.
            <ul>
                <li><strong>str: </strong> The string to be converted</li>
            </ul>
            <hr />
        </li>
    </ul>
</div>);