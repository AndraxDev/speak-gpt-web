import React from 'react';
import Markdown from 'react-markdown'
import remarkGfm from "remark-gfm";
import {sha256} from "js-sha256";
import Prism from 'prismjs';

const failedImage = "data:image/png;base64,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6mCVLlcBwMGDB6ui7VuxYsXtPeVbuXLlHdGD25YtW5b3lC96lZTpbdkf//jHFxw9erTT28x9dVCdMWPGhdG2ZltGRUXFumh7d+zY8UImeZ955pm50e/46NGjh7PvSc96M3Zy3bdc74Nn0liFAScaAJys559//v7u6nviiSduPHbs2Pup1Ie3LefNmzc5k3Y2NDTUZVNPEOQmAHj44Yf/KnoQ3rRp09JM+hQEQfDGG288k543kUgkujsYr1y58s7od/7mm28+m2l9U6dOHVJfX380WsbpGgDMnz//sk6uPmuyKaOiouLFaH+XLl36/ex60rNsx05/9S1X++CZNlZhwMl1ANBh6dKl3/v1r389O9N2vvLKK79Ir6eysvKVnvLkIgCoqal5Kz19S0tLczwez8u0X6WlpaOiv+k+99xz93WV/oMPPngvPW0ikWjv6lZqVzo78ZyuAUD0t+owDMN58+b9QTZlFBcXF0R/ojl27Nj72fWkZ9mOnf7uW1/vg2faWIUBp78CgGwtW7bsn9Prqa6uruwpT18HAMXFxQXRg9P69et/lm3f9u7d+3p6GTU1NXs6Szdt2rSiaH1bt25dk219QRAEBw4c2JVezukaAESDo6qqqjd6047169c/Fm1Hple+mco2ADiT+hYE2e2DZ+JYJTcsBnQaS6VSqcOHD+/rbf4jR45sPZXt6dDQ0PBu+vbgwYP7fcniiRMn/ve8vLyPrvZTqVRq06ZNJdmWs3PnzhXjx4//w47t0aNHf6KzdJdccsn/TK8vCIJg69atD2VbXxAEQU1NzbaPf/zjl/Qmb64sXLjwG7FY7ITJZ1577bUuH6zszssvv1x8xRVX/I+O7y8vLy/vsssuuzEIgptPQVOzdib2LZt9cKCNVTInADiNpVKp8KKLLur06eP+FIZhe3+3IWrixInfSN8OwzBZWFj48QULFnw8m3La2tqOp28PGjRo0IwZMy684447Tniga9y4cX+avp1KpVL79u1bkW27gyAIWltb63uTL5cuueSSv0vfTqVSqd27dz/am7JuvfXWt7/3ve81Dx06dHjHZxMmTPjyybaxt87EvmWzDw60sUrmBAB85P777//jyy+//KaLL774s+eee+7vDR8+vCgWiw1Kv5rp7zZ2paio6KL07VgsNujGG2/M+CGn7owYMWJCEAQnBACFhYXnp2+3t7e3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";

function Message({isBot, message, ...props}) {
    const linesNumbers = (str) => {
        let lines = str.split("\n").length;

        let l = [];

        for (let i = 0; i < lines; i++) {
            l.push("<span class='line'>" + (i+1) + "</span>");
        }

        return l.join("\n");
    }

    const highlightCode = (code, lang, l) => {
        try {
            return Prism.highlight(code, lang, l);
        } catch (e) {
            return null;
        }
    }

    return (
        <div className={"message"}>
            { isBot ? (
                <div className={"message-bot"}>
                    <div className={"message-author"}>
                        <span className={"message-icon material-symbols-outlined"}>smart_toy</span>
                        <b className={"message-author-2"}>SpeakGPT</b>
                    </div>
                    {!message.toString().includes("~file:") ? <Markdown
                            components={{
                                code(props) {
                                    const {children, className, node, ...rest} = props
                                    const match = /language-(\w+)/.exec(className || '')
                                    return match ? (
                                        <div className={"code-block"}>
                                            {
                                                highlightCode(children, Prism.languages[match[1]], className) !== null ?
                                                    <>
                                                        <div className={"lines"}
                                                             dangerouslySetInnerHTML={{__html: linesNumbers(highlightCode(children, Prism.languages[match[1]], className))}}/>
                                                        <div className={"lines-delim"}/>
                                                    </>
                                                    : null
                                            }

                                            <div dangerouslySetInnerHTML={{__html: highlightCode(children, Prism.languages[match[1]], className) == null ? children : highlightCode(children, Prism.languages[match[1]], className)}}/>
                                        </div>
                                    ) : (
                                            <code {...rest} className={"unknown-code-block " + className}>
                                                {children}
                                            </code>
                                    )
                                }
                            }}
                            remarkPlugins={[remarkGfm]}
                            className={"message-content"}>{message}</Markdown> :
                        <img id={"image-" + sha256(message)} className={"chat-image"}
                                src={message.toString() === "~file:null" ? failedImage : message.toString().replace("~file:", "data:image/png;base64,")} onError={() => {
                            document.getElementById("image-" + sha256(message)).src = failedImage;
                        }}/>
                    }

                </div>
            ) : (
                <div className={"message-user"}>
                    <div className={"message-author"}>
                        <span className={"message-icon material-symbols-outlined"}>account_circle</span>
                        <b className={"message-author-2"}>User</b>
                    </div>
                    <p className={"message-content"}>{message}</p>
                </div>
            )}
        </div>
    );
}

export default Message;