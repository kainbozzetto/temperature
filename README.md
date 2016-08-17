# Overview

Displaying and recording temperature using an IR Temperature Sensor connected to an Arduino Board and sending the data serially to a NodeJS webserver. Data saved to a MongoDB database using Mongoose on the backend. Frontend developed using AngularJS and Bootstrap with ChartJS to display graphs.

# Setup

* Arduino EtherMega 2560
* [Freetronics IR Temperature Sensor Module](http://www.freetronics.com.au/collections/modules/products/irtemp-ir-temperature-sensor-module#.V7PrxjUbIsQ)

![Setup](https://cloud.githubusercontent.com/assets/8401521/17724570/8a6e8f36-6486-11e6-82e8-912c1ae9700e.jpg)

# Client

Developed using AngularJS and Bootstrap and therefore mobile-compatible.

## Home

Displays the current temperature and dynamically graphs the recent history (approximately 5 minutes) for both temperature recordings.

![Home Page](https://cloud.githubusercontent.com/assets/8401521/17724616/e88a529e-6486-11e6-89da-ab6c552c6d20.png)

## History

Allows for users to search for temperature recordings between the specified time periods.

![History Search](https://cloud.githubusercontent.com/assets/8401521/17724621/f2277386-6486-11e6-9c8b-705c761dd15a.png)

Once data is retrieved the user is given the ability to download the data as a CSV (Comma Separated Value) file.

![History Results](https://cloud.githubusercontent.com/assets/8401521/17724628/026ec51e-6487-11e6-9def-be12e71c1e94.png)

## CSV Download

![Download CSV](https://cloud.githubusercontent.com/assets/8401521/17724635/1070c91e-6487-11e6-9614-431e8db86a56.png)

The CSV file can be opened in Microsoft Excel and converted into an XLS file format from there if desired.

![CSV Data](https://cloud.githubusercontent.com/assets/8401521/17724642/190e6e0a-6487-11e6-958b-aed01c16ae43.png)
