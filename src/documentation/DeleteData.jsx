import React from 'react';
import DocPage from "../components/DocPage";

const pageContent = `
## To delete your data from mobile app SpeakGPT, please follow these steps:

1. Go to Device settings > Apps > SpeakGPT > Clear data
2. To opt-out from ads personalization please go to Device settings > Google > Ads and select Reset or delete advertising ID. Also you may need to go to your Google account settings to completely opt-out from ads personalization. For more info please [visit this page](https://support.google.com/My-Ad-Center-Help/answer/12155656?hl=en&co=GENIE.Platform%3DAndroid)
3. To disable analytics open app settings and search for "Usage and diagnostics" option
3. To disable all data collecting open app settings and search for "Revoke authorization" option
4. To delete analytics data, please contact us via admin@teslasoft.org

## To delete data from web app SpeakGPT, please follow these steps:

1. Go to your browser settings > Browsing data > Select &quot;assistant.teslasoft.org&quot; > Clear all data

Read Privacy Policy here: [Privacy Policy](/privacy)
`;

function DeleteData() {
    return (
        <DocPage title={"Delete data"}>
            {pageContent}
        </DocPage>
    );
}

export default DeleteData;