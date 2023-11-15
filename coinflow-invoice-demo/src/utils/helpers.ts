import toast from "react-hot-toast";

export function truncateString(inputString: string) {
  if (inputString.length <= 8) {
    return inputString;
  }

  const startChars = inputString.slice(0, 4);
  const endChars = inputString.slice(-4);

  const middleReplacement = "...";

  return startChars + middleReplacement + endChars;
}

export async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    toast.success("Copied");
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}
