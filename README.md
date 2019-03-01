<img src="https://user-images.githubusercontent.com/1423657/39084356-c723a81e-4574-11e8-963c-d11717789fa3.png" width=200>

# homer-view-react
Experimental React Viewer for HEP APIs

## Requirements
* This Application requires a [HEP Auth Proxy](https://github.com/hepictel/hepic-export-proxy) to access the HOMER API

## Installation
1. Clone this repository
2. `cd homer-view-react`
3. Run `npm install` to install dependencies
4. Run `npm run build` to build application
5. Start the development server `npm run start`
6. Access the application at http://localhost:3000/

### Usage
The Application accepts the following URL parameters defining search settings:
* `from`: start time in milliseconds
* `to`: stop time in milliseconds
* `callid`: callid string or array
* `tabs`: tabs string or array (available tabs: `messages, qos, flow, logs, export`)

#### Example
* `http://localhost:3000/?from=1550706099000&to=1550707799000&callid=8afhjq@127.0.0.1&tabs=messages,qos`

-------------

#### Made by Humans
This Open-Source project is made possible by actual Humans without corporate sponsors, angels or patreons.<br>
If you use this software in production, please consider supporting its development with contributions or [donations](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=donation%40sipcapture%2eorg&lc=US&item_name=SIPCAPTURE&no_note=0&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHostedGuest)

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=donation%40sipcapture%2eorg&lc=US&item_name=SIPCAPTURE&no_note=0&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHostedGuest) 
