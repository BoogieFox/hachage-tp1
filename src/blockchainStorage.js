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
    // Version Promise explicite
    // return new Promise((resolve,reject)=> {
    //     readFile(path, {encoding:'utf8'}).then((result)=>{
    //         resolve(JSON.parse(result))
    //     }).catch((error) => {
    //         reject(error)
    //     })
    // })

    // Version Promise implicite
    try {
        const result = await readFile(path, { encoding: 'utf8' });
        return JSON.parse(result);
    } catch (error) {
        throw error;
    }
}

/**
 * Trouve un block à partir de son id
 * @param partialBlock
 * @return {Promise<Block[]>}
 */
export async function findBlock(partialBlock) {
    let blocks = await findBlocks();
    for (let i=0;i<blocks.length;i++) {
        if (blocks[i].id===partialBlock) {
            if (i==0||blocks[i].hash===calculateHash(JSON.stringify(blocks[i-1]))) {
                return blocks[i];
            }
            return { error: "Block is not reliable." };
        }
    }
    return { error: "Block could not be found." };
}

/**
 * S'assure de l'intégrité de la chaîne
 * @return {Promise<Boolean>}
 */
export async function verifBlocks() {
    let blocks = await findBlocks();
    for (let i = 0;i<blocks.length-1;i++) {
        if (calculateHash(JSON.stringify(blocks[i]))!==blocks[i+1].hash) {
            return false;
        }
    }
    return true;
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
    // Version Promise explicite
    // let blocks = await findBlocks();
    // const lastBlock = await findLastBlock();

    // const id = uuidv4();
    // const nom = contenu.nom;
    // const don = contenu.don;
    // let block = null;
    // const date = getDate();
    // if (lastBlock!=null) {
    //     const hash = createHash('sha256').update(JSON.stringify(lastBlock)).digest('hex');
    //     block = { id, nom, don, date, hash};
    // } else {
    //     block = { id, nom, don, date};
    //}
    // const newBlocks = [...blocks,block];

    // return new Promise((resolve,reject)=> {
    //     writeFile(path, JSON.stringify(newBlocks,null,4), {encoding: 'utf8'}).then(() => {
    //         resolve("Bien ajouté !");
    //     }).catch((error) => {
    //         reject("FF " + error)
    //     });
    // })

    //Version Promise implicite
    try {
        // Version où on ne peut ajouter un block que si la chaîne est intègre
        let integrity = await verifBlocks();
        if (!integrity) {
            return { error: "Chain is not integrated." };
        }

        let blocks = await findBlocks();
        const lastBlock = await findLastBlock();

        const id = uuidv4();
        const nom = contenu.nom;
        const don = contenu.don;
        const date = getDate();
        let hash = null;
        if (lastBlock != null) {
            hash = calculateHash(JSON.stringify(lastBlock));
        } else {
            hash = calculateHash(monSecret);
        }
        const block = { id, nom, don, date, hash};
        const newBlocks = [...blocks, block];
        await writeFile(path, JSON.stringify(newBlocks, null, 4), { encoding: 'utf8' });

        return "Bien ajouté !";
    } catch (error) {
        throw "FF " + error;
    }
}

function calculateHash(toHash) {
    return createHash('sha256').update(toHash).digest('hex');
}

