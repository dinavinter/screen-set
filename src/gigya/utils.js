 
/** *****************************************************/
/*                    3. LOG FUNCTIONS                 */
/** *****************************************************/
/**
 * 
 * @param {string} text The text to log
 * @param {string} operation the network operation performed. (No network operation if null)
 * @param {boolean} show Show the log or not
 */

var showLog =true;
var showEventsLog =true;
export function log(text, operation, show , title ='Log') {
    if (showLog === true || show === true) {
         var backgroundColor = !operation ? "#00800033" : "#ff000033";
        console.info(
            `%c ${title} %c--> ` + text + "%c%s",
            `font-weight: bold; color: #333;background-color:${backgroundColor};`,
            "font-weight: normal;color:#aaa",
            "font-weight: bold;color:#f14668",
            operation ? " --> " + operation : ""
        );
    }
}
/**
 *
 * @param {string} eventName The name of the  Event
 * @param {string} methodName The name of the  Method
 * @param {boolean} show Show the log or not
 * @param title
 */
function logEvents(eventName, methodName, show, title= "Event") {
    if (methodName && methodName === "gscounters.sendReport") {
        return;
    }

    // debugger;
    if (showEventsLog === true || show === true) {
         var backgroundColor = "#0089ff33";
        if (methodName) {
            console.info(
                `%c ${title} %c - Event: %c` +
                eventName +
                "%c, Method: %c" +
                methodName,
                `font-weight: bold;color: #333;background-color:${backgroundColor};`,
                "font-weight: normal;color:#aaa",
                `font-weight:bold;color:#428bca;`,
                "font-weight: normal;color:#aaa;",
                "font-weight: bold; color: #f14668"
            );
        } else {
            console.info(
                `%c ${title} %c - Event: %c` + eventName,
                `font-weight: bold; color: #333;background-color:${backgroundColor};`,
                "font-weight: normal;color:#aaa",
                `font-weight:bold; color:#428bca;`
            );
        }
    }
}

/** *****************************************************/


/** *****************************************************/
/*                  4. SEARCH FUNCTIONS                 */
/** *****************************************************/
/**
 * Returns the value of the variable if exists into the query string in the url of the site.
 * @param {string} variable the variable to search
 * @returns {string} the value of the variable if found and null if not found
 */
export function getFromQueryString(variable) {

    // Take query string and make object
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(variable)) {

        if (urlParams.get(variable) !== '') {
            return urlParams.get(variable);
        }
    }

}

/**
 *  It returns the url params of hte navigation bar
 * @returns {string} the url params
 */
export function getQueryParamsAsString() {
    return window.location.search;
}

/**
 * Gets the variable (if exists) from the local storage
 * @param {string} variable the name of the variable
 * @param {object} value the value of the variable
 */
export function getFromLocalStorage(variable) {
    return localStorage.getItem(variable);
}

/**
 * Sets the variable with the value in parameters into the local storage
 * @param {string} variable the name of the variable
 * @param {object} value the value of the variable
 */
export function setInLocalStorage(variable, value) {
    localStorage.setItem(variable, value);
}