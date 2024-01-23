import {readFile, writeFile} from 'node:fs/promises'
import {getDate, monSecret} from "./divers.js";
import {NotFoundError} from "./errors.js";
import {createHash} from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';

/* Chemin de stockage des blocks */
const path = 'data/blockchain.json'

/**
 * Mes définitions
 * @typedef { id: string, nom: string, don: number, date: string,hash: string} Block
 * @property {string} id
 * @property {string} nom
 * @property {number} don
 * @property {string} date
 * @property {string} string
 *
 */

/**
 * Renvoie un tableau json de tous les blocks
 * @return {Promise<any>}
 */
export async function findBlocks() {
    return new Promise((resolve,reject)=> {
        readFile(path, {encoding:'utf8'}).then((result)=>{
            resolve(JSON.parse(result))
        }).catch((error) => {
            reject(error)
        })
    })
}

/**
 * Trouve un block à partir de son id
 * @param partialBlock
 * @return {Promise<Block[]>}
 */
export async function findBlock(partialBlock) {
    // A coder
}

/**
 * Trouve le dernier block de la chaine
 * @return {Promise<Block|null>}
 */
export async function findLastBlock() {
    let blocks = await findBlocks();
    return blocks.length===0?null:blocks[blocks.length-1];
}

/**
 * Creation d'un block depuis le contenu json
 * @param contenu
 * @return {Promise<Block[]>}
 */
export async function createBlock(contenu) {
    let blocks = await findBlocks();
    const lastBlock = await findLastBlock();

    const id = uuidv4();
    const nom = contenu.nom;
    const don = contenu.don;
    const date = getDate();
    let hash = null;
    if (lastBlock!=null) {
        hash = createHash('sha256');
    }
    const block = {id,nom,don,date};
    const newBlocks = [...blocks,block];

    return new Promise((resolve,reject)=> {
        writeFile(path, JSON.stringify(newBlocks,null,4), {encoding: 'utf8'}).then(() => {
            resolve("Bien ajouté !");
        }).catch((error) => {
            reject("FF " + error)
        });
    })
}

