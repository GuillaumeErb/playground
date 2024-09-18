
import { graphConfig } from "./authConfig";

export async function callMsGraph(accessToken: string, optionNumber: number) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    let endpoint = "";
    if (optionNumber === 1) {
        endpoint = graphConfig.grapheOneDriveTestEndpoint;
    } else if (optionNumber === 2) {
        endpoint = graphConfig.graphOneDriveEndpoint;
    }

    return fetch(endpoint, options)
        .then(response => {return response.json()})
        .catch(error => console.log(error));
}
