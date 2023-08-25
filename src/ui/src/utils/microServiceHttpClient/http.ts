const HTTP_CONFIG = {
    CREDENTIALS: 'include' as RequestCredentials
};

export interface ErrorMessage {
    statusCode: number;
    error: string;
    message: string;
}

/**
 * Set http headers to be used in the fetch requests
 */
const LegacyRequestHeaders = () => {
    const headers = new Headers({
        'Accept': 'application/json',
    });
    return headers;
};

/**
 * Set http headers to be used in the fetch requests
 */
const RequestHeaders = () => {
    const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });
    return headers;
};

/**
 * Handle the http fetch responses in a generic safe way
 * @param {fetch response} res
 */
const handleResponse = async (res: Promise<Response>, isJson = true) => {
    const response = await res;

    if (response.status >= 200 && response.status < 300) {
        return isJson ? response.json() : response.text();
    } else if (response.status === 401) {
        // should send the user to the logout page
    } else {
        const err = new Error(`${response.statusText} - ${response.text()} `);
        throw err;
    }
};

/**
 * Http GET requests
 * @param url
 */
export const get = (url: string, isJson = true) => handleResponse(fetch(url, {
    headers: RequestHeaders(),
    credentials: HTTP_CONFIG.CREDENTIALS
}), isJson);

/**
 * Http GET requests for legacy play routes
 * @param url
 */
export const legacyGet = (url: string, isJson = true) => handleResponse(fetch(url, {
    headers: LegacyRequestHeaders(),
    credentials: HTTP_CONFIG.CREDENTIALS
}), isJson);

/**
 * Http POST request
 * @param url
 * @param payload
 */
export const post = (url: string, payload: object) => {
    const postObj: RequestInit = {
        method: 'POST',
        headers: RequestHeaders(),
        body: JSON.stringify(payload),
        credentials: HTTP_CONFIG.CREDENTIALS
    };
    return handleResponse(fetch(url, postObj));
};

/**
 * Http PUT request
 * @param url
 * @param payload
 */
export const put = (url: string, payload: object) => {
    const postObj: RequestInit = {
        method: 'PUT',
        body: JSON.stringify(payload),
        credentials: HTTP_CONFIG.CREDENTIALS
    };
    return handleResponse(fetch(url, postObj));
};

/**
 * Http DELETE request
 * @param url
 */
export const remove = (url: string) => {
    const postObj: RequestInit = {
        method: 'DELETE',
        credentials: HTTP_CONFIG.CREDENTIALS
    };
    return handleResponse(fetch(url, postObj));
};

export default {
    HTTP_CONFIG,
    LegacyRequestHeaders,
    RequestHeaders,
    handleResponse,
    get,
    legacyGet,
    post,
    put,
    remove,
};
