import crypto from "crypto";

export function getRGB(hash: string): string {
    return `#${hash.substring(0, 6)}`;
}

export function md5(string: string): string {
    return crypto.createHash("md5").update(string).digest("hex");
}