import { AvailableIntentsEventsEnum, WebsocketClient } from "../src/index";



(async function () {
    const ws = await new WebsocketClient({
        appID: "",
        token: "",
        intents: [AvailableIntentsEventsEnum.PUBLIC_GUILD_MESSAGES],
    }).connect();

    ws.on(AvailableIntentsEventsEnum.PUBLIC_GUILD_MESSAGES, (data) => {
        console.log(data);
    });
})();