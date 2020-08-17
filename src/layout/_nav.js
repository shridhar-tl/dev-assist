export default [
    { label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => { window.location = '#/' } },
    {
        label: 'Handlers', icon: 'pi pi-fw pi-globe', badge: '9',
        items: [
            { label: 'View Handlers', icon: 'pi pi-fw pi-th-large', to: '/handlers' },
            { label: 'New Handler', icon: 'pi pi-fw pi-file', to: '/handlers/create' }
        ]
    },
    { label: 'Documentation', icon: 'pi pi-fw pi-question', command: () => { window.location = "#/documentation" } },
    { label: 'Donate', icon: 'pi pi-fw pi-question', command: () => { window.location = "#/documentation" } },
    { label: 'Report Bug', icon: 'pi pi-fw pi-question', command: () => { window.location = "#/documentation" } },
    { label: 'View Source', icon: 'pi pi-fw pi-search', command: () => { window.location = "https://github.com/primefaces/sigma" } }
];