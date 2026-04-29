import { DurableObject } from "cloudflare:workers";

// Worker
export default {
  async fetch(request, env) {

    // A stub is a client Object used to send messages to the Durable Object.
    let dodo = env.ACCESSTOKEN.getByName("access");
    let token = dodo.getTokenValue()
    dodo.setTokenValue()
  }}

// Durable Object
export class AccessToken extends DurableObject {
  async getTokenValue() {
    let value = (await this.ctx.storage.get("accessToken")) || null;
    return value;
  }

  async setTokenValue(data) {
    let value = (await this.ctx.storage.get("accessToken")) || null;
    value = data;
    await this.ctx.storage.put("accessToken", value);
    return value;
  }
}