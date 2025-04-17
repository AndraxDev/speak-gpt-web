import React from 'react';
import DocPage from "../components/DocPage";

const pageContent = `
## To delete your data from mobile app SpeakGPT, please follow these steps:

1. Go to Device settings > Apps > SpeakGPT > Clear data
2. To disable analytics open app settings and search for "Usage and diagnostics" option
3. To disable all data collecting open app settings and search for "Revoke authorization" option
4. To delete analytics data, please contact us via admin@teslasoft.org

## To delete data from web app SpeakGPT, please follow these steps:

1. Go to your browser settings > Browsing data > Select &quot;assistant.teslasoft.org&quot; > Clear all data

> SpeakGPT Lite does not collect any personal data. To delete all local data, go to Device settings > Apps > SpeakGPT > Clear data

## To delete your account from API Provider (Like OpenAI), refer to it's Privacy Policy. Here are some account close links for popular API providers:
- [OpenAI](https://help.openai.com/en/articles/6378407-how-to-delete-your-account)
- [OpenRouter](https://openrouter.ai/docs/faq#how-can-i-delete-my-account)

Read Privacy Policy here: [Privacy Policy for regular SpeakGPT mobile/web app](/privacy) and [Privacy Policy for SpeakGPT Lite](/privacy_lite)
`;

function DeleteData() {
    return (
        <DocPage title={"Delete data"}>
            {pageContent}
        </DocPage>
    );
}

export default DeleteData;