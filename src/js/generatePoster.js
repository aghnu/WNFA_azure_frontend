const endpointURL = 'https://wnfafunctions.azurewebsites.net/api/wnfapostersgen';

export const ERROR_CODE = {
    USER_ERROR: 1001,
    SERVER_ERROR: 1002,
    NETWORK_ERROR: 1003,
}

export function generatePoster(text, callbackSuc, callbackFail) {
    fetch(endpointURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'text': text,
            })
        })
        .then((r) => {
            if (r.status === 200) {
                r.json().then((d) => {
                    callbackSuc(d);
                })
            } else if (r.status === 400) {
                callbackFail(ERROR_CODE.USER_ERROR);
            } else {
                callbackFail(ERROR_CODE.SERVER_ERROR);
            }
        })
        .catch(() => {
            callbackFail(ERROR_CODE.NETWORK_ERROR);
        });
}