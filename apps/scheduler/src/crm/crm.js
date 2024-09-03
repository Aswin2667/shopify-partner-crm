export default class ShopifyCrm {
    constructor({ appId, appApiKey, apiUrl = "https://appapi.shopifycrm.com/v1" }) {
        this.appId = appId,
        this.appApiKey = appApiKey,
        this.apiUrl = apiUrl
    }

    async shopifyCrmRequest({ path, method = "GET", body }) {
        const response = await fetch(`${this.apiUrl}${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                "X-ShopifyCrm-App-Id": this.appId,
                "X-ShopifyCrm-App-Api-Key": this.appApiKey,
            },
            ...(body && {
                body: JSON.stringify(body)
            })
        });

        const result = await response.json();
        return result;

    }

    async customershopifyCrmRequest({ path, method = "GET", body, shopifyCrmApiToken }) {
        const response = await fetch(`${this.apiUrl}${path}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            "X-ShopifyCrm-App-Id": this.appId,
            "X-ShopifyCrm-Customer-Api-Token": shopifyCrmApiToken,
          },
          ...(body && {
            body: JSON.stringify(body),
          }),
        });
        const result = await response.json();
        return result;
      }

    async identifyCustomer({
        platform = "shopify",
        myshopifyDomain,
        platformId,
        name,
        email,
        accessToken,
    }) {
        console.log(`[ShopifyCrm] identifyCustomer: `, { platform, platformId, name, email, accessToken });
        const result = await this.shopifyCrmRequest({
        path: "/identify",
        method: "POST",
        body: {
            platform,
            platformId,
            ...(platform === "shopify" && myshopifyDomain && { myshopifyDomain }),
            name,
            email,
            accessToken,
        },
        });
        return result;
  }

  async getCustomer({shopifyCrmApiToken}) {
    console.log(`[shopifyCrm] getCustomer...`)
    const result = await this.customershopifyCrmRequest({ path: "/customer", shopifyCrmApiToken})
    return result.customer;
  }

}