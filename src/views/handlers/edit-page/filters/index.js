import DayOfWeekFilter from "./DayOfWeekFilter";
import FilterGroup from "./FilterGroup";
import HeaderFilter from './HeaderFilter';
import QueryParamFilter from "./QueryParamFilter";
import RequestTypeFilter from './RequestTypeFilter';
import ScalarFieldFilter from './ScalarFieldFilter';
import TimeRangeFilter from "./TimeRangeFilter";

export const DRAG_TYPE_FILTER = 'FILTER_TO_ADD';
export const FILTERS_ADDED = 'FILTER';

export const filtersList = [
    { type: DRAG_TYPE_FILTER, id: 'f_grp', text: 'Filter group', itemType: FilterGroup },
    { type: DRAG_TYPE_FILTER, id: 'hdr', text: 'Header filter', itemType: HeaderFilter },
    { type: DRAG_TYPE_FILTER, id: 'rq_type', text: 'Request type', itemType: RequestTypeFilter },
    {
        type: DRAG_TYPE_FILTER, id: 'hostname', text: 'Host filter', itemType: ScalarFieldFilter,
        params: { fieldName: 'Host name' }
    },
    {
        type: DRAG_TYPE_FILTER, id: 'url', text: 'Url filter', itemType: ScalarFieldFilter,
        params: { fieldName: 'Url' }
    },
    {
        type: DRAG_TYPE_FILTER, id: 'flt_refr_url', text: 'Referrer url filter', itemType: ScalarFieldFilter,
        params: { fieldName: 'Referrer url' }
    },
    { type: DRAG_TYPE_FILTER, id: 'quer_param', text: 'Query param filter', itemType: QueryParamFilter },
    { type: DRAG_TYPE_FILTER, id: 'dayOfWeek', text: 'Day of week filter', itemType: DayOfWeekFilter },
    { type: DRAG_TYPE_FILTER, id: 'timeOfDay', text: 'Time of day filter', itemType: TimeRangeFilter },
    { type: DRAG_TYPE_FILTER, id: 'attachment', text: 'Attachments filter', itemType: HeaderFilter }
];

export const filterMap = filtersList.reduce((obj, filter) => {
    const { id, itemType, text, params } = filter

    obj[id] = { Control: itemType, title: text, params };

    return obj;
}, {});