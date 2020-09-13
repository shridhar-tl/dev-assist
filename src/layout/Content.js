import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import List from '../views/handlers/List';
import Edit from '../views/handlers/edit-page/Edit';
import { ImportHandlers } from '../components';

class Content extends PureComponent {
    render() {
        return (
            <div className="layout-main">
                <Route path="/" exact component={List} />
                <Route path="/handlers" exact component={List} />
                <Route path="/handlers/create" exact component={Edit} />
                <Route path="/handlers/edit/:id" exact component={Edit} />
                {/*<Route path="/forms" component={FormsDemo} />
                <Route path="/sample" component={SampleDemo} />
                <Route path="/data" component={DataDemo} />
                <Route path="/panels" component={PanelsDemo} />
                <Route path="/overlays" component={OverlaysDemo} />
                <Route path="/menus" component={MenusDemo} />
                <Route path="/messages" component={MessagesDemo} />
                <Route path="/charts" component={ChartsDemo} />
                <Route path="/misc" component={MiscDemo} />
                <Route path="/empty" component={EmptyPage} />
                <Route path="/documentation" component={Documentation} />*/}
                <ImportHandlers />
            </div>
        );
    }
}

export default Content;