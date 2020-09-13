import DayOfWeekFilter from "./DayOfWeekFilter";
import FilterGroup from "./FilterGroup";
import HeaderFilter from './HeaderFilter';
import QueryParamFilter from "./QueryParamFilter";
import ScalarFieldFilter from './ScalarFieldFilter';
import TimeRangeFilter from './TimeRangeFilter';
import { FilterTypes } from '../../../../common/constants';
import filterInfo from './filterInfo';
import './Filters.scss';
import { InitiatorType, OriginTypeList, ProtocolList, RequestMethodList } from "../../../../components";
import SelectItemFilter from "./SelectItemFilter";

export const DRAG_TYPE_FILTER = 'FILTER_TO_ADD';
export const FILTERS_ADDED = 'FILTER';

export { filterInfo };

export const filtersList = [
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.FilterGroup,
        text: 'Filter group',
        itemType: FilterGroup
    },
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.RequestMethod,
        text: 'Request method',
        itemType: SelectItemFilter,
        params: {
            Control: RequestMethodList,
            fieldName: 'Request method'
        }
    },
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.RequestType,
        text: 'Request type',
        itemType: SelectItemFilter,
        params: {
            Control: InitiatorType,
            fieldName: 'Request type'
        }
    },
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.RequestOrigin,
        text: 'Request origin',
        itemType: SelectItemFilter,
        params: {
            Control: OriginTypeList,
            fieldName: 'Request origin type'
        }
    },
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.Initiator,
        text: 'Initiator host',
        itemType: ScalarFieldFilter,
        params: {
            fieldName: 'Initiator host'
        }
    },
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.RequestProtocol,
        text: 'Request protocol',
        itemType: SelectItemFilter,
        params: {
            Control: ProtocolList,
            fieldName: 'Protocol type'
        }
    },
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.HostName,
        text: 'Host filter',
        itemType: ScalarFieldFilter,
        params: { fieldName: 'Host name' }
    },
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.RequestPort,
        text: 'Request port',
        itemType: ScalarFieldFilter,
        params: { fieldType: 'number' }
    },
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.Url,
        text: 'Url filter',
        itemType: ScalarFieldFilter,
        params: {
            fieldName: 'Url'
        }
    },
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.Header,
        text: 'Header filter',
        itemType: HeaderFilter
    },
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.ReferrerUrl,
        text: 'Referrer url filter',
        itemType: ScalarFieldFilter,
        params: {
            fieldName: 'Referrer url'
        }
    },
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.QueryParam,
        text: 'Query param filter',
        itemType: QueryParamFilter
    },
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.DayOfWeek,
        text: 'Day of week filter',
        itemType: DayOfWeekFilter
    },
    {
        type: DRAG_TYPE_FILTER,
        id: FilterTypes.TimeOfDay,
        text: 'Time of day filter',
        itemType: TimeRangeFilter
    },
    //{ type: DRAG_TYPE_FILTER, id: FilterTypes.Attachment, text: 'Attachments filter', itemType: HeaderFilter }
];

export const filterMap = filtersList.reduce((obj, filter) => {
    const { id, itemType, text, params } = filter

    obj[id] = { Control: itemType, title: text, params };

    return obj;
}, {});