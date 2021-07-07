import array from '../../common/js-extn';

export const rowsPerPageOptions = [10, 15, 25, 50];
export const currentPageReportTemplate = "Showing {first} to {last} of {totalRecords}";
export const paginatorTemplate = "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown";

export async function getSiteNodes($browser) {
    let tabs = await $browser.getAllTabs();

    tabs = tabs.map(t => {
        if (!t.url) { return null; }

        const { protocol, host } = new URL(t.url);
        if (!host) {
            return null;
        }

        return {
            protocol: protocol.substring(0, protocol.length - 1),
            host,
            id: t.id,
            title: t.title
        };
    }).filter(Boolean);

    const groupedProtocol = array(tabs).groupBy('protocol')();
    let nodes = groupedProtocol.map(({ key: protocol, values }) => ({
        key: protocol,
        label: protocol,
        leaf: false,
        children: array(values)
            .groupBy('host')()
            .map(({ key, values }) => ({
                key,
                label: protocol !== 'chrome-extension' ? key : values[0].title,
                icon: 'fa fa-globe',
                leaf: false,
                id: values[0].id
            }))
    }));

    if (nodes.length === 1) {
        nodes = nodes[0].children;
    }

    return nodes;
}