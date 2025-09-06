import { notification } from "antd";

export const formatLocation = (sublocality) => {
    if (!sublocality) return "Not specified";
    return sublocality;
};

export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        notification.success({
            message: "ID copied",
            description: "ID has been copied to clipboard",
            duration: 2
        });
    } catch (error) {   
        console.log('error copyToClipboard', error);
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        notification.success({
            message: "ID copied", 
            description: "ID has been copied to clipboard",
            duration: 2
        });
    }
};
