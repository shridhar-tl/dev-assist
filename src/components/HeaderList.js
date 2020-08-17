import React, { Component } from 'react';
//import { AutoComplete } from 'primereact/components/autocomplete/AutoComplete';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';

export const COMMON_HTTP_RESPONSE_HEADERS = [
  { text: 'Access-Control-Allow-Credentials' },
  { text: 'Access-Control-Allow-Headers' },
  { text: 'Access-Control-Allow-Methods' },
  { text: 'Access-Control-Allow-Origin' },
  { text: 'Access-Control-Expose-Headers' },
  { text: 'Access-Control-Max-Age' },
  { text: 'Accept-Ranges' },
  { text: 'Age' },
  { text: 'Allow' },
  { text: 'Alternate-Protocol' },
  { text: 'Cache-Control' },
  { text: 'Client-Date' },
  { text: 'Client-Peer' },
  { text: 'Client-Response-Num' },
  { text: 'Connection' },
  { text: 'Content-Disposition' },
  { text: 'Content-Encoding' },
  { text: 'Content-Language' },
  { text: 'Content-Length' },
  { text: 'Content-Location' },
  { text: 'Content-MD5' },
  { text: 'Content-Range' },
  { text: 'Content-Security-Policy' },
  { text: 'X-Content-Security-Policy' },
  { text: 'X-WebKit-CSP' },
  { text: 'Content-Security-Policy-Report-Only' },
  { text: 'Content-Type' },
  { text: 'Date' },
  { text: 'ETag' },
  { text: 'Expires' },
  { text: 'HTTP' },
  { text: 'Keep-Alive' },
  { text: 'Last-Modified' },
  { text: 'Link' },
  { text: 'Location' },
  { text: 'Pragma' },
  { text: 'Proxy-Authenticate' },
  { text: 'Proxy-Connection' },
  { text: 'Refresh' },
  { text: 'Retry-After' },
  { text: 'Server' },
  { text: 'Set-Cookie' },
  { text: 'Status' },
  { text: 'Strict-Transport-Security' },
  { text: 'Timing-Allow-Origin' },
  { text: 'Trailer' },
  { text: 'Transfer-Encoding' },
  { text: 'Upgrade' },
  { text: 'Vary' },
  { text: 'Via' },
  { text: 'Warning' },
  { text: 'WWW-Authenticate' },
  { text: 'X-Aspnet-Version' },
  { text: 'X-Content-Type-Options' },
  { text: 'X-Frame-Options' },
  { text: 'X-Permitted-Cross-Domain-Policies' },
  { text: 'X-Pingback' },
  { text: 'X-Powered-By' },
  { text: 'X-Robots-Tag' },
  { text: 'X-UA-Compatible' },
  { text: 'X-XSS-Protection' }
];

export const COMMON_HTTP_REQUEST_HEADERS = [
  { text: 'Accept-Charset' },
  { text: 'Accept-Encoding' },
  { text: 'Accept-Language' },
  { text: 'Authorization' },
  { text: 'Expect' },
  { text: 'From' },
  { text: 'Host' },
  { text: 'If-Match' },
  { text: 'If-Modified-Since' },
  { text: 'If-None-Match' },
  { text: 'If-Range' },
  { text: 'If-Unmodified-Since' },
  { text: 'Max-Forwards' },
  { text: 'Proxy-Authorization' },
  { text: 'Range' },
  { text: 'Referer' },
  { text: 'TE' },
  { text: 'User-Agent' }
]


export default class HeaderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };

    this.selectionChanged = this.selectionChanged.bind(this);
  }

  selectionChanged(e) {
    this.setState({ value: e.value })
    this.props.onChange(e.value);
  }

  render() {
    return (
      <div className="p-col-12 p-md-6">
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Select Header</span>
          <Dropdown editable={true} filter={true} showClear={true} value={this.state.value}
            options={COMMON_HTTP_RESPONSE_HEADERS}
            optionLabel="text" onChange={this.selectionChanged} style={{ width: '250px' }} placeholder="Enter the name of a header" />
        </div>
      </div>
    );
  }
}
