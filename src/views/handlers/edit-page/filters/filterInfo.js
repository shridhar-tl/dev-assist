import { FilterTypes } from "../../../../common/constants";

const filters = {
    [FilterTypes.DayOfWeek]: 'Day of week filter lets you to apply an action only on selected day of the week.',
    [FilterTypes.FilterGroup]: 'Filter group lets you group multiple filters. This group would be particularly helpful if you need to use combination of "and" + "or" conditions.',
    [FilterTypes.Header]: 'Header filter lets you apply an action based on a particular header value. This will also let you apply actions based on existince of header.',
    [FilterTypes.QueryParam]: 'Query param filter lets you to apply an action based on a particular query value.',
    [FilterTypes.RequestMethod]: 'Filter http verbs like GET, POST, PUT, etc..',
    [FilterTypes.RequestType]: 'Lets you apply an action based on type of request like image, script, etc..',

}

export default filters;