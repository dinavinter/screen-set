import {initDemoSite} from './engine'
import {checkIfGigyaLoaded} from "./dynamic-apikey";

/**
 * Initial function (once all the content is loaded). It loads the configuration
 * from setup/site.json and starts the site UI
 */
document.addEventListener("DOMContentLoaded", function() {
    // Initialize the site (and loads Gigya file)
    initDemoSite();
});

/**
 * This function will be triggered once Gigya is fully loaded and ready to be used.
 * In the function **onGigyaServiceReady**, we look for a valid user session, checking
 * if the user is logged or not and show different sections depending on that state.
 *
 * See more in: https://developers.gigya.com/display/GD/onGigyaServiceReady+Template
 */
export function onGigyaServiceReady() {
    // Check if the user was previously logged in
    if (typeof window.gigya === "undefined") {
        alert("Gigya is not loaded on this page :(");
    } else {
        // Check if the library is properly loaded or not (stops the flow if it's bad loaded)
        checkIfGigyaLoaded(); 
    }
}
/** *****************************************************/