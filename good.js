import { DurableObject } from "cloudflare:workers";

// Worker
export default {
  async fetch(request, env) {

    // A stub is a client Object used to send messages to the Durable Object.
    let dodo = env.ACCESSTOKEN.getByName("access");

    let token = dodo.getTokenValue()
    let currentTime = Date.now().toISOString();
    if (token.validUntil < currentTime){
      // let newToken = 

      token = dodo.setTokenValue(newToken)

    }
  }}

// Durable Object
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