import { DurableObject } from "cloudflare:workers";
export default {
async fetch(request, env, ctx) {
const corsHeaders = {
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
if (request.method === 'OPTIONS') {
return new Response(null, {
status: 204,
headers: corsHeaders,
});
}

const url = new URL(request.url);
const pathname = url.pathname.slice(1) + url.search;
console.log(pathname)
// // const searchMatch = pathname.match(/^\/api\/search\/([A-Z]{3})$/i);
// // let stationCode = ""
// // let targetUrl = ""

// // if (searchMatch) {
// // stationCode = searchMatch[1].toUpperCase(); // Normalize to uppercase
// // targetUrl = `https://api.rtt.io/api/v1/json/search/${stationCode}`;
// // } else {
// // targetUrl = `https://api.rtt.io/api/v1/json/search/${stationCode}`;
// // }

// // Capture anything after `/api/`
// // const match = pathname.match(/^\/api\/(.+)$/);
// function getPathAndQuery(url) {
//   const u = new URL(url);
//   return u.pathname.slice(1) + u.search;
// }
// const match = getPathAndQuery()
let id = env.ACCESSTOKEN.idFromName("access");
let dodo = env.ACCESSTOKEN.get(id);
let token = await dodo.getTokenValue()
let currentTime = new Date().toISOString();

if (!token || !token.validUntil || token.validUntil < currentTime){
      // let newToken = 
    let response = await fetch("https://data.rtt.io/api/get_access_token", {
    headers: {
      'Authorization' : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMjRiNzhiYy1jNTZmLTQ4MWYtODFhMS04MjU0ZTA5M2JlOTIiLCJpc3MiOiJodHRwczovL2FwaS1wb3J0YWwucnR0LmlvIn0.uzeEQ6doV_6t49SXiyOxHjwrPeV6LGfiVDUrbWIJ9gs" 
    },
    });
    let data = await response.json();
    token = await dodo.setTokenValue(data)
    }

// Calling the A-P-I
let targetUrl;

if (pathname) {
// const restOfPath = match[1]; // Everything after `/api/`
targetUrl = `https://data.rtt.io/${pathname}`;
// targetUrl = `https://data.rtt.io/rtt/location?code=gb-nr%3APAR`;
}
let response = await fetch(targetUrl, {
  // Line above causing issues
headers: {
// 'Authorization': 'Basic ' + btoa('rttapi_BayleyDuquetteSF:bb79df0b52901909f8a5349aabccdbb5394b8d7e'),
  'Authorization' : "Bearer " + token.token
},
});

let data = await response.text();
return new Response(data, {
status: response.status,
headers: {
'Content-Type': response.headers.get('Content-Type') || 'application/json',
...corsHeaders,
},
});

return new Response('Not Found', {
status: 404,
headers: corsHeaders,
});
},
};
export class AccessToken extends DurableObject {
  async getTokenValue() {
    let value = (await this.ctx.storage.get("accessToken")) || null;
    return value;
  }

  async setTokenValue(data) {
    await this.ctx.storage.put("accessToken", data);
    return data;
  }
}