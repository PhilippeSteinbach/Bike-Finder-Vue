import axios from 'axios'

function getBearerToken() {
    return localStorage.getItem('token');
}

function setBearerToken(token) {
    console.log("Cached a new Token in Local Storage");
    localStorage.setItem('token', token);
}

function clearBearerToken() {
    localStorage.removeItem('token');
}

function generateImageUrl(id) {
    return `${process.env.VUE_APP_SQUIDEX_API}/api/assets/${id}`;
}

export async function getBikes() {
    const json = await getContentAxios(`api/content/${process.env.VUE_APP_APP_NAME}/bikes`);

    const {
        total,
        items
    } = json;

    return {
        total,
        bikes: items.map(x => parseBike(x))
    };
}

export async function setBikeLocation(id, body) {
    const json = await patchContentAxios(`api/content/${process.env.VUE_APP_APP_NAME}/bikes/${id}`, body);
    
    return json;
}

export async function createHistory(body) {
    const json = await postContentAxios(`api/content/${process.env.VUE_APP_APP_NAME}/history`, body);
    
    return json;
}

export async function getHome() {
    const json = await getContentAxios(`api/content/${process.env.VUE_APP_APP_NAME}/home`);

    const {
        items
    } = json;

    return {
        homeContent: parseHome(items[0])
    };
}

export async function getNews() {
    const json = await getContentAxios(`api/content/${process.env.VUE_APP_APP_NAME}/news`);

    const {
        total,
        items
    } = json;

    return {
        total,
        news: items.map(x => parseNews(x))
    };
}

export async function getHistory() {
    const json = await getContentAxios(`api/content/${process.env.VUE_APP_APP_NAME}/history`);

    const {
        total,
        items
    } = json;

    return {
        total,
        history: items.map(x => parseHistory(x))
    };
}

function getContentAxios(url) {
    return getContentInternalAxios(url, false);
}

//edit
function patchContentAxios(url, bike) {
    return patchContentInternalAxios(url, bike);
}

function postContentAxios(url, history) {
    return postContentInternalAxios(url, history);
}



async function getContentInternalAxios(url, retry) {
    // Fetch the bearer token.
    const token = await fetchBearerTokenAxios();

    // Catch 401 / 403 (unauthorized/forbidden) and retry
    axios.interceptors.response.use(response => {
        return response;
    }, error => {
        if (error.response.status === 401 || error.response.status === 403) {
            clearBearerToken();

            if (retry) {
                return getContentAxios(url);
            }
        }
        return error;
    });

    var json = axios
        .get(buildUrl(url), {
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))

    return json;
}

async function patchContentInternalAxios(url, body) {
    // Fetch the bearer token.
    const token = await fetchBearerTokenAxios();

    var json = await axios
        .patch(buildUrl(url), body, {
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
    
    return json;
}

async function postContentInternalAxios(url, body) {
    // Fetch the bearer token.
    const token = await fetchBearerTokenAxios();

    var json =  await axios
        .post(buildUrl(url), body, {
            params: {
                publish: true
            },
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
    
    return json;
}

function parseBike(response) {
    return {
        id: response.id,
        name: response.data.name.iv,
        location: response.data.location.iv,
        locationAddress: response.data.locationAddress.iv,
        imageUrl: generateImageUrl(response.data.image.iv) //must not be null TODO: FIX
    };
}

function parseHome(response) {
    var carouselImages = response.data.carouselImages.iv.map(x => generateImageUrl(x))

    var highlights = response.data.highlights.iv
    highlights.forEach(element => {
        element.image = generateImageUrl(element.image)
    })
    
    return {
        id: response.id,
        headerTitle: response.data.headerTitle.iv,
        headerSubtitle1: response.data.headerSubtitle1.iv,
        headerSubtitle2: response.data.headerSubtitle2.iv,
        carouselImageUrls: carouselImages,
        highlights: highlights,
    };
}

function parseNews(response) {
    return {
        id: response.id,
        created: response.created,
        title: response.data.title.iv,
        subtitle: response.data.subtitle.iv,
        text: response.data.text.iv,
        imageUrl: generateImageUrl(response.data.image.iv) //must not be null TODO: FIX
    };
}

function parseHistory(response) {
    return {
        id: response.id,
        name: response.data.bike.iv,
        startDate: response.data.startDate.iv,
        endDate: response.data.endDate.iv,
        distance: response.data.distance.iv,
        imageUrl: generateImageUrl(response.data.image.iv) //must not be null TODO: FIX
    };
}

export async function fetchBearerTokenAxios() {
    // Check if we have already a bearer token in local store.
    let token = getBearerToken();

    if (token) {
        //console.log('Access Token found in LocalStorage: true');
        return token;
    }

    const body = new FormData();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', process.env.VUE_APP_CLIENT_ID);
    body.set('client_secret', process.env.VUE_APP_CLIENT_SECRET);
    body.set('scope', 'squidex-api');

    // Get the bearer token. Ensure that we use a client id with readonly permissions.
    var json = await axios.post(buildUrl('identity-server/connect/token'), body)
        .then((response) => {
            console.log('Aquired new Access Token');
            return response.data;
        }, (error) => {
            throw new Error(`Failed to retrieve token, got ${error.statusText}`);
        });

    token = json.access_token;

    // Cache the bearer token in the local store.
    setBearerToken(token);

    return token;
}

function buildUrl(url) {
    if (url.length > 0 && url.startsWith('/')) {
        url = url.substr(1);
    }

    const result = `${process.env.VUE_APP_SQUIDEX_API}/${url}`;

    return result;
}