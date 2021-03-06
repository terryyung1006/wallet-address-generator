import * as bitcoinLib from 'bitcoinjs-lib'
import BIP32Factory from 'bip32'
import * as ecc from 'tiny-secp256k1'
import * as bip39 from 'bip39'

const bip32 = BIP32Factory(ecc)

/**
 * @description Check if seed phase has 12 - 24 words (128 bits to 256 bits ENT)
 * 
 * @param seedPhase mnemonic to be checked
 * @returns empty string if passed
 */
export function checkSeedPhase(seedPhase: string): string{
    let seedPhaseArray: Array<string> = seedPhase.split(" ")
    
    if (seedPhaseArray.length < 12 || seedPhaseArray.length > 24) {
        const errMsg = "seed phase must has 12 to 24 words"
        console.error(errMsg)
        return errMsg
    }
    return ""
}

/**
 * @description Generate native segwit bitcoin address  (prefix "bc1")
 * 
 * @param seedPhase mnemonic for master key pair
 * @param path derivation path for child key pair
 * @returns Segwit address
 */
export function generateSegwitAddress(seedPhase: string, path: string): string | undefined {
    if (!!checkSeedPhase(seedPhase) )
        return undefined
    
    const seed = bip39.mnemonicToSeedSync(seedPhase)
    const root = bip32.fromSeed(seed)
    let child
    try {
        child = root.derivePath(path)
    } catch (e) {
        console.error(e)
        return undefined
    }

    const { address } = bitcoinLib.payments.p2wpkh({
        pubkey: child.publicKey,
        network: bitcoinLib.networks.bitcoin
    })

    return address
}