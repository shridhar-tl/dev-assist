import React, { Component } from 'react';
//import { AutoComplete } from 'primereact/components/autocomplete/AutoComplete';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';

export const COMMON_HTTP_RESPONSE_HEADERS = [
  { value: 'Access-Control-Allow-Credentials' },
  { value: 'Access-Control-Allow-Headers' },
  { value: 'Access-Control-Allow-Methods' },
  { value: 'Access-Control-Allow-Origin' },
  { value: 'Access-Control-Expose-Headers' },
  { value: 'Access-Control-Max-Age' },
  { value: 'Accept-Ranges' },
  { value: 'Age' },
  { value: 'Allow' },
  { value: 'Alternate-Protocol' },
  { value: 'Cache-Control' },
  { value: 'Client-Date' },
  { value: 'Client-Peer' },
  { value: 'Client-Response-Num' },
  { value: 'Connection' },
  { value: 'Content-Disposition' },
  { value: 'Content-Encoding' },
  { value: 'Content-Language' },
  { value: 'Content-Length' },
  { value: 'Content-Location' },
  { value: 'Content-MD5' },
  { value: 'Content-Range' },
  { value: 'Content-Security-Policy' },
  { value: 'X-Content-Security-Policy' },
  { value: 'X-WebKit-CSP' },
  { value: 'Content-Security-Policy-Report-Only' },
  { value: 'Content-Type' },
  { value: 'Date' },
  { value: 'ETag' },
  { value: 'Expires' },
  { value: 'HTTP' },
  { value: 'Keep-Alive' },
  { value: 'Last-Modified' },
  { value: 'Link' },
  { value: 'Location' },
  { value: 'Pragma' },
  { value: 'Proxy-Authenticate' },
  { value: 'Proxy-Connection' },
  { value: 'Refresh' },
  { value: 'Retry-After' },
  { value: 'Server' },
  { value: 'Set-Cookie' },
  { value: 'Status' },
  { value: 'Strict-Transport-Security' },
  { value: 'Timing-Allow-Origin' },
  { value: 'Trailer' },
  { value: 'Transfer-Encoding' },
  { value: 'Upgrade' },
  { value: 'Vary' },
  { value: 'Via' },
  { value: 'Warning' },
  { value: 'WWW-Authenticate' },
  { value: 'X-Aspnet-Version' },
  { value: 'X-Content-Type-Options' },
  { value: 'X-Frame-Options' },
  { value: 'X-Permitted-Cross-Domain-Policies' },
  { value: 'X-Pingback' },
  { value: 'X-Powered-By' },
  { value: 'X-Robots-Tag' },
  { value: 'X-UA-Compatible' },
  { value: 'X-XSS-Protection' }
];

COMMON_HTTP_RESPONSE_HEADERS.forEach(h => h.label = h.value);

export const COMMON_HTTP_REQUEST_HEADERS = [
  { value: 'Accept-Charset' },
  { value: 'Accept-Encoding' },
  { value: 'Accept-Language' },
  { value: 'Authorization' },
  { value: 'Expect' },
  { value: 'From' },
  { value: 'Host' },
  { value: 'If-Match' },
  { value: 'If-Modified-Since' },
  { value: 'If-None-Match' },
  { value: 'If-Range' },
  { value: 'If-Unmodified-Since' },
  { value: 'Max-Forwards' },
  { value: 'Proxy-Authorization' },
  { value: 'Range' },
  { value: 'Referer' },
  { value: 'TE' },
  { value: 'User-Agent' }
];

COMMON_HTTP_REQUEST_HEADERS.forEach(h => h.label = h.value);

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
    const { showResponseHeaders, size = 4 } = this.props;

    return (
      <div className={`p-md-${size}`}>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Header</span>
          <Dropdown editable={true} filter={true} showClear={true} value={this.state.value}
            options={showResponseHeaders ? COMMON_HTTP_RESPONSE_HEADERS : COMMON_HTTP_REQUEST_HEADERS}
            onChange={this.selectionChanged} style={{ width: '250px' }} placeholder="Enter the name of a header" />
        </div>
      </div>
    );
  }
}
