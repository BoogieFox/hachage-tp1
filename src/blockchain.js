import {createBlock, findBlock, findBlocks, verifBlocks} from "./blockchainStorage.js";
import {json} from "node:stream/consumers"

export async function liste(req, res, url) {
    return findBlocks()
}

export async function single(req, res, url) {
    return findBlock(url.searchParams.get("id"))
}

export async function integrity(req, res, url) {
    return verifBlocks()
}

export async function create(req, res) {
    return createBlock(await json(req))
}
