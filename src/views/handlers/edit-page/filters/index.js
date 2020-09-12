import DayOfWeekFilter from "./DayOfWeekFilter";
import FilterGroup from "./FilterGroup";
import HeaderFilter from './HeaderFilter';
import QueryParamFilter from "./QueryParamFilter";
import RequestTypeFilter from './RequestTypeFilter';
import ScalarFieldFilter from './ScalarFieldFilter';
import TimeRangeFilter from './TimeRangeFilter';
import { FilterTypes } from '../../../../common/constants';
import filterInfo from './filterInfo';
import './Filters.scss';

export const DRAG_TYPE_FILTER = 'FILTER_TO_ADD';
export const FILTERS_ADDED = 'FILTER';

export { filterInfo };

export const filtersList = [
    { type: DRAG_TYPE_FILTER, id: FilterTypes.FilterGroup, text: 'Filter group', itemType: FilterGroup },
    { type: DRAG_TYPE_FILTER, id: FilterTypes.Header, text: 'Header filter', itemType: HeaderFilter },
    { type: DRAG_TYPE_FILTER, id: FilterTypes.RequestType, text: 'Request type', itemType: RequestTypeFilter },
    {
        type: DRAG_TYPE_FILTER, id: FilterTypes.HostName, text: 'Host filter', itemType: ScalarFieldFilter,
        params: { fieldName: 'Host name' }
    },
    {
        type: DRAG_TYPE_FILTER, id: FilterTypes.Initiator, text: 'Initiator host filter', itemType: ScalarFieldFilter,
        params: { fieldName: 'Initiator host' }
    },
    {
        type: DRAG_TYPE_FILTER, id: FilterTypes.Url, text: 'Url filter', itemType: ScalarFieldFilter,
        params: { fieldName: 'Url' }
    },
    {
        type: DRAG_TYPE_FILTER, id: FilterTypes.ReferrerUrl, text: 'Referrer url filter', itemType: ScalarFieldFilter,
        params: { fieldName: 'Referrer url' }
    },
    { type: DRAG_TYPE_FILTER, id: FilterTypes.QueryParam, text: 'Query param filter', itemType: QueryParamFilter },
    { type: DRAG_TYPE_FILTER, id: FilterTypes.DayOfWeek, text: 'Day of week filter', itemType: DayOfWeekFilter },
    { type: DRAG_TYPE_FILTER, id: FilterTypes.TimeOfDay, text: 'Time of day filter', itemType: TimeRangeFilter },
    //{ type: DRAG_TYPE_FILTER, id: FilterTypes.Attachment, text: 'Attachments filter', itemType: HeaderFilter }
];

export const filterMap = filtersList.reduce((obj, filter) => {
    const { id, itemType, text, params } = filter

    obj[id] = { Control: itemType, title: text, params };

    return obj;
}, {});